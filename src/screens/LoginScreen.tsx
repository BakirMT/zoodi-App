import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  X,
  User,
  PlusCircle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { navigate, login, showToast } = useApp();

  // Email / Password Form State
  const [identifier, setIdentifier] = useState(() => {
    return localStorage.getItem('zoodi_remembered_email') || 'afneel@gmail.com';
  });
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Google OAuth Dialog State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoadingAccount, setGoogleLoadingAccount] = useState<string | null>(null);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Facebook OAuth Dialog State
  const [showFacebookModal, setShowFacebookModal] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [fbEmailOrPhone, setFbEmailOrPhone] = useState('afneel.fb@zoodi.com');
  const [fbPassword, setFbPassword] = useState('••••••••');

  // Submit Email & Password
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      setFormError('Please enter your email or mobile number.');
      showToast('Please enter your email or mobile number', 'error');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setFormError('Please enter a valid password (minimum 4 characters).');
      showToast('Please enter your password', 'error');
      return;
    }

    setIsSubmitting(true);

    // Save or clear rememberMe
    if (rememberMe) {
      localStorage.setItem('zoodi_remembered_email', cleanIdentifier);
    } else {
      localStorage.removeItem('zoodi_remembered_email');
    }

    // Simulate authentic authentication delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Derive name from identifier if possible
      const derivedName = cleanIdentifier.includes('@')
        ? cleanIdentifier.split('@')[0].replace(/[\._]/g, ' ')
        : 'Afneel';
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

      login(cleanIdentifier, cleanPassword, {
        name: formattedName || 'Afneel',
        email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@zoodi.com`,
      });
    }, 600);
  };

  // Google Sign-In Handler
  const handleSelectGoogleAccount = (accountName: string, accountEmail: string, avatarUrl?: string) => {
    setGoogleLoadingAccount(accountEmail);

    setTimeout(() => {
      setGoogleLoadingAccount(null);
      setShowGoogleModal(false);

      login(accountEmail, 'google_oauth_token', {
        name: accountName,
        email: accountEmail,
        avatar: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      });
    }, 800);
  };

  // Custom Google Account Sign-In
  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
      showToast('Please enter a valid Google email address', 'error');
      return;
    }
    const cleanEmail = customGoogleEmail.trim();
    const cleanName = cleanEmail.split('@')[0].replace(/[\._]/g, ' ');
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    handleSelectGoogleAccount(formattedName, cleanEmail);
  };

  // Facebook Sign-In Handler
  const handleFacebookContinue = (customName?: string) => {
    setFacebookLoading(true);

    setTimeout(() => {
      setFacebookLoading(false);
      setShowFacebookModal(false);

      const nameToUse = customName || 'Afneel';
      login(`${nameToUse.toLowerCase().replace(/\s+/g, '')}@facebook.com`, 'fb_oauth_token', {
        name: nameToUse,
        email: `${nameToUse.toLowerCase().replace(/\s+/g, '')}@facebook.com`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      });
    }, 850);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      showToast(`Password reset link sent to ${resetEmail}`);
      setShowForgotModal(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 1500);
  };

  return (
    <div className="relative min-h-[580px] p-6 flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <div>
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mb-4 cursor-pointer"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Log in to continue your shopping journey
          </p>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{formError}</span>
          </div>
        )}

        {/* Option 1: Email and Password Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Email / Mobile input */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Email or Mobile Number
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Email or Mobile Number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Enter password..."
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  rememberMe
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-slate-600 dark:text-slate-400">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-pink-600 dark:text-pink-400 hover:underline font-semibold cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Social divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white dark:bg-slate-950 px-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Option 2 & 3: Google & Facebook Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer group"
          >
            <svg className="w-4 h-4 shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.93 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Continue with Facebook */}
          <button
            type="button"
            onClick={() => setShowFacebookModal(true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-[0.98] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer group"
          >
            <svg className="w-4 h-4 fill-[#1877F2] shrink-0 group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook</span>
          </button>
        </div>
      </div>

      {/* Footer Register Link */}
      <div className="text-center pt-6 text-xs text-slate-500 dark:text-slate-400">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={() => navigate('register')}
          className="text-pink-600 dark:text-pink-400 font-bold hover:underline cursor-pointer"
        >
          Register
        </button>
      </div>

      {/* ========================================================
          Interactive Google Sign-in Account Chooser Modal
         ======================================================== */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl relative text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.93 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Sign in with Google
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 mb-3">
              Choose an account to continue to <strong className="text-slate-900 dark:text-white">ZOODI Collection</strong>
            </p>

            {/* Account List */}
            <div className="flex flex-col gap-2">
              {/* Account 1: Bakir Mannarkkad (User's verified email) */}
              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount(
                    'Bakir Mannarkkad',
                    'bakirmannarkkad170@gmail.com',
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'
                  )
                }
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs ring-2 ring-blue-500/20">
                    B
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Bakir Mannarkkad
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      bakirmannarkkad170@gmail.com
                    </p>
                  </div>
                </div>
                {googleLoadingAccount === 'bakirmannarkkad170@gmail.com' ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />
                )}
              </button>

              {/* Account 2: Afneel */}
              <button
                type="button"
                onClick={() =>
                  handleSelectGoogleAccount(
                    'Afneel',
                    'afneel@gmail.com',
                    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80'
                  )
                }
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center text-xs shadow-xs ring-2 ring-pink-500/20">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                      Afneel
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      afneel@gmail.com
                    </p>
                  </div>
                </div>
                {googleLoadingAccount === 'afneel@gmail.com' ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100" />
                )}
              </button>

              {/* Use Another Google Account option */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-blue-500" />
                  <span>Use another Google account</span>
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-blue-500/30 flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Enter Google Email:
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex gap-2 justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed">
              Google will share your name, email address, and profile picture with ZOODI.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          Interactive Facebook Login Dialog Modal
         ======================================================== */}
      {showFacebookModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl relative text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Log in with Facebook
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowFacebookModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 p-1 border-2 border-[#1877F2] relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                  alt="Facebook Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                  <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Log in as Afneel
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                ZOODI Collection will receive your name, profile picture, and email address.
              </p>

              {/* 1-Click Facebook Continue Button */}
              <button
                type="button"
                disabled={facebookLoading}
                onClick={() => handleFacebookContinue('Afneel')}
                className="w-full mt-4 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer disabled:opacity-60"
              >
                {facebookLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Facebook...</span>
                  </>
                ) : (
                  <span>Continue as Afneel</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowFacebookModal(false)}
                className="mt-3 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Enter your registered email address and we'll send a link to reset your password.
            </p>
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-pink-500"
              />
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetSuccess}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-pink-500 text-white hover:bg-pink-600 cursor-pointer flex items-center gap-1.5"
                >
                  {resetSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <span>Send Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
