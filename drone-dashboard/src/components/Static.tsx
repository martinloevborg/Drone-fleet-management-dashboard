//Imports
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "../css/style.css";
import logo from "../assets/image.png";
import logo2 from "../assets/Exclamation.png";

//Circle card interface and component
interface CircleProps {
  value: string;
  label: string;
}

const Circle: React.FC<CircleProps> = ({ value, label }) => {
  return (
    <div className="circle">
      <div className="circle-content">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
};

export default function Static() {
  //States
  const [data, setData] = useState<any[]>([]);
  const [batPct, setBatPct] = useState(0);
  const [plotColor, setPlotColor] = useState<string>("#4b83cd");

  //Objects
  const batteryData = {
    r: 33,
    theta: ["Bat(V)"],
  };
  const tempData = {
    r: 39,
    theta: ["Temp(°C)"],
  };

  //Variable
  const percentageLeft = (batteryData.r / 40) * 100;

  //Function for data processing with arrays for each row and a loop for pushing the data in the arrays
  const processData = (csvData: string) => {
    const allRows = csvData.split("\n").map((row) => row.split(","));
    const time = [];
    const alt = [];
    const agl = [];
    const vdop = [];
    const hdop = [];
    const snr = [];
    const lat = [];
    const long = [];
    const rssi = [];
    const rsrp = [];
    const rsrq = [];
    const temp = [];
    const spd = [];
    const bat = [];
    const msg = [];

    for (let i = 0; i < allRows.length; i++) {
      const row = allRows[i];
      time.push(row[0]);
      alt.push(row[1]);
      agl.push(row[2]);
      vdop.push(row[3]);
      hdop.push(row[4]);
      snr.push(row[5]);
      lat.push(row[6]);
      long.push(row[7]);
      rssi.push(row[8]);
      rsrp.push(row[9]);
      rsrq.push(row[10]);
      temp.push(row[11]);
      spd.push(row[12]);
      bat.push(row[13]);
      msg.push(row[14]);
    }

    setData({
      time,
      alt,
      agl,
      vdop,
      hdop,
      snr,
      lat,
      long,
      rssi,
      rsrp,
      rsrq,
      temp,
      spd,
      bat,
      msg,
    });
  };

  //Function for alert handling with if and else if statements on which messages should be displayed
  const handleAlerts = () => {
    const tempValue = tempData.r;
    setBatPct(percentageLeft);
    const below20Pct = percentageLeft < 20;
    const above60Temp = tempValue > 60;
    if (above60Temp && below20Pct) {
      alert(
        `Battery is low at: ${percentageLeft.toFixed(
          2
        )}% need charging!\nDevice is overheated at ${tempValue} °C need cooling`
      );
    } else if (above60Temp) {
      alert(
        `Battery percentage: ${percentageLeft.toFixed(
          2
        )}%\nDevice is overheated at ${tempValue} °C need cooling`
      );
    } else if (below20Pct) {
      alert(
        `Battery is low at: ${percentageLeft.toFixed(
          2
        )}% need charging!\nDevice temperature: ${tempValue} °C`
      );
    } else {
      alert(
        `Battery percentage: ${percentageLeft.toFixed(
          2
        )}%\nDevice temperature: ${tempValue} °C`
      );
    }
  };

  //Function for changing the plots color
  const handleColorChange = (color: string) => {
    setPlotColor(color);
  };

  useEffect(() => {
    //Function for fetching data from the csv file
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/martinloevborg/martinloevborg.github.io/main/my-react-app/src/test/demostration/newdata.csv"
        );
        const csvData = await response.text();
        console.log(csvData);
        processData(csvData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="container">
        <div className="container2">
          <div className="container3">
            <div className="dashboard-subtiletitle-container ">
              {/* Error message */}
              <img src={logo2} className="icon"></img>
              <h3>
                No data to visualize in real-time, this is data from ID
                4DF5E020C901F8D2C on 2024-04-26 between 14-15
              </h3>
              <img src={logo2} className="icon"></img>
            </div>
          </div>
          <div className="circle-container">
            {/* Circle cards */}
            <Circle value={"false"} label="Airborne" />
            <Circle value={"0"} label="Disconnectioned" />
            <Circle value={"1"} label="Airtime(h)" />
          </div>
          <div className="controls-container">
            {/* Buttons for displaying alert messages*/}
            <button onClick={handleAlerts}>
              Maintenance check
              <img src={logo} className="button-image"></img>
            </button>
            {/* Radio buttons for selecting plot color */}
            <fieldset>
              <div className="radio-group">
                <label className="radio">
                  <input
                    type="radio"
                    name="color"
                    onClick={() => handleColorChange("red")}
                  />
                  <span className="radio-label"></span>
                  Red
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="color"
                    onClick={() => handleColorChange("gold")}
                  />
                  <span className="radio-label"></span>
                  Yellow
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="color"
                    onClick={() => handleColorChange("#4b83cd")}
                  />
                  <span className="radio-label"></span>
                  Blue
                </label>
              </div>
            </fieldset>
          </div>
          {/* Renders the plots by defining traces data and layout */}
          <div className="twoplotcontainer">
            <div className="container3">
              <h2>Heights during flight</h2>
            </div>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.alt,
                  type: "scatter",
                  fill: "tozeroy",
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "Altitude through time",
                xaxis: { title: "Time(TS) " },
                yaxis: { title: "Altitude(m)" },
              }}
              //config={{responsive: true}}
            />
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.agl,
                  type: "scatter",
                  mode: "lines",
                  fill: "tozeroy",
                  line: { shape: "spline" },
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "AGL(Above Ground Level) through time",
                xaxis: { title: "Time(TS) " },
                yaxis: { title: "AGL(m)" },
              }}
            />
          </div>
          <div className="oneplotcontainer">
            <div className="container3">
              <h2>DOP(Dilution Of Precision) during flight</h2>
            </div>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.vdop,
                  type: "scatter",
                  line: { shape: "hv", color: plotColor },
                  mode: "lines+markers",
                  name: "VDOP",
                },
                {
                  x: data.time,
                  y: data.hdop,
                  type: "scatter",
                  line: { shape: "hv", dash: "dot", color: plotColor },
                  mode: "lines+markers",
                  name: "HDOP",
                },
              ]}
              layout={{
                title: "Vertical DOP and Horizontal DOP through time",
                xaxis: { title: "Time(TS) " },
                yaxis: { title: "VDOP/HDOP(unitless)" },
              }}
            />
          </div>
          <div className="twoplotcontainer">
            <div className="container3">
              <h2>Geographic coordinates during flight</h2>
            </div>
            <Plot
              data={[
                {
                  x: data.lat,
                  type: "histogram",
                  marker: { color: plotColor },
                  name: "Lat(°)",
                },
                {
                  x: data.long,
                  type: "histogram",
                  marker: { color: plotColor },
                  xaxis: "x2",
                  yaxis: "y2",
                  name: "Long(°)",
                },
              ]}
              layout={{
                title: "Latitude and Longtitude through time",
                xaxis: { title: "Latitude(°)" },
                grid: { rows: 1, columns: 2, pattern: "independent" },
                xaxis2: { title: "Longtitude(°)" },
              }}
            />
            <Plot
              data={[
                {
                  type: "scatter",
                  x: data.lat,
                  y: data.long,
                  mode: "markers",
                  marker: { color: plotColor },
                },
                {
                  type: "violin",
                  name: "Lat(°)",
                  x: data.lat,
                  yaxis: "y2",
                  marker: { color: plotColor },
                  box: {
                    visible: true,
                  },
                },
                {
                  type: "violin",
                  name: "Long(°)",
                  y: data.long,
                  xaxis: "x2",
                  marker: { color: plotColor },
                  box: {
                    visible: true,
                  },
                },
              ]}
              layout={{
                title: "Latitude and Longtitude during flight",
                margin: { t: 50 },
                bargap: 0,
                showlegend: false,
                xaxis: {
                  domain: [0, 0.85],
                  showgrid: false,
                  zeroline: false,
                  title: "Latitude(°)",
                },
                yaxis: {
                  domain: [0, 0.85],
                  showgrid: false,
                  zeroline: false,
                  title: "Longtitude(°)",
                },
                xaxis2: {
                  domain: [0.85, 1],
                  showgrid: false,
                  zeroline: false,
                },
                yaxis2: {
                  domain: [0.85, 1],
                  showgrid: false,
                  zeroline: false,
                },
              }}
            />
          </div>
          <div className="twoplotcontainer2">
            <div className="container3">
              <h2>Statistics of parameters</h2>
            </div>
            <Plot
              data={[
                {
                  r: [
                    tempData.r,
                    71,
                    batteryData.r,
                    84,
                    percentageLeft,
                    tempData.r,
                  ],
                  theta: [
                    tempData.theta,
                    "Spd(m/s)",
                    batteryData.theta,
                    "Msg(N)",
                    "Bat(%)",
                    tempData.theta,
                  ],
                  fill: "toself",
                  type: "scatterpolar",
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "Last recording parameters",
                polar: {
                  radialaxis: {
                    visible: true,
                    range: [0, 100],
                  },
                },
              }}
            />
            <Plot
              data={[
                {
                  r: [48, 61, 36, 49, 85, 48],
                  theta: [
                    "Temp(°C)",
                    "Spd(m/s)",
                    "Bat(V)",
                    "Msg(N)",
                    "Bat(%)",
                    "Temp(°C)",
                  ],
                  fill: "toself",
                  type: "scatterpolar",
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "Parameters average",
                polar: {
                  radialaxis: {
                    visible: true,
                    range: [0, 100],
                  },
                },
              }}
            />
          </div>

          <div className="oneplotcontainer">
            <div className="container3">
              <h2>Parameters during flight</h2>
            </div>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.temp,
                  type: "bar",
                  name: "Temp(°C)",
                  marker: { color: plotColor },
                },
                {
                  x: data.time,
                  y: data.spd,
                  type: "bar",
                  xaxis: "x2",
                  yaxis: "y2",
                  name: "Spd(m/s)",
                  marker: { color: plotColor },
                },
                {
                  x: data.time,
                  y: data.bat,
                  type: "bar",
                  xaxis: "x3",
                  yaxis: "y3",
                  name: "Bat(V)",
                  marker: { color: plotColor },
                },
                {
                  x: data.time,
                  y: data.msg,
                  type: "bar",
                  xaxis: "x4",
                  yaxis: "y4",
                  name: "Msg(N)",
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "Parameters through time",
                grid: { rows: 2, columns: 2, pattern: "independent" },
                xaxis: { showticklabels: false },
                xaxis2: { showticklabels: false },
                xaxis3: { title: "Time(TS) " },
                xaxis4: { title: "Time(TS) " },
                yaxis: { title: "Temp(°C)" },
                yaxis2: { title: "Spd(m/s)" },
                yaxis3: { title: "Bat(V)" },
                yaxis4: { title: "Msg(N)" },
              }}
            />
          </div>

          <div className="twoplotcontainer">
            <div className="container3">
              <h2>SNR and RS during flight</h2>
            </div>
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.snr,
                  type: "scatter",
                  mode: "lines",
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "SNR(Signal-to-Noise Ratio) through time",
                xaxis: { title: "Time(TS) " },
                yaxis: { title: "SNR(dB)" },
              }}
            />
            <Plot
              data={[
                {
                  x: data.time,
                  y: data.rssi,
                  type: "scatter",
                  name: "RSSI(strength indicator)",
                  marker: { color: plotColor },
                },
                {
                  x: data.time,
                  y: data.rsrp,
                  xaxis: "x2",
                  yaxis: "y2",
                  type: "scatter",
                  name: "RSRP(received power)",
                  marker: { color: plotColor },
                },
                {
                  x: data.time,
                  y: data.rsrq,
                  xaxis: "x3",
                  yaxis: "y3",
                  type: "scatter",
                  name: "RSRQ(received quality)",
                  marker: { color: plotColor },
                },
              ]}
              layout={{
                title: "RS(Reference Signal) attributes",
                grid: { rows: 3, columns: 1, pattern: "independent" },
                xaxis3: { title: "Time(TS) " },
                xaxis: { showticklabels: false },
                xaxis2: { showticklabels: false },
                yaxis: { title: "RSSI(dBm)" },
                yaxis2: { title: "RSRP(dBm)" },
                yaxis3: { title: "RSRQ(dB)" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
