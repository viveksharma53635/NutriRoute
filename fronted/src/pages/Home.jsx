import React from 'react';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../cssjs/Home.css";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container-fluid px-3 px-md-5">
          <div className="row align-items-center">
            <div className="col-md-6 py-5">
              <h1 className="hero-title mb-3">
                Eat Smart <br />
                Live Healthy <br />
                <span className="text-success">Track Your Nutrition with NutriRoute</span>
              </h1>
              <p className="hero-subtitle mb-4">
                A smart platform for diet planning, meal tracking, and health analytics.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-success btn-lg px-4" onClick={handleLogin}>
                  Get Started
                </button>
                <button className="btn btn-outline-success btn-lg px-4" onClick={() => navigate("/diet-planner")}>
                  Explore Diet Plans
                </button>
              </div>
            </div>
            <div className="col-md-6 py-5">
              <div className="hero-image-card">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061"
                  alt="Nutrition Dashboard Concept"
                  className="img-fluid hero-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section py-5">
        <div className="container-fluid px-3 px-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Core Features</h2>
            <p className="text-muted">Everything you need for a healthier routine.</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 mb-4">
              <div className="feature-card h-100">
                <div className="feature-icon">
                  <i className="bi bi-stars text-success fs-1"></i>
                </div>
                <h5 className="fw-bold">AI Diet Recommendation</h5>
                <p>
                  Personalized diet suggestions based on your goals and nutrition patterns.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card h-100">
                <div className="feature-icon">
                  <i className="bi bi-clipboard2-check text-success fs-1"></i>
                </div>
                <h5 className="fw-bold">Meal Tracking</h5>
                <p>
                  Log meals daily and monitor calories, macros, and consistency.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card h-100">
                <div className="feature-icon">
                  <i className="bi bi-graph-up-arrow text-success fs-1"></i>
                </div>
                <h5 className="fw-bold">Health Analytics</h5>
                <p>
                  Visualize your weekly progress and improve decisions with insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default Home;
