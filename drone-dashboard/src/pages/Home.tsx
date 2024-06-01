import React, { useState, useEffect } from "react";
import Static from "../components/Static";
import Dynamic from "../components/Dynamic";
import "../css/style.css";
import logo from "../assets/AirPlate-Logo.png";

export default function Home() {
  //State for boolean
  const [bool, setIsChecked] = useState(true);

  //Function for changing the boolean value
  const handleToggle = () => {
    setIsChecked(!bool);
  };

  return (
    <div>
      <div className="container3">
      <img src={logo} className="title-image"></img>
      <div className="dashboard-title-container">
        <h1 className="dashboard-title">Drone flight history dashboard</h1>
        </div>
        {/* Toggle checkbox */}
        <div>
          <label className="toogle-switch">
          <input
            type="checkbox"
            checked={bool}
            onChange={handleToggle}
            onClick={handleToggle}
          />
          <span className="slider"></span>
          </label>
        </div>
      </div>
      <div className="container3">
        {bool ? (
          <div className="container3">
            <Dynamic />
          </div>
        ) : (
          <div className="container3">
            <Static />
          </div>
        )}
      </div>
    </div>
  );
}