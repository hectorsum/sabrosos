'use client';

import { useEffect, useRef, useState } from 'react';
import { ARMA_PRICE, STEPS, armaUnit, emptyPicks, soles, type Picks, type Step } from '@/lib/data';
import { Stepper } from './Order';

type Props = {
  vista: 'wizard' | 'lista';
  onAdd: (picks: Picks, unit: number, qty: number) => void;
};

const REQ_STEPS = STEPS.filter((st) => st.req);
const hintFor = (st: Step, wizard: boolean) =>
  st.req ? 'Obligatorio · elige 1' : st.multi ? 'Opcional · elige las que quieras' : wizard ? 'Opcional · elige 1' : 'Opcional';

export default function ArmaTuPlato({ vista, onAdd }: Props) {
  const isWizard = vista === 'wizard';
  const [picks, setPicks] = useState<Picks>(emptyPicks);
  const [step, setStep] = useState(0);
  const [qty, setQty] = useState(1);
  const advance = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(advance.current), []);

  const picked = REQ_STEPS.filter((st) => picks[st.id].length === 1).length;
  const done = picked === REQ_STEPS.length;
  const unit = armaUnit(picks);
  const price = soles(unit * qty);
  const status = done
    ? qty > 1 ? `${qty} × ${soles(unit)}` : '¡Listo! Tu plato está armado'
    : `${picked}/${REQ_STEPS.length} pasos obligatorios`;

  const goStep = (i: number) => {
    clearTimeout(advance.current);
    setStep(i);
  };

  const toggle = (st: Step, label: string) => {
    if (isWizard && st.req && !st.multi) {
      clearTimeout(advance.current);
      advance.current = setTimeout(() => setStep((s) => Math.min(STEPS.length, s + 1)), 280);
    }
    setPicks((p) => {
      const cur = p[st.id];
      let next: string[];
      if (st.multi) next = cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label];
      else if (cur.includes(label)) next = st.req ? cur : [];
      else next = [label];
      return { ...p, [st.id]: next };
    });
  };

  const add = () => {
    onAdd(picks, unit, qty);
    setPicks(emptyPicks());
    setQty(1);
    setStep(0);
  };

  const options = (st: Step, pill?: boolean) =>
    st.opts.map((op) => {
      const on = picks[st.id].includes(op.label);
      const priceText = op.price ? '+ S/ ' + op.price.toFixed(2) : '';
      return (
        <button key={op.label} className={`opt${pill ? ' pill' : ''}`} aria-pressed={on} onClick={() => toggle(st, op.label)}>
          {!pill && <span className="opt-dot" />}
          <span className={pill ? undefined : 'opt-label'}>{op.label}</span>
          {priceText && <span className="opt-price">{priceText}</span>}
        </button>
      );
    });

  const quantity = (size: number) => (
    <div className="qty-row">
      <span className="display" style={{ fontSize: size }}>Cantidad</span>
      <Stepper qty={qty} onAdd={() => setQty(qty + 1)} onSub={() => setQty(Math.max(1, qty - 1))}>
        <span style={{ display: 'inline-block', minWidth: 32, fontSize: 26 }}>{qty}</span>
      </Stepper>
    </div>
  );

  return (
    <div className="card arma">
      <div className="arma-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/arma-tu-plato.jpg" alt="Plato armado: chicharrón de pollo, papas fritas, chaufa y huevo frito" />
        <span className="display arma-desde">Desde {soles(ARMA_PRICE)}</span>
      </div>
      <div className="arma-body">
        <div>
          <h2 className="display arma-title">Arma tu plato</h2>
          <p className="arma-lead">2 bases · 1 proteína · 1 complemento · 2 salsas. Súmale extras si te quedas con hambre.</p>
        </div>

        {isWizard ? (
          <Wizard
            step={step} picks={picks} done={done} price={price} status={status}
            goStep={goStep} options={options} quantity={quantity} onAdd={add}
          />
        ) : (
          <div className="lista">
            {STEPS.map((st, idx) => {
              const cur = picks[st.id];
              return (
                <div key={st.id} className="lista-step">
                  <div className="lista-head">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <span className="lista-num">{idx + 1}</span>
                      <div className="stack" style={{ gap: 2, minWidth: 0 }}>
                        <span className="display" style={{ fontSize: 26, lineHeight: 1.05 }}>{st.name}</span>
                        <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>{hintFor(st, false)}</span>
                      </div>
                    </div>
                    {st.req && cur.length === 1 && <span className="lista-done">✓ Listo</span>}
                    {!st.req && cur.length > 0 && (
                      <button className="btn-small" onClick={() => setPicks((p) => ({ ...p, [st.id]: [] }))}>Quitar</button>
                    )}
                  </div>
                  <div className="lista-opts">{options(st, true)}</div>
                </div>
              );
            })}
            <div style={{ paddingTop: 20, borderTop: '2px dashed var(--arena)' }}>{quantity(26)}</div>
            <div className="lista-total">
              <div className="stack" style={{ gap: 2 }}>
                <span className="display" style={{ fontSize: 32, lineHeight: 1, textTransform: 'none' }}>{price}</span>
                <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>{status}</span>
              </div>
              <button className="btn btn-primary lift" disabled={!done} onClick={add}>Agregar al pedido</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Wizard({ step, picks, done, price, status, goStep, options, quantity, onAdd }: {
  step: number;
  picks: Picks;
  done: boolean;
  price: string;
  status: string;
  goStep: (i: number) => void;
  options: (st: Step) => React.ReactNode;
  quantity: (size: number) => React.ReactNode;
  onAdd: () => void;
}) {
  const wi = Math.min(step, STEPS.length);
  const isSummary = wi >= STEPS.length;
  const st = isSummary ? null : STEPS[wi];
  const cur = st ? picks[st.id] : [];
  const nextOk = st ? !st.req || cur.length === 1 : done;
  const nextLabel = !st ? 'Agregar' : !st.req && cur.length === 0 ? 'Saltar' : 'Siguiente';

  return (
    <div className="wz">
      <div>
        <div className="wz-bar">
          {STEPS.map((s, i) => {
            const cls = i === wi ? 'current' : (s.req ? picks[s.id].length === 1 : i < wi) ? 'done' : '';
            return <button key={s.id} className={cls} onClick={() => goStep(i)} aria-label={s.name} title={s.name} />;
          })}
          <button className={isSummary ? 'current' : ''} onClick={() => goStep(STEPS.length)} aria-label="Resumen" title="Resumen" />
        </div>
        <div className="wz-meta">
          <span>{isSummary ? 'Resumen' : `Paso ${wi + 1} de ${STEPS.length}`}</span>
          <span>{st ? hintFor(st, true) : 'Revisa y agrega'}</span>
        </div>
      </div>

      {st ? (
        <div>
          <h3 className="display wz-h">{(st.req ? 'Elige tu ' : 'Agrega ') + st.name.toLowerCase()}</h3>
          <div className="wz-opts">{options(st)}</div>
        </div>
      ) : (
        <div className="stack" style={{ gap: 12 }}>
          <h3 className="display wz-h">Así queda tu plato</h3>
          <div className="wz-summary" style={{ marginTop: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} className="wz-row">
                <span className="wz-row-name">{s.name}</span>
                <button className="btn-small" onClick={() => goStep(i)}>Cambiar</button>
                <span className="wz-row-value">
                  {picks[s.id].length ? picks[s.id].join(', ') : s.req ? 'Falta elegir' : 'Sin extra'}
                </span>
              </div>
            ))}
          </div>
          {quantity(24)}
        </div>
      )}

      <div className="wz-dock">
        {wi > 0 && (
          <button className="icon-btn" onClick={() => goStep(Math.max(0, wi - 1))} aria-label="Paso anterior">←</button>
        )}
        <div className="wz-dock-info">
          <span className="wz-dock-price">{price}</span>
          <span className="wz-dock-status">{status}</span>
        </div>
        <button className="btn wz-next" disabled={!nextOk} onClick={() => (isSummary ? onAdd() : goStep(wi + 1))}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
