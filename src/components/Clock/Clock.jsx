import React, { useEffect, useReducer } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./clock.css";

const callAll = (...fns) => (...args) => fns.forEach((fn) => fn?.(...args));
// https://cssanimation.rocks/clocks/
const actionTypes = {
  RESET: "RESET",
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
  if (action.hour && (action.hour < 0 || action.hour > 11)) {
    throw new Error("hour must be a number from 0 to 11 inclusive");
  }
  if (action.minute && (action.minute < 0 || action.minute > 59)) {
    throw new Error("minute must be a number from 0 to 59 inclusive");
  }
  if (action.second && (action.second < 0 || action.second > 59)) {
    throw new Error("second must be a number from 0 to 59 inclusive");
  }
  switch (action.type) {
    case actionTypes.RESET:
      return {
        ...state,
        ...action.initialState
      };
    case actionTypes.SET_CLOCK:
      return {
        second: action.second,
        minute: action.minute,
        hour: action.hour
      };
    case actionTypes.SET_MINUTE:
      return {
        ...state,
        minute: action.minute
      };
    case actionTypes.SET_SECOND:
      return {
        ...state,
        second: action.second
      };
    case actionTypes.SET_HOUR:
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
const useClock = ({
  reducer = clockReducer,
  onChange,
  initialState = {
    hour: 0,
    minute: 0,
    second: 0
  },
  hour,
  minute,
  second
} = {}) => {
  const { current: internalIntialState } = React.useRef(initialState);
  const [state, dispatch] = useReducer(reducer, internalIntialState);
  const clockIsControlled = Boolean(onChange);

  const dispatchWithOnChange = (action) => {
    if (!clockIsControlled) {
      dispatch(action);
    }
    if (onChange) {
      onChange(reducer({ ...state, hour, minute, second }, action), action);
    }
  };

  const reset = () =>
    dispatchWithOnChange({
      type: actionTypes.RESET,
      initialState: internalIntialState
    });
  const getResetterProps = ({ onClick, ...props } = {}) => {
    return {
      onClick: callAll(onClick, reset),
      ...props
    };
  };
  return { getResetterProps, state, dispatch };
};

const HourHand = ({ hour }) => {
  return (
    <div className="hours-container">
      <div
        className="hours"
        style={{
          transform: `rotate(${hour * 30}deg)`
        }}
      ></div>
    </div>
  );
};
const MinuteHand = ({ minute }) => {
  return (
    <div className="minutes-container">
      <div
        className="minutes"
        style={{
          transform: `rotate(${minute * 60}deg)`
        }}
      ></div>
    </div>
  );
};
const SecondHand = ({ second }) => {
  return (
    <div className="seconds-container">
      <div
        className="seconds"
        style={{
          transform: `rotate(${second * 60}deg)`
        }}
      ></div>
    </div>
  );
};
const Clock = ({ state, dispatch, children, ...props }) => {
  return (
    <div className="clock">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, state);
      })}
    </div>
  );
};
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};
const ClockWithErrorBoundary = (props) => {
  const { state, dispatch } = useClock();
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Clock state={state} dispatch={dispatch} {...props}>
        <HourHand />
        <MinuteHand />
        <SecondHand />
      </Clock>
    </ErrorBoundary>
  );
};

export default ClockWithErrorBoundary;
