import {
  ApartmentOutlined,
  CheckOutlined,
  CopyOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Flex, Segmented, Space, Tabs, Tooltip, Typography } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { handleCopy } from "../../utils/helperFunction";
import DynamicTable from "../DynamicTable";
import ToolOutputIcon from "../Icons/ToolOutputIcon";
import MarkdownComponent from "../Markdown";
import { FlexEndContainer } from "../UIComponents/UIComponents.style";
import {
  NoOutputDescription,
  NoOutputHeading,
  OutputContainer,
  ToolOutputContainer,
  ToolOutputTitle,
} from "./style";

const { Text } = Typography;

const ToolUseOutput = ({ outputs, toolUseOutput }) => {
  const [jsonView, setJsonView] = useState("table");
  const [activeKey, setActiveKey] = useState();
  const [showCopied, setShowCopied] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setJsonView("table");
  }, [toolUseOutput, setJsonView]);

  useEffect(() => {
    let newActiveKey;
    const newItems =
      Object.entries(outputs || {})?.map?.((singleToolOutput) => {
        newActiveKey = singleToolOutput?.[0];
        return {
          label: singleToolOutput?.[0],
          value: singleToolOutput?.[1],
          key: newActiveKey,
          id: newActiveKey,
        };
      }) || [];

    setActiveKey(newActiveKey);

    setItems([...newItems]);
  }, [outputs, toolUseOutput]);

  const onChange = (key) => {
    setActiveKey(key);
  };

  const outputItems = useMemo(() => {
    return items?.map?.((item) => {
      return {
        label: (
          <Space size="small" style={{ color: "inherit" }}>
            <Text style={{ color: "inherit" }}>{item?.label}</Text>
          </Space>
        ),
        key: item?.id,
      };
    });
  }, [items]);

  const currentActiveKey = items?.find?.(
    (item) => item.key == activeKey,
  )?.label;

  const currentActiveKeyOutputValue = toolUseOutput?.data?.[currentActiveKey];

  return (
    <ToolOutputContainer style={{ padding: 16 }}>
      <Tabs
        style={{ width: "100%" }}
        hideAdd
        size="large"
        onChange={onChange}
        activeKey={activeKey}
        items={outputItems}
        tabBarExtraContent={{
          left: (
            <Flex
              justify="start"
              align="center"
              wrap="wrap-reverse"
              gap="8px"
              style={{ marginRight: "16px" }}
            >
              <ToolOutputIcon />
              <ToolOutputTitle>Tool Outputs</ToolOutputTitle>
            </Flex>
          ),
        }}
      />
      {currentActiveKeyOutputValue ? (
        <>
          <FlexEndContainer style={{ width: "100%" }}>
            {showCopied ? (
              <Tooltip title="Copied" placement="top">
                <CheckOutlined />
              </Tooltip>
            ) : (
              <Tooltip title="Copy" placement="top">
                <CopyOutlined
                  onClick={() => {
                    const copyContent =
                      typeof currentActiveKeyOutputValue === "object"
                        ? JSON.stringify(currentActiveKeyOutputValue, null, 2)
                        : currentActiveKeyOutputValue;
                    handleCopy(copyContent);
                    setShowCopied(true);
                    setTimeout(() => {
                      setShowCopied(false);
                    }, 700);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            )}
          </FlexEndContainer>

          <OutputContainer>
            {typeof currentActiveKeyOutputValue === "object" ? (
              <Flex style={{ width: "100%" }} vertical gap={6}>
                <Flex style={{ width: "100%" }} justify="end" align="center">
                  <Segmented
                    value={jsonView}
                    onChange={(val) => {
                      setJsonView(val);
                    }}
                    options={[
                      { value: "json", icon: <ApartmentOutlined /> },
                      { value: "table", icon: <TableOutlined /> },
                    ]}
                  />
                </Flex>
                {jsonView === "json" ? (
                  <ReactCodeMirror
                    value={JSON.stringify(
                      currentActiveKeyOutputValue || {},
                      undefined,
                      2,
                    )}
                    editable={false}
                    extensions={[langs.json()]}
                    theme={xcodeDark}
                    autoSave={"true"}
                    maxHeight="200px"
                    style={{
                      borderRadius: "15px",
                    }}
                  />
                ) : (
                  <DynamicTable jsonData={currentActiveKeyOutputValue} />
                )}
              </Flex>
            ) : (
              <div
                style={{
                  width: "100%",
                  maxHeight: "200px",
                }}
              >
                <MarkdownComponent
                  markdown={`${currentActiveKeyOutputValue}`}
                />
              </div>
            )}
          </OutputContainer>
        </>
      ) : (
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ width: "100%", height: "100%" }}
        >
          <NoOutputHeading>
            No output Available for selected output
          </NoOutputHeading>
          <NoOutputDescription>
            Execute the tool again to see the selected output result here.
          </NoOutputDescription>
        </Flex>
      )}
    </ToolOutputContainer>
  );
};

export default ToolUseOutput;
