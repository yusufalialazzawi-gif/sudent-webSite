import React from 'react';
import { HOME_SECTIONS } from '../../components/home/sections';

// STUDYFANS.COM — ANA SAYFA (HOME PAGE)
// Sabit sıralama:
// 1 Navbar (Header) -> 2 Hero -> [İstatistik / Güven Şeridi] -> 3 Arama formu (#homepage-form) ->
// 4 Partner ülkeler -> 5 Hizmetler -> 6 Üniversiteler -> 7 Bölümler -> 8 Makaleler -> 9 Final CTA -> 10 Footer
export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {HOME_SECTIONS.map(({ key, Component }) => (
        <Component key={key} />
      ))}
    </div>
  );
}
