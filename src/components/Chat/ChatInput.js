import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Col, Flex, Input, Row, Spin, Tooltip, Upload } from "antd";
import React, { memo, useEffect, useState } from "react";
import SendIcon from "../Icons/SendIcon";
import StopIcon from "../Icons/StopIcon";

import { isEqual } from "lodash";
import { v4 } from "uuid";
import { useStore } from "zustand";
import { chatAttachmentString } from "../../constants";
import useLivekitAudio from "../../hooks/useLivekitAudio";
import { useAppStore } from "../../store";
import { uploadPublicFiles } from "../../utils/helperFunction";
import AudioVisualizer from "../AudioVisualizerComponent/AudioVisualizer";
import AudioCallIcon from "../Icons/AudioCallIcon";
import CallEndIcon from "../Icons/CallEndIcon";
import FileIcon from "../Icons/FileIcon";
import InterruptIcon from "../Icons/InterruptIcon";
import MuteIcon from "../Icons/MuteIcon";
import PaperClipIcon from "../Icons/PaperClipIcon";
import UnMuteIcon from "../Icons/UnMuteIcon";
import {
  ActionItemContainer,
  AudioCallContainer,
  ChatInputActionContainer,
  ChatInputContainer,
  ConnectingText,
  LeftControls,
  RemoveUploadedFileIcon,
  RightControls,
  SpeakerName,
  UploadedFileCard,
  UploadedFileName,
} from "./style";

const { TextArea } = Input;

const areEqual = (prevProps, nextProps) => {
  /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
  */
  return (
    prevProps?.input === nextProps?.input &&
    prevProps?.loading === nextProps?.loading &&
    isEqual(prevProps?.uploadEnabled, nextProps?.uploadEnabled) &&
    isEqual(prevProps?.voiceEnabled, nextProps?.voiceEnabled) &&
    prevProps?.agentId === nextProps?.agentId &&
    isEqual(prevProps?.agentDetails, nextProps?.agentDetails) &&
    prevProps?.conversationId === nextProps?.conversationId &&
    isEqual(prevProps?.changeConversation, nextProps?.changeConversation) &&
    isEqual(
      prevProps?.setVoiceConversationInProgress,
      nextProps?.setVoiceConversationInProgress,
    ) &&
    isEqual(prevProps?.startSession, nextProps?.startSession) &&
    isEqual(prevProps?.endSession, nextProps?.endSession) &&
    isEqual(prevProps?.handleChunkSpeak, nextProps?.handleChunkSpeak) &&
    isEqual(
      prevProps?.enableAgentThinkingMode,
      nextProps?.enableAgentThinkingMode,
    ) &&
    isEqual(
      prevProps?.disableAgentThinkingMode,
      nextProps?.disableAgentThinkingMode,
    ) &&
    isEqual(prevProps?.interuptAvatar, nextProps?.interuptAvatar) &&
    isEqual(prevProps?.hasAvatar, nextProps?.hasAvatar)
  );
};

