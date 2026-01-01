import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  // const [openFaq, setOpenFaq] = useState(null);

  // const toggleFaq = (index) => {
  //   setOpenFaq(openFaq === index ? null : index);
  // };

  const faqs = [
    {
      question: "Where are wind turbines manufactured?",
      answer:
        "Wind turbines are manufactured in specialized factories. Major components like blades, towers, nacelles, and generators are produced separately and assembled on-site."
    },
    {
      question: "What materials are used in wind turbine blades?",
      answer:
        "Blades are made from fiberglass-reinforced composites, carbon fiber, and epoxy resins to ensure strength, flexibility, and durability."
    },
    {
      question: "What is the warranty period for wind turbines?",
      answer:
        "Standard warranty ranges from 2–5 years. Extended service agreements can cover turbines for up to 20–25 years."
    },
    {
      question: "How long does it take to manufacture a wind turbine?",
      answer:
        "Manufacturing takes 2–4 months depending on turbine size. Installation and commissioning take an additional few weeks."
    },
    {
      question: "Are spare parts easily available?",
      answer:
        "Yes. OEM manufacturers maintain global supply chains and regional service centers for quick spare part availability."
    }
  ];

  return (
    <div className="about-page">

      {/* =======================
          HERO CAROUSEL
      ======================== */}
      <div
        id="windCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3500"
        data-bs-pause="hover"
      >
        {/* Indicators */}
        <div className="carousel-indicators">
          <button data-bs-target="#windCarousel" data-bs-slide-to="0" className="active"></button>
          <button data-bs-target="#windCarousel" data-bs-slide-to="1"></button>
          <button data-bs-target="#windCarousel" data-bs-slide-to="2"></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={"https://blog.ucs.org/wp-content/uploads/2022/12/121222-Charlie-wind-blog-1.jpg"}
              className="d-block w-100 carousel-img"
              alt="Wind Farm"
            />
            <div className="carousel-caption">
              <h1>Powering the Future with Wind Energy</h1>
              <p>Clean • Scalable • Sustainable</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src={"https://control.com/uploads/articles/NREL_1.jpg"}
              className="d-block w-100 carousel-img"
              alt="Manufacturing"
            />
            <div className="carousel-caption">
              <h1>Advanced Wind Turbine Manufacturing</h1>
              <p>Precision Engineering & Global Standards</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src={"https://images.ft.com/v3/image/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2F0faec745-7578-40c3-af31-703d04eddb8c.jpg?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1"}
              className="d-block w-100 carousel-img"
              alt="Reliability"
            />
            <div className="carousel-caption">
              <h1>Reliable Energy for 25+ Years</h1>
              <p>Designed for Long-Term Performance</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#windCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#windCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      <div className="container py-5">

        {/* MISSION */}
        <section className="mb-5 text-center">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            Accelerating global wind energy adoption through innovative,
            reliable, and cost-effective turbine solutions.
          </p>
        </section>
        {/* MANUFACTURING */}
        <section className="manufacturing-section mb-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="section-title">Wind Turbine installation</h2>
              <p className="section-text">
                Our wind turbines are manufactured using advanced automation,
                aerospace-grade materials, and strict quality control standards.
              </p>
              <ul className="manufacturing-list">
                <li>✔ High-strength composite blades</li>
                <li>✔ Precision-engineered gearboxes & generators</li>
                <li>✔ Corrosion-resistant steel towers</li>
                <li>✔ IEC & ISO certified production</li>
                <li>✔ Smart sensors & SCADA integration</li>
              </ul>
            </div>
            <div className="col-md-6 text-center">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/070/867/108/small/workers-assembling-a-large-wind-turbine-blade-in-a-factory-photo.jpg"
                className="img-fluid rounded shadow-lg"
                alt="Manufacturing"
              />
            </div>
          </div>
        </section>

        {/* WIND ENERGY OVERVIEW */}
        <section className="wind-info-section mb-5">
          <div className="text-center mb-5">
            <h2 className="section-title">About Wind Energy</h2>
            <p className="section-text">
              Wind energy is one of the fastest-growing renewable energy sources,
              providing clean, reliable, and cost-effective electricity worldwide.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="wind-info-card">
                <h5>🌬️ How Wind Energy Works</h5>
                <p>
                  Wind turbines convert kinetic energy from moving air into mechanical
                  power, which is then transformed into electricity using generators.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="wind-info-card">
                <h5>⚡ Benefits of Wind Energy</h5>
                <p>
                  Wind energy produces zero emissions, reduces dependency on fossil
                  fuels, and offers long-term cost savings after installation.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="wind-info-card">
                <h5>🌍 Environmental Impact</h5>
                <p>
                  Wind power significantly lowers carbon emissions, conserves water
                  resources, and supports sustainable energy goals globally.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-6">
              <div className="wind-info-card">
                <h5>🏗️ Onshore & Offshore Wind</h5>
                <p>
                  Onshore wind farms are cost-effective and easy to install, while
                  offshore wind offers higher and more consistent wind speeds for
                  large-scale power generation.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-6">
              <div className="wind-info-card">
                <h5>📊 Role in Modern Power Grids</h5>
                <p>
                  Modern wind farms integrate with smart grids, energy storage systems,
                  and AI-based forecasting to ensure reliable and balanced electricity
                  supply.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* FAQ */}
        {/* FAQ DROPDOWN SECTION */}
        <section className="faq-section mt-5">
          <h2 className="section-title text-center mb-4">
            Manufacturing & Warranty FAQs
          </h2>

          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div className="accordion-item" key={index}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq-${index}`}
                  >
                    {faq.question}
                  </button>
                </h2>

                <div
                  id={`faq-${index}`}
                  className={`accordion-collapse collapse ${index === 0 ? "show" : ""
                    }`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
};

export default About;
