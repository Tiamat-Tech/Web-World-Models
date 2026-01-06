import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import { DiscoverRoute } from "./routes/Discover";
import { WorldRoute } from "./routes/World";
import { DestinationGuideRoute } from "./routes/DestinationGuide";
import { ThemeProvider } from "./context/ThemeContext";
import { PlannerProvider } from "./context/PlannerContext";
import { WorldTravelProvider } from "./context/WorldTravelContext";
import "./index.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <WorldRoute /> },
      { path: "world", element: <WorldRoute /> },
      { path: "discover", element: <DiscoverRoute /> },
      { path: "destinations/:slug", element: <DestinationGuideRoute /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WorldTravelProvider>
        <ThemeProvider>
          <PlannerProvider>
            <RouterProvider router={router} />
          </PlannerProvider>
        </ThemeProvider>
      </WorldTravelProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
