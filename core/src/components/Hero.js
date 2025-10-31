import React from 'react';

function Hero() {
    return (
      <section id="hero" className="hero section dark-background">

      <div className="video-background">
      <video autoPlay loop muted playsInline>
        <source src="/assets/img/video/video-2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
        <div className="video-overlay"></div>
      </div>

      <div className="hero-content">

        <div className="container position-relative">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1  data-aos-delay="100">Transform Your Vision Into Reality</h1>

              <p  data-aos-delay="200">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
              <div className="hero-buttons"  data-aos-delay="300">
                <a href="#about" className="btn btn-primary">Get Started</a>
                <a href="#services" className="btn btn-outline">Learn More</a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
        );

}
export default Hero;

