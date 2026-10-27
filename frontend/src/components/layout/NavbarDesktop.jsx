import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, ChevronDown } from 'lucide-react';

// Masaüstü menü: admin panelinden gelen öğeler ve alt menüler (hover ile açılır).
export default function NavbarDesktop({ items, pathname }) {
  const [openId, setOpenId] = useState(null);

  return (
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
      {items.map((item) => {
        if (item.children?.length > 0) {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setOpenId(item.id)}
              onMouseLeave={() => setOpenId(null)}
            >
              <Link
                to={item.url || '/'}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isOpen
                    ? 'text-[#ff9015] bg-orange-50'
                    : 'text-[#0a2240] hover:text-[#ff9015] hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              </Link>

              {isOpen && (
                <div className="absolute top-full start-0 w-64 pt-2 z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.url}
                        className="block px-4 py-2.5 text-xs sm:text-sm font-medium text-[#0a2240] hover:text-[#ff9015] hover:bg-orange-50/60 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        const isActive = pathname === item.url || (item.url && item.url !== '/' && pathname.startsWith(`${item.url}/`));
        return (
          <Link
            key={item.id}
            to={item.url || '/'}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive
                ? 'text-[#ff9015] bg-orange-50/80 shadow-xs'
                : item.highlight
                ? 'text-[#ff9015] hover:text-[#e05e00] bg-orange-500/10 hover:bg-orange-500/20 font-bold border border-orange-300/40'
                : 'text-[#0a2240] hover:text-[#ff9015] hover:bg-slate-50'
            }`}
          >
            {item.highlight && <Award className="w-3.5 h-3.5 text-[#ff9015] animate-pulse" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
