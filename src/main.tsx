import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createChat } from "@n8n/chat";
import "@n8n/chat/dist/style.css";

// Initialize global n8n chat widget once
try {
  createChat({
    webhookUrl:
      "https://dharnish0106.app.n8n.cloud/webhook/0b5dbdf5-e042-4ad8-a220-8146d98d369a/chat",
  });
} catch (_) {}

createRoot(document.getElementById("root")!).render(<App />);