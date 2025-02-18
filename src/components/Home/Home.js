import React from "react";
import "../../styles/Home.css";

const Home = ({ userData }) => {
  return (
    <div className="home-container">
      <div className="home-title">
        <h1>Welcome to LuxMart, {userData?.user?.first_name}!</h1>
      </div>
      <div className="home-work"></div>
    </div>
  );
};

export default Home;
