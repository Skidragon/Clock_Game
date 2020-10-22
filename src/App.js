import React from "react";
import { Clock, HourHand } from "./components/Clock/Clock";
import "./styles.css";

export default function App() {
  return (
    <div className="App">
      <Clock>
        <HourHand />
      </Clock>
    </div>
  );
}
