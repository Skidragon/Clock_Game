import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useClock } from "../useClock";
import "./analog-clock.css";

// https://cssanimation.rocks/clocks/
const Clock = ({ state, children, ...props }) => {
  return (
    <div>
      <div className="clock" {...props}>
        {React.Children.map(children, child => {
          if (!child) {
            return;
          }
          return React.cloneElement(child, state);
        })}
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
  const { state } = useClock({
    hour,
    minute,
    second
  });
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Clock state={state} {...props}>
        {children}
      </Clock>
    </ErrorBoundary>
  );
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
export { ClockWithErrorBoundary as Clock, HourHand, MinuteHand, SecondHand };
