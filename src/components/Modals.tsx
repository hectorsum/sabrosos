'use client';

import { useState, type ReactNode } from 'react';
import { COUNTRY_CODES, LEGAL, phoneErr, type LegalKey } from '@/lib/data';
import type { WeekDay } from './Info';

export function Modal({ title, onClose, width = 480, z, children }: {
  title: string; onClose: () => void; width?: number; z?: number; children: ReactNode;
}) {
  return (
    <div className="overlay" style={z ? { zIndex: z } : undefined} role="dialog" aria-modal="true" aria-label={title}>
      <div className="backdrop" onClick={onClose} />
      <div className="card modal" style={{ width: `min(${width}px, 100%)` }}>
        <div className="modal-head">
          <h2 className="display modal-title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PromoModal({ onClose, onApply }: { onClose: () => void; onApply: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Promoción">
      <div className="backdrop" onClick={onClose} />
      <div className="promo">
        <button className="icon-btn thick" onClick={onClose} aria-label="Cerrar">×</button>
        <span className="display" style={{ fontSize: 88, lineHeight: 0.9, color: 'var(--crema)' }}>10% dscto.</span>
        <span className="display" style={{ fontSize: 28, lineHeight: 1, color: 'var(--crema)' }}>En todo tu pedido</span>
        <div className="promo-code">
          <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Usa el código</span>
          <span className="display" style={{ fontSize: 36, lineHeight: 1, letterSpacing: '.06em' }}>SABROSOS</span>
        </div>
        <button className="btn btn-cream" onClick={onApply}>Ver la carta</button>
      </div>
    </div>
  );
}

