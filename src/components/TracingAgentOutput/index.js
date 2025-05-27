import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Col, Flex, Result, Row, Tabs, Typography } from "antd";
import { useMemo, useState } from "react";
import { checkValidStringifiedJSON } from "../../utils/helperFunction";
import { MessageCard, MessageCardContent } from "../TracingAgentInput/style";
import { DrawerTabTitle } from "../UIComponents/UIComponents.style";

const { Text, Paragraph } = Typography;

const TracingAgentOutput = ({ selectedNodeDetails }) => {
  const [selectedTab, setSelectedTab] = useState("content");

  const onChange = (key) => {
    setSelectedTab(key);
  };

  const items = useMemo(() => {
    return [
      {
        key: "content",
        destroyInactiveTabPane: false,
        label: <DrawerTabTitle>Content</DrawerTabTitle>,
        children: (
          <Flex vertical gap={12} style={{ overflow: "auto", height: "100%" }}>
            {!selectedNodeDetails ||
            !selectedNodeDetails?.data?.output?.content ? (
              <Row justify="center">
                <Col>
                  <Result title="No Details Available" />
                </Col>
              </Row>
            ) : (
              <MessageCard isagent={true}>
                <MessageCardContent>
                  <Paragraph
                    ellipsis={{
                      rows: 3,
                      expandable: true,
                      symbol: "more",
                    }}
                  >
                    {selectedNodeDetails?.data?.output?.content}
                  </Paragraph>
                </MessageCardContent>
              </MessageCard>
            )}
          </Flex>
        ),
      },
      {
        key: "tool_calls",
        destroyInactiveTabPane: false,
        label: <DrawerTabTitle>Tool calls</DrawerTabTitle>,
        children: (
          <Flex vertical gap={12} style={{ overflow: "auto", height: "100%" }}>
            {!selectedNodeDetails ||
            !selectedNodeDetails?.data?.output?.tool_calls ? (
              <Row justify="center">
                <Col>
                  <Result title="No Details Available" />
                </Col>
              </Row>
            ) : (
              <MessageCard isblank={true}>
                <MessageCardContent>
                  <ReactCodeMirror
                    theme={xcodeDark}
                    value={
                      checkValidStringifiedJSON(
                        selectedNodeDetails?.data?.output?.tool_calls,
                      )
                        ? selectedNodeDetails?.data?.output?.tool_calls
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

export default TracingAgentOutput;
