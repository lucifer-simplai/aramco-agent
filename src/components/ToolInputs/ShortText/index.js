import { Flex, Form, Input, Popover, Space, Tag } from "antd";

import { memo, useCallback, useRef } from "react";
import { disabledToolStepFields } from "../../../utils/constants";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import VariablePopOver from "../../VariablePopOver";
import { InputContainer } from "../style";
import { ShortTextInputArea, ShortTextInputContainer } from "./style";

const { TextArea } = Input;

const ShortText = ({
  inputDetails,
  itemName,
  inputFieldName,
  form,
  inputForm,
  index,
  disabled = false,
}) => {
  const ShortTextRef = useRef();

  const addVariableToText = useCallback(
    (values) => {
      const newValue = form.getFieldValue(inputFieldName);

      const startPos = ShortTextRef?.current?.input?.selectionStart;
      const endPos = ShortTextRef?.current?.input?.selectionEnd;

      form.setFields([
        {
          name: inputFieldName,
          value:
            (newValue?.substring(0, startPos) ?? "") +
            `{{${values}}}` +
            (newValue?.substring(endPos) ?? ""),
        },
      ]);
      ShortTextRef?.current?.setSelectionRange(
        endPos + values?.length + 4,
        endPos + values?.length + 4,
      );

      ShortTextRef?.current.focus();
    },
    [inputFieldName, form],
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
        <ShortTextInputContainer>
          <Form.Item name={itemName} noStyle>
            <ShortTextInputArea
              disabled={
                disabledToolStepFields?.includes(inputDetails?.name) || disabled
              }
              onFocus={() => ShortTextRef?.current.focus()}
              onChange={() => ShortTextRef?.current.focus()}
              ref={ShortTextRef}
              placeholder="Type your message here..."
              style={{ resize: "none" }}
            />
          </Form.Item>
        </ShortTextInputContainer>
      </Popover>
    </InputContainer>
  );
};

export default memo(ShortText);
