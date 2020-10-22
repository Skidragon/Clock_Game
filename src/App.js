import React, { useState } from "react";
import { Clock, HourHand, MinuteHand } from "./components/Clock/Clock";
import "./styles.css";

export default function App() {
  const [time, setTime] = useState({
    hour: 4,
    minute: 40
  });
  return (
    <div className="App">
      <Clock hour={time.hour} minute={time.minute}>
        <HourHand />
        <MinuteHand />
      </Clock>
    </div>
  );
}
