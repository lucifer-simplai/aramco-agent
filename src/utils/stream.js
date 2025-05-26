import { v4 } from "uuid";
import { ChunkType } from "../hooks/useChatStream";
import _authHttp from "../services/authHttp";
import config from "./apiEndpoints";

const DEFAULT_HEADERS = {
  "Content-Type": "text/markdown",
};

export const getChatDetails = async (chatId, params, headers) => {
  const response = await _authHttp.get(
    `${config.intract.chatDetails}/${chatId}`,
    {
      params,
      headers: { ...DEFAULT_HEADERS, ...headers },
    },
  );

  if (response?.status !== 200)
    throw new Error("Error while fetching chat details");

  const chatMessage =
    response?.data?.result?.response?.flatMap((chat) => {
      const getSimplaiTools = getChatTools(chat?.tool_calls);
      const userMessage = {
        role: "user",
        content: chat?.query?.message || "",
        id: v4(),
      };
      const SimplAiMessage = {
        role: "SimplAi",
        content: chat?.query_result || "",
        tools: getSimplaiTools,
        id: v4(),
      };
      return [userMessage, SimplAiMessage];
    }) || [];

  return chatMessage;
};

const getChatTools = (tools) => {
  try {
    if (!tools) {
      return null;
    } else {
      let chatTools = null;

      tools?.forEach?.((tool) => {
        const parsedToolDetails = JSON.parse(tool);

        if (parsedToolDetails?.tool_calls?.length > 0) {
          chatTools = getChatToolDetail(
            ChunkType.TOOL_CALLS,
            parsedToolDetails?.tool_calls,
          );
        }
      });

      if (chatTools?.length > 0)
        tools?.forEach?.((tool) => {
          const parsedToolDetails = JSON.parse(tool);

          if (
            parsedToolDetails?.role?.toUpperCase?.() === "TOOL" &&
            !!parsedToolDetails?.tool_call_id
          ) {
            chatTools = getChatToolDetail(
              ChunkType.TOOL,
              parsedToolDetails,
              chatTools,
            );
          }
        });

      return chatTools;
    }
  } catch (error) {
    return null;
  }
};

const getChatToolDetail = (type, toolDetail, tools) => {
  switch (type) {
    case ChunkType.TOOL_CALLS:
      const newTools =
        toolDetail
          ?.map?.((toolData) => {
            if (Object.keys(toolData || {})?.length > 0) {
              const functionDetails = toolData?.function || {};
              return { ...(toolData || {}), ...(functionDetails || {}) };
            } else {
              return null;
            }
          })
          ?.filter?.((toolData) => !!toolData) || null;
      return newTools;

    case ChunkType.TOOL:
      const newToolwithDetails =
        tools?.length > 0
          ? tools?.map?.((toolData) => {
              if (toolData?.id === toolDetail?.tool_call_id) {
                return {
                  ...toolData,
                  content: toolDetail?.content,
                };
              } else {
                return { ...toolData };
              }
            })
          : null;
      return newToolwithDetails;

    default:
      return null;
  }
};
