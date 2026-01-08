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
            <p className="mb-2">Highlighted renewable energy solution</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="energy-card wind-card shadow-lg">
                <img
                  src="https://earth.org/wp-content/uploads/2022/06/Untitled-1024-%C3%97-683px-13-1200x675.jpg"
                  alt="Wind Energy"
                />

                <div className="energy-card-body text-center">
                  <h4 className="fw-bold mb-2">Wind Energy</h4>

                  <p className="text-muted">
                    Wind energy converts the kinetic energy of wind into electricity
                    using wind turbines. It is one of the fastest-growing and most
                    cost-effective renewable energy sources.
                  </p>

                  <ul className="wind-points text-start mt-3">
                    <li>🌬️ No fuel cost – wind is naturally available</li>
                    <li>💰 Low operating & maintenance cost</li>
                    <li>🌱 Very low CO₂ emissions</li>
                    <li>📈 High long-term return on investment</li>
                    <li>⚡ Suitable for small to large-scale power generation</li>
                  </ul>

                  <button
                    onClick={() => navigate("/products")}
                    className="btn btn-success mt-4 px-4 py-2 fw-semibold"
                  >
                    View Wind Products
                  </button>
                </div>
              </div>
            </div>
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