export function HoursModal({ week, onClose }: { week: WeekDay[]; onClose: () => void }) {
  return (
    <Modal title="Horarios" onClose={onClose} width={440}>
      <div style={{ marginTop: -10 }}>
        {week.map((d) => (
          <div key={d.day} className={`week-row${d.today ? ' today' : ''}`} style={{ padding: d.today ? '12px 10px' : '12px 0', margin: d.today ? '0 -10px' : undefined }}>
            <span>{d.day}{d.today && ' · hoy'}</span><span>{d.time}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function LegalModal({ which, onClose }: { which: LegalKey; onClose: () => void }) {
  const legal = LEGAL[which];
  return (
    <Modal title={legal.title} onClose={onClose} width={560} z={80}>
      {legal.items.map((li) => (
        <div key={li.h} className="stack" style={{ gap: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>{li.h}</span>
          <span className="muted" style={{ fontSize: 15, lineHeight: '22px', textWrap: 'pretty' }}>{li.p}</span>
        </div>
      ))}
      <span className="muted" style={{ fontSize: 13, lineHeight: '18px', paddingTop: 12, borderTop: '2px dashed var(--arena)' }}>
        Borrador de referencia. Reemplazar por el texto aprobado por el asesor legal.
      </span>
    </Modal>
  );
}

export type User = { name: string; phone: string };
export type AuthMode = 'signup' | 'login' | 'account';

const emptyForm = () => ({ name: '', cc: '+51', phone: '', email: '', birthday: '', accept: false, marketing: false, code: '' });
type Form = ReturnType<typeof emptyForm>;
type Errs = Partial<Record<'name' | 'phone' | 'email' | 'accept' | 'code', string>>;

export function PhoneInput({ cc, phone, onCc, onPhone, placeholder = '987 654 321' }: {
  cc: string; phone: string; onCc: (v: string) => void; onPhone: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="phone-grid">
      <select className="field" value={cc} onChange={(e) => onCc(e.target.value)} aria-label="Código de país">
        {COUNTRY_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input
        className="field" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={placeholder}
        value={phone} onChange={(e) => onPhone(e.target.value)} aria-label="Celular"
      />
    </div>
  );
}

export function AuthModal({ mode, user, onMode, onClose, onUser, onLogout, onLegal }: {
  mode: AuthMode;
  user: User | null;
  onMode: (m: AuthMode) => void;
  onClose: () => void;
  onUser: (u: User, msg: string) => void;
  onLogout: () => void;
  onLegal: (k: LegalKey) => void;
}) {
  const [f, setF] = useState<Form>(emptyForm);
  const [errs, setErrs] = useState<Errs>({});
  const [codeSent, setCodeSent] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    setErrs((e) => ({ ...e, [k]: '' }));
  };
  const switchMode = (m: AuthMode) => { setErrs({}); setCodeSent(false); onMode(m); };
  const legalLink = (k: LegalKey, text: string) => (
    <a href="#" onClick={(e) => { e.preventDefault(); onLegal(k); }} style={{ fontWeight: 700 }}>{text}</a>
  );

  const submitSignup = () => {
    const e: Errs = {
      name: f.name.trim().length < 2 ? 'Escribe tu nombre.' : '',
      phone: phoneErr(f.cc, f.phone),
      email: f.email && !/^\S+@\S+\.\S+$/.test(f.email) ? 'Revisa tu email.' : '',
      accept: f.accept ? '' : 'Debes aceptar los Términos y la Política de privacidad para continuar.',
    };
    if (Object.values(e).some(Boolean)) return setErrs(e);
    onUser({ name: f.name.trim(), phone: `${f.cc} ${f.phone}` }, 'Cuenta creada. ¡Bienvenido!');
  };

  const submitLogin = () => {
    const pe = phoneErr(f.cc, f.phone);
    if (pe) return setErrs({ phone: pe });
    if (!codeSent) { setCodeSent(true); setErrs({}); return; }
    if (!/^\d{6}$/.test(f.code)) return setErrs({ code: 'El código tiene 6 dígitos.' });
    onUser({ name: 'Cliente Sabrosos', phone: `${f.cc} ${f.phone}` }, 'Ingresaste a tu cuenta');
  };

  const title = mode === 'login' ? 'Ingresa' : mode === 'account' ? 'Tu cuenta' : 'Crea tu cuenta';
  const err = (k: keyof Errs) => errs[k] && <span className="err">{errs[k]}</span>;
  const submit = (label: string, onClick: () => void) => (
    <button className="btn btn-primary" style={{ minHeight: 56 }} onClick={onClick}>{label}</button>
  );

  return (
    <Modal title={title} onClose={onClose}>
      {mode === 'signup' && (
        <div className="stack" style={{ gap: 16 }}>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>
            ¿Ya tienes cuenta? <button className="btn-text" onClick={() => switchMode('login')}>Ingresa</button>
          </p>
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Nombre completo <span className="req">*</span></span>
            <input className="field" type="text" autoComplete="name" placeholder="Nombre y apellido" value={f.name} onChange={(e) => set('name', e.target.value)} />
            {err('name')}
          </label>
          <div className="stack" style={{ gap: 6 }}>
            <span className="label">Celular <span className="req">*</span></span>
            <PhoneInput cc={f.cc} phone={f.phone} onCc={(v) => set('cc', v)} onPhone={(v) => set('phone', v)} />
            {err('phone')}
          </div>
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Email</span>
            <input className="field" type="email" autoComplete="email" placeholder="tu@correo.com" value={f.email} onChange={(e) => set('email', e.target.value)} />
            {err('email')}
          </label>
          <label className="stack" style={{ gap: 6 }}>
            <span className="label">Cumpleaños <span className="muted" style={{ fontWeight: 500 }}>(opcional, para tu regalo)</span></span>
            <input className="field" type="date" value={f.birthday} onChange={(e) => set('birthday', e.target.value)} />
          </label>
          <div className="stack" style={{ gap: 12, padding: 16, background: 'var(--crema)', border: '2px dashed var(--cafe)', borderRadius: 6 }}>
            <label className="check">
              <input type="checkbox" checked={f.accept} onChange={(e) => set('accept', e.target.checked)} />
              <span>
                He leído y acepto los {legalLink('terminos', 'Términos y condiciones')} y la {legalLink('privacidad', 'Política de privacidad')}, y autorizo el tratamiento de mis datos para gestionar mi cuenta y mis pedidos. <span className="req" style={{ fontWeight: 700 }}>*</span>
              </span>
            </label>
            <label className="check">
              <input type="checkbox" checked={f.marketing} onChange={(e) => set('marketing', e.target.checked)} />
              <span>Quiero recibir promociones y novedades por WhatsApp o email. <span className="muted">(Opcional)</span></span>
            </label>
            {err('accept')}
          </div>
          {submit('Crear cuenta', submitSignup)}
          <span className="muted" style={{ fontSize: 12, lineHeight: '18px' }}>
            Tus datos se tratan conforme a la Ley N° 29733, Ley de Protección de Datos Personales.
          </span>
        </div>
      )}

      {mode === 'login' && (
        <div className="stack" style={{ gap: 16 }}>
          <p className="muted" style={{ margin: 0, fontSize: 15 }}>
            ¿Primera vez? <button className="btn-text" onClick={() => switchMode('signup')}>Crea tu cuenta</button>
          </p>
          <div className="stack" style={{ gap: 6 }}>
            <span className="label">Celular</span>
            <PhoneInput cc={f.cc} phone={f.phone} onCc={(v) => set('cc', v)} onPhone={(v) => set('phone', v)} />
            {err('phone')}
          </div>
          {codeSent && (
            <label className="stack" style={{ gap: 6 }}>
              <span className="label">Código de 6 dígitos</span>
              <input
                className="field" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••"
                value={f.code} onChange={(e) => set('code', e.target.value)}
                style={{ minHeight: 52, fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '.3em' }}
              />
              <span className="muted" style={{ fontSize: 13 }}>Te lo enviamos por WhatsApp al {f.cc} {f.phone}.</span>
              {err('code')}
            </label>
          )}
          {submit(codeSent ? 'Ingresar' : 'Enviar código', submitLogin)}
        </div>
      )}

      {mode === 'account' && user && (
        <div className="stack" style={{ gap: 14 }}>
          <div className="notice">
            <span className="display" style={{ fontSize: 26 }}>{user.name}</span>
            <span className="muted" style={{ fontSize: 15 }}>{user.phone}</span>
          </div>
          <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: '20px' }}>
            Puedes pedir el acceso, corrección o eliminación de tus datos escribiéndonos por WhatsApp.
          </p>
          <button className="btn btn-outline" onClick={onLogout}>Cerrar sesión</button>
        </div>
      )}
    </Modal>
  );
}
