import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, SUPPORTED_LANGUAGES } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguageState] = useState(() => {
    try {
      return localStorage.getItem('akros_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguageState(langCode);
      try {
        localStorage.setItem('akros_lang', langCode);
      } catch {
        // Ignore storage access errors
      }
    }
  };

  // Helper to resolve nested keys like "nav.home"
  const t = (keyPath, fallback = '') => {
    const langDict = translations[currentLanguage] || translations.en;
    const parts = keyPath.split('.');
    let current = langDict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English if missing
        let enFallback = translations.en;
        for (const p of parts) {
          if (enFallback && typeof enFallback === 'object' && p in enFallback) {
            enFallback = enFallback[p];
          } else {
            return fallback || keyPath;
          }
        }
        return enFallback || fallback || keyPath;
      }
    }
    return current || fallback || keyPath;
  };

  const currentDict = translations[currentLanguage] || translations.en;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        dict: currentDict,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
