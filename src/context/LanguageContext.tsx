import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS, CROP_TRANSLATIONS, CATEGORY_TRANSLATIONS, STATUS_TRANSLATIONS } from '../data/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  translateCrop: (name: string) => string;
  translateCategory: (category: string) => string;
  translateStatus: (status: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('farmdirect_language');
    if (saved === 'hi' || saved === 'te' || saved === 'en') {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('farmdirect_language', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  const translateCrop = (name: string): string => {
    if (!name) return '';
    if (language === 'en') return name;

    const cropDict = CROP_TRANSLATIONS[language];
    if (!cropDict) return name;

    // Exact match
    if (cropDict[name]) return cropDict[name];

    // Substring match
    for (const [enKey, trans] of Object.entries(cropDict)) {
      if (name.toLowerCase().includes(enKey.toLowerCase())) {
        return name.replace(new RegExp(enKey, 'gi'), String(trans));
      }
    }

    return name;
  };

  const translateCategory = (category: string): string => {
    if (!category) return '';
    if (language === 'en') return category;
    const catDict = CATEGORY_TRANSLATIONS[language];
    return (catDict && catDict[category]) || category;
  };

  const translateStatus = (status: string): string => {
    if (!status) return '';
    if (language === 'en') return status;
    const statusDict = STATUS_TRANSLATIONS[language];
    return (statusDict && statusDict[status]) || status;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateCrop,
        translateCategory,
        translateStatus
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'en',
      setLanguage: () => {},
      t: (k: string, fallback?: string) => TRANSLATIONS.en[k] || fallback || k,
      translateCrop: (n: string) => n,
      translateCategory: (c: string) => c,
      translateStatus: (s: string) => s
    };
  }
  return context;
};
