import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/ui/mode-toggle";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <ModeToggle className="fixed bottom-4 right-4" />
    </ThemeProvider>
  </StrictMode>,
);
