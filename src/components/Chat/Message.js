import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { Avatar, Image, Tooltip, Typography } from "antd";

import { cloneDeep } from "lodash";
import { useMemo, useState } from "react";
import { useStore } from "zustand";
import { chatAttachmentString } from "../../constants";
import { useAppStore } from "../../store";
import { CHATBOT_BASE_URL } from "../../utils/apiEndpoints";
import {
  checkValidStringifiedJSON,
  FileNameWithoutTimestamp,
  getCleanMarkdownString,
  handleCopy,
} from "../../utils/helperFunction";
import FileIcon from "../Icons/FileIcon";
import SimplaiIcon from "../Icons/SimplaiIcon";
import TraceIcon from "../Icons/TraceIcon";
import MarkdownComponent from "../Markdown";
import ChatCitations from "./ChatCitations";
import ChatFeedbackModal from "./ChatFeedBackModal";
import DocEditorCitation from "./DocEditorCitations";
import {
  ChatLoadingAnimationIcon,
  MessageActionButtonContainer,
  MessageActionContainer,
  MessageContainer,
  PromptContainer,
  UploadedFileCard,
  UploadedFileName,
} from "./style";

const { Paragraph, Text } = Typography;

function Message({
  message,
  loading,
  isLastMessage,
  chatStreaming,
  chatConfig,
  setDocumentContent,
  setShowEditorDrawer,
  submitMessageFeedback,
  handleViewMessageTrace,
}) {
  message = cloneDeep(message);
  let index = message?.content?.indexOf?.(chatAttachmentString);
  let attachedFile;
  if (index !== -1) {
    attachedFile = FileNameWithoutTimestamp(
      message?.content
        ?.substring?.(index + chatAttachmentString.length)
        ?.replace?.("https://media-simplai.s3.ap-south-1.amazonaws.com/", "")
        ?.split?.("-")
        ?.slice?.(3)
        ?.join?.("-")
        ?.trim?.() || "",
    );
    message.content = message?.content?.substring?.(0, index);
  }

  const isBot = message?.role === "SimplAi";
  const store = useStore(useAppStore, (state) => state);

  const [showCopied, setShowCopied] = useState(false);
  const [isMessageHovered, setIsMessageHovered] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisibile] = useState(false);

  const toggleFeedbackModal = () => {
    setFeedbackModalVisibile((prev) => !prev);
  };

  const outputWithHtmlContent = useMemo(
    () =>
      !isLastMessage || (isLastMessage && !chatStreaming)
        ? message?.tools?.find?.(
            (tooldetail) =>
              checkValidStringifiedJSON(tooldetail?.content) &&
              JSON.parse?.(tooldetail?.content || JSON.stringify({}))
                ?.HTMLForDocument,
          )
        : undefined,
    [message, isLastMessage, chatStreaming],
  );

  return (
    <MessageContainer
      role={message?.role}
      islastmessage={isLastMessage?.toString() || ""}
    >
      {!isBot ? (
        <></>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          {/* <img
            src={"/assets/Logos/simplaiLogo.svg"}
            height={25}
            width={25}
            alt=""
          /> */}
          {/* <SimplaiIcon height={25} width={25} alt="" /> */}
          {!!store?.userSessionConfig?.TENANT_ID ? (
            store?.userSessionConfig?.TENANT_ID == 2 ? (
              <Image
                src={`${CHATBOT_BASE_URL}/public/lawyeredIcon.gif`}
                style={{ borderRadius: 4 }}
                width="24px"
                preview={false}
              />
            ) : (
              <SimplaiIcon height={24} width={24} alt="" />
            )
          ) : (
            <Avatar shape="square" />
          )}
        </div>
      )}
      <PromptContainer role={message?.role}>
        {loading ? (
          <div
            style={{
              width: "32px",
              // height: "24px",
              marginLeft: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ChatLoadingAnimationIcon />
          </div>
        ) : (
          <>
            {message?.content || message?.tools?.length > 0 ? (
              <>
                {/* {message?.tools?.length > 0 && (
                <ChatToolDetails toolDetails={message?.tools} />
              )} */}
                {!!attachedFile && (
                  <UploadedFileCard>
                    <FileIcon style={{ width: "16px" }} />
                    <UploadedFileName>{attachedFile}</UploadedFileName>
                  </UploadedFileCard>
                )}
                <MarkdownComponent
                  markdown={message?.content}
                  enableCopyCodeBlocks={true}
                />
                {(Object.keys(message?.citations || {})?.length > 0 ||
                  message?.tool_citations?.length > 0) && (
                  <ChatCitations
                    citationDetails={message?.citations}
                    toolDetails={message?.tool_citations}
                  />
                )}
                {!!outputWithHtmlContent && (
                  <DocEditorCitation
                    toolOutput={outputWithHtmlContent}
                    setDocumentContent={setDocumentContent}
                    setShowEditorDrawer={setShowEditorDrawer}
                  />
                )}
              </>
            ) : (
              ""
            )}
            {(!isLastMessage || (isLastMessage && !chatStreaming)) &&
              !!getCleanMarkdownString(message?.content)?.trim()?.length && (
                <>
                  <MessageActionContainer
                    isshortmessage={
                      getCleanMarkdownString(message?.content)?.length < 20
                        ? "true"
                        : "false"
                    }
                    role={message?.role}
                  >
                    {/* {submitMessageFeedback && isBot && (
                      <>
                        {message?.message_liked === undefined ? (
                          <>
                            <MessageActionButtonContainer
                              onClick={() => {
                                submitMessageFeedback(true, message);
                              }}
                            >
                              <LikeIcon
                                style={{
                                  height: "16px",
                                  width: "16px",
                                }}
                              />
                            </MessageActionButtonContainer>
                            <MessageActionButtonContainer
                              onClick={() => {
                                toggleFeedbackModal();
                              }}
                            >
                              <DislikeIcon
                                style={{
                                  height: "16px",
                                  width: "16px",
                                }}
                              />
                            </MessageActionButtonContainer>
                          </>
                        ) : (
                          <>
                            {message?.message_liked ? (
                              <MessageActionButtonContainer>
                                <LikedIcon
                                  style={{
                                    height: "16px",
                                    width: "16px",
                                  }}
                                />
                              </MessageActionButtonContainer>
                            ) : (
                              <MessageActionButtonContainer>
                                <DislikedIcon
                                  style={{
                                    height: "16px",
                                    width: "16px",
                                  }}
                                />
                              </MessageActionButtonContainer>
                            )}
                          </>
                        )}
                      </>
                    )} */}

                    {showCopied ? (
                      <Tooltip title="Copied" placement="top">
                        <MessageActionButtonContainer>
                          <CheckOutlined
                            style={{
                              height: "16px",
                              width: "16px",
                            }}
                          />
                        </MessageActionButtonContainer>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={
                          <Text
                            style={{
                              opacity: 0.5,
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            Copy
                          </Text>
                        }
                        placement="top"
                      >
                        <MessageActionButtonContainer
                          onClick={() => {
                            const copyContent = getCleanMarkdownString(
                              message?.content,
                            );
                            handleCopy(copyContent);
                            setShowCopied(true);
                            setTimeout(() => {
                              setShowCopied(false);
                            }, 700);
                          }}
                        >
                          <CopyOutlined
                            style={{
                              height: "16px",
                              width: "16px",
                            }}
                          />
                        </MessageActionButtonContainer>
                      </Tooltip>
                    )}
                    {!!message?.trace?.node_id && (
                      <MessageActionButtonContainer
                        onClick={() => {
                          if (handleViewMessageTrace) {
                            handleViewMessageTrace(message?.trace);
                          }
                        }}
                      >
                        <TraceIcon
                          style={{
                            height: "16px",
                            width: "16px",
                          }}
                        />
                        Show tracing
                      </MessageActionButtonContainer>
                    )}
                  </MessageActionContainer>
                </>
              )}
          </>
        )}
      </PromptContainer>
      <ChatFeedbackModal
        open={feedbackModalVisible}
        onClose={() => {
          setFeedbackModalVisibile(false);
        }}
        submitMessageFeedback={submitMessageFeedback}
        message={message}
      />
    </MessageContainer>
  );
}

export default Message;
