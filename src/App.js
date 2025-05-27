import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import "./App.css";
import SimplaiChat from "./components/SimplaiChat";
import theme from "./theme/theme.antd";

const queryClient = new QueryClient();

const AgentProps = {
  elementId: "my-tool-container",
  TENANT_ID: 11,
  TOKEN: "71978a93-4246-41e1-a218-fb7ea850b670",
  APP_ID: "agent-682eaf4d414acecb31b2b68d",
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
