'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import {
  ADDRESS, ALL, CLOSE, DAYS, HOURS_TXT, INSTAGRAM, MENU, OPEN, STEPS, soles,
  type LegalKey, type Picks,
} from '@/lib/data';
import { BookIcon, ClockIcon, PinIcon, UserIcon } from './icons';
import MenuList from './MenuList';
import ArmaTuPlato from './ArmaTuPlato';
import { BottomBar, CartDrawer, OrderAside, type CartLine } from './Order';
import { Horarios, Siguenos, type WeekDay } from './Info';
import { AuthModal, HoursModal, LegalModal, PromoModal, type AuthMode, type User } from './Modals';

const Mapa = dynamic(() => import('./Mapa'), { ssr: false, loading: () => <div className="map" /> });

type Props = {
  mesa: number | null;
  whatsapp: string;
  promo: boolean;
  armaVista: 'wizard' | 'lista';
};

type Custom = { key: string; picks: Picks; unit: number; qty: number };

// Reloj por minuto; en el servidor es null para evitar desajustes de hidratación.
const subscribeClock = (cb: () => void) => {
  const t = setInterval(cb, 15_000);
  return () => clearInterval(t);
};
const useMinute = () =>
  useSyncExternalStore(subscribeClock, () => Math.floor(Date.now() / 60_000), () => null);

const TABS = [
  ['wok', 'Al wok'], ['guisos', 'Guisos'], ['pollos', 'Pollos y carnes'], ['arma', 'Arma tu plato'], ['bebidas', 'Bebidas'],
] as const;

