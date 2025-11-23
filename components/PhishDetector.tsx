
import React, { useState, useEffect, useRef } from 'react';
import { analyzeEmailContent } from '../services/geminiService';
import { Classification } from '../types';
import type { AnalysisResult, Translations } from '../types';
import { Language } from '../constants';
import ResultCard from './ResultCard';
import LanguageSwitcher from './LanguageSwitcher';
import Spinner from './Spinner';

interface PhishDetectorProps {
  onLogout: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
}

const PhishDetector: React.FC<PhishDetectorProps> = ({ onLogout, language, setLanguage, translations }) => {
  const [emailContent, setEmailContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('analysisHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('analysisHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setEmailContent(text);
      };
      reader.onerror = () => {
        setError(translations.fileReadError);
      }
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim()) return;

    setIsLoading(true);
    setError(null);
    setCurrentResult(null);

    const result = await analyzeEmailContent(emailContent);

    if (result) {
      const newResult: AnalysisResult = {
        id: new Date().toISOString(),
        content: emailContent.substring(0, 200) + '...', // Store a snippet
        classification: result.classification,
        reason: result.reason,
        timestamp: new Date().toLocaleString(),
      };
      setCurrentResult(newResult);
      setHistory(prev => [newResult, ...prev]);
    } else {
      setError(translations.errorDescription);
    }
    setIsLoading(false);
  };
  
  const getResultBgColor = (classification: Classification | undefined) => {
    switch (classification) {
      case Classification.SAFE: return 'bg-safe-green/10 border-safe-green';
      case Classification.SUSPICIOUS: return 'bg-suspicious-yellow/10 border-suspicious-yellow';
      case Classification.PHISHING: return 'bg-phishing-red/10 border-phishing-red';
      default: return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 animate-fade-in">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h1 className="text-2xl font-bold">{translations.appName}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
            {translations.logout}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold">{translations.mainHeader}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{translations.mainSubheader}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input and Result */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit}>
                <label htmlFor="email-content" className="block text-lg font-semibold mb-2">{translations.pasteEmail}</label>
                <textarea
                  id="email-content"
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition"
                  placeholder={translations.pastePlaceholder}
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />

                <div className="flex items-center my-4">
                  <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
                  <span className="mx-4 text-gray-500 dark:text-gray-400 font-semibold">{translations.or}</span>
                  <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt,.eml"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span>{fileName || translations.uploadFile}</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !emailContent}
                  className="w-full mt-6 px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition"
                >
                  {isLoading ? <><Spinner /> {translations.analyzing}</> : translations.analyze}
                </button>
              </form>
            </div>
            
            {/* Result Display */}
            <div className="sticky top-8">
                {(isLoading || error || currentResult) && (
                    <div className={`p-6 rounded-lg shadow-lg border-2 animate-fade-in ${getResultBgColor(currentResult?.classification)}`}>
                        <h3 className="text-2xl font-bold mb-4">{translations.analysisResult}</h3>
                        {error && (
                            <div className="text-red-600 dark:text-red-400">
                            <p className="font-bold">{translations.error}</p>
                            <p>{error}</p>
                            </div>
                        )}
                        {currentResult && <ResultCard result={currentResult} translations={translations} isCurrent={true} />}
                    </div>
                )}
            </div>
          </div>

          {/* Right Column: History */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4 border-b pb-2 dark:border-gray-600">{translations.history}</h3>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {history.length > 0 ? (
                history.map(result => <ResultCard key={result.id} result={result} translations={translations} />)
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">{translations.noHistory}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhishDetector;
