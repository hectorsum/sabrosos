'use client';

import { soles, type MenuItem } from '@/lib/data';
import { Stepper } from './Order';

type Props = {
  items: MenuItem[];
  cart: Record<string, number>;
  onQty: (id: string, d: number) => void;
};

export default function MenuList({ items, cart, onQty }: Props) {
  return (
    <div className="card menu-list">
      {items.map((item) => {
        const qty = cart[item.id] || 0;
        return (
          <div key={item.id} className="dish">
            <div className="dish-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt={item.name} loading="lazy" style={{ objectFit: item.contain ? 'contain' : 'cover' }} />
            </div>
            <div className="dish-body">
              <h3 className="display dish-name">{item.name}</h3>
              <p className="dish-desc">{item.desc}</p>
              <span className="dish-price">{soles(item.price)}</span>
              <div className="dish-action">
                {qty === 0 ? (
                  <button className="btn btn-dark" onClick={() => onQty(item.id, 1)}>+ Agregar</button>
                ) : (
                  <Stepper qty={qty} onAdd={() => onQty(item.id, 1)} onSub={() => onQty(item.id, -1)} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
