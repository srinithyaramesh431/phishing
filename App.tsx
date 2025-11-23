
import React, { useState, useEffect, useMemo } from 'react';
import PhishDetector from './components/PhishDetector';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { Language, translations } from './constants';
import type { Translations } from './types';

type Page = 'login' | 'signup' | 'app';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('isLoggedIn');
    if (loggedInUser === 'true') {
      setIsLoggedIn(true);
      setCurrentPage('app');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    setCurrentPage('app');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const currentTranslations: Translations = useMemo(() => translations[language], [language]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderPage = () => {
    if (isLoggedIn) {
      return (
        <PhishDetector
          onLogout={handleLogout}
          language={language}
          setLanguage={setLanguage}
          translations={currentTranslations}
        />
      );
    }
    switch (currentPage) {
      case 'signup':
        return (
          <SignupPage
            onSignup={handleLogin}
            switchToLogin={() => setCurrentPage('login')}
            translations={currentTranslations}
            language={language}
            setLanguage={setLanguage}
          />
        );
      case 'login':
      default:
        return (
          <LoginPage
            onLogin={handleLogin}
            switchToSignup={() => setCurrentPage('signup')}
            translations={currentTranslations}
            language={language}
            setLanguage={setLanguage}
          />
        );
    }
  };

  return (
    <main className="min-h-screen font-sans text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      {renderPage()}
    </main>
  );
};

export default App;
