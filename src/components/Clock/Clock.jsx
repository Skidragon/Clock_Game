import React, { useEffect, useReducer } from "react";
import "./clock.css";
const actionTypes = {
  SET_HOUR: "CHANGE_HOUR",
  SET_MINUTE: "CHANGE_MINUTE",
  SET_SECOND: "CHANGE_SECOND",
  INCREMENT_HOUR: "INCREMENT_HOUR",
  INCREMENT_MINUTE: "INCREMENT_MINUTE",
  INCREMENT_SECOND: "INCREMENT_SECOND",
  SET_CLOCK: "SET_CLOCK",
  SET_RANDOM_TIME: "SET_RANDOM_TIME"
};

const clockReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_CLOCK:
      return {
        second: action.second,
        minute: action.minute,
        hour: action.hour
      };
    case actionTypes.SET_MINUTE:
      if (action.minute < 0 || action.minute > 59) {
        throw new Error("minute must be a number from 0 to 59 inclusive");
      }
      return {
        ...state,
        minute: action.minute
      };
    case actionTypes.SET_SECOND:
      if (action.second < 0 || action.second > 59) {
        throw new Error("second must be a number from 0 to 59 inclusive");
      }
      return {
        ...state,
        second: action.second
      };
    case actionTypes.SET_HOUR:
      if (action.hour < 0 || action.hour > 11) {
        throw new Error("second must be a number from 0 to 11 inclusive");
      }
      return {
        ...state,
        hour: action.hour
      };
    case actionTypes.SET_RANDOM_TIME:
      function randomIntFromInterval(min, max) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
      return {
        hour: randomIntFromInterval(0, 11),
        minute: randomIntFromInterval(0, 59),
        second: randomIntFromInterval(0, 59)
      };
    case actionTypes.INCREMENT_HOUR:
      return {
        ...state,
        hour: state.hour > 11 ? 0 : state.hour + 1
      };
    case actionTypes.INCREMENT_MINUTE:
      return {
        ...state,
        minute: action.minute > 59 ? 0 : action.minute + 1
      };
    case actionTypes.INCREMENT_SECOND:
      return {
        ...state,
        second: action.second > 59 ? 0 : action.second + 1
      };
    default:
      throw new Error(
        `${action.type} is not a valid action type in clockReducer.`
      );
  }
};
export const Clock = () => {
  const [state, dispatch] = useReducer(clockReducer, {
    minute: 0,
    second: 0,
    hour: 0
  });
  useEffect(() => {
    dispatch({ type: actionTypes.SET_RANDOM_TIME });
  }, []);
  return (
    <article className="clock">
      <div className="hours-container">
        <div
          className="hours"
          style={{
            transform: `rotate(${state.hour * 30}deg)`
          }}
        ></div>
      </div>
      <div className="minutes-container">
        <div className="minutes"></div>
      </div>
      <div className="seconds-container">
        <div className="seconds"></div>
      </div>
    </article>
  );
};
