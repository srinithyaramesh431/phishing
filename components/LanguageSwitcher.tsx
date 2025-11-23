import React from 'react';
import { Language } from '../constants';

interface LanguageSwitcherProps {
  language: Language;
  setLanguage: (language: Language) => void;
  className?: string;
}

const languageMap: { [key in Language]: string } = {
  [Language.EN]: 'English',
  [Language.ZH]: '中文',
  [Language.JA]: '日本語',
  [Language.TA]: 'தமிழ்',
  [Language.FR]: 'Français',
  [Language.HI]: 'हिन्दी',
  [Language.KN]: 'ಕನ್ನಡ',
  [Language.TE]: 'తెలుగు',
  [Language.ML]: 'മലയാളം',
  [Language.AR]: 'العربية',
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage, className }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none w-full bg-gray-200 dark:bg-gray-700 border-none text-gray-700 dark:text-gray-300 py-2 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
        aria-label="Select language"
      >
        {Object.entries(languageMap).map(([langCode, langName]) => (
          <option key={langCode} value={langCode}>
            {langName}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
