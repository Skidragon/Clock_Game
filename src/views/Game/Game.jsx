import React, { useState, useEffect, useReducer, useRef } from "react";
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
import { useForm } from "react-hook-form";
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const modes = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD"
};
const actionTypes = {
  MEMORIZE_PHASE: "MEMORIZE_PHASE",
  ANSWER_PHASE: "ANSWER_PHASE",
  SCORE_PHASE: "SCORE_PHASE"
};
const gameReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.MEMORIZE_PHASE:
      if (!state.sequences[state.sequenceIndex + 1]) {
        return {
          ...state,
          phase: actionTypes.ANSWER_PHASE,
          sequenceIndex: 0
        };
      } else {
        return {
          ...state,
          sequenceIndex: state.sequenceIndex + 1
        };
      }
    case actionTypes.ANSWER_PHASE:
      if (!state.sequences[state.sequenceIndex + 1]) {
        return {
          ...state,
          phase: actionTypes.MEMORIZE_PHASE,
          sequenceIndex: state.sequences.length,
          score: state.score + 1,
          sequences: [
            ...state.sequences,
            {
              hour: randomIntFromInterval(1, 12),
              minute: randomIntFromInterval(0, 59),
              second: randomIntFromInterval(0, 59)
            }
          ]
        };
      } else {
        return {
          ...state,
          phase: actionTypes.ANSWER_PHASE,
          sequenceIndex: state.sequenceIndex + 1
        };
      }
    case actionTypes.SCORE_PHASE:
      return {
        ...state,
        phase: actionTypes.SCORE_PHASE
      };
    default:
      throw new Error(`${action.type} is not a valid action in gameReducer.`);
  }
};
export const Game = ({ mode = modes.EASY, backToHome }) => {
  const [gameState, gameDispatch] = useReducer(gameReducer, {
    sequences: [
      {
        hour: randomIntFromInterval(1, 12),
        minute: randomIntFromInterval(0, 59),
        second: randomIntFromInterval(0, 59)
      }
    ],
    score: 0,
    sequenceIndex: 0,
    phase: actionTypes.MEMORIZE_PHASE
  });

  useEffect(() => {
    const memorizePhase = setInterval(() => {
      if (gameState.phase === actionTypes.MEMORIZE_PHASE) {
        gameDispatch({ type: actionTypes.MEMORIZE_PHASE });
      }
    }, 3000);
    return () => {
      clearInterval(memorizePhase);
    };
  }, [gameState.phase]);
  const [input, setInput] = useState({
    hour: "",
    minute: "",
    second: ""
  });
  const hourInputRef = useRef();
  const currentTime = gameState.sequences[gameState.sequenceIndex];
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
    if (
      mode === modes.HARD &&
      isValidSecond(input.second) &&
      currentTime.second !== Number(input.secomd)
    ) {
      gameDispatch({ type: actionTypes.SCORE_PHASE });
    } else if (
      (mode === modes.MEDIUM || mode === modes.HARD) &&
      isValidMinute(input.minute) &&
      currentTime.minute !== Number(input.minute)
    ) {
      gameDispatch({ type: actionTypes.SCORE_PHASE });
    } else if (
      isValidHour(input.hour) &&
      currentTime.hour !== Number(input.hour)
    ) {
      gameDispatch({ type: actionTypes.SCORE_PHASE });
    } else {
      gameDispatch({ type: actionTypes.ANSWER_PHASE });
      hourInputRef.current.focus();
      setInput({
        hour: "",
        minute: "",
        second: ""
      });
    }
  };
  return (
    <div>
      {JSON.stringify(gameState, undefined, 3)}
      {actionTypes.MEMORIZE_PHASE === gameState.phase && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Clock
            hour={currentTime.hour}
            minute={currentTime.minute}
            second={currentTime.second}
          >
            <HourHand />
            {mode === modes.MEDIUM || mode === modes.HARD ? (
              <MinuteHand />
            ) : null}
            {mode === modes.HARD ? <SecondHand /> : null}
          </Clock>
          <DigitalClock
            hour={currentTime.hour}
            minute={currentTime.minute}
            second={currentTime.second}
          >
            <HourDigit />
            {mode === modes.MEDIUM || mode === modes.HARD ? (
              <MinuteDigit />
            ) : null}
            {mode === modes.HARD ? <SecondDigit /> : null}
          </DigitalClock>
        </div>
      )}
      {actionTypes.ANSWER_PHASE === gameState.phase && (
        <div>
          <p>{`What was the #${gameState.sequenceIndex + 1} clock's time?`}</p>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                style={{
                  display: "flex",
                  flexFlow: "column"
                }}
              >
                <div>
                  <label htmlFor="hour">Hour:</label>

                  <input
                    type="text"
                    id="hour"
                    name="hour"
                    style={{
                      marginBottom: "12px"
                    }}
                    autoFocus={true}
                    ref={ref => {
                      hourInputRef.current = ref;
                      register(ref);
                    }}
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
                  <span
                    style={{
                      marginLeft: "12px"
                    }}
                  ></span>
                </div>
                {(mode === modes.MEDIUM || mode === modes.HARD) && (
                  <div>
                    <label htmlFor="minute">Minute:</label>
                    <input
                      ref={register}
                      type="text"
                      id="minute"
                      name="minute"
                      style={{
                        marginBottom: "12px"
                      }}
                      value={input.minute}
                      onChange={e => {
                        if (isValidMinute(e.target.value)) {
                          setInput(prevState => {
                            return { ...prevState, minute: e.target.value };
                          });
                        } else if (e.target.value.length === 0) {
                          return setInput(prevState => {
                            return { ...prevState, minute: "" };
                          });
                        }
                      }}
                    />
                  </div>
                )}
                {mode === modes.HARD && (
                  <div>
                    <label htmlFor="second">Second:</label>
                    <input
                      ref={register}
                      type="text"
                      id="second"
                      name="second"
                      value={input.second}
                      onChange={e => {
                        if (isValidSecond(e.target.value)) {
                          setInput(prevState => {
                            return { ...prevState, second: e.target.value };
                          });
                        } else if (e.target.value.length === 0) {
                          return setInput(prevState => {
                            return { ...prevState, second: "" };
                          });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <input type="submit" value="Next" />
            </form>
          </div>
        </div>
      )}
      {gameState.phase === actionTypes.SCORE_PHASE && (
        <div>
          <button onClick={backToHome}>Home</button>
          Your Score: {gameState.score}
        </div>
      )}
    </div>
  );
};
