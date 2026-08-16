import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('sampan_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('sampan_lang', language);
    document.documentElement.lang = language === 'bn' ? 'bn' : 'en';
    if (language === 'bn') {
      document.body.classList.add('bangla');
    } else {
      document.body.classList.remove('bangla');
    }
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};