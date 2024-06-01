//Imports
const express = require('express')
const {InfluxDB} = require('@influxdata/influxdb-client')
const cors = require('cors');

//Variables
const app = express()
const port = 80
const token = 'token_placeholder';
const org = 'username';
const client = new InfluxDB({ url: 'url', token: token });
const queryApi = client.getQueryApi(org);

//Setup for backend server
app.use(cors());
app.use(express.static('public'))
app.set('port', port);
app.listen(app.get('port'), () => {
    console.log(`Listening on ${app.get('port')}.`);
});

//Function for fetching data using influx query
const fetchData = async (req, res) => {
    const startTime = req.query.startTime || '2024-04-23T10:00:00.000Z';
    const stopTime = req.query.stopTime || '2024-04-23T11:00:00.000Z';
    const measurements = req.query.measurement ? (Array.isArray(req.query.measurement) ? req.query.measurement : [req.query.measurement]) : [];
    const field = req.query.field; 
  
    const dataByMeasurement = {};
  
    try {
        for (const measurement of measurements) {
            const query = `
              from(bucket: "bucket_name")
              |> range(start: ${startTime}, stop: ${stopTime})
              |> filter(fn: (r) => r["_measurement"] == "${measurement}")
              |> filter(fn: (r) => r["_field"] == "${field}")
              |> aggregateWindow(every: 4m, fn: mean, createEmpty: false)
              |> yield(name: "mean")
            `;
            const data = await queryApi.collectRows(query);
            dataByMeasurement[measurement] = data;
          }
          res.json(dataByMeasurement);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };

  // Defined routes utilizing the fetchData function
  app.get('/alt', (req, res) => {
    req.query.field = 'altitude';
    fetchData(req, res);
  });

  app.get('/agl', (req, res) => {
    req.query.field = 'AGLBaro';
    fetchData(req, res);
  });

  app.get('/vdop', (req, res) => {
    req.query.field = 'VDOP';
    fetchData(req, res);
  });

  app.get('/hdop', (req, res) => {
    req.query.field = 'HDOP';
    fetchData(req, res);
  });

  app.get('/snr', (req, res) => {
    req.query.field = 'SNR';
    fetchData(req, res);
  });

  app.get('/rssi', (req, res) => {
    req.query.field = 'rssi';
    fetchData(req, res);
  });

  app.get('/rsrp', (req, res) => {
    req.query.field = 'rsrq';
    fetchData(req, res);
  });

  app.get('/rsrq', (req, res) => {
    req.query.field = 'rsrq';
    fetchData(req, res);
  });

  app.get('/lat', (req, res) => {
    req.query.field = 'lat';
    fetchData(req, res);
  });

  app.get('/long', (req, res) => {
    req.query.field = 'long';
    fetchData(req, res);
  });

  app.get('/temp', (req, res) => {
    req.query.field = 'temperatur';
    fetchData(req, res);
  });

  app.get('/spd', (req, res) => {
    req.query.field = 'speed';
    fetchData(req, res);
  });

  app.get('/batv', (req, res) => {
    req.query.field = 'batteryVoltage';
    fetchData(req, res);
  });

  app.get('/msg', (req, res) => {
    req.query.field = 'messageCounter';
    fetchData(req, res);
  });



  //Function for fetching the last recorded data point using influx query
  const fetchLastData = async (req, res) => {
    const startTime = req.query.startTime || '2024-04-23T10:00:00.000Z';
    const stopTime = req.query.stopTime || '2024-04-23T11:00:00.000Z';
    const measurements = req.query.measurement ? (Array.isArray(req.query.measurement) ? req.query.measurement : [req.query.measurement]) : [];
    const field = req.query.field; 
  
    const dataByMeasurement = {};
  
    try {
        for (const measurement of measurements) {
            const query = `
              from(bucket: "bucket_name")
              |> range(start: ${startTime}, stop: ${stopTime})
              |> filter(fn: (r) => r["_measurement"] == "${measurement}")
              |> filter(fn: (r) => r["_field"] == "${field}")
              |> aggregateWindow(every: 10m, fn: mean, createEmpty: false)
              |> last()
            `;
            const data = await queryApi.collectRows(query);
            dataByMeasurement[measurement] = data;
          }
          res.json(dataByMeasurement);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };

  // Defined routes utilizing the fetchLastData function
  app.get('/templast', (req, res) => {
    req.query.field = 'temperatur';
    fetchLastData(req, res);
  });

  app.get('/spdlast', (req, res) => {
    req.query.field = 'speed';
    fetchLastData(req, res);
  });

  app.get('/batvlast', (req, res) => {
    req.query.field = 'batteryVoltage';
    fetchLastData(req, res);
  });

  app.get('/msglast', (req, res) => {
    req.query.field = 'messageCounter';
    fetchLastData(req, res);
  });






  //Function for fetching the average value of the data using influx query
  const fetchMeanData = async (req, res) => {
    const startTime = req.query.startTime || '2024-04-23T10:00:00.000Z';
    const stopTime = req.query.stopTime || '2024-04-23T11:00:00.000Z';
    const measurements = req.query.measurement ? (Array.isArray(req.query.measurement) ? req.query.measurement : [req.query.measurement]) : [];
    const field = req.query.field; 
  
    const dataByMeasurement = {};
  
    try {
        for (const measurement of measurements) {
            const query = `
              from(bucket: "bucket_name")
              |> range(start: ${startTime}, stop: ${stopTime})
              |> filter(fn: (r) => r["_measurement"] == "${measurement}")
              |> filter(fn: (r) => r["_field"] == "${field}")
              |> aggregateWindow(every: 10m, fn: mean, createEmpty: false)
              |> mean()
            `;
            const data = await queryApi.collectRows(query);
            dataByMeasurement[measurement] = data;
          }
          res.json(dataByMeasurement);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };

  // Defined routes utilizing the fetchMeanData function
  app.get('/tempmean', (req, res) => {
    req.query.field = 'temperatur';
    fetchMeanData(req, res);
  });

  app.get('/spdmean', (req, res) => {
    req.query.field = 'speed';
    fetchMeanData(req, res);
  });

  app.get('/batvmean', (req, res) => {
    req.query.field = 'batteryVoltage';
    fetchMeanData(req, res);
  });

  app.get('/msgmean', (req, res) => {
    req.query.field = 'messageCounter';
    fetchMeanData(req, res);
  });