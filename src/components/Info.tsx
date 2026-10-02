'use client';

import { useState } from 'react';
import { PhoneInput } from './Modals';

export type WeekDay = { day: string; time: string; today: boolean };

export function Horarios({ week, statusText }: { week: WeekDay[]; statusText: string }) {
  return (
    <div id="nosotros" className="card info-card red">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 className="display info-title" style={{ color: 'var(--crema)' }}>Horarios</h2>
        {statusText && <span className="status-pill">{statusText}</span>}
      </div>
      <div style={{ background: 'var(--papel)', borderRadius: 6, padding: '6px 16px' }}>
        {week.map((d) => (
          <div key={d.day} className={`week-row${d.today ? ' today' : ''}`}>
            <span>{d.day}{d.today && ' · hoy'}</span><span>{d.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Siguenos({ onPrivacy }: { onPrivacy: () => void }) {
  const [cc, setCc] = useState('+51');
  const [phone, setPhone] = useState('');
  const [accept, setAccept] = useState(false);
  const [done, setDone] = useState(false);

  const digits = phone.replace(/\D/g, '');
  const valid = accept && (cc === '+51' ? /^9\d{8}$/.test(digits) : digits.length >= 7);

  return (
    <div className="card info-card" style={{ gap: 14 }}>
      <h2 className="display info-title" style={{ color: 'var(--rojo)' }}>Síguenos y entérate</h2>
      <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: '22px', textWrap: 'pretty' }}>
        Nuevos platos y promociones exclusivas, primero por WhatsApp.
      </p>
      {done ? (
        <div className="notice" style={{ fontSize: 16, fontWeight: 700 }}>¡Listo! Te escribiremos al {cc} {phone}.</div>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          <PhoneInput cc={cc} phone={phone} onCc={setCc} onPhone={setPhone} placeholder="Número de celular" />
          <label className="check">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            <span>
              Autorizo a Sabrosos a enviarme promociones y novedades por WhatsApp, conforme a la{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); onPrivacy(); }} style={{ fontWeight: 700 }}>Política de privacidad</a>.
              Puedo darme de baja cuando quiera.
            </span>
          </label>
          <button className="btn btn-primary" style={{ minHeight: 52 }} disabled={!valid} onClick={() => setDone(true)}>Seguir</button>
        </div>
      )}
    </div>
  );
}
