import React, { useEffect } from "react";
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
      duration: 1000, // مدت زمان انیمیشن‌ها
      once: true,     // فقط یک بار انیمیشن اجرا میشه (وقتی اسکرول کردی)
    });
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Table />
      <Footer />
    </>
  );
}

export default App;