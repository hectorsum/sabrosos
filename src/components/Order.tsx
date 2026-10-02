'use client';

import type { ReactNode } from 'react';

export type CartLine = {
  key: string;
  name: string;
  desc: string;
  qty: number;
  total: number;
  totalText: string;
  add: () => void;
  sub: () => void;
};

type OrderProps = {
  lines: CartLine[];
  totalText: string;
  sent: boolean;
  mesaLabel: string | null;
  waHref: string;
  onSendMesa: () => void;
};

function Checkout({ mesaLabel, waHref, onSendMesa }: Pick<OrderProps, 'mesaLabel' | 'waHref' | 'onSendMesa'>) {
  return mesaLabel ? (
    <button className="btn btn-primary block" onClick={onSendMesa}>Enviar a cocina</button>
  ) : (
    <a className="btn btn-primary block lift" href={waHref} target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
  );
}

function SentNotice({ big }: { big?: boolean }) {
  return (
    <div className="notice" style={big ? { background: 'var(--papel)' } : undefined}>
      <span className="display" style={{ fontSize: big ? 28 : 24 }}>Pedido enviado</span>
      <span className="muted" style={{ fontSize: 15, lineHeight: '22px' }}>Ya llegó a cocina. Te lo llevamos a la mesa.</span>
    </div>
  );
}

function Empty({ size }: { size: number }) {
  return (
    <p className="muted" style={{ margin: 0, fontSize: size, lineHeight: size === 15 ? '22px' : '24px' }}>
      Todavía no agregas nada. Elige de la carta o arma tu plato.
    </p>
  );
}

export function OrderAside(props: OrderProps) {
  const { lines, totalText, sent, mesaLabel } = props;
  return (
    <aside className="card aside wide-only">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <h2 className="display aside-title">Tu pedido</h2>
        {mesaLabel && <span className="display" style={{ fontSize: 20 }}>{mesaLabel}</span>}
      </div>
      {sent && <SentNotice />}
      {lines.length === 0 && !sent && <Empty size={15} />}
      {lines.map((l) => (
        <div key={l.key} className="cart-line">
          <span style={{ fontSize: 16, fontWeight: 700 }}>{l.name}</span>
          <span className="display" style={{ fontSize: 20, textTransform: 'none' }}>{l.totalText}</span>
          <span className="muted" style={{ fontSize: 13, lineHeight: '18px' }}>{l.desc}</span>
          <Stepper qty={l.qty} onAdd={l.add} onSub={l.sub} small />
        </div>
      ))}
      {lines.length > 0 && (
        <div className="stack" style={{ gap: 16 }}>
          <Total totalText={totalText} />
          <Checkout {...props} />
        </div>
      )}
    </aside>
  );
}

export function CartDrawer(props: OrderProps & { onClose: () => void }) {
  const { lines, totalText, sent, mesaLabel, onClose } = props;
  return (
    <div className="drawer" role="dialog" aria-modal="true" aria-label="Tu pedido">
      <div className="backdrop" onClick={onClose} />
      <div className="drawer-panel">
        <div className="drawer-head">
          <h2 className="display" style={{ margin: 0, fontSize: 32, lineHeight: 1, color: 'var(--crema)' }}>Tu pedido</h2>
          <button className="icon-btn thick" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="drawer-body">
          {mesaLabel && (
            <span className="display" style={{ alignSelf: 'flex-start', fontSize: 20, border: '2px solid var(--tinta)', borderRadius: 6, padding: '4px 10px', background: 'var(--papel)' }}>
              {mesaLabel}
            </span>
          )}
          {sent && <SentNotice big />}
          {lines.length === 0 && !sent && <Empty size={16} />}
          {lines.map((l) => (
            <div key={l.key} className="cart-line drawer-line">
              <span className="display" style={{ fontSize: 22, lineHeight: 1.05, color: 'var(--rojo-osc)' }}>{l.name}</span>
              <span className="display" style={{ fontSize: 22, textTransform: 'none' }}>{l.totalText}</span>
              <span className="muted" style={{ fontSize: 14, lineHeight: '20px' }}>{l.desc}</span>
              <Stepper qty={l.qty} onAdd={l.add} onSub={l.sub} />
            </div>
          ))}
        </div>
        {lines.length > 0 && (
          <div className="drawer-foot">
            <Total totalText={totalText} />
            <Checkout {...props} />
          </div>
        )}
      </div>
    </div>
  );
}

export function BottomBar({ count, totalText, onOpen }: { count: number; totalText: string; onOpen: () => void }) {
  return (
    <div className="bottom-bar narrow-only">
      <div className="wrap bottom-bar-inner">
        <div className="stack">
          <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>{count} {count === 1 ? 'producto' : 'productos'}</span>
          <span className="display" style={{ fontSize: 26, lineHeight: 1, textTransform: 'none' }}>{totalText}</span>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 22px' }} onClick={onOpen}>Ver pedido</button>
      </div>
    </div>
  );
}

function Total({ totalText }: { totalText: string }) {
  return (
    <div className="total-row">
      <span className="display" style={{ fontSize: 24 }}>Total</span>
      <span className="display" style={{ fontSize: 32, color: 'var(--rojo-osc)', textTransform: 'none' }}>{totalText}</span>
    </div>
  );
}

export function Stepper({ qty, onAdd, onSub, small, children }: {
  qty: number; onAdd: () => void; onSub: () => void; small?: boolean; children?: ReactNode;
}) {
  return (
    <div className="stepper" style={{ justifySelf: 'end' }}>
      <button className={`icon-btn${small ? ' sm' : ''}`} onClick={onSub} aria-label="Quitar uno">−</button>
      <span className="stepper-qty" style={small ? { minWidth: 20, fontSize: 20 } : undefined}>{children ?? qty}</span>
      <button className={`icon-btn dark${small ? ' sm' : ''}`} onClick={onAdd} aria-label="Agregar uno">+</button>
    </div>
  );
}
