export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  img: string;
  contain?: boolean;
};

export type Category = { id: string; name: string; items: MenuItem[] };

export type StepOpt = { label: string; price: number };
export type Step = { id: string; name: string; req: boolean; multi?: boolean; opts: StepOpt[] };

export const MENU: Category[] = [
  { id: 'wok', name: 'Al wok', items: [
    { id: 'lomo', name: 'Lomo saltado', desc: 'Lomo, cebolla y tomate al wok con papas fritas y arroz.', price: 28, img: '/platos/LomoSaltado.webp' },
    { id: 'pollosalt', name: 'Pollo saltado', desc: 'Pollo al wok con cebolla, tomate, papas fritas y arroz.', price: 24, img: '/platos/PolloSaltado.webp' },
    { id: 'tallcarne', name: 'Tallarín saltado de carne', desc: 'Tallarín al wok con lomo, cebolla y tomate.', price: 27, img: '/platos/TallarinSaltadoDeCarne.webp' },
    { id: 'tallpollo', name: 'Tallarín saltado de pollo', desc: 'Tallarín al wok con pollo, cebolla y tomate.', price: 24, img: '/platos/TallarinSaltadoDePollo.webp' },
    { id: 'chaufacarne', name: 'Chaufa de carne', desc: 'Arroz al wok con carne, huevo y cebollita china.', price: 25, img: '/platos/ChaufaDeCarne.webp' },
    { id: 'chaufapollo', name: 'Chaufa de pollo', desc: 'Arroz al wok con pollo, huevo y cebollita china.', price: 22, img: '/platos/ChaufaDePollo.webp' },
    { id: 'huanclomo', name: 'Tallarines a la huancaína con lomo saltado', desc: 'Tallarines en crema huancaína con lomo saltado.', price: 30, img: '/platos/TallarinesALaHuancainaConLomoSaltado.webp' },
    { id: 'huancpollo', name: 'Tallarines a la huancaína con pollo saltado', desc: 'Tallarines en crema huancaína con pollo saltado.', price: 27, img: '/platos/TallarinesALaHuancainaConPolloSaltado.webp' },
  ]},
  { id: 'guisos', name: 'Guisos', items: [
    { id: 'seco', name: 'Seco norteño con frejoles', desc: 'Res guisada al culantro con frejoles, arroz y sarsa criolla.', price: 28, img: '/platos/SecoNortenoConFrejoles.webp' },
    { id: 'aji', name: 'Ají de gallina', desc: 'Gallina deshilachada en crema de ají amarillo, con arroz y huevo.', price: 22, img: '/platos/AjiDeGallina.webp' },
    { id: 'asado', name: 'Asado de res con puré', desc: 'Asado en su jugo con puré de papa y arroz.', price: 27, img: '/platos/AsadoDeResConPure.webp' },
    { id: 'albondigas', name: 'Albóndigas con puré', desc: 'Albóndigas en salsa de tomate con puré y arroz.', price: 22, img: '/platos/AlbondigasConPure.webp' },
    { id: 'arrozpollo', name: 'Arroz con pollo', desc: 'Arroz verde al culantro con pierna de pollo, papa a la huancaína y sarsa.', price: 22, img: '/platos/ArrozConPollo.webp' },
    { id: 'tallrojos', name: 'Tallarines rojos con pollo', desc: 'Tallarines en salsa roja con pierna de pollo y papa a la huancaína.', price: 22, img: '/platos/TallarinesRojosConPollo.webp' },
  ]},
  { id: 'pollos', name: 'Pollos y carnes', items: [
    { id: 'pobre', name: 'Bistec a lo pobre', desc: 'Bistec con huevo frito, plátano frito, papas fritas y arroz.', price: 30, img: '/platos/BistecALoPobre.webp' },
    { id: 'verdesbistec', name: 'Tallarines verdes con bistec', desc: 'Tallarines al pesto criollo con bistec.', price: 28, img: '/platos/TallarinesVerdesConBistec.webp' },
    { id: 'verdeschich', name: 'Tallarines verdes con chicharrón de pollo', desc: 'Tallarines al pesto criollo con chicharrón de pollo.', price: 25, img: '/platos/TallarinesVerdesConChicharronDePollo.webp' },
    { id: 'mostrito', name: 'Mostrito broaster', desc: 'Pollo broaster con chaufa, papas fritas y cremas.', price: 24, img: '/platos/MostritoBroaster.webp' },
    { id: 'plancha', name: 'Pollo a la plancha', desc: 'Filete de pollo a la plancha con puré y arroz.', price: 22, img: '/platos/PolloALaPlancha.webp' },
    { id: 'dorado', name: 'Pollo dorado', desc: 'Pierna de pollo dorada con puré y arroz.', price: 20, img: '/platos/PolloDorado.webp' },
    { id: 'tipakay', name: 'Pollo tipakay', desc: 'Pollo crocante en salsa agridulce con chaufa.', price: 24, img: '/platos/PolloTipakay.webp' },
    { id: 'chijaukay', name: 'Pollo chijaukay', desc: 'Pollo crocante en salsa de ostión con ajonjolí y chaufa.', price: 24, img: '/platos/PolloChijaukay.webp' },
  ]},
  { id: 'bebidas', name: 'Bebidas', items: [
    { id: 'chicha', name: 'Chicha morada casera', desc: 'Botella de 1 litro.', price: 12, img: '/platos/ChichaCasera.webp' },
    { id: 'inca', name: 'Gaseosa 500 ml', desc: 'Inca Kola u otra, botella.', price: 5, img: '/platos/Gaseosa500ml.webp', contain: true },
    { id: 'agua', name: 'Agua 600 ml', desc: 'Agua mineral sin gas.', price: 4, img: '/platos/Agua600ml.webp', contain: true },
  ]},
];

