import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Flex, Form, Space, Tag } from "antd";
import { memo } from "react";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import { InputContainer } from "../style";

const CodeInput = ({ inputDetails, itemName, disabled = false }) => {
  return (
    <InputContainer>
      <Flex align="center" gap="12px">
        <Space>
          <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
          <InfoIconTooltip title={inputDetails?.description} />
          {inputDetails?.required && <Tag color="red">Required</Tag>}
        </Space>
      </Flex>
      <Form.Item name={itemName} noStyle style={{ width: "100%" }}>
        <ReactCodeMirror
          height="200px"
          theme={xcodeDark}
          extensions={
            inputDetails?.metadata?.language == "python"
              ? [langs.python()]
              : inputDetails?.metadata?.language == "sql"
              ? [langs.sql()]
              : [langs.javascript({ jsx: true })]
          }
          autoSave={"true"}
          editable={!disabled}
          style={{
            borderRadius: "15px",
            overflow: "hidden",
            width: "100%",
          }}
        />
      </Form.Item>
    </InputContainer>
  );
};

export default memo(CodeInput);