export default function Sabrosos({ mesa, whatsapp, promo, armaVista }: Props) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [custom, setCustom] = useState<Custom[]>([]);
  const [tab, setTab] = useState<string>('wok');
  const [cartOpen, setCartOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [flash, setFlash] = useState<{ msg: string } | null>(null);
  const [promoOpen, setPromoOpen] = useState(promo);
  const [promoApplied, setPromoApplied] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [legal, setLegal] = useState<LegalKey | null>(null);
  const [auth, setAuth] = useState<AuthMode | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const minute = useMinute();
  const now = minute === null ? null : new Date(minute * 60_000);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 1800);
    return () => clearTimeout(t);
  }, [flash]);

  const showFlash = (msg: string) => setFlash({ msg });

  const setQty = (id: string, d: number) => {
    if (d > 0 && !cart[id]) showFlash(ALL[id].name + ' agregado');
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + d) };
      if (!next[id]) delete next[id];
      return next;
    });
    setSent(false);
  };

  const setCustomQty = (key: string, d: number) => {
    setCustom((cs) => cs.map((c) => (c.key === key ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0));
    setSent(false);
  };

  const addArma = (picks: Picks, unit: number, qty: number) => {
    setCustom((cs) => [...cs, { key: 'c' + Date.now(), picks, unit, qty }]);
    setSent(false);
    showFlash('Tu plato se agregó al pedido');
  };

  const lines: CartLine[] = [
    ...Object.entries(cart).map(([id, q]) => {
      const i = ALL[id];
      return {
        key: id, name: i.name, desc: soles(i.price) + ' c/u', qty: q, total: i.price * q, totalText: soles(i.price * q),
        add: () => setQty(id, 1), sub: () => setQty(id, -1),
      };
    }),
    ...custom.map((c) => ({
      key: c.key,
      name: 'Arma tu plato',
      desc: STEPS.flatMap((st) => c.picks[st.id]).filter((x) => x !== 'Ninguna').join(' · '),
      qty: c.qty, total: c.unit * c.qty, totalText: soles(c.unit * c.qty),
      add: () => setCustomQty(c.key, 1), sub: () => setCustomQty(c.key, -1),
    })),
  ];
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.total, 0);
  const totalText = soles(total);

  const msg =
    'Hola Sabrosos' + (user ? ', soy ' + user.name : '') + '. Quiero pedir:\n' +
    lines.map((l) => `${l.qty}x ${l.name}${l.name === 'Arma tu plato' ? ` (${l.desc})` : ''} — ${l.totalText}`).join('\n') +
    '\nTotal: ' + totalText + (promoApplied ? '\nCódigo: SABROSOS' : '');
  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

  const mins = now ? now.getHours() * 60 + now.getMinutes() : -1;
  const isOpen = mins >= OPEN && mins < CLOSE;
  const statusText = !now ? '' : isOpen ? 'Abierto · hasta las 22:30' : 'Cerrado · abre a las 12:00';
  const statusShort = !now ? 'Horarios' : isOpen ? 'Abierto hoy' : 'Cerrado ahora';
  const week: WeekDay[] = DAYS.map((day, i) => ({ day, time: HOURS_TXT, today: now?.getDay() === i }));

  const mesaLabel = mesa ? `Mesa ${mesa}` : null;
  const activeCat = MENU.find((c) => c.id === tab);
  const order = {
    lines, totalText, sent, mesaLabel, waHref,
    onSendMesa: () => { setCart({}); setCustom([]); setSent(true); },
  };

  return (
    <>
      <header className="header">
        <div className="wrap header-inner">
          <a href="#inicio" className="header-brand">
            <img src="/brand/sabrosos-monograma-crema.png" alt="" style={{ height: 40 }} />
            <img className="header-wordmark" src="/brand/sabrosos-wordmark-crema.png" alt="Sabrosos" style={{ height: 22 }} />
          </a>
          <div className="header-actions">
            <nav className="header-nav wide-only">
              <a href="#carta">Carta</a>
              <a href="#ubicacion">Ubicación</a>
              <a href="#contacto">Contacto</a>
            </nav>
            {mesaLabel && <span className="mesa-tag">{mesaLabel}</span>}
            <button className="btn account-btn" onClick={() => setAuth(user ? 'account' : 'signup')}>
              <UserIcon />
              <span className="account-label">{user ? 'Hola, ' + user.name.split(' ')[0] : 'Ingresar'}</span>
            </button>
            <button className="btn cart-btn" onClick={() => setCartOpen(true)}>
              <span>Pedido</span>
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="wrap hero-inner">
            <div className="hero-banner">
              <img src="/img/hero.jpg" alt="Causas rellenas sobre pizarra" />
            </div>
            <div className="hero-badge">
              <img src="/brand/sabrosos-monograma.png" alt="Sabrosos" style={{ height: 92 }} />
            </div>
            <div className="hero-title">
              <img src="/brand/sabrosos-wordmark.png" alt="Sabrosos" style={{ width: 'min(420px, 80vw)' }} />
              <span className="display hero-sub">Barra criolla</span>
            </div>
            <p className="hero-tagline">
              {mesa ? `Hola, mesa ${mesa}. Pide desde aquí y te lo llevamos.` : 'Crea tu plato a tu manera, ¡nosotros lo hacemos sabroso!'}
            </p>
            <div className="hero-chips">
              <a href="#ubicacion" className="chip"><PinIcon /><span>San Isidro, Lima</span></a>
              <button className="chip" onClick={() => setHoursOpen(true)}><ClockIcon /><span>{statusText || 'Ver horarios'}</span></button>
            </div>
          </div>
        </section>

        <section id="carta" className="carta">
          <div className="wrap carta-grid">
            <div className="carta-main">
              <div className="tabs" role="tablist">
                {TABS.map(([id, label]) => (
                  <button key={id} role="tab" aria-selected={tab === id} className="tab" onClick={() => setTab(id)}>{label}</button>
                ))}
              </div>
              {activeCat && <MenuList items={activeCat.items} cart={cart} onQty={setQty} />}
              {tab === 'arma' && <ArmaTuPlato vista={armaVista} onAdd={addArma} />}
            </div>
            <OrderAside {...order} />
          </div>
        </section>

        <section id="ubicacion" className="ubicacion">
          <div className="wrap stack" style={{ gap: 28 }}>
            <h2 className="display ubicacion-title">Encuéntranos</h2>
            <div className="card map-card">
              <Mapa />
              <div className="map-foot">
                <div className="stack" style={{ gap: 4 }}>
                  <span className="display" style={{ fontSize: 28, lineHeight: 1, color: 'var(--rojo-osc)' }}>Sabrosos · Barra criolla</span>
                  <span style={{ fontSize: 17, lineHeight: '26px' }}>{ADDRESS}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <button className="btn btn-dark" style={{ minHeight: 48, padding: '0 20px', boxShadow: 'none' }} onClick={() => setHoursOpen(true)}>
                    {statusShort}
                  </button>
                  <a
                    className="btn btn-primary" style={{ minHeight: 48, padding: '0 20px', fontSize: 20 }}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`} target="_blank" rel="noreferrer"
                  >
                    Cómo llegar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="info">
          <div className="wrap info-grid">
            <Horarios week={week} statusText={statusText} />
            <Siguenos onPrivacy={() => setLegal('privacidad')} />
          </div>
        </section>
      </main>

      <footer id="contacto" className={`footer${count > 0 ? ' with-bar' : ''}`}>
        <div className="wrap footer-inner">
          <img src="/brand/sabrosos-monograma-crema.png" alt="Sabrosos" style={{ height: 96 }} />
          <h2 className="display" style={{ margin: 0, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 0.95 }}>Pide por WhatsApp</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
            <a className="btn btn-cream" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Escríbenos</a>
            <a className="btn ig-btn" style={{ padding: '12px 24px', fontSize: 24 }} href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer">
              @{INSTAGRAM}
            </a>
          </div>
          <div className="footer-legal">
            <button className="link" onClick={() => setLegal('privacidad')}>Política de privacidad</button>
            <button className="link" onClick={() => setLegal('terminos')}>Términos y condiciones</button>
            <button className="claims-btn" onClick={() => setLegal('reclamos')}><BookIcon /><span>Libro de Reclamaciones</span></button>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>© 2026 Sabrosos · Barra criolla</span>
        </div>
      </footer>

      {count > 0 && !cartOpen && <BottomBar count={count} totalText={totalText} onOpen={() => setCartOpen(true)} />}
      {flash && <div className="flash" role="status">{flash.msg}</div>}

      {promoOpen && (
        <PromoModal
          onClose={() => setPromoOpen(false)}
          onApply={() => { setPromoOpen(false); setPromoApplied(true); showFlash('Código SABROSOS guardado para tu pedido'); }}
        />
      )}
      {hoursOpen && <HoursModal week={week} onClose={() => setHoursOpen(false)} />}
      {auth && (
        <AuthModal
          mode={auth}
          user={user}
          onMode={setAuth}
          onClose={() => setAuth(null)}
          onUser={(u, m) => { setUser(u); setAuth(null); showFlash(m); }}
          onLogout={() => { setUser(null); setAuth(null); showFlash('Cerraste sesión'); }}
          onLegal={setLegal}
        />
      )}
      {cartOpen && <CartDrawer {...order} onClose={() => setCartOpen(false)} />}
      {legal && <LegalModal which={legal} onClose={() => setLegal(null)} />}
    </>
  );
}
