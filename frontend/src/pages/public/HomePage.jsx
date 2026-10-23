import React from 'react';
import { HOME_SECTIONS } from '../../components/home/sections';
import { useHomeSections } from '../../components/home/useHomeSections';

// Ana sayfa: bölümlerin kendisi components/home/ dosyalarında;
// burada yalnızca admin'in belirlediği sıra ve görünürlük uygulanır.
export default function HomePage() {
  const { order, hasCustomOrder } = useHomeSections();

  const sections = hasCustomOrder
    ? order
        .map((key) => HOME_SECTIONS.find((s) => s.key === key))
        .filter(Boolean)
    : HOME_SECTIONS;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {sections.map(({ key, Component }) => (
        <Component key={key} />
      ))}
    </div>
  );
}
