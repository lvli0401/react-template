import React from "react";
import { createRoot } from "react-dom/client";
import "./index.less";
import logo from "./assets/logo.svg";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1> Webpack V5 + React18 </h1>
      </header>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
