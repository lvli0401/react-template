import React, { lazy } from "react";
interface Router {
  name?: string;
  path: string;
  children?: Array<Router>;
  component: React.ReactNode;
}

const router: Array<Router> = [
  {
    path: "/",
    component: lazy(() => import("@/pages/home")),
  },
  {
    path: "/about",
    component: lazy(() => import("@/pages/about")),
  },
];

export default router;
