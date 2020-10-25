import React, { useState } from "react";
import "./styles.css";
import { Home } from "./views/Home/Home";
import { Game } from "./views/Game/Game";
const pages = {
  HOME: "HOME",
  GAME: "GAME",
  SCORE: "SCORE"
};
export default function App() {
  const [page, setPage] = useState(pages.HOME);
  const [mode, setMode] = useState("HARD");

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "center"
      }}
    >
      <h1
        onClick={() => {
          setPage(pages.HOME);
        }}
        style={{
          cursor: "pointer"
        }}
      >
        Clock Memory
      </h1>
      {pages.HOME === page ? (
        <Home
          onStart={mode => {
            setPage(pages.GAME);
            setMode(mode);
          }}
        />
      ) : null}
      {pages.GAME === page ? <Game mode={mode} /> : null}
    </div>
  );
}
