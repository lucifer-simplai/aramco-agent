import { Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import { useStore } from "zustand";
import { A_ID, PIM_SID, X_PROJECT_ID, X_TENANT_ID } from "../../constants";
import { useFetchData } from "../../hooks/useApi";
import useChatStream from "../../hooks/useChatStream";
import _authHttp from "../../services/authHttp";
import _unauthHttp from "../../services/unauthHttp";
import { useAppStore } from "../../store";
import config from "../../utils/apiEndpoints";
import { encryptData } from "../../utils/helperFunction";
import ChatBot from "../ChatBot";
import ChatFooter from "../ChatFooter";
import Header from "../Header";
import {
  ChatBotContainer,
  EbmedChatContainer,
  ToolLoadingContainer,
} from "./style";

const { Text } = Typography;

const SimplaiChat = (props) => {
  const store = useStore(useAppStore, (state) => state);
  const [sessionFetching, setSessionFetching] = useState(true);
  const [voiceConversationInProgress, setVoiceConversationInProgress] =
    useState(false);

  const { data: agentData, isLoading: agentLoading } = useFetchData(
    `${config.agents.details}/${store?.userSessionConfig?.chatConfig?.agent_pid}`,
    {},
    {},
    {
      enabled:
        !!store?.userSessionConfig?.PIM_SID &&
        !!store?.userSessionConfig?.chatConfig?.agent_pid,
    },
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    chatStreaming,
    setInput,
    changeConversation,
    changeConversationLoading,
    stopStream,
    setChatConfig,
    conversationRefId,
    setConversationRefId,
    chatConfig,
    conversationId,
    setMessages,
    submitMessageFeedback,
  } = useChatStream({
    chatConfig: {
      model: "",
      language_code: "EN",
      source: "EMBED",
      app_id: "",
      model_id: "",
    },
    // convRefId: props?.conversationReferenceId,
  });

  useEffect(() => {
    if (
      !store?.userSessionConfig?.PIM_SID ||
      !store?.userSessionConfig?.chatConfig?.model_id ||
      store?.userSessionConfig?.TENANT_ID != props?.TENANT_ID ||
      store?.userSessionConfig?.PROJECT_ID != props?.PROJECT_ID ||
      store?.userSessionConfig?.APP_ID != props?.APP_ID ||
      store?.userSessionConfig?.GUEST_USER_ID != props?.user?.id ||
      store?.userSessionConfig?.GUEST_USER_NAME != props?.user?.name ||
      (!!props?.conversationReferenceId &&
        props?.conversationReferenceId != store?.userSessionConfig?.userId) ||
      store?.userSessionConfig?.TOKEN != props?.TOKEN ||
      store?.userSessionConfig?.conversationReferenceId !==
        props?.conversationReferenceId ||
      store?.userSessionConfig?.initialMessage != props?.initialMessage ||
      store?.userSessionConfig?.error
    ) {
      getGuestSession();
    } else {
      setChatConfig({
        model: store?.userSessionConfig?.chatConfig?.app_name,
        language_code: "EN",
        source: "EMBED",
        app_id: store?.userSessionConfig?.chatConfig?.app_id,
        model_id: store?.userSessionConfig?.chatConfig?.model_id,
      });
      setSessionFetching(false);
    }
  }, []);

  useEffect(() => {
    if (
      store?.userSessionConfig?.conversationReferenceId ===
        props?.conversationReferenceId &&
      store?.userSessionConfig?.conversationReferenceId !== conversationRefId
    ) {
      setConversationRefId(props?.conversationReferenceId);
    }
  }, []);

  useEffect(() => {
    if (
      !!store?.userSessionConfig?.initialMessage &&
      !store?.userSessionConfig?.error &&
      store?.userSessionConfig?.conversationReferenceId ===
        props?.conversationReferenceId &&
      store?.userSessionConfig?.conversationReferenceId === conversationRefId &&
      store?.userSessionConfig?.initialMessage === props?.initialMessage &&
      !!chatConfig?.model_id &&
      messages?.length < 1 &&
      !(
        isLoading ||
        chatStreaming ||
        changeConversationLoading ||
        sessionFetching
      )
    ) {
      handleSubmit({}, store?.userSessionConfig?.initialMessage);
    }
  }, [
    store?.userSessionConfig?.initialMessage,
    chatConfig,
    store?.userSessionConfig?.error,
    conversationRefId,
    isLoading,
    chatStreaming,
    changeConversationLoading,
    sessionFetching,
    props,
  ]);

  const getGuestSession = async () => {
    try {
      setSessionFetching(true);
      const response = await _unauthHttp.get(config.identity.getGuestSession, {
        headers: {
          [X_TENANT_ID]: props?.TENANT_ID,
          [X_PROJECT_ID]: props?.PROJECT_ID ?? props?.TENANT_ID,
        },
      });
      if (response.status === 200 && response?.data?.ok) {
        const dataToEncrypt = props?.TOKEN;
        const encryptionKey = response?.data?.result?.[0]?.token;

        const encryptedData = encryptData(dataToEncrypt, encryptionKey);

        const configResponse = await _authHttp.get(config.embed.config, {
          headers: {
            [PIM_SID]: response?.data?.result?.[0]?.token,
            [X_TENANT_ID]: props?.TENANT_ID,
            [A_ID]: encryptedData,
            type: "embed",
            [X_PROJECT_ID]: props?.PROJECT_ID ?? props?.TENANT_ID,
          },
          params: {
            id: props?.APP_ID,
          },
        });
        if (configResponse?.status === 200) {
          // Usage example
          store?.updateUserSessionConfig({
            userId: props?.conversationReferenceId || v4(),
            PIM_SID: response?.data?.result?.[0]?.token,
            A_ID: encryptedData,
            TENANT_ID: props?.TENANT_ID,
            PROJECT_ID: props?.PROJECT_ID,
            TOKEN: props?.TOKEN,
            APP_ID: props?.APP_ID,
            GUEST_USER_ID: props?.user?.id,
            GUEST_USER_NAME: props?.user?.name,
            chatConfig: configResponse?.data,
            conversationReferenceId: props?.conversationReferenceId,
            initialMessage: props?.initialMessage,
            error: false,
          });
          setConversationRefId(props?.conversationReferenceId);

          setChatConfig({
            model: configResponse?.data?.app_name,
            language_code: "EN",
            source: "EMBED",
            app_id: configResponse?.data?.app_id,
            model_id: configResponse?.data?.model_id,
          });
        }
      }
    } catch (error) {
      store?.updateUserSessionConfig({
        error: true,
      });
    } finally {
      setSessionFetching(false);
    }
  };

  if (sessionFetching) {
    return (
      <EbmedChatContainer>
        <Header chatConfig={chatConfig} closePopover={props?.closePopover} />
        <ToolLoadingContainer>
          <Spin />
        </ToolLoadingContainer>
        {props?.APP_ID == "agent-676148cc6e71ef9e44b21bd0" && <ChatFooter />}
      </EbmedChatContainer>
    );
  }

  if (!chatConfig?.model || store?.userSessionConfig?.error) {
    return (
      <EbmedChatContainer>
        <Header chatConfig={chatConfig} closePopover={props?.closePopover} />
        <ToolLoadingContainer>
          <Text danger>
            The setup of the bot has not been properly carried out.
          </Text>
        </ToolLoadingContainer>
        {props?.APP_ID == "agent-676148cc6e71ef9e44b21bd0" && <ChatFooter />}
        {/* agent-6777ec623b61154ba9b9a49b */}
      </EbmedChatContainer>
    );
  }
  return (
    <EbmedChatContainer>
      <Header chatConfig={chatConfig} closePopover={props?.closePopover} />
      <ChatBotContainer
        style={
          props?.APP_ID == "agent-676148cc6e71ef9e44b21bd0"
            ? {
                minHeight: "calc(100% - 140px)",
                maxHeight: "calc(100% - 140px)",
              }
            : {}
        }
      >
        <ChatBot
          messages={messages}
          uploadEnabled={agentData?.config?.file_upload_config?.enabled}
          isLoading={isLoading}
          chatStreaming={chatStreaming}
          changeConversationLoading={changeConversationLoading}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
          setInput={setInput}
          stopStream={stopStream}
          WelcomeMessage={agentData?.welcome_message?.message ?? ""}
          chatConfig={chatConfig}
          agentId={agentData?.id}
          agentDetails={agentData}
          voiceEnabled={agentData?.config?.voice_config?.enabled}
          setMessages={setMessages}
          conversationId={conversationId}
          changeConversation={changeConversation}
          setVoiceConversationInProgress={setVoiceConversationInProgress}
          configProps={props}
          hasAvatar={
            agentData?.config?.voice_config?.synthesizer_config?.synthesizer ===
            "Heyzen"
          }
          startMessages={agentData?.start_messages}
          submitMessageFeedback={submitMessageFeedback}
        />
      </ChatBotContainer>
      {props?.APP_ID == "agent-676148cc6e71ef9e44b21bd0" && <ChatFooter />}
    </EbmedChatContainer>
  );
};

export default SimplaiChat;
