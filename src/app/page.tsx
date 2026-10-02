import Sabrosos from '@/components/Sabrosos';

export default async function Page({ searchParams }: PageProps<'/'>) {
  const params = await searchParams;
  // Modo QR mesa: /?mesa=7 (cada mesa tiene su QR con su número)
  const mesaParam = Number(Array.isArray(params.mesa) ? params.mesa[0] : params.mesa);
  const mesa = Number.isInteger(mesaParam) && mesaParam >= 1 && mesaParam <= 99 ? mesaParam : null;

  return (
    <Sabrosos
      mesa={mesa}
      whatsapp={(process.env.NEXT_PUBLIC_WHATSAPP ?? '51999999999').replace(/\D/g, '')}
      promo={process.env.NEXT_PUBLIC_PROMO !== 'false'}
      armaVista={process.env.NEXT_PUBLIC_ARMA_VISTA === 'lista' ? 'lista' : 'wizard'}
    />
  );
}
