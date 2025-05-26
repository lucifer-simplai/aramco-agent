import { Flex, Form, Input, Popover, Space, Tag } from "antd";

import { memo, useCallback, useRef } from "react";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import VariablePopOver from "../../VariablePopOver";
import { InputContainer } from "../style";
import {
  LongTextInputArea,
  LongTextInputBottomHint,
  LongTextInputContainer,
} from "./style";

const { TextArea } = Input;

const LongText = ({
  inputDetails,
  itemName,
  inputFieldName,
  form,
  inputForm,
  index,
}) => {
  const LongTextRef = useRef();

  const addVariableToText = useCallback(
    (values) => {
      const newValue = form.getFieldValue(inputFieldName);
      const startPos =
        LongTextRef?.current?.resizableTextArea?.textArea?.selectionStart;
      const endPos =
        LongTextRef?.current?.resizableTextArea?.textArea?.selectionEnd;

      form.setFields([
        {
          name: inputFieldName,
          value:
            (newValue?.substring(0, startPos) ?? "") +
            `{{${values}}}` +
            (newValue?.substring(endPos) ?? ""),
        },
      ]);
      LongTextRef?.current?.resizableTextArea?.textArea?.setSelectionRange(
        endPos + values?.length + 4,
        endPos + values?.length + 4,
      );

      LongTextRef?.current?.resizableTextArea?.textArea.focus();
    },
    [form, inputFieldName],
  );

  return (
    <InputContainer>
      <Flex align="center" gap="12px">
        <Space>
          <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
          <InfoIconTooltip title={inputDetails?.description} />
          {inputDetails?.required && <Tag color="red">Required</Tag>}
        </Space>
      </Flex>

      <Popover
        getPopupContainer={(node) => node.parentNode}
        content={
          <VariablePopOver
            form={form}
            inputForm={inputForm}
            index={index}
            addVariableToText={addVariableToText}
          />
        }
        overlayStyle={{
          minWidth: "100%",
          wordBreak: "break-all",
        }}
        overlayInnerStyle={{
          width: "100%",
        }}
        trigger={"click"}
        placement="bottom"
        arrow={false}
        autoAdjustOverflow={false}
      >
        <LongTextInputContainer>
          <Form.Item name={itemName} noStyle>
            <LongTextInputArea
              onFocus={() =>
                LongTextRef?.current?.resizableTextArea?.textArea.focus()
              }
              onChange={() =>
                LongTextRef?.current?.resizableTextArea?.textArea.focus()
              }
              ref={LongTextRef}
              placeholder="Type your message here..."
              style={{ resize: "none" }}
              autoSize={{ minRows: 6, maxRows: 6 }}
            />
          </Form.Item>
          <LongTextInputBottomHint>
            {` Use {{ to use any variable in between textarea`}{" "}
          </LongTextInputBottomHint>
        </LongTextInputContainer>
      </Popover>
    </InputContainer>
  );
};

export default memo(LongText);
