import React, { useState } from "react";
import {
  Clock,
  HourHand,
  MinuteHand,
  SecondHand
} from "./components/Clocks/AnalogClock/AnalogClock";
import {
  DigitalClock,
  HourDigit,
  MinuteDigit,
  SecondDigit
} from "./components/Clocks/DigitalClock/DigitalClock";
import "./styles.css";

export default function App() {
  const [time, setTime] = useState({
    hour: 4,
    minute: 40
  });
  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          alignItems: "center"
        }}
      >
        <h1>Clock Memory</h1>
        <div
          style={{
            display: "flex",
            flexFlow: "column"
          }}
        >
          <Clock>
            <HourHand />
            <MinuteHand />
            <SecondHand />
          </Clock>
          <DigitalClock>
            <HourDigit />
            <MinuteDigit />
            <SecondDigit />
          </DigitalClock>
        </div>
      </div>
    </div>
  );
}
