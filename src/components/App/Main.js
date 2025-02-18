import React, { useState } from "react";
import "../../styles/Main.css";
import Home from "../Home/Home";
import Categories from "../Products/Categories";
import Settings from "../Settings/Settings";
import Dashboard from "../Dashboard/Dashboard";

const Main = ({ userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState("home");

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <Home userData={userData} />;
      case "categories":
        return <Categories userData={userData} />;
      case "settings":
        return <Settings />;
      case "dashboard":
        return <Dashboard />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Заголовок всегда наверху */}
      <header className="headerMain">
        <h2>
          LuxMart - {userData?.user?.first_name} {userData?.user?.last_name}!
        </h2>
        <button onClick={onLogout}>Logout</button>
      </header>

      {/* Основной контейнер для бокового меню и контента */}
      <div className="outer-container">
        <div className="tab">
          <div
            className={activeTab === "home" ? "active" : ""}
            onClick={() => setActiveTab("home")}
          >
            Home
          </div>
          <div
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </div>
          <div
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </div>
          <div
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </div>
        </div>

        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </>
  );
};

export default Main;