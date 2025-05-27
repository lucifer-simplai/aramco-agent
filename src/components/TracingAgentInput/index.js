import { RobotOutlined, ToolFilled, UserOutlined } from "@ant-design/icons";
import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Col, Flex, Result, Row, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import {
  formatHeaderStringWithUnderscore,
  isValidJSONValue,
} from "../../utils/helperFunction";
import { DrawerTabTitle } from "../UIComponents/UIComponents.style";
import { MessageCard, MessageCardContent, MessageCardHeader } from "./style";

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
                        <Paragraph
                          ellipsis={{
                            rows: 3,
                            expandable: true,
                            symbol: "more",
                          }}
                        >
                          {message?.content}
                        </Paragraph>
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
