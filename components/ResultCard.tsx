
import React from 'react';
import { Classification } from '../types';
import type { AnalysisResult, Translations } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
  translations: Translations;
  isCurrent?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, translations, isCurrent = false }) => {
  const getColors = () => {
    switch (result.classification) {
      case Classification.SAFE:
        return {
          bg: isCurrent ? 'bg-transparent' : 'bg-safe-green/10',
          text: 'text-safe-green',
          border: 'border-safe-green',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case Classification.SUSPICIOUS:
        return {
          bg: isCurrent ? 'bg-transparent' : 'bg-suspicious-yellow/10',
          text: 'text-suspicious-yellow',
          border: 'border-suspicious-yellow',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case Classification.PHISHING:
        return {
          bg: isCurrent ? 'bg-transparent' : 'bg-phishing-red/10',
          text: 'text-phishing-red',
          border: 'border-phishing-red',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          )
        };
    }
  };

  const { bg, text, border, icon } = getColors();

  return (
    <div className={`p-4 rounded-lg border ${isCurrent ? 'border-none p-0' : `${bg} ${border}`}`}>
      <div className={`flex items-center space-x-3 ${text} mb-2`}>
        {icon}
        <span className="text-xl font-bold">{translations.verdict}: {result.classification}</span>
      </div>
      <p className="text-gray-800 dark:text-gray-200">
        <strong className="font-semibold">{translations.reason}:</strong> {result.reason}
      </p>
      {!isCurrent && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-right">{result.timestamp}</p>
      )}
    </div>
  );
};

export default ResultCard;
