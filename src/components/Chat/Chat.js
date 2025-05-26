import { Col, Row, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";

import Message from "./Message";
import {
  ChatContainer,
  FirstQueryMessageContainer,
  GetStartedSubText,
  GetStartedText,
} from "./style";

function Chat({
  messages,
  loading,
  chatLoading,
  WelcomeMessage,
  chatStreaming,
  chatConfig,
  setDocumentContent,
  setShowEditorDrawer,
  submitMessageFeedback,
  startMessages,
  submitHandler,
  handleViewMessageTrace,
}) {
  const messageEndRef = useRef();
  const chatContainerRef = useRef(null);
  const [userAtBottom, setUserAtBottom] = useState(true);

  useEffect(() => {
    if (userAtBottom) messageEndRef.current?.scrollIntoView();
  }, [messages, loading]);

  const handleScroll = () => {
    // Calculate if user is at the bottom (you may need to adjust the threshold)
    const threshold = 10; // Pixels from the bottom
    const isAtBottom =
      (chatContainerRef?.current?.scrollHeight || 0) -
        (chatContainerRef?.current?.scrollTop || 0) <=
      (chatContainerRef?.current?.clientHeight || 0) + threshold;

    setUserAtBottom(isAtBottom);
  };

  useEffect(() => {
    chatContainerRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up: remove event listener
      chatContainerRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [chatContainerRef?.current]);

  return (
    <ChatContainer ref={chatContainerRef} hasMessages={messages?.length > 0}>
      {messages?.length < 1 && (
        <Skeleton avatar active loading={chatLoading}>
          <Row
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <GetStartedText>Welcome</GetStartedText>
              <GetStartedSubText>How can I help you today?</GetStartedSubText>
              {startMessages?.length > 0 && (
                <Row
                  gutter={[0, 4]}
                  justify={"center"}
                  style={{ marginTop: "12px" }}
                >
                  {startMessages?.map?.((startMessage) => (
                    <Col span={24}>
                      <FirstQueryMessageContainer
                        onClick={() => submitHandler({}, startMessage)}
                      >
                        {startMessage}
                      </FirstQueryMessageContainer>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </Skeleton>
      )}
      {messages?.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          loading={
            index === messages?.length - 1 &&
            loading &&
            message?.role !== "user"
          }
          chatStreaming={chatStreaming}
          isLastMessage={index === messages?.length - 1}
          chatConfig={chatConfig}
          setDocumentContent={setDocumentContent}
          setShowEditorDrawer={setShowEditorDrawer}
          submitMessageFeedback={submitMessageFeedback}
          handleViewMessageTrace={handleViewMessageTrace}
        />
      ))}
      <div ref={messageEndRef} />
    </ChatContainer>
  );
}

export default Chat;
