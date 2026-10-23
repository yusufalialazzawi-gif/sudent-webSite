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
                    ? 'text-brand-amber-600 bg-brand-amber-50'
                    : 'text-slate-700 hover:text-brand-navy-900 hover:bg-slate-100'
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
                        className="block px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-brand-amber-600 hover:bg-brand-amber-50/50 transition-colors"
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
                ? 'text-brand-amber-600 bg-brand-amber-50 shadow-sm'
                : item.highlight
                ? 'text-brand-amber-700 hover:text-brand-amber-800 bg-brand-amber-500/10 hover:bg-brand-amber-500/20 font-bold border border-brand-amber-400/30'
                : 'text-slate-700 hover:text-brand-navy-900 hover:bg-slate-100'
            }`}
          >
            {item.highlight && <Award className="w-3.5 h-3.5 text-brand-amber-600 animate-pulse" />}
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
