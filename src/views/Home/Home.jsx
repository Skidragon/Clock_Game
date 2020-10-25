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
export const Home = ({ onStart }) => {
  const [modeSelection, setModeSelection] = useState("EASY");

  return (
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
        <form>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "36px"
            }}
          >
            <div>
              <input
                checked={modeSelection === "EASY"}
                value="EASY"
                type="radio"
                name="mode"
                id="easy"
                onChange={e => {
                  setModeSelection(e.currentTarget.value);
                }}
              />
              <label for="easy">Easy</label>
            </div>
            <div>
              <input
                checked={modeSelection === "MEDIUM"}
                value="MEDIUM"
                type="radio"
                name="mode"
                id="medium"
                onChange={e => {
                  setModeSelection(e.currentTarget.value);
                }}
              />
              <label for="medium">Medium</label>
            </div>
            <div>
              <input
                checked={modeSelection === "HARD"}
                value="HARD"
                type="radio"
                name="mode"
                id="hard"
                onChange={e => {
                  setModeSelection(e.currentTarget.value);
                }}
              />
              <label for="hard">Hard</label>
            </div>
          </div>
          <button
            type="submit"
            onClick={() => {
              onStart(modeSelection);
            }}
            style={{
              padding: "1em 2em"
            }}
          >
            Start
          </button>
        </form>
      </div>
    </div>
  );
};
