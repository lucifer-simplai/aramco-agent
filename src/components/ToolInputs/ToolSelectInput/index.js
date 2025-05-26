import { UndoOutlined } from "@ant-design/icons";
import { Avatar, Flex, Form, Popover, Select, Space, Tag } from "antd";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import BracketsIcon from "../../Icons/BracketsIcon";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import VariablePopOver from "../../VariablePopOver";
import {
  ShortTextInputArea,
  ShortTextInputContainer,
} from "../ShortText/style";
import { InputContainer } from "../style";
import { ToolDropdown } from "./style";

const ToolSelectInput = ({
  inputDetails,
  inputFieldName,
  options = [],
  itemName,
  form,
  inputForm,
  toggleEnabled = true,
  index,
}) => {
  const [textField, setTextField] = useState("default");
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
    [form, inputFieldName],
  );

  const selectValue = Form.useWatch(inputFieldName, form);

  const validateSelect = useMemo(() => {
    if (!selectValue) {
      return {};
    }
    const optionsHasValue = options?.some(
      (option) => option?.value === selectValue,
    );

    if (!optionsHasValue && options?.length > 0) {
      return {
        validateStatus: "error",
        help: "This value is invalid",
      };
    }
    return {};
  }, [selectValue, textField]);

  return (
    <InputContainer>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Flex align="center" gap="12px">
          <Space>
            <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
            <InfoIconTooltip title={inputDetails?.description} />
            {inputDetails?.required && <Tag color="red">Required</Tag>}
          </Space>
        </Flex>
        {toggleEnabled &&
          (textField === "default" ? (
            <Avatar
              size={24}
              shape="square"
              style={{ background: "#F8F2FF", cursor: "pointer" }}
              onClick={() => {
                setTextField("variable");
              }}
              icon={<BracketsIcon />}
            />
          ) : (
            <Avatar
              size={24}
              shape="square"
              style={{ background: "#F8F2FF", cursor: "pointer" }}
              onClick={() => {
                setTextField("default");
              }}
              icon={<UndoOutlined />}
            />
          ))}
      </Flex>
      <ToolDropdown>
        {textField === "variable" ? (
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
                  onFocus={() => ShortTextRef?.current.focus()}
                  onChange={() => ShortTextRef?.current.focus()}
                  ref={ShortTextRef}
                  placeholder="Type your message here..."
                  style={{ resize: "none" }}
                />
              </Form.Item>
            </ShortTextInputContainer>
          </Popover>
        ) : (
          textField === "default" && (
            <Form.Item name={itemName} noStyle {...validateSelect}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Value"
                options={
                  options?.map?.((option) => ({
                    label: option?.label,
                    value: option?.value,
                  })) || []
                }
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
          )
        )}
      </ToolDropdown>
    </InputContainer>
  );
};

export default memo(ToolSelectInput);
