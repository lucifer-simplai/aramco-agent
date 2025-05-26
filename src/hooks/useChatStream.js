// import { initiateConversationApi } from "@/api/intract";

import { getChatDetails } from "../utils/stream";

import { useEffect, useRef, useState } from "react";

import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "zustand";
import {
  initiateConversationApi,
  submitUserMessageFeedbackApi,
} from "../api/interact";
import { X_SELLER_ID, X_SELLER_PROFILE_ID } from "../constants";
import { useAppStore } from "../store";
import config from "../utils/apiEndpoints";
import {
  checkValidStringifiedJSON,
  getErrorFromApi,
} from "../utils/helperFunction";

const SimplAi_ERROR_MESSAGE = "Something went wrong fetching AI response.";

export const ChunkType = {
  TOOL_CALLS: "tool_calls",
  TOOL: "tool",
  CITATION: "Citation",
  TOOL_CITATION_MESSAGE: "tool_citation_message",
  TRACE: "trace",
};

const useChatStream = (input) => {
  const streamRef = useRef();
  const controller = new AbortController();
  const signal = controller.signal;

  const { userSessionConfig } = useStore(useAppStore, (state) => state);
  const [messages, setMessages] = useState(input?.messages ?? []);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStreaming, setChatStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(
    input?.convId ?? input?.convRefId,
  );
  const [conversationRefId, setConversationRefId] = useState(input?.convRefId);

  const [changeConversationLoading, setChangeConversationLoading] =
    useState(false);
  const [chatConfig, setChatConfig] = useState(
    input?.chatConfig ?? {
      model: "",
      language_code: "EN",
      source: "EMBED",
    },
  );

  const [custAtrr, setCustAtrr] = useState(input?.customAttributes);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  useEffect(() => {
    changeConversation(conversationRefId);
  }, [conversationRefId]);

  useEffect(() => {
    signal?.addEventListener?.("abort", () => {
      if (streamRef?.current) {
        setChatStreaming(false);
        setIsLoading(false);
        streamRef?.current?.close?.();
      }
    });
  }, [signal]);

  const resetCustAtrr = () => {
    stopStream();
    setCustAtrr(undefined);
  };

  const handleInputChange = (e) => {
    setMessage(e?.target?.value);
  };

  const changeConversation = async (convId) => {
    try {
      stopStream();
      setChangeConversationLoading(true);
      setConversationId(convId);
      setMessage("");
      if (convId) {
        setMessages([]);
        const chatDetails = await getChatDetails(convId, {
          userId: userSessionConfig?.userId,
          type: "embed",
        });
        setMessages(chatDetails);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setConversationId();
      setMessages([]);
    } finally {
      setChangeConversationLoading(false);
    }
  };

  const addMessageToChat = (message, role = "user") => {
    setMessages((messages) => [
      ...messages,
      { role, content: message, id: uuidv4() },
    ]);
  };

  const appendMessageToChat = (message) => {
    setMessages((messages) => {
      if (messages?.length > 0) {
        const latestMessage = messages[messages.length - 1];

        return [
          ...messages.slice(0, -1),
          { ...latestMessage, content: `${latestMessage.content}${message}` },
        ];
      }
      return [...messages];
    });
  };

  const appendExtraMessageDetailsToChat = (type, data) => {
    setMessages((messages) => {
      messages = cloneDeep(messages);
      const latestMessage = messages[messages.length - 1];

      switch (type) {
        case ChunkType.TOOL_CALLS:
          const newTools =
            data
              ?.map?.((toolData) => {
                if (Object.keys(toolData || {})?.length > 0) {
                  const functionDetails = toolData?.function || {};
                  return { ...(toolData || {}), ...(functionDetails || {}) };
                } else {
                  return null;
                }
              })
              ?.filter?.((toolData) => !!toolData) || null;
          return [
            ...messages.slice(0, -1),
            { ...latestMessage, tools: newTools },
          ];

        case ChunkType.TOOL:
          const newToolwithDetails = latestMessage?.tools
            ? latestMessage?.tools?.map?.((toolData) => {
                if (toolData?.id === data?.tool_call_id) {
                  return {
                    ...toolData,
                    content: data?.content,
                  };
                } else {
                  return { ...toolData };
                }
              })
            : null;
          return [
            ...messages.slice(0, -1),
            { ...latestMessage, tools: newToolwithDetails },
          ];

        case ChunkType.CITATION:
          const citations = latestMessage?.citations || {};
          if (!!data?.nodes) {
            data?.nodes?.map?.((citationChunk) => {
              if (!!citations?.[citationChunk?.metadata?.file_name]) {
                citations[citationChunk?.metadata?.file_name] = [
                  ...(citations?.[citationChunk?.metadata?.file_name] || []),
                  citationChunk,
                ];
              } else {
                citations[citationChunk?.metadata?.file_name] = [citationChunk];
              }
            });
          } else if (data?.length > 0) {
            const citationsData = cloneDeep(data);
            citationsData?.map?.((citationChunk) => {
              if (!!citations?.[citationChunk?.doc?.file_name]) {
                citations[citationChunk?.doc?.file_name] = [
                  ...(citations?.[citationChunk?.doc?.file_name] || []),
                  citationChunk,
                ];
              } else {
                citations[citationChunk?.doc?.file_name] = [citationChunk];
              }
            });
          }

          return [
            ...messages.slice(0, -1),
            {
              ...latestMessage,
              citations:
                Object.keys(citations || {})?.length > 0 ? citations : null,
            },
          ];

        case ChunkType.TRACE: {
          return [
            ...messages.slice(0, -1),
            {
              ...latestMessage,
              ...{
                trace: checkValidStringifiedJSON(data)
                  ? JSON.parse(data ?? JSON.stringify(""))
                  : {},
              },
            },
          ];
        }

        case ChunkType.FOLLOW_UP_MESSAGE:
          const followUpMessages = data;

          return [
            ...messages.slice(0, -1),
            {
              ...latestMessage,
              followUpMessages: followUpMessages,
            },
          ];
        case ChunkType.TOOL_CITATION_MESSAGE:
          const tool_citations = latestMessage?.tool_citations || [];
          const toolDetail = data;
          if (Object.keys(toolDetail || {})?.length) {
            tool_citations?.push?.(toolDetail);
          }
          return [
            ...messages.slice(0, -1),
            {
              ...latestMessage,
              tool_citations,
            },
          ];

        default:
          return [...messages];
      }
    });
  };

  const replaceMessageToChat = (message) => {
    setMessages((messages) => {
      const latestMessage = messages[messages.length - 1];
      return [...messages.slice(0, -1), { ...latestMessage, content: message }];
    });
  };

  const fetchAndUpdateAIResponse = async (messageID) => {
    try {
      streamRef.current = new EventSource(
        `${config.intract.streamResponse}/${messageID}/stream`,
      ); // Replace with your actual SSE endpoint

      streamRef.current.onmessage = async (event) => {
        if (chatConfig?.model_id?.includes("agent")) {
          const chatResponseChunkJson = JSON.parse(
            event?.data?.replace?.(/---->/g, "")?.replace?.(/<----/g, ""),
          );

          if (
            chatResponseChunkJson?.role?.toUpperCase?.() === "ASSISTANT" &&
            !!chatResponseChunkJson?.content
          ) {
            setIsLoading(false);
            appendMessageToChat(chatResponseChunkJson?.content);
          } else if (
            chatResponseChunkJson?.role?.toUpperCase?.() === "ASSISTANT" &&
            chatResponseChunkJson?.tool_calls?.length > 0
          ) {
            appendExtraMessageDetailsToChat(
              ChunkType.TOOL_CALLS,
              chatResponseChunkJson?.tool_calls,
            );
          } else if (
            chatResponseChunkJson?.role?.toUpperCase?.() === "TOOL" &&
            !!chatResponseChunkJson?.tool_call_id
          ) {
            appendExtraMessageDetailsToChat(
              ChunkType.TOOL,
              chatResponseChunkJson,
            );
          } else if (
            chatResponseChunkJson?.role?.toUpperCase?.() === "ASSISTANT" &&
            !!chatResponseChunkJson?.citation_message
          ) {
            appendExtraMessageDetailsToChat(
              ChunkType.CITATION,
              chatResponseChunkJson?.citation_message,
            );
          } else if (
            chatResponseChunkJson?.role?.toUpperCase?.() === "ASSISTANT" &&
            !!chatResponseChunkJson?.tool_citation_message
          ) {
            appendExtraMessageDetailsToChat(
              ChunkType.TOOL_CITATION_MESSAGE,
              chatResponseChunkJson,
            );
          } else if (
            chatResponseChunkJson?.role?.toUpperCase?.() === "TRACE" &&
            chatResponseChunkJson?.content
          ) {
            appendExtraMessageDetailsToChat(
              ChunkType.TRACE,
              chatResponseChunkJson?.content,
            );
          }
        } else {
          setIsLoading(false);
          appendMessageToChat(
            event?.data?.replace(/---->/g, "").replace(/<----/g, ""),
          );
        }
      };

      if (streamRef?.current) {
        streamRef.current.onerror = (error) => {
          // Handle any errors (e.g., connection closed)
          setChatStreaming(false);

          setIsLoading(false);

          if (streamRef.current) {
            streamRef?.current?.close();
            streamRef.current = undefined;
          }
        };
      }
    } catch (error) {
      streamRef.current = undefined;
      if (error?.response?.status === 403) {
        replaceMessageToChat(getErrorFromApi(error));
      } else {
        replaceMessageToChat(getErrorFromApi(SimplAi_ERROR_MESSAGE));
      }
      setChatStreaming(false);
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    if (signal && controller) {
      controller?.abort();
    }
    if (streamRef.current) {
      streamRef?.current?.close();
      streamRef.current = undefined;
      setChatStreaming(false);
      setIsLoading(false);
    }
  };

  const submitMessageFeedback = async (liked, messageObj, remark = "") => {
    const messagesClone = cloneDeep(messages);
    const messageToUpdate = messagesClone.find(
      (chatMessage) => chatMessage?.id === messageObj?.id,
    );
    if (!messageToUpdate) return;
    const updatedMessage = {
      ...messageToUpdate,
      message_liked: liked,
      feedback_remark: remark ?? null,
    };
    setMessages((prev) =>
      prev.map((chatMessage) =>
        chatMessage?.id === updatedMessage?.id ? updatedMessage : chatMessage,
      ),
    );
    try {
      const res = await submitUserMessageFeedbackApi({
        payload: {
          conversation_id: conversationId,
          message_id: messageObj?.id,
          version_id: chatConfig?.version_id,
          app_id: chatConfig?.app_id,
          app_name: chatConfig?.model,
          like_dislike: liked,
          remarks: remark,
        },
      });
      if (res?.status !== 200 && res?.status !== 201) {
        setMessages((prev) =>
          prev?.map?.((chatMessage) =>
            chatMessage?.id === updatedMessage?.id
              ? messageToUpdate
              : chatMessage,
          ),
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev?.map?.((chatMessage) =>
          chatMessage?.id === updatedMessage?.id
            ? messageToUpdate
            : chatMessage,
        ),
      );
    }
  };

  const handleSubmit = async (e, newMessage) => {
    if (
      isLoading ||
      chatStreaming ||
      (!message?.trim?.() && !newMessage?.trim?.())
    )
      return null;
    setIsLoading(true);
    setChatStreaming(true);
    addMessageToChat(newMessage ?? message);
    setMessage("");

    try {
      addMessageToChat("", "SimplAi");
      const res = await initiateConversationApi({
        payload: {
          ...chatConfig,
          cust_attr: custAtrr,
          action: conversationId ? "START_SCREEN" : "START_SCREEN",
          query: {
            message: newMessage ?? message,
            message_type: "text",
            message_category: "",
          },
          conversation_id: conversationId,
          ref_id: conversationRefId,
        },
        headers: {
          [X_SELLER_ID]: userSessionConfig?.userId,
          [X_SELLER_PROFILE_ID]: userSessionConfig?.userId,
        },
        signal,
      });
      if (res?.data?.result?.conversation_id) {
        if (
          !conversationId ||
          res?.data?.result?.conversation_id != conversationId
        ) {
          setConversationId(res?.data?.result?.conversation_id);
        }
        await fetchAndUpdateAIResponse(res?.data?.result?.message_id);
      }
    } catch (error) {
      if (error?.response?.status === 403) {
        replaceMessageToChat(getErrorFromApi(error));
      } else {
        replaceMessageToChat(getErrorFromApi(SimplAi_ERROR_MESSAGE));
      }
      setIsLoading(false);
      setChatStreaming(false);
    }
  };

  return {
    conversationId,
    setConversationId,
    messages,
    setMessages,
    input: message,
    setInput: setMessage,
    handleInputChange,
    handleSubmit,
    isLoading,
    chatStreaming,
    stopStream,
    chatConfig,
    setChatConfig,
    changeConversation,
    changeConversationLoading,
    custAtrr,
    conversationRefId,
    setCustAtrr,
    setConversationRefId,
    resetCustAtrr,
    submitMessageFeedback,
  };
};

export default useChatStream;
