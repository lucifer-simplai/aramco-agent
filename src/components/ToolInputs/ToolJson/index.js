import { json } from "@codemirror/lang-json";
import { Flex, Form, Space, Tag } from "antd";

import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { memo, useMemo } from "react";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import { InputContainer } from "../style";

const MemoizedReactCodeMirror = memo(ReactCodeMirror);

const ToolJson = ({ inputDetails, itemName, inputFieldName, form }) => {
  const editorSettings = useMemo(
    () => ({
      style: {
        borderRadius: "15px",
        overflow: "hidden",
        width: "100%",
      },
      className: "nodrag nopan",
      extensions: [json()], // Set CodeMirror to JSON mode
      theme: xcodeDark,
      height: "150px",
    }),
    [inputDetails?.title, inputDetails?.description],
  );
  return (
    <InputContainer className="nodrag nopan">
      <Flex align="center" gap="12px">
        <Space>
          <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
          <InfoIconTooltip title={inputDetails?.description} />
          {inputDetails?.required && <Tag color="red">Required</Tag>}
        </Space>
      </Flex>

      <Form.Item name={itemName} noStyle className="nodrag">
        <MemoizedReactCodeMirror
          key={`${inputDetails?.title}_${inputDetails?.description}`}
          {...editorSettings} // Use memoized settings
        />
      </Form.Item>
    </InputContainer>
  );
};

export default memo(ToolJson);
