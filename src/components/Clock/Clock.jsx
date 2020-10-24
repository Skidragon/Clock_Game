import React, { useReducer, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import "./clock.css";

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args));
// https://cssanimation.rocks/clocks/
const actionTypes = {
  MOVE_FORWARD: "MOVE_FORWARD",
  RESET: "RESET",
  SET_HOUR: "SET_HOUR",
  SET_MINUTE: "SET_MINUTE",
  SET_SECOND: "SET_SECOND",
  SET_CLOCK: "SET_CLOCK",
  SET_RANDOM_TIME: "SET_RANDOM_TIME",
  INCREMENT_HOUR: "INCREMENT_HOUR",
  INCREMENT_MINUTE: "INCREMENT_MINUTE",
  INCREMENT_SECOND: "INCREMENT_SECOND"
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
    case actionTypes.MOVE_FORWARD:
      const { hour, minute, second } = state;
      let updatedSecond = second + 1 > 59 ? 0 : second + 1;
      let updatedMinute = minute;

      if (second + 1 > 59) {
        updatedMinute += 1;
      }
      let updatedHour = updatedMinute === 60 ? hour + 1 : hour;
      if (updatedMinute === 60) {
        updatedMinute = 0;
      }
      return {
        hour: updatedHour,
        minute: updatedMinute,
        second: updatedSecond
      };
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
        minute: state.minute > 59 ? 0 : state.minute + 1
      };
    case actionTypes.INCREMENT_SECOND:
      return {
        ...state,
        second: state.second > 59 ? 0 : state.second + 1
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
  hour: controlledHour,
  minute: controlledMinute,
  second: controlledSecond
} = {}) => {
  const { current: internalIntialState } = React.useRef(initialState);
  const [state, dispatch] = useReducer(reducer, internalIntialState);
  const clockIsControlled = Boolean(onChange);

  const hourIsControlled = Boolean(controlledHour);
  const hour = hourIsControlled ? controlledHour : state.hour;

  const minuteIsControlled = Boolean(controlledMinute);
  const minute = minuteIsControlled ? controlledMinute : state.minute;

  const secondIsControlled = Boolean(controlledSecond);
  const second = secondIsControlled ? controlledSecond : state.second;
  const dispatchWithOnChange = action => {
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

  return {
    getResetterProps,
    state: { hour, minute, second },
    dispatch
  };
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
          transform: `rotate(${minute * 6}deg)`
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
          transform: `rotate(${second * 6}deg)`
        }}
      ></div>
    </div>
  );
};
const Clock = ({ state, dispatch, children, ...props }) => {
  useEffect(() => {
    const moveFoward = setInterval(() => {
      dispatch({ type: "MOVE_FORWARD" });
    }, 1000);
    return () => {
      clearInterval(moveFoward);
    };
  }, [dispatch]);

  return (
    <div>
      <div className="clock" {...props}>
        {React.Children.map(children, child => {
          return React.cloneElement(child, state);
        })}
      </div>
      <div className="digital-wrap">
        <div className="digit">{state.hour}</div>
        <div className="digit">{state.minute}</div>
        <div className="digit">{state.second}</div>
      </div>
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
const ClockWithErrorBoundary = ({
  children,
  hour,
  minute,
  second,
  ...props
}) => {
  const { state, dispatch } = useClock({
    hour,
    minute,
    second
  });
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Clock state={state} dispatch={dispatch} {...props}>
        {children}
      </Clock>
    </ErrorBoundary>
  );
};

export { ClockWithErrorBoundary as Clock, HourHand, MinuteHand, SecondHand };
