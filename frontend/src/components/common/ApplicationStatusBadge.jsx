import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, XCircle, Clock, HelpCircle, Calendar } from 'lucide-react';

export default function ApplicationStatusBadge({
  status = 'UNCONFIRMED',
  deadline = null,
  startDate = null,
  endDate = null,
  statusNote = null,
  size = 'md', // 'sm', 'md', 'lg'
  showDetails = false,
}) {
  const { currentLang } = useLanguage();

  const normalizedStatus = (status || 'UNCONFIRMED').toUpperCase();

  const config = {
    OPEN: {
      label: {
        ar: 'التقديم مفتوح الآن',
        tr: 'Başvuru Açık',
        en: 'Application Open',
      },
      badgeClass: 'bg-emerald-500 text-white border-emerald-400/40 shadow-emerald-500/20',
      pillClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      dotClass: 'bg-white animate-pulse',
    },
    CLOSED: {
      label: {
        ar: 'التقديم مغلق حالياً',
        tr: 'Başvuru Kapalı',
        en: 'Application Closed',
      },
      badgeClass: 'bg-rose-600 text-white border-rose-400/40 shadow-rose-600/20',
      pillClass: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      dotClass: 'bg-rose-200',
    },
    UPCOMING: {
      label: {
        ar: 'يفتح قريباً للعام القادم',
        tr: 'Yakında Açılacak',
        en: 'Coming Soon',
      },
      badgeClass: 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/20',
      pillClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Clock,
      dotClass: 'bg-slate-900',
    },
    UNCONFIRMED: {
      label: {
        ar: 'الحالة غير مؤكدة رسمياً',
        tr: 'Durum Doğrulanmadı',
        en: 'Status Not Confirmed',
      },
      badgeClass: 'bg-slate-700 text-slate-200 border-slate-600 shadow-slate-700/20',
      pillClass: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: HelpCircle,
      dotClass: 'bg-slate-400',
    },
  };

  const itemConfig = config[normalizedStatus] || config.UNCONFIRMED;
  const label = itemConfig.label[currentLang] || itemConfig.label.ar;
  const Icon = itemConfig.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1 font-bold',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2 font-black',
  };

  return (
    <div className="inline-flex flex-col gap-1">
      <span
        className={`inline-flex items-center shadow-sm border ${itemConfig.badgeClass} ${sizeClasses[size] || sizeClasses.md}`}
        title={statusNote || label}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${itemConfig.dotClass} shrink-0`}></span>
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-cairo truncate">{label}</span>
      </span>

      {showDetails && (deadline || endDate || statusNote) && (
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
          {(deadline || endDate) && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>
                {currentLang === 'ar' ? 'آخر موعد:' : currentLang === 'tr' ? 'Son Başvuru:' : 'Deadline:'}{' '}
                <strong className="text-slate-700">
                  {deadline || (endDate ? new Date(endDate).toLocaleDateString() : '')}
                </strong>
              </span>
            </span>
          )}
          {statusNote && (
            <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
              ({statusNote})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
