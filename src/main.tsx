import { DirectionProvider } from "@/components/ui/direction";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./app/index.css";
import { AppProviders } from "./app/providers";
import { AppRouter } from "./app/router";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <DirectionProvider dir="rtl" direction="rtl">
        <AppProviders>
          <AppRouter />
        </AppProviders>
      </DirectionProvider>
    </StrictMode>,
  );
}
