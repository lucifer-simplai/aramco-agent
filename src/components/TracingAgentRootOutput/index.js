import { RobotOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Flex, Result, Row, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import { formatHeaderStringWithUnderscore } from "../../utils/helperFunction";
import {
  MessageCard,
  MessageCardContent,
  MessageCardHeader,
} from "../TracingAgentInput/style";
import { DrawerTabTitle } from "../UIComponents/UIComponents.style";

const { Text, Paragraph } = Typography;

const TracingAgentRootOutput = ({ selectedNodeDetails }) => {
  const [selectedTab, setSelectedTab] = useState("content");

  const onChange = (key) => {
    setSelectedTab(key);
  };

  const items = useMemo(() => {
    return [
      {
        key: "Messages",
        destroyInactiveTabPane: false,
        label: <DrawerTabTitle>Response</DrawerTabTitle>,
        children: (
          <Flex vertical gap={12} style={{ overflow: "auto", height: "100%" }}>
            {!selectedNodeDetails ||
            !(selectedNodeDetails?.data?.output?.messages?.length > 0) ? (
              <Row justify="center">
                <Col>
                  <Result title="No Details Available" />
                </Col>
              </Row>
            ) : (
              selectedNodeDetails?.data?.output?.messages?.map?.((message) => {
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

export default TracingAgentRootOutput;
