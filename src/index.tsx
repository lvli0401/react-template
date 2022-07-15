import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
// import s from "./index.module.less";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import router from "@/router";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {router.map((item, index) => (
            <React.Fragment key={index}>
              <Route
                path={item.path}
                element={
                  <Suspense fallback={<div>加载...</div>}>
                    <item.component />
                  </Suspense>
                }
              />
            </React.Fragment>
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
