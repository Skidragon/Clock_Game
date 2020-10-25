import React, { useState, useEffect, useCallback } from "react";
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
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import {
  isValidHour,
  isValidMinute,
  isValidSecond
} from "../../components/Clocks/useClock";
const modes = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD"
};
export const Game = ({ mode = modes.EASY }) => {
  const [time, setTime] = useState({
    hour: 12,
    minute: 0,
    second: 0
  });
  const [sequences, setSequences] = useState([]);

  const [input, setInput] = useState({
    hour: "",
    minute: "",
    second: ""
  });
  const [isAnswerTime, setIsAnswerTime] = useState(false);
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
      <DigitalClock>
        <HourDigit />
        {mode === modes.MEDIUM || mode === modes.HARD ? <MinuteDigit /> : null}
        {mode === modes.HARD ? <SecondDigit /> : null}
      </DigitalClock>
      <div>
        <p>{`What was the #${sequences.length + 1} clock's time?`}</p>
        <div>
          <div>
            <label htmlFor="hour">Hour:</label>
            <input
              type="text"
              id="hour"
              value={input.hour}
              onChange={e => {
                if (isValidHour(e.target.value)) {
                  setInput(prevState => {
                    return { ...prevState, hour: e.target.value };
                  });
                } else if (e.target.value.length === 0) {
                  return setInput(prevState => {
                    return { ...prevState, hour: "" };
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
