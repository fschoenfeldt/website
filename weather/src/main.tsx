import React from "react";
import ReactDOM from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";

import store from "./weather/store";

import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <Provider store={store}>
        <main className="text-foreground bg-background light">
          <App />
        </main>
      </Provider>
    </NextUIProvider>
  </React.StrictMode>,
);
