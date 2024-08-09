/* eslint-disable react/prop-types */

import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Nav from "./Nav";

const Home = () => {
  return (
    <div>
      <Nav />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
