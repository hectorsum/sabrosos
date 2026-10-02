'use client';

import { useEffect, useRef } from 'react';
import { LATLNG } from '@/lib/data';

const PIN = `<svg width="48" height="60" viewBox="0 0 48 60"><path d="M27 5C15 5 7 14 7 25c0 14 20 32 20 32s20-18 20-32C47 14 39 5 27 5z" fill="#1d0e0b"/><path d="M24 2C12 2 4 11 4 22c0 14 20 32 20 32s20-18 20-32C44 11 36 2 24 2z" fill="#e41e13" stroke="#1d0e0b" stroke-width="3"/><circle cx="24" cy="22" r="8" fill="#f8f2da" stroke="#1d0e0b" stroke-width="3"/></svg>`;

export default function Mapa() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import('leaflet').Map | undefined;
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false }).setView(LATLNG, 16);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const icon = L.divIcon({ className: '', iconSize: [48, 60], iconAnchor: [24, 58], html: PIN });
      L.marker(LATLNG, { icon, title: 'Sabrosos' }).addTo(map);
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return <div ref={ref} className="map" />;
}