export const ALL: Record<string, MenuItem> = Object.fromEntries(
  MENU.flatMap((c) => c.items.map((i) => [i.id, i])),
);

const BASES = [
  'Tallarines a la huancaína', 'Tallarines verdes', 'Tallarines rojos', 'Arroz chaufa',
  'Aeropuerto chifero (chaufa con frejolito y tallarín)', 'Arroz norteño (como el arroz con pollo)',
  'Arroz blanco', 'Papa sancochada', 'Papas fritas', 'Puré de papa', 'Frejoles',
  'Verduras chiferas (brócoli, pac choy, pimiento)', 'Ensalada fresca (lechuga, tomate, pepino, zanahoria)',
];
const PROTEINAS = [
  'Pollo a la plancha', 'Pollo saltado', 'Pollo dorado (1/8 pollo)', 'Chicharrón de pollo broaster',
  'Alitas broaster (4 und)', 'Alitas BBQ (4 und)', 'Hamburguesa', 'Ají de gallina',
  'Albóndigas de carne (4 und)', 'Pollo chijaukay (el salado)', 'Pollo tipakay (el dulce)',
];
const PROTEINAS_RES = ['Lomo saltado', 'Bistec frito', 'Asado de res', 'Seco de res norteño'];
const COMPLEMENTOS = [
  'Plátano frito (1/2 und)', 'Huevo frito', 'Huevo duro', 'Hot dog', 'Wantán frito (2 und)', 'Papita a la huancaína',
];
const SALSAS = [
  'Huancaína', 'Mayonesa casera', 'Ají pollero', 'Tártara', 'Rocoto molido',
  'Tamarindo (dulce)', 'Ostión (salado)', 'Kétchup', 'Mostaza',
];

const opts = (labels: string[], price = 0): StepOpt[] => labels.map((label) => ({ label, price }));
const NINGUNA: StepOpt = { label: 'Ninguna', price: 0 };

