/* eslint-disable react/jsx-pascal-case */
// src/components/Home.js
import React from "react";
import HeroCover from "../components/Hero_Cover/Hero_cover";
import List_Hotel from "../components/List_Hotel/list_hotel";

const Home = () => {
  return (
    <div className="page-container">
      <HeroCover title="welcome" desc="desc" />
      <List_Hotel />
    </div>
  );
};

export default Home;
