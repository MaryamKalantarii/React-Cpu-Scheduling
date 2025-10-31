import React from "react";

function About() {
    return(
        <section id="about" className="about section">

        <div className="container section-title" data-aos="fade-up">
          <span className="subtitle">About</span>
          <h2>About</h2>
          <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam</p>
        </div>
  
        <div className="container" data-aos="fade-up" data-aos-delay="100">
  
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
              <div className="content">
                <h2>Crafting meaningful experiences through thoughtful design and innovative solutions</h2>
                <p className="lead">We believe in the power of purposeful creation, where every detail serves a greater vision and every project becomes a testament to our commitment to excellence.</p>
                <p>Our journey began with a simple philosophy: to transform ideas into reality through meticulous attention to detail and an unwavering dedication to quality. Today, we continue to push boundaries while staying true to our core values of authenticity, innovation, and meaningful impact.</p>
                <div className="stats-wrapper">
                  <div className="stat-item">
                    <span className="number purecounter" data-purecounter-start="0" data-purecounter-end="8" data-purecounter-duration="1"></span>
                    <span className="label">Years of Excellence</span>
                  </div>
                  <div className="stat-item">
                    <span className="number purecounter" data-purecounter-start="0" data-purecounter-end="150" data-purecounter-duration="1"></span>
                    <span className="label">Projects Completed</span>
                  </div>
                  <div className="stat-item">
                    <span className="number purecounter" data-purecounter-start="0" data-purecounter-end="12" data-purecounter-duration="1"></span>
                    <span className="label">Team Members</span>
                  </div>
                </div>
                <div className="cta-wrapper">
                  <a href="#" className="btn-link">
                    Discover our story
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
  
            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
              <div className="image-wrapper">
                <img src="assets/img/about/about-1.webp" alt="About us" className="img-fluid"/>
                <div className="floating-element">
                  <div className="quote-content">
                    <blockquote>
                      "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
                    </blockquote>
                    <cite>— Aristotle</cite>
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