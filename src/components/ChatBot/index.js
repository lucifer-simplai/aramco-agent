import { CloseOutlined } from "@ant-design/icons";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Flex, Skeleton, Typography } from "antd";
import { cloneDeep } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { getRootChildrenApi } from "../../api/tracing";
import { heygenApiKey } from "../../constants";
import _unauthHttp from "../../services/unauthHttp";
import { injectInlineStylesFromHTML } from "../../utils/helperFunction";
import Chat from "../Chat/Chat";
import ChatInput from "../Chat/ChatInput";
import EditorDrawer from "../EditorDrawer";
import TracingDetailDrawer from "../Tracing/TracingDetailDrawer";
import { Container, TracingSection } from "./style";

const { Text } = Typography;
const ChatBot = ({
  messages,
  isLoading,
  chatStreaming,
  changeConversationLoading,
  handleSubmit,
  handleInputChange,
  input,
  setInput,
  stopStream,
  WelcomeMessage,
  chatConfig,
  uploadEnabled = false,
  voiceEnabled = false,
  agentId,
  agentDetails,
  setMessages,
  conversationId,
  changeConversation,
  setVoiceConversationInProgress,
  configProps,
  hasAvatar = false,
  submitMessageFeedback,
  startMessages,
}) => {
  const [documentContent, setDocumentContent] = useState();
  const [showEditorDrawer, setShowEditorDrawer] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [stream, setStream] = useState();
  const avatar = useRef(null);
  const mediaStream = useRef(null);

  const [treeData, setTreeData] = useState({});
  const [tracingTreeDetails, setTracingTreeDetails] = useState([]);
  const [rootDataFetching, setRootDataFetching] = useState(false);
  const [traceDetailsOpen, setTraceDetailsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState();

  const getTreeData = useCallback(
    async (traceData) => {
      try {
        if (!treeData?.[traceData?.node_id]) {
          const params = {
            nodeId: traceData?.node_id,
            treeId: traceData?.tree_id,
          };

          const childrenData1 = await getRootChildrenApi({ params });

          const newTreeData = { ...treeData };
          newTreeData[traceData?.node_id] = [childrenData1?.data?.result];
          setTreeData({ ...newTreeData });
          return childrenData1?.data?.result
            ? [childrenData1?.data?.result]
            : [];
        } else {
          return treeData?.[traceData?.node_id];
        }
      } catch (error) {
        return undefined;
      }
    },
    [treeData, setTreeData],
  );

  const handleViewMessageTrace = useCallback(
    async (traceData) => {
      try {
        setRootDataFetching(true);
        setTraceDetailsOpen(true);

        const newTreeData = await getTreeData(traceData);

        setSelectedNode(newTreeData?.[0]?.id);

        setTracingTreeDetails(newTreeData);
      } catch (error) {
      } finally {
        setRootDataFetching(false);
      }
    },
    [
      setRootDataFetching,
      setTraceDetailsOpen,
      setSelectedNode,
      setTracingTreeDetails,
    ],
  );

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current.play();
      };
    }
  }, [mediaStream, stream]);

  const startSession = async () => {
    try {
      setIsLoadingSession(true);
      const newTokenResponse = await _unauthHttp.post(
        "https://api.heygen.com/v1/streaming.create_token",
        {},
        {
          headers: {
            "x-api-key": heygenApiKey,
          },
        },
      );

      avatar.current = new StreamingAvatar({
        token: newTokenResponse?.data?.data?.token,
      });
      avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {});
      avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {});
      avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        endSession();
      });
      avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
        setIsLoadingSession(false);
        setStream(event.detail);
      });
      avatar.current?.on(StreamingEvents.USER_START, (event) => {
        // setIsUserTalking(true);
      });
      avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
        // setIsUserTalking(false);
      });
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: "37f4d912aa564663a1cf8d63acd0e1ab",
        disableIdleTimeout: true,
        voice: {
          emotion: VoiceEmotion.SOOTHING,
          rate: 0.9,
        },
      });
    } catch (error) {
      setIsLoadingSession(false);
    }
  };

  const endSession = async () => {
    setStream(undefined);
    if (avatar?.current) await avatar.current?.stopAvatar();
  };

  const handleChunkSpeak = async (textToSpeak) => {
    if (!avatar.current) {
      return;
    }

    // speak({ text: text, task_type: TaskType.REPEAT })
    await avatar.current
      .speak({
        text: textToSpeak || "",
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.ASYNC,
      })
      .catch((e) => {});
  };

  const enableAgentThinkingMode = async () => {
    if (!avatar.current) {
      return;
    }
    // speak({ text: text, task_type: TaskType.REPEAT })
    await avatar.current.startListening().catch((e) => {});
  };

  const disableAgentThinkingMode = async () => {
    if (!avatar.current) {
      return;
    }
    // speak({ text: text, task_type: TaskType.REPEAT })
    await avatar.current.stopListening().catch((e) => {});
  };

  const interuptAvatar = async () => {
    if (!avatar.current) {
      return;
    }
    await avatar.current.interrupt();
  };

  useEffect(() => {
    if (!isLoading && !chatStreaming) {
      const newMessages = cloneDeep(messages);
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage?.role === "SimplAi" && !!lastMessage?.trace) {
        handleViewMessageTrace(lastMessage?.trace);
      }
    }
  }, [messages, isLoading, chatStreaming]);

  return (
    <Flex gap={12} align="stretch" style={{ width: "100%" }}>
      <Container>
        {isLoadingSession || (hasAvatar && stream) ? (
          <Flex vertical flex={1} style={{ flexGrow: 1, width: "100%" }}>
            <Skeleton
              loading={isLoadingSession}
              active
              paragraph={{ rows: 2 }}
              style={{ height: "100%", width: "50%" }}
            >
              <div
                style={{
                  height: "85%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <video
                  ref={mediaStream}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                >
                  <track kind="captions" />
                </video>
              </div>
            </Skeleton>
          </Flex>
        ) : (
          <Chat
            key="chat-messages"
            messages={messages}
            loading={isLoading}
            chatStreaming={chatStreaming}
            chatLoading={changeConversationLoading}
            WelcomeMessage={WelcomeMessage}
            chatConfig={chatConfig}
            setDocumentContent={setDocumentContent}
            setShowEditorDrawer={setShowEditorDrawer}
            submitMessageFeedback={submitMessageFeedback}
            submitHandler={handleSubmit}
            startMessages={startMessages}
            handleViewMessageTrace={handleViewMessageTrace}
          />
        )}
        <ChatInput
          key="chat-input"
          submitHandler={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
          loading={isLoading || chatStreaming}
          stopStream={stopStream}
          uploadEnabled={uploadEnabled}
          voiceEnabled={voiceEnabled}
          agentId={agentId}
          agentDetails={agentDetails}
          chatConfig={chatConfig}
          setMessages={setMessages}
          conversationId={conversationId}
          changeConversation={changeConversation}
          setVoiceConversationInProgress={setVoiceConversationInProgress}
          configProps={configProps}
          startSession={startSession}
          endSession={endSession}
          handleChunkSpeak={handleChunkSpeak}
          enableAgentThinkingMode={enableAgentThinkingMode}
          disableAgentThinkingMode={disableAgentThinkingMode}
          interuptAvatar={interuptAvatar}
          hasAvatar={hasAvatar}
        />
        <EditorDrawer
          open={showEditorDrawer}
          onClose={() => {
            setShowEditorDrawer(false);
            setDocumentContent(undefined);
          }}
          initialContent={injectInlineStylesFromHTML(documentContent) ?? ""}
        />
      </Container>
      <TracingSection show={traceDetailsOpen}>
        <Flex justify="space-between" style={{ width: "100%" }}>
          <Skeleton
            loading={rootDataFetching}
            title={false}
            paragraph={{ rows: 1 }}
          >
            <Text strong style={{ fontSize: "16px" }}>
              {tracingTreeDetails?.[0]?.name || "Trace details"}
            </Text>
          </Skeleton>
          <CloseOutlined
            style={{ color: "darkgrey", fontSize: "18px" }}
            onClick={() => {
              setTraceDetailsOpen(false);
              setSelectedNode(undefined);
              setTracingTreeDetails([]);
            }}
          />
        </Flex>
        <TracingDetailDrawer
          title={tracingTreeDetails?.[0]?.name || "Trace details"}
          tracingTreeDetails={tracingTreeDetails}
          setTracingTreeDetails={setTracingTreeDetails}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          open={traceDetailsOpen}
          onClose={() => setTraceDetailsOpen(false)}
          loading={rootDataFetching}
        />
      </TracingSection>
    </Flex>
  );
};

export default ChatBot;
