import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">

      {/* ================= SECTION 1: INTRO ================= */}
      <section className="section hero-section">
        <div className="container text-center">
          <h1 className="hero-title">
            Renewable Energy
          </h1>
          <p className="hero-subtitle">
            Renewable energy is energy derived from natural sources such as wind,
            sunlight, water, biomass, and geothermal heat. These sources are
            sustainable, environmentally friendly, and play a crucial role in
            reducing carbon emissions.
          </p>
        </div>
      </section>

      {/* ================= SECTION 2: ENERGY CARDS ================= */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <h2>Renewable Energy Sources</h2>
            <p className="mb-2">Major types of renewable energy used worldwide</p>
          </div>

          <div className="row g-4">
            {[
              {
                title: "Solar Energy",
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6kIWgvRaKC16WuWJBnJQjun7jIzlfRObV_A&s",
                desc: "Uses sunlight to generate electricity through solar panels."
              },
              {
                title: "Wind Energy",
                img: "https://earth.org/wp-content/uploads/2022/06/Untitled-1024-%C3%97-683px-13-1200x675.jpg",
                desc: "Converts wind movement into electricity using turbines."
              },
              {
                title: "Hydro Energy",
                img: "https://kyyekxqg.cdn.imgeng.in/wp-content/uploads/hydro-power-infographic.png",
                desc: "Generates power from flowing or stored water."
              },
              {
                title: "Biomass Energy",
                img: "https://www.mdpi.com/energies/energies-16-01783/article_deploy/html/images/energies-16-01783-g001.png",
                desc: "Produces energy from organic materials and waste."
              },
              {
                title: "Geothermal Energy",
                img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7gcUkoELdr0ylnnMK89T-qu6x8yzHwySUwQ&s",
                desc: "Uses heat from inside the Earth to generate power."
              }
            ].map((item, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="energy-card">
                  <img src={item.img} alt={item.title} />

                  <div className="energy-card-body text-center">
                    <h5>{item.title}</h5>
                    <p>{item.desc}</p>

                    {/* ✅ PRODUCTS BUTTON ONLY FOR WIND ENERGY */}
                    {item.title === "Wind Energy" && (
                      <button
                        onClick={() => navigate("/products")}
                        className="mt-3 px-4 py-2 bg-green-600 text-green rounded hover:bg-green-700"
                      >
                        View Products
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= SECTION 3: MORE INFO ================= */}
      <section className="section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h2>Why Renewable Energy Matters</h2>
              <p>
                Renewable energy reduces dependency on fossil fuels, lowers
                greenhouse gas emissions, and supports long-term energy security.
                It helps combat climate change while providing reliable and
                affordable power.
              </p>
              <p>
                Governments and industries worldwide are shifting toward
                renewables to achieve sustainability goals and economic growth.
              </p>
            </div>
            <div className="col-md-6">
              <img
                src={"https://tradebrains.in/features/wp-content/uploads/2024/07/green-energy-3-1080x675.jpg"}
                alt="Renewable"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: USE CASES ================= */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header text-center">
            <h2>Uses of Renewable Energy</h2>
            <p>Where and how renewable energy is applied</p>
          </div>

          <div className="row g-4">
            {[
              "Residential electricity generation",
              "Industrial power supply",
              "Smart cities and infrastructure",
              "Electric vehicle charging",
              "Agricultural and rural electrification",
              "Water pumping and desalination"
            ].map((use, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="use-card">
                  <h5>{use}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: PROJECT PURPOSE ================= */}
      <section className="section project-section mb-2">
        <div className="container text-center">
          <h2>Overview This Project</h2>
          <p>
            This project is designed to provide a clear understanding of
            renewable energy sources using modern web technologies. It includes
            dashboards, data visualization, and insights to help users analyze
            renewable energy performance and impact.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
