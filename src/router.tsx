import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
} from "react-router-dom";
import Drives from "./pages/Drive";
import Search from "./pages/Search";

export const router = createBrowserRouter([
  {
    path: '/drives',
    element: <Drives/>
  },
  {
    path: '/search',
    element: <Search/>
  }
])