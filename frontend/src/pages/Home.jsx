import React from "react";
import "../pages_css/Home.css";

function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MyLogo</div>
        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <h1>Welcome to My Website</h1>
          <p>A simple React homepage with Navbar, Hero, and Footer.</p>
          <button>Get Started</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 My Website | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;
