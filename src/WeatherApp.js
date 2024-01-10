import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { Card} from "@mui/material";

export default function WeatherApp() {
  const [weatherDataLocation, setWeatherDataLocation] = useState([]);
  const [weatherDataCurrent, setWeatherDataCurrent] = useState([]);
  const [weatherDataCondition, setWeatherDataCondition] = useState("null");
  const [debounceTime, setDebounceTime] = useState(0);
  const [isFound, setIsFound] = useState(false);

  const fetchWeatherData = async (text) => {
    try {
      setIsFound(true);
      const res = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=2ec2fdbc0c014a5eb6a190053240901&q=${text}`
      );
      setWeatherDataLocation(res.data.location);
      setWeatherDataCurrent(res.data.current);
      setWeatherDataCondition(res.data.current.condition);
      console.log(res.data);
      return res.data;
    } catch (err) {
      if (err.response.status === 400) {
        setIsFound(false);
        // enqueueSnackbar("No matching location found", { variant: "warning" });
        setWeatherDataLocation("null");
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    let text = event.target.value;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(() => fetchWeatherData(text), 1000);
    setDebounceTime(newTimeout);
  };
  return (
    <Box align="center">
      <Toolbar>
        <AppBar position="static" style={{ width: "100vw" }}>
          <Typography variant="h5" m={2}>
            Weather App
          </Typography>
        </AppBar>
      </Toolbar>

      <TextField
        id="outlined-basic"
        label="Enter location"
        variant="outlined"
        margin="normal"
        style={{ width: "35vw" }}
        onChange={(e) => {
          debounceSearch(e, debounceTime);
        }}
      />
      {weatherDataLocation === "null" && (
        <Typography variant="h4" color="red">
          No matching location found.
        </Typography>
      )}
      {isFound && (
        <>
          <Typography variant="h3" m={2}>
            {weatherDataLocation.name},{weatherDataLocation.country}
          </Typography>
          <Card style={{ width: "300px" }}>
            <Box display="flex" justifyContent="flex-start">
              <img src={weatherDataCondition.icon} />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography>Temprature</Typography>
                <Typography>Condition</Typography>
                <Typography>Wind Speed</Typography>
                <Typography>Humidity</Typography>
                <Typography>Cloud coverage</Typography>
                <Typography>Last Updated</Typography>
              </Box>
              <Box>
                <Typography>
                  {weatherDataCurrent.temp_c}°C / {weatherDataCurrent.temp_f}°F
                </Typography>
                <Typography>{weatherDataCondition.text}</Typography>
                <Typography>{weatherDataCurrent.wind_kph} Km/h</Typography>
                <Typography>{weatherDataCurrent.humidity}%</Typography>
                <Typography>{weatherDataCurrent.cloud}%</Typography>
                <Typography>{weatherDataCurrent.last_updated}</Typography>
              </Box>
            </Box>
          </Card>
        </>
      )}
    </Box>
  );
}
