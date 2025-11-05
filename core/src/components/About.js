import React from "react";
import logo from "../logo.svg";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="about section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">{t("about.subtitle")}</span>
        <h2>{t("about.title")}</h2>
        <p>{t("about.text1")}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>{t("about.sectionTitle")}</h2>
              <p className="lead">{t("about.sectionLead")}</p>
              <p>{t("about.sectionText1")}</p>

              <div className="stats-wrapper">
                <div className="stat-item">
                  <span
                    className="number purecounter"
                    data-purecounter-start="0"
                    data-purecounter-end="8"
                    data-purecounter-duration="1"
                  ></span>
                  <span className="label">{t("about.yearsLabel")}</span>
                </div>
                <div className="stat-item">
                  <span
                    className="number purecounter"
                    data-purecounter-start="0"
                    data-purecounter-end="150"
                    data-purecounter-duration="1"
                  ></span>
                  <span className="label">{t("about.projectsLabel")}</span>
                </div>
                <div className="stat-item">
                  <span
                    className="number purecounter"
                    data-purecounter-start="0"
                    data-purecounter-end="12"
                    data-purecounter-duration="1"
                  ></span>
                  <span className="label">{t("about.teamLabel")}</span>
                </div>
              </div>

              <div className="cta-wrapper">
                <a href="#" className="btn-link">
                  {t("about.ctaText")}
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
            <img src={logo} alt="logo" className="App-logo" />

            <div className="image-wrapper">
              <div className="floating-element">
                <div className="quote-content">
                  <blockquote>{t("about.quote")}</blockquote>
                  <cite>{t("about.quoteAuthor")}</cite>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;