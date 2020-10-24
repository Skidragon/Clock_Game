import React, { useState } from "react";
import {
  Clock,
  HourHand,
  MinuteHand,
  SecondHand
} from "../../components/Clocks/AnalogClock/AnalogClock";
import {
  DigitalClock,
  HourDigit,
  MinuteDigit,
  SecondDigit
} from "../../components/Clocks/DigitalClock/DigitalClock";
const modes = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD"
};
export const Game = ({ mode = modes.EASY }) => {
  const [time, setTime] = useState({
    hour: 0,
    minute: 0,
    second: 0
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Clock hour={time.hour} minute={time.minute} second={time.second}>
        <HourHand />
        {mode === modes.MEDIUM || mode === modes.HARD ? <MinuteHand /> : null}
        {mode === modes.HARD ? <SecondHand /> : null}
      </Clock>
      <DigitalClock hour={time.hour} minute={time.minute} second={time.second}>
        <HourDigit />
        {mode === modes.MEDIUM || mode === modes.HARD ? <MinuteDigit /> : null}
        {mode === modes.HARD ? <SecondDigit /> : null}
      </DigitalClock>
      <div style={{ display: "flex", justifyContent: "space-between" }}></div>
    </div>
  );
};
