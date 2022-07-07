import React from "react";
import { createRoot } from "react-dom/client";
import s from "./index.module.less";
import logo from "./assets/logo.svg";
import { Button } from "@arco-design/web-react";

function App() {
  return (
    <div className={s.app}>
      <header>
        <img src={logo} className={s.appLogo} alt="logo" />
        <h1> Webpack V5 + React18 </h1>
        <Button type="primary">嘿嘿嘿</Button>
      </header>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
