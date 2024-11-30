import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import { ThemeProvider } from "./providers/theme-providers.jsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
      <Toaster richColors duration={2000} closeButton position="top-center" />
    </ThemeProvider>
  </React.StrictMode>
);
