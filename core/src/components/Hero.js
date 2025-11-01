import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t, i18n } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const currentLang = i18n?.language ? i18n.language.toUpperCase() : "EN";

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangMenuOpen(false); // بستن منو بعد از انتخاب
  };

  return (
    <section id="hero" className="hero section dark-background">
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/assets/img/video/video-2.mp4" type="video/mp4" />
          {t('videoNotSupported')}
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 data-aos-delay="100">{t('hero.title')}</h1>
              <p data-aos-delay="200">{t('hero.description')}</p>

              <div className="hero-buttons" data-aos-delay="300">
                <a href="#about" className="btn btn-primary">{t('hero.getStarted')}</a>

                {/* دکمه تغییر زبان */}
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    const newLang = i18n.language === 'en' ? 'fa' : 'en';
                    changeLanguage(newLang);
                  }}
                >
                  {i18n.language === 'en' ? 'فارسی' : 'English'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero; 
