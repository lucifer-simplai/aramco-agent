import {
  RobotOutlined,
  ToolFilled,
  ToolOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Col, Flex, Result, Row, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import {
  checkValidStringifiedJSON,
  formatHeaderStringWithUnderscore,
  isValidJSONValue,
} from "../../utils/helperFunction";
import MarkdownComponent from "../Markdown";
import { DrawerTabTitle } from "../UIComponents/UIComponents.style";
import {
  MessageCard,
  MessageCardContent,
  MessageCardHeader,
  ToolCallCard,
  ToolCallContent,
  ToolCallHeader,
} from "./style";

const { Text, Paragraph } = Typography;

const TracingAgentInput = ({ selectedNodeDetails }) => {
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
            !(selectedNodeDetails?.data?.input?.messages?.length > 0) ? (
              <Row justify="center">
                <Col>
                  <Result title="No Details Available" />
                </Col>
              </Row>
            ) : (
              selectedNodeDetails?.data?.input?.messages?.map?.((message) => {
                console.log("🚀 ~ items ~ message:", message);
                if (
                  (message?.role == "user" ||
                    message?.role == "system" ||
                    message?.role == "assistant") &&
                  (message?.content || message?.tool_calls)
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
      {
        key: "tools",
        destroyInactiveTabPane: false,
        label: <DrawerTabTitle>Tool calls</DrawerTabTitle>,
        children: (
          <Flex vertical gap={12} style={{ overflow: "auto", height: "100%" }}>
            {!selectedNodeDetails ||
            !(selectedNodeDetails?.data?.input?.tools?.length > 0) ? (
              <Row justify="center">
                <Col>
                  <Result title="No Details Available" />
                </Col>
              </Row>
            ) : (
              selectedNodeDetails?.data?.input?.tools?.map?.((tool) => {
                if (tool?.type == "function") {
                  return (
                    <MessageCard istool={true}>
                      <MessageCardHeader>
                        <ToolFilled />
                        <Text strong>{tool?.function?.name}</Text>
                      </MessageCardHeader>
                      <MessageCardContent>
                        <Paragraph
                          ellipsis={{
                            rows: 3,
                            expandable: true,
                            symbol: "more",
                          }}
                        >
                          {tool?.function?.description}
                        </Paragraph>
                        <ReactCodeMirror
                          theme={xcodeDark}
                          value={
                            isValidJSONValue(
                              tool?.function?.parameters?.properties,
                            )
                              ? JSON.stringify(
                                  tool?.function?.parameters?.properties || {},
                                  null,
                                  2,
                                )
                              : ""
                          }
                          height="150px"
                          extensions={[langs.json()]}
                          contentEditable={false}
                          style={{
                            borderRadius: "15px",
                            overflow: "hidden",
                            width: "100%",
                          }}
                        />
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

export default TracingAgentInput;
