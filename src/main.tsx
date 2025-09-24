import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createChat } from "@n8n/chat";
import "@n8n/chat/dist/style.css";

// Initialize global n8n chat widget once
try {
  createChat({
    webhookUrl:
      "https://dharnish0106.app.n8n.cloud/webhook/96131af3-e8d6-4fb6-ba1b-25a8cd7458f7/chat",
  });
} catch (_) {}

createRoot(document.getElementById("root")!).render(<App />);