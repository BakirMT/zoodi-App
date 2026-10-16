import React, { useState } from 'react';
import {
  User,
  Bell,
  Globe,
  Sun,
  Moon,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const {
    user,
    updateProfile,
    isDarkMode,
    toggleDarkMode,
    notificationsEnabled,
    setNotificationsEnabled,
    language,
    setLanguage,
    clearCache,
    cacheSizeMB,
    logout,
    showToast,
    replayOpenAnimation,
  } = useApp();

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);

  // Edit account state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const handleAccountSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setShowAccountModal(false);
  };

  const languages = ['English', 'Hindi (हिंदी)', 'Malayalam (മലയാളം)', 'Arabic (العربية)', 'Spanish (Español)'];

  return (
    <div className="pb-28 p-4 flex flex-col gap-3">
      {/* Settings List (Matching Screenshot 20) */}
      <div className="flex flex-col gap-2">
        {/* Account Information */}
        <div
          onClick={() => setShowAccountModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Account Information
              </h3>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Notifications Toggle */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-[11px] text-slate-400">Order updates & promotional alerts</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => {
                setNotificationsEnabled(e.target.checked);
                showToast(
                  e.target.checked
                    ? 'Notifications enabled.'
                    : 'Notifications muted.',
                  'info'
                );
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </div>

        {/* Language */}
        <div
          onClick={() => setShowLanguageModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Language
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{language}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Appearance (Light / Dark Mode) */}
        <div
          onClick={() => setShowAppearanceModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              {isDarkMode ? <Moon className="w-4 h-4 text-pink-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Appearance
              </h3>
              <p className="text-[11px] text-slate-400">
                {isDarkMode ? 'Dark Mode' : 'Light Mode (White)'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleDarkMode();
              }}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-pink-500 text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
              title="Quick Toggle Theme"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-pink-400" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Privacy & Security */}
        <div
          onClick={() => setShowPrivacyModal(true)}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
              Privacy & Security
            </h3>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Play App Open Animation */}
        <div
          onClick={() => {
            replayOpenAnimation();
            showToast('Playing ZOODI open animation', 'info');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/40 flex items-center justify-center text-pink-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Replay Open Animation
              </h3>
              <p className="text-[11px] text-slate-400">Preview the app launch animation</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Clear Cache */}
        <div
          onClick={clearCache}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-500/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Clear Cache
              </h3>
              <p className="text-[11px] text-slate-400">Free temporary app storage</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{cacheSizeMB}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Logout */}
        <div
          onClick={logout}
          className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between cursor-pointer hover:bg-rose-50 transition-colors mt-2"
        >
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </div>
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account Information
              </h3>
              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAccountSave} className="py-4 flex flex-col gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs hover:bg-pink-600 mt-2"
              >
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Choose Language
              </h3>
              <button
                type="button"
                onClick={() => setShowLanguageModal(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 flex flex-col gap-1.5 text-xs">
              {languages.map((lang) => {
                const isSelected = language === lang.split(' ')[0];
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.split(' ')[0]);
                      setShowLanguageModal(false);
                      showToast(`Language set to ${lang}`);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <Check className="w-4 h-4 text-pink-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Privacy & Security
              </h3>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-xs text-slate-600 dark:text-slate-300 space-y-3">
              <p>
                <strong>Data Encryption:</strong> All user credentials and payment transactions are protected using industry-standard TLS encryption.
              </p>
              <p>
                <strong>Two-Factor Authentication:</strong> Enabled by default for all transaction approvals and account profile edits.
              </p>
              <p>
                <strong>Data Retention:</strong> You can request full account deletion or export your order history anytime.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Appearance Modal (Light vs Dark Mode) */}
      {showAppearanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Appearance Theme
              </h3>
              <button
                type="button"
                onClick={() => setShowAppearanceModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 flex flex-col gap-2.5 text-xs">
              {/* Light Mode / White */}
              <div
                onClick={() => {
                  toggleDarkMode(false);
                  setShowAppearanceModal(false);
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  !isDarkMode
                    ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/20 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-xs">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Light Mode (White)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Bright, classic white shopping background
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    !isDarkMode
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {!isDarkMode && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Dark Mode */}
              <div
                onClick={() => {
                  toggleDarkMode(true);
                  setShowAppearanceModal(false);
                }}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  isDarkMode
                    ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/20 text-white font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-pink-400 flex items-center justify-center shadow-xs">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Dark Mode
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Sleek dark theme, easy on the eyes
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isDarkMode
                      ? 'border-pink-500 bg-pink-500 text-white'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isDarkMode && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAppearanceModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
