import { RobotOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Flex, Result, Row, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import {
  checkValidStringifiedJSON,
  formatHeaderStringWithUnderscore,
} from "../../utils/helperFunction";
import MarkdownComponent from "../Markdown";
import {
  ToolCallCard,
  ToolCallContent,
  ToolCallHeader,
} from "../TracingAgentInput/style";
import { DrawerTabTitle } from "../UIComponents/UIComponents.style";
import { MessageCard, MessageCardContent, MessageCardHeader } from "./style";
const { Text, Paragraph } = Typography;

const TracingAgentRootInput = ({ selectedNodeDetails }) => {
  const [selectedTab, setSelectedTab] = useState("messages");

  const onChange = (key) => {
    setSelectedTab(key);
  };

  const items = useMemo(() => {
    return [
      {
        key: "messages",
        destroyInactiveTabPane: false,
        label: <DrawerTabTitle>Chat history</DrawerTabTitle>,
        children: (
          <Flex vertical gap={12} style={{ overflow: "auto", height: "100%" }}>
            {!selectedNodeDetails ||
            !(selectedNodeDetails?.data?.input?.length > 0) ? (
              <Row justify="center">
                <Col>
                  <Result title="No Details Available" />
                </Col>
              </Row>
            ) : (
              selectedNodeDetails?.data?.input?.map?.((message) => {
                if (
                  message?.role == "user" ||
                  message?.role == "system" ||
                  message?.role == "assistant"
                ) {
                  return (
                    <MessageCard
                      isagent={
                        message?.role == "system" ||
                        message?.role == "assistant"
                      }
                    >
                      <MessageCardHeader>
                        {message?.role == "system" ||
                        message?.role == "assistant" ? (
                          <RobotOutlined />
                        ) : (
                          <UserOutlined />
                        )}
                        <Text strong>
                          {formatHeaderStringWithUnderscore(message?.role)}
                        </Text>
                      </MessageCardHeader>
                      <MessageCardContent>
                        {message?.content ? (
                          <Paragraph
                            ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: "more",
                            }}
                          >
                            {message?.content}
                          </Paragraph>
                        ) : message?.tool_calls ? (
                          <Flex vertical gap={12} style={{ width: "100%" }}>
                            <Text strong>Tool Calls</Text>
                            {message?.tool_calls?.map((toolDetails) => {
                              return (
                                <ToolCallCard>
                                  <ToolCallHeader>
                                    <ToolOutlined />
                                    <Text strong>
                                      {toolDetails?.function?.name || ""}
                                    </Text>
                                  </ToolCallHeader>
                                  <ToolCallContent>
                                    <MarkdownComponent
                                      markdown={
                                        checkValidStringifiedJSON(
                                          toolDetails?.function?.arguments,
                                        )
                                          ? `<pre>${JSON.stringify(
                                              JSON.parse(
                                                toolDetails?.function
                                                  ?.arguments,
                                              ),
                                              null,
                                              2,
                                            )}</pre>`
                                          : toolDetails?.function?.arguments ||
                                            ""
                                      }
                                    />
                                  </ToolCallContent>
                                </ToolCallCard>
                              );
                            })}
                          </Flex>
                        ) : null}
                      </MessageCardContent>
                    </MessageCard>
                  );
                }
                return null;
              })
            )}
          </Flex>
        ),
      },
    ];
  }, [selectedTab, selectedNodeDetails]);

  return (
    <Tabs
      items={items}
      onChange={onChange}
      style={{ overflow: "auto", height: "100%" }}
      color="#fff"
      size="small"
    />
  );
};

export default TracingAgentRootInput;
