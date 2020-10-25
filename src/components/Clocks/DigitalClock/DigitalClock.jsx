import React, { useEffect } from "react";
import "./digital-clock.css";
import { useClock } from "../useClock";
import { ErrorBoundary } from "react-error-boundary";
const DigitalClock = ({ state, dispatch, children }) => {
  useEffect(() => {
    const moveFoward = setInterval(() => {
      dispatch({ type: "MOVE_FORWARD" });
    }, 1000);
    return () => {
      clearInterval(moveFoward);
    };
  }, [dispatch]);
  return (
    <div className="digital-wrap">
      {React.Children.map(children, child => {
        if (!child) {
          return;
        }
        return React.cloneElement(child, state);
      })}
    </div>
  );
};
const HourDigit = ({ hour }) => {
  return (
    <div className="digit-display">
      <div className="digit-identifier">Hour</div>
      <div className="digit">{hour < 10 ? `0${hour}` : hour}</div>
    </div>
  );
};
const MinuteDigit = ({ minute }) => {
  return (
    <div className="digit-display">
      <div className="digit-identifier">Minute</div>
      <div className="digit">{minute < 10 ? `0${minute}` : minute}</div>
    </div>
  );
};
const SecondDigit = ({ second }) => {
  return (
    <div className="digit-display">
      <div className="digit-identifier">Second</div>
      <div className="digit">{second < 10 ? `0${second}` : second}</div>
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
      <DigitalClock state={state} dispatch={dispatch} {...props}>
        {children}
      </DigitalClock>
    </ErrorBoundary>
  );
};

export {
  ClockWithErrorBoundary as DigitalClock,
  HourDigit,
  MinuteDigit,
  SecondDigit
};