const ChatInput = memo(function ChatInput({
  submitHandler,
  loading,
  input,
  handleInputChange,
  stopStream,
  uploadEnabled = false,
  voiceEnabled = false,
  agentId,
  agentDetails,
  chatConfig,
  setMessages,
  conversationId,
  changeConversation,
  setVoiceConversationInProgress,
  configProps,
  startSession,
  endSession,
  handleChunkSpeak,
  enableAgentThinkingMode,
  disableAgentThinkingMode,
  interuptAvatar,
  hasAvatar,
}) {
  const store = useStore(useAppStore, (state) => state);

  const [uploadedFile, setUploadedFile] = useState();
  const [uploading, setUploading] = useState(false);

  const config = {
    agentDetails: {
      agent_id: agentId,
      agent_name: chatConfig?.model,
      version_id: agentDetails?.version_id,
      citations: agentDetails?.citations?.enabled,
      tool_citations: agentDetails?.tool_citations?.enabled,
      config: agentDetails?.config,
    },
    userDetails: {
      name: store?.userSessionConfig?.GUEST_USER_NAME,
      id: store?.userSessionConfig?.GUEST_USER_ID,
    },
    conversationId: conversationId,
    setMessages,
    changeConversation,
    startSession,
    endSession,
    handleChunkSpeak,
    enableAgentThinkingMode,
    disableAgentThinkingMode,
    hasAvatar,
  };

  const {
    status,
    audioTracks,
    participants,
    connectToRoom,
    handleDisconnect,
    interuptAgent,
    toggleMuteLocalParticipant,
    isMicrophoneEnabled,
    setVoiceConversationId,
  } = useLivekitAudio(config);

  useEffect(() => {
    if (conversationId) setVoiceConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    if (setVoiceConversationInProgress) {
      if (["connected", "connecting"]?.includes(status)) {
        setVoiceConversationInProgress(true);
      } else {
        setVoiceConversationInProgress(false);
      }
    }
  }, [status, setVoiceConversationInProgress]);
  return (
    <ChatInputContainer connecting={status === "connecting"}>
      {["connected", "connecting"]?.includes(status) ? (
        <AudioCallContainer connecting={status === "connecting"}>
          {status === "connecting" ? (
            <>
              <ConnectingText>Connecting to agent...</ConnectingText>
              {/* <CancelText onClick={handleDisconnect}>Cancel</CancelText> */}
            </>
          ) : (
            <Row
              gutter={[12, 20]}
              justify={"space-around"}
              align={"center"}
              style={{ width: "100%" }}
            >
              <Col style={{ flex: "1" }}>
                <Flex align="center" justify="flex-start" gap={20}>
                  {participants.map((participant) => {
                    return (
                      <>
                        <Flex
                          key={`${participant.identity}-name`}
                          justify="flex-start"
                          align="center"
                          gap={18}
                        >
                          <SpeakerName
                            title={
                              participant?.name
                                ? participant?.name
                                : participant?.isAgent
                                ? !!chatConfig?.model
                                  ? chatConfig?.model
                                  : "Agent"
                                : "You"
                            }
                          >
                            {participant?.name
                              ? participant?.name
                              : participant?.isAgent
                              ? !!chatConfig?.model
                                ? chatConfig?.model
                                : "Agent"
                              : "You"}
                          </SpeakerName>
                          <AudioVisualizer
                            audioTrack={audioTracks[participant.identity]}
                            isAgent={participant?.isAgent}
                          />
                        </Flex>
                      </>
                    );
                  })}
                </Flex>
              </Col>
              <Col>
                <Flex align="center" justify="flex-end" gap={2}>
                  <Tooltip title="Interrupt Agent">
                    <ActionItemContainer
                      onClick={() => {
                        if (interuptAvatar) interuptAvatar();

                        interuptAgent();
                      }}
                      style={{ padding: "8px 10px" }}
                    >
                      <InterruptIcon />
                    </ActionItemContainer>
                  </Tooltip>
                  {isMicrophoneEnabled ? (
                    <Tooltip title="Mute">
                      <ActionItemContainer
                        onClick={() =>
                          toggleMuteLocalParticipant(
                            isMicrophoneEnabled ?? false,
                          )
                        }
                      >
                        <UnMuteIcon />
                      </ActionItemContainer>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Unmute">
                      <ActionItemContainer
                        onClick={() =>
                          toggleMuteLocalParticipant(
                            isMicrophoneEnabled ?? false,
                          )
                        }
                      >
                        <MuteIcon />
                      </ActionItemContainer>
                    </Tooltip>
                  )}
                  <Tooltip title="End call">
                    <ActionItemContainer onClick={handleDisconnect}>
                      <CallEndIcon
                        style={{
                          boxShadow:
                            "0px 17.176px 34.353px -8.245px rgba(0, 0, 0, 0.25), 0px 0px 10.306px 0px rgba(0, 0, 0, 0.07)",
                        }}
                      />
                    </ActionItemContainer>
                  </Tooltip>
                </Flex>
              </Col>
            </Row>
          )}
        </AudioCallContainer>
      ) : (
        <>
          {uploadedFile && (
            <UploadedFileCard>
              <FileIcon style={{ width: "18px" }} />
              <UploadedFileName>{uploadedFile?.name}</UploadedFileName>
              <RemoveUploadedFileIcon
                onClick={() => {
                  setUploadedFile(undefined);
                }}
              />
            </UploadedFileCard>
          )}
          <Flex justify="center" align="center" style={{ width: "100%" }}>
            {uploadEnabled && (
              <LeftControls>
                <Tooltip title="Upload files and more">
                  <Upload
                    name="dataset_files"
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    disabled={uploading || loading}
                    style={{
                      width: "100% !important",
                      height: "100%",
                      backgroundColor: "green !important",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    beforeUpload={async (file) => {
                      setUploading(true);
                      try {
                        const fileUrl = await uploadPublicFiles(file, {
                          tenant_id: store?.userSessionConfig?.TENANT_ID,
                          vertical_type: "SIMPLAI",
                          vertical_id: v4(),
                          sub_vertical_type: "IMAGES",
                          sub_vertical_id: v4(),
                          file_name: file?.name,
                        });
                        if (fileUrl?.public_url) {
                          const newFile = {
                            uid: file?.uid,
                            name: file?.name,
                            size: file?.size,
                            public_url: fileUrl?.public_url,
                          };

                          setUploadedFile(newFile);

                          // setFileList(file);
                          setUploading(false);
                          return false;
                        }
                        setUploading(false);
                      } catch (error) {
                        setUploading(false);
                        return false;
                      }
                    }}
                    onRemove={(file) => {
                      setUploadedFile(undefined);
                    }}
                  >
                    {uploading ? (
                      <Spin
                        spinning={uploading}
                        indicator={
                          <Loading3QuartersOutlined
                            style={{ fontSize: "18px" }}
                            spin
                          />
                        }
                      />
                    ) : (
                      <ChatInputActionContainer
                        cursor={loading ? "no-drop" : "pointer"}
                      >
                        <PaperClipIcon />
                      </ChatInputActionContainer>
                    )}
                  </Upload>
                </Tooltip>
              </LeftControls>
            )}
            <TextArea
              placeholder="Type your message here..."
              // disabled={!session}
              value={input}
              onChange={(e) => {
                handleInputChange(e);
              }}
              style={{ resize: "none" }} // placeholder visible when input is empty
              autoSize={{ minRows: 1, maxRows: 6 }}
              onKeyPress={(event) => {
                if (event.which === 13 && !event.shiftKey) {
                  event.preventDefault();
                  if (uploadedFile) {
                    submitHandler(
                      {},
                      `${input} ${chatAttachmentString} ${uploadedFile?.public_url}`,
                    );
                  } else {
                    submitHandler({});
                  }

                  setUploadedFile(undefined);
                }
              }}
            />
            <RightControls>
              {loading ? (
                <ChatInputActionContainer
                  cursor={"pointer"}
                  onClick={(e) => {
                    e?.preventDefault();
                    stopStream();
                  }}
                >
                  <StopIcon />
                </ChatInputActionContainer>
              ) : (
                <Flex gap={12}>
                  {!!voiceEnabled && (
                    <Tooltip title="Use voice mode">
                      <ChatInputActionContainer
                        cursor={"pointer"}
                        onClick={connectToRoom}
                      >
                        <AudioCallIcon
                          style={{
                            color: "#444444",
                            fontSize: "24px",
                          }}
                        />
                      </ChatInputActionContainer>
                    </Tooltip>
                  )}
                  <ChatInputActionContainer
                    cursor={"pointer"}
                    onClick={() => {
                      setUploadedFile(undefined);
                      if (uploadedFile) {
                        submitHandler(
                          {},
                          `${input} ${chatAttachmentString} ${uploadedFile?.public_url}`,
                        );
                      } else {
                        submitHandler({});
                      }
                    }}
                  >
                    <SendIcon
                      style={{
                        color: "#c7c7c7",
                        marginLeft: "2px",
                      }}
                    />
                  </ChatInputActionContainer>
                </Flex>
              )}
            </RightControls>
          </Flex>
        </>
      )}
    </ChatInputContainer>
  );
},
areEqual);

export default ChatInput;
