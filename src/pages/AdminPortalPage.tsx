// AdminPortalPage.tsx
// Panel de Administración para gestión de servicios, auditoría y grabaciones de audio de terapeutas

import React, { useState } from 'react';
import { Shield, Mic, CheckCircle, Clock, Calendar, User, Radio, Play, FileText, Lock } from 'lucide-react';
import { voiceRecorderService, RecordingItem } from '../services/VoiceRecorderService';

export const AdminPortalPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);

  const loadRecordings = () => {
    setRecordings(voiceRecorderService.getAllRecordings());
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      loadRecordings();
      const interval = setInterval(loadRecordings, 3000); // Poll/refresh every 3s to get instant incoming recordings
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'essenya2026' || passcode === 'admin' || passcode === '') {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña de administrador incorrecta. (Puedes dejar en blanco o usar essenya2026)');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="pt-28 pb-20 min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <div className="bg-white p-8 max-w-md w-full border border-subtle shadow-lg space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-[#C5A059]" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-[#2D2926]">Panel de Administración</h1>
            <p className="text-xs text-gray-500">
              Acceso restringido únicamente para coordinadores y administradores autorizados de ESSENYA.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Contraseña de Administrador"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full p-3 border border-subtle bg-[#F9F6F2] text-xs text-[#2D2926] focus:outline-none text-center"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2D2926] hover:bg-[#C5A059] text-white hover:text-[#120E0D] text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Ingresar al Panel
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 min-h-screen bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-[#2D2926] text-[#FDFBF7] py-12 px-6 sm:px-8 rounded-sm shadow-md border-b-2 border-[#C5A059] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/20 px-3 py-1 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-full">
              <Shield className="w-3.5 h-3.5" /> Seguridad y Auditoría ESSENYA
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-light text-white">
              Panel de Control y <i className="text-[#C5A059] font-normal">Grabaciones</i>
            </h1>
            <p className="text-xs text-gray-300">
              Auditoría en tiempo real de servicios a domicilio, verificación de protocolos de audio y reproductor seguro de grabaciones.
            </p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Recordings Section */}
        <div className="bg-white p-6 sm:p-8 border border-subtle shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-subtle pb-4">
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6 text-[#C5A059]" />
              <h3 className="font-serif text-2xl text-[#2D2926]">🎙️ Grabaciones de Servicios (Directo al Panel)</h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadRecordings}
                className="px-3 py-1.5 bg-[#2D2926] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
              >
                🔄 Actualizar
              </button>
              <span className="text-xs font-bold bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 rounded">
                {recordings.length} Registros
              </span>
            </div>
          </div>

          {recordings.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-[#F9F6F2] border border-dashed border-subtle">
              <Radio className="w-10 h-10 text-gray-400 mx-auto" />
              <h4 className="font-serif text-lg text-[#2D2926]">No hay grabaciones registradas aún</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Las grabaciones realizadas por las terapeutas desde el portal aparecerán aquí de forma segura e indexada.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recordings.map((rec, index) => (
                <div key={rec.id} className="bg-[#F9F6F2] p-5 border border-subtle space-y-4 rounded-sm shadow-xs">
                  <div className="flex items-center justify-between border-b border-subtle pb-3">
                    <span className="font-serif font-medium text-base text-[#2D2926]">
                      Grabación {recordings.length - index} ({rec.serviceId})
                    </span>
                    <span className={`text-[9px] px-2.5 py-1 rounded font-bold uppercase tracking-widest ${
                      rec.syncStatus === 'SINCRONIZADA' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.syncStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Terapeuta: <strong>Valeria Soto</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Fecha: <strong>{rec.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Hora: <strong>{rec.startTime}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>Duración: <strong>{voiceRecorderService.formatDuration(rec.durationSeconds)}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-subtle space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block flex items-center gap-1.5">
                      <Play className="w-3 h-3 text-[#C5A059]" /> Reproductor Seguro (▶ REPRODUCIR)
                    </span>
                    {rec.audioBlobUrl ? (
                      <audio controls src={rec.audioBlobUrl} className="w-full h-10" />
                    ) : (
                      <span className="text-xs text-red-500">Audio no disponible en memoria local.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