export const STEPS: Step[] = [
  { id: 'base1', name: 'Primera base', req: true, opts: opts(BASES) },
  { id: 'base2', name: 'Segunda base', req: true, opts: opts(BASES) },
  { id: 'proteina', name: 'Proteína', req: true, opts: [...opts(PROTEINAS), ...opts(PROTEINAS_RES, 2)] },
  { id: 'complemento', name: 'Complemento', req: true, opts: [...opts(COMPLEMENTOS), NINGUNA] },
  { id: 'salsa1', name: 'Primera salsa (10 g)', req: true, opts: [...opts(SALSAS), NINGUNA] },
  { id: 'salsa2', name: 'Segunda salsa (10 g)', req: true, opts: [...opts(SALSAS), NINGUNA] },
  { id: 'xprot', name: 'Proteína extra', req: false, opts: [...opts(PROTEINAS, 6), ...opts(PROTEINAS_RES, 8)] },
  { id: 'xcomp', name: 'Complemento extra', req: false, opts: opts(COMPLEMENTOS, 3) },
  { id: 'xsalsa', name: 'Salsas extra (10 g c/u)', req: false, multi: true, opts: opts(SALSAS, 1) },
];

export type Picks = Record<string, string[]>;

export const ARMA_PRICE = 22;
export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
export const OPEN = 12 * 60;
export const CLOSE = 22 * 60 + 30;
export const HOURS_TXT = '12:00 – 22:30';
export const LATLNG: [number, number] = [-12.0921, -77.0203];
export const ADDRESS = 'Av. Andrés Aramburú 1010, San Isidro, Lima';
export const INSTAGRAM = 'sabrosos____';
export const COUNTRY_CODES = ['+51', '+1', '+34', '+54', '+56', '+57', '+52'];

export const soles = (n: number) => 'S/ ' + n;
export const emptyPicks = (): Picks => Object.fromEntries(STEPS.map((st) => [st.id, []]));
export const armaUnit = (picks: Picks) =>
  ARMA_PRICE +
  STEPS.reduce(
    (n, st) => n + st.opts.filter((op) => picks[st.id].includes(op.label)).reduce((m, op) => m + op.price, 0),
    0,
  );

export const phoneErr = (cc: string, phone: string) => {
  const d = phone.replace(/\D/g, '');
  if (cc === '+51') return /^9\d{8}$/.test(d) ? '' : 'Ingresa un celular válido de 9 dígitos (empieza con 9).';
  return d.length >= 7 ? '' : 'Ingresa un número válido.';
};

export type LegalKey = 'privacidad' | 'terminos' | 'reclamos';
export const LEGAL: Record<LegalKey, { title: string; items: { h: string; p: string }[] }> = {
  privacidad: { title: 'Política de privacidad', items: [
    { h: 'Responsable', p: 'Sabrosos · Barra criolla [razón social y RUC por completar], Av. Andrés Aramburú 1010, San Isidro, Lima.' },
    { h: 'Qué datos usamos', p: 'Nombre, celular, email y, si nos lo das, tu fecha de cumpleaños.' },
    { h: 'Para qué', p: 'Crear tu cuenta, gestionar tus pedidos y contactarte sobre ellos. Solo te enviaremos promociones si lo autorizas aparte.' },
    { h: 'Tus derechos', p: 'Puedes pedir acceso, rectificación, cancelación u oposición (ARCO) y retirar tu consentimiento en cualquier momento escribiéndonos [email por completar].' },
    { h: 'Marco legal', p: 'Ley N° 29733, Ley de Protección de Datos Personales, y su Reglamento (D.S. N° 016-2024-JUS).' },
  ]},
  terminos: { title: 'Términos y condiciones', items: [
    { h: 'Pedidos', p: 'Los pedidos se confirman por WhatsApp. Los precios están en soles e incluyen IGV.' },
    { h: 'Promociones', p: 'Código SABROSOS: 10% de descuento, no acumulable con otras promociones. Válido hasta agotar stock o nuevo aviso.' },
    { h: 'Cuenta', p: 'Eres responsable de que los datos de tu cuenta sean correctos.' },
  ]},
  reclamos: { title: 'Libro de Reclamaciones', items: [
    { h: 'Conforme al Código de Protección y Defensa del Consumidor', p: 'Este establecimiento cuenta con un Libro de Reclamaciones virtual a tu disposición.' },
    { h: 'Formulario', p: '[Conectar aquí el formulario virtual del Libro de Reclamaciones con los datos de la empresa.]' },
  ]},
};
