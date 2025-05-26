import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import "./App.css";
import SimplaiChat from "./components/SimplaiChat";
import theme from "./theme/theme.antd";

const queryClient = new QueryClient();

const AgentProps = {
  elementId: "my-tool-container",
  TENANT_ID: 11,
  TOKEN: "48013088-83f9-43ad-8b80-2fa2ea77d65f",
  APP_ID: "agent-676148cc6e71ef9e44b21bd0",
  PROJECT_ID: 11,
  chatbot: {
    placement: "topLeft",
    width: "80vw",
    height: "80vh",
  },
  chatbotButton: {
    type: "",
    placement: {
      top: "20px",
      right: "20px",
    },
  },
  // Other options...
};

const App = () => {
  return (
    <ConfigProvider theme={{ ...theme, algorithm: antdTheme.defaultAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        <SimplaiChat {...AgentProps} />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
