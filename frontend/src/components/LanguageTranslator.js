import React, { useState } from 'react';
import '../styles/LanguageTranslator.css';

const LanguageTranslator = () => {
  const [isTranslatorVisible, setIsTranslatorVisible] = useState(false);

  const loadGoogleTranslate = () => {
    // Only load if not already loaded
    if (!window.google || !window.google.translate) {
      // Create a script element for the Google Translate API
      const googleTranslateScript = document.createElement('script');
      googleTranslateScript.type = 'text/javascript';
      googleTranslateScript.charset = 'UTF-8';
      googleTranslateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      
      // Add error handler
      googleTranslateScript.onerror = () => {
        console.log('Google Translate script failed to load');
      };
      
      document.head.appendChild(googleTranslateScript);
    }
    
    // Define the callback function
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,te,ta,mr,gu,kn,ml,pa,ur',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      } catch (error) {
        console.log('Google Translate widget initialization failed', error);
      }
    };
  };

  const toggleTranslator = () => {
    setIsTranslatorVisible(!isTranslatorVisible);
    
    // Load Google Translate on first click
    if (!window.google || !window.google.translate) {
      loadGoogleTranslate();
    }
  };

  return (
    <div className="language-translator">
      <button 
        className="translator-toggle-btn" 
        onClick={toggleTranslator}
        title="Translate Page"
      >
        <span role="img" aria-label="Translate">🌐</span> Translate
      </button>
      <div 
        id="google_translate_element" 
        className={`translator-dropdown ${isTranslatorVisible ? 'visible' : ''}`}
      ></div>
    </div>
  );
};

export default LanguageTranslator; 