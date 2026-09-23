// VoiceNotificationService.ts
// Manages automated system voice announcements (play once per service event)

class VoiceNotificationService {
  private playedEvents: Set<string> = new Set();

  constructor() {
    // Load previously played events from sessionStorage to persist across minor reloads during the same session
    try {
      const stored = sessionStorage.getItem('essenya_played_voice_events');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.playedEvents = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load played voice events', e);
    }
  }

  private persist() {
    try {
      sessionStorage.setItem('essenya_played_voice_events', JSON.stringify(Array.from(this.playedEvents)));
    } catch (e) {
      console.warn('Could not persist played voice events', e);
    }
  }

  public playServiceStarted(serviceId: string): void {
    const eventKey = `started-${serviceId}`;
    if (this.playedEvents.has(eventKey)) {
      console.log(`[VoiceNotification] Service started voice for ${serviceId} already played. Skipping.`);
      return;
    }

    this.playedEvents.add(eventKey);
    this.persist();

    const text = 'Servicio iniciado correctamente. El tiempo de la sesión ha comenzado.';
    this.playAudioOrSpeech('/audio/service-started.mp3', text);
  }

  public playServiceFinished(serviceId: string): void {
    const eventKey = `finished-${serviceId}`;
    if (this.playedEvents.has(eventKey)) {
      console.log(`[VoiceNotification] Service finished voice for ${serviceId} already played. Skipping.`);
      return;
    }

    this.playedEvents.add(eventKey);
    this.persist();

    const text = 'El servicio ha finalizado. Gracias por utilizar ESSENYA.';
    this.playAudioOrSpeech('/audio/service-finished.mp3', text);
  }

  private playAudioOrSpeech(audioPath: string, fallbackText: string): void {
    // Try playing local audio file first
    const audio = new Audio(audioPath);
    audio.play().then(() => {
      console.log(`[VoiceNotification] Played audio file: ${audioPath}`);
    }).catch((err) => {
      console.warn(`[VoiceNotification] Audio file ${audioPath} not found or blocked, falling back to Web Speech API:`, err);
      this.speakText(fallbackText);
    });
  }

  private speakText(text: string): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const voiceNotificationService = new VoiceNotificationService();
