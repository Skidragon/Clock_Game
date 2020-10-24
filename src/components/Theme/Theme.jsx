import React, { useState, useContext, useReducer } from "react";

const ThemeContext = React.createContext();
ThemeContext.displayName = "ThemeContext";
const actionTypes = {
  PREVIOUS_THEME: "PREVIOUS_THEME",
  NEXT_THEME: "NEXT_THEME",
  SELECT_THEME: "SELECT_THEME"
};
export const themeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.PREVIOUS_THEME:
      return {
        currentTheme: {},
        themes: []
      };
  }
};
export const ThemeProvider = () => {
  const [state, dispatch] = useReducer(themeReducer, []);

  const getTogglerProps = () => {
    return {};
  };
  return <ThemeContext.Provider value={{ state, dispatch }}></ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext();
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return context;
};
