import React from "react";
import s from "./index.module.less";
import logo from "@/assets/logo.svg";
import { Button } from "@arco-design/web-react";

export default () => {
  return (
    <div className={s.app}>
      <header>
        <img src={logo} className={s.appLogo} alt="logo" />
        <h1> W </h1>
        <Button type="primary">嘿嘿嘿</Button>
      </header>
    </div>
  );
};
