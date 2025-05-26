import { ClearOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Typography } from "antd";
import { memo, useCallback, useMemo } from "react";
import { ClickableText } from "../../UIComponents/UIComponents.style";
import { BuilderCardContainer, SchemaBuilderHeading } from "./style";

export function JsonPaste({
  handleClearJsonFormat,
  itemName,
  error,
  setError,
  handleJsonPasteChange,
  inputFieldName,
  form,
}) {
  const jsonInput = Form.useWatch(inputFieldName, form);

  const formattable = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      return formatted !== jsonInput;
    } catch (err) {
      return false;
    }
  }, [jsonInput]);

  const formatJsonInput = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      form.setFields([{ name: inputFieldName, value: formatted }]);
    } catch (err) {}
  }, [jsonInput, form, inputFieldName]);

  const handleTextAreaChange = useCallback(
    (e) => {
      handleJsonPasteChange(e.target.value);
    },
    [handleJsonPasteChange],
  );

  const handleClearClick = useCallback(() => {
    handleClearJsonFormat();
    setError(null);
  }, [handleClearJsonFormat, setError]);

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="center">
        <SchemaBuilderHeading>
          Provide your own response format using a custom JSON schema.
        </SchemaBuilderHeading>
        <ClickableText onClick={formatJsonInput} disabled={!formattable}>
          <MenuUnfoldOutlined />
          Format
        </ClickableText>
      </Flex>
      <BuilderCardContainer>
        <Form.Item name={itemName} noStyle>
          <Input.TextArea
            placeholder="Enter your JSON schema here..."
            autoSize={{ minRows: 10, maxRows: 20 }}
            onChange={handleTextAreaChange}
          />
        </Form.Item>
        {error && (
          <Flex align="center" gap={12}>
            <Typography.Text
              style={{ fontSize: 14, fontWeight: 400, color: "#FF0000" }}
            >
              {error}
            </Typography.Text>
            <Button
              onClick={handleClearClick}
              icon={<ClearOutlined />}
              size="middle"
            >
              Clear format
            </Button>
          </Flex>
        )}
      </BuilderCardContainer>
    </Flex>
  );
}

export default memo(JsonPaste);
