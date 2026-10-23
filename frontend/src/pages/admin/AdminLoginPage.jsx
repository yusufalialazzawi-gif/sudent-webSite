import React, { useState } from 'react';
import { ta } from '../../i18n/adminText';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { currentLanguage, changeLanguage, isRtl, tx } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || tx('فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.', 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.', 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className={`min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher in Corner */}
      <div className="absolute top-6 right-6 flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 z-10">
        <button
          onClick={() => changeLanguage('ar')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition ${
            currentLanguage === 'ar' ? 'bg-brand-amber-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          {ta("عربي")}
        </button>
        <button
          onClick={() => changeLanguage('tr')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition ${
            currentLanguage === 'tr' ? 'bg-brand-amber-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Türkçe
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition ${
            currentLanguage === 'en' ? 'bg-brand-amber-500 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          English
        </button>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white p-1 shadow-xl shadow-brand-amber-500/10 mb-4 border border-brand-amber-500/40">
            <img src="/logo.jpg" alt={ta("المجد للقبولات الجامعية")} className="w-full h-full object-contain rounded-xl" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide font-cairo">
            {currentLanguage === 'ar' ? 'المجد للقبولات الجامعية' : currentLanguage === 'tr' ? 'El-Mecd Üniversite Kabulleri' : 'Al-Majd Admissions Portal'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {tx('بوابة الإدارة المركزية لمتابعة ملفات الطلاب والجامعات', 'Öğrenci dosyaları ve üniversite kataloğu için merkezi yönetim portalı', 'Central admissions and university catalog management portal')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-300 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {tx('البريد الإلكتروني', 'E-posta Adresi', 'Email Address')}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@soraedu-tr.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50 focus:border-brand-amber-500 text-sm transition ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {tx('كلمة المرور', 'Şifre', 'Password')}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50 focus:border-brand-amber-500 text-sm transition ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg shadow-brand-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{tx('تسجيل الدخول', 'Portala Giriş Yap', 'Sign In to Portal')}</span>
                <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 text-center mb-3 flex items-center justify-center gap-1.5">
            <KeyRound size={14} className="text-brand-amber-500" />
            <span>{tx('حسابات تجريبية سريعة', 'Hızlı Demo Hesapları', 'Quick Demo Accounts')}</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@soraedu-tr.com', 'Admin@2026!')}
              className="text-start px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-amber-400">Super Admin</span>
                <div className="text-[11px] text-slate-400">admin@soraedu-tr.com</div>
              </div>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">Full Control</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('admissions@soraedu-tr.com', 'Admissions@2026!')}
              className="text-start px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-emerald-400">Admissions Officer</span>
                <div className="text-[11px] text-slate-400">admissions@soraedu-tr.com</div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">Student Leads</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('editor@soraedu-tr.com', 'Editor@2026!')}
              className="text-start px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-purple-400">Content Editor</span>
                <div className="text-[11px] text-slate-400">editor@soraedu-tr.com</div>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">CMS & Articles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
