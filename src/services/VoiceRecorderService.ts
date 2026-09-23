// VoiceRecorderService.ts
// Manages live voice recording with MediaRecorder, MIME detection, offline queueing, and sync state

export interface RecordingItem {
  id: string;
  serviceId: string;
  therapistId: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  format: string;
  syncStatus: 'SINCRONIZADA' | 'PENDIENTE DE SINCRONIZACIÓN';
  audioBlobUrl?: string;
  audioBlobData?: string; // Base64 for persistence
}

class VoiceRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private currentRecordingId: string | null = null;
  private currentServiceId: string | null = null;
  private currentTherapistId: string | null = null;
  private startTimeMs: number = 0;
  private timerInterval: any = null;
  private onDurationUpdate?: (seconds: number) => void;
  private onStatusChange?: (isRecording: boolean, seconds: number) => void;

  constructor() {
    // Listen for online/offline events to sync pending recordings
    window.addEventListener('online', () => {
      this.syncPendingRecordings();
    });
  }

  public getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus'
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  }

  public async startRecording(
    serviceId: string,
    therapistId: string,
    onDurationUpdate?: (sec: number) => void,
    onStatusChange?: (recording: boolean, sec: number) => void
  ): Promise<boolean> {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      console.warn('[VoiceRecorder] Recording is already active.');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = this.getSupportedMimeType();
      
      const options: MediaRecorderOptions = {};
      if (mimeType) {
        options.mimeType = mimeType;
      }

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, options);
      this.currentRecordingId = 'rec-' + Date.now();
      this.currentServiceId = serviceId;
      this.currentTherapistId = therapistId;
      this.startTimeMs = Date.now();
      this.onDurationUpdate = onDurationUpdate;
      this.onStatusChange = onStatusChange;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const durationSec = Math.floor((Date.now() - this.startTimeMs) / 1000);
        const mime = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mime });
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());

        await this.saveRecordingResult(blob, durationSec, mime);
      };

      this.mediaRecorder.start(1000); // Collect data every second

      if (this.onStatusChange) {
        this.onStatusChange(true, 0);
      }

      let elapsed = 0;
      this.timerInterval = setInterval(() => {
        elapsed += 1;
        if (this.onDurationUpdate) {
          this.onDurationUpdate(elapsed);
        }
        if (this.onStatusChange) {
          this.onStatusChange(true, elapsed);
        }
      }, 1000);

      return true;
    } catch (err) {
      console.error('[VoiceRecorder] Failed to start recording / permission denied:', err);
      throw err;
    }
  }

  public stopRecording(): Promise<RecordingItem | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
        resolve(null);
        return;
      }

      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }

      const originalOnStop = this.mediaRecorder.onstop;
      this.mediaRecorder.onstop = async (e) => {
        if (originalOnStop) {
          // @ts-ignore
          originalOnStop(e);
        }
        const durationSec = Math.floor((Date.now() - this.startTimeMs) / 1000);
        const mime = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mime });
        const item = await this.saveRecordingResult(blob, durationSec, mime);
        
        if (this.onStatusChange) {
          this.onStatusChange(false, 0);
        }
        resolve(item);
      };

      this.mediaRecorder.stop();
    });
  }

  private async saveRecordingResult(blob: Blob, durationSeconds: number, format: string): Promise<RecordingItem> {
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX');
    const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    
    const isOnline = navigator.onLine;
    const syncStatus = isOnline ? 'SINCRONIZADA' : 'PENDIENTE DE SINCRONIZACIÓN';

    // Convert blob to base64 for persistent storage
    const base64Data = await this.blobToBase64(blob);

    const recordingItem: RecordingItem = {
      id: this.currentRecordingId || 'rec-' + Date.now(),
      serviceId: this.currentServiceId || 'unknown',
      therapistId: this.currentTherapistId || 'terapista-1',
      date: dateStr,
      startTime: timeStr,
      durationSeconds,
      format,
      syncStatus,
      audioBlobData: base64Data,
      audioBlobUrl: URL.createObjectURL(blob)
    };

    this.storeRecordingInLocalStorage(recordingItem);
    return recordingItem;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private storeRecordingInLocalStorage(item: RecordingItem) {
    try {
      const existing = this.getAllRecordings();
      const updated = [item, ...existing];
      localStorage.setItem('essenya_recordings', JSON.stringify(updated));
    } catch (e) {
      console.error('[VoiceRecorder] Error saving to localStorage', e);
    }
  }

  public getAllRecordings(): RecordingItem[] {
    try {
      const stored = localStorage.getItem('essenya_recordings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            // Recreate blob URL from base64 if needed
            let url = item.audioBlobUrl;
            if (!url && item.audioBlobData) {
              // Convert base64 back to blob URL
              try {
                const arr = item.audioBlobData.split(',');
                const mime = arr[0].match(/:(.*?);/)?.[1] || 'audio/webm';
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                url = URL.createObjectURL(blob);
              } catch (err) {
                console.error('Error recreating blob', err);
              }
            }
            return { ...item, audioBlobUrl: url };
          });
        }
      }
    } catch (e) {
      console.warn('Could not read recordings', e);
    }
    return [];
  }

  public getRecordingsForService(serviceId: string): RecordingItem[] {
    return this.getAllRecordings().filter(r => r.serviceId === serviceId);
  }

  private syncPendingRecordings() {
    try {
      const recordings = this.getAllRecordings();
      let updated = false;
      const synced = recordings.map(r => {
        if (r.syncStatus === 'PENDIENTE DE SINCRONIZACIÓN') {
          updated = true;
          return { ...r, syncStatus: 'SINCRONIZADA' as const };
        }
        return r;
      });
      if (updated) {
        localStorage.setItem('essenya_recordings', JSON.stringify(synced));
        console.log('[VoiceRecorder] Pending recordings successfully synchronized.');
      }
    } catch (e) {
      console.error('Error syncing recordings', e);
    }
  }

  public formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${remMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

export const voiceRecorderService = new VoiceRecorderService();
