import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useLocation } from "react-router-dom";
import "./App.css";
import SimplaiChat from "./components/SimplaiChat";
import theme from "./theme/theme.antd";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const tenantId = queryParams.get("TENANT_ID") || 11;
  const projectId = queryParams.get("PROJECT_ID") || 11;
  const token =
    queryParams.get("TOKEN") || "71978a93-4246-41e1-a218-fb7ea850b670";
  const appId = queryParams.get("APP_ID") || "agent-682eaf4d414acecb31b2b68d";

  const AgentProps = {
    elementId: "my-tool-container",
    TENANT_ID: tenantId,
    TOKEN: token,
    APP_ID: appId,
    PROJECT_ID: projectId,
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

  return (
    <ConfigProvider theme={{ ...theme, algorithm: antdTheme.defaultAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        <SimplaiChat {...AgentProps} />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
