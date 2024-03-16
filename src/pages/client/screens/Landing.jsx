import React from "react";
// Sections
import TopNavbar from "../../../components/ClientComponents/Nav/TopNavbar";
import Header from "../../../components/ClientComponents/Sections/Header";
import Servicess from "../../../components/ClientComponents/Sections/Servicess";
import Doctorss from "../../../components/ClientComponents/Sections/Doctorss";
import Blog from "../../../components/ClientComponents/Sections/Blog";
import Footer from "../../../components/ClientComponents/Sections/Footer"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Landing() {
  return (
    <>
      {/* <TopNavbar /> */}
      <Header />
      <Doctorss />
      <Servicess />
      <Blog />
      <Footer />
    </>
  );
}


