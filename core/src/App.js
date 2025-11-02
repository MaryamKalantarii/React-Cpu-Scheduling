import './i18n';
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import "./App.css";
import Header from "./components/header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import About from "./components/About";
import Table from './components/Table';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <BrowserRouter >
      <Header />
      <Hero />
      <About />
      <Table />
      <Footer />
    </BrowserRouter>
  );
}

export default App;