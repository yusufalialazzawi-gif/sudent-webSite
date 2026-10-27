import React from 'react';
import { Link } from 'react-router-dom';

/**
 * StudyFans breadcrumb band: beige strip carrying the schema.org trail and the page H1.
 * The H1 lives inside the band rather than above the grid, which is what sets the
 * StudyFans page rhythm apart from a centered hero title.
 */
export default function SfBreadcrumb({ items = [], title }) {
  return (
    <section className="bg-[#f7f5f2] py-4 sm:py-6 mb-8 drop-shadow-sm">
      <nav
        aria-label="Breadcrumb"
        className="px-4 sf-container flex flex-col gap-[10px] sm:gap-4"
      >
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="flex gap-2 flex-wrap text-base font-light capitalize text-[#707070]"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const label = (
              <span itemProp="name" className={isLast ? 'text-[#0071CE]' : undefined}>
                {item.label}
              </span>
            );

            return (
              <li
                key={`${item.label}-${index}`}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="inline"
              >
                {item.to && !isLast ? (
                  <Link itemProp="item" to={item.to}>
                    {label}
                  </Link>
                ) : (
                  label
                )}
                {!isLast && <span> /</span>}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>

        {title && (
          <h1 className="text-xl sm:text-[1.625rem] font-bold text-main-color">{title}</h1>
        )}
      </nav>
    </section>
  );
}
