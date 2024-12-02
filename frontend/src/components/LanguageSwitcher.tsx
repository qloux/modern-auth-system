import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/languageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="language-switcher-container">
      <button
        onClick={toggleLanguage}
        className="language-switcher"
      >
        <span className="language-text" key={i18n.language}>
          {i18n.language.toUpperCase()}
        </span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
