import { DeleteOutlined } from "@ant-design/icons";
import { Col, Flex, Form, Row, Space, Tag, Typography } from "antd";
import { memo, useEffect } from "react";
import { PRIMARY_BRAND_COLOR } from "../../../theme/theme.antd";
import InfoIconTooltip from "../../InfoIconTooltip";
import {
  RemoveButton,
  ToolInputLabel,
} from "../../UIComponents/UIComponents.style";
import { InputContainer } from "../style";
import { HeaderInputField } from "./style";

const { Text } = Typography;

const KeyValueInput = ({ inputDetails, form, itemName, inputFieldName }) => {
  useEffect(() => {
    const KeyValueInputValue = form.getFieldValue(inputFieldName);
    if (!KeyValueInputValue) {
      form.setFields([
        {
          name: inputFieldName,
          value: [
            {
              key: undefined,
              value: undefined,
            },
          ],
        },
      ]);
    }
  }, []);

  return (
    <InputContainer>
      <Flex align="center" gap="12px">
        <Space>
          <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
          <InfoIconTooltip title={inputDetails?.description} />
          {inputDetails?.required && <Tag color="red">Required</Tag>}
        </Space>
      </Flex>
      <Form.List
        name={itemName}
        initialValue={[{ key: undefined, value: undefined }]}
      >
        {(fields, { add, remove }) => (
          <Row style={{ width: "100%" }} gutter={[24, 24]}>
            {fields.map(({ key, name, ...restField }, index) => (
              <Col span={24} key={key}>
                <Row style={{ width: "100%" }} gutter={24}>
                  <Col span={24} md={{ span: 11 }}>
                    <Form.Item
                      {...restField}
                      label="key"
                      name={[name, "key"]}
                      style={{ margin: 0 }}
                    >
                      <HeaderInputField placeholder="Enter key here..." />
                    </Form.Item>
                  </Col>
                  <Col span={24} md={{ span: 11 }}>
                    <Form.Item
                      {...restField}
                      label="value"
                      name={[name, "value"]}
                      style={{ margin: 0 }}
                    >
                      <HeaderInputField placeholder="Enter value here..." />
                    </Form.Item>
                  </Col>
                  <Col
                    span={24}
                    md={{ span: 2 }}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <RemoveButton
                      icon={<DeleteOutlined />}
                      type="text"
                      onClick={() => remove(name)}
                      style={{ margin: "34px 0 0" }}
                    ></RemoveButton>
                  </Col>
                </Row>
              </Col>
            ))}
            <Flex justify="end" style={{ width: "100%" }}>
              <Text
                onClick={() => add()}
                strong
                underline
                style={{ color: PRIMARY_BRAND_COLOR, cursor: "pointer" }}
              >
                Add key
              </Text>
            </Flex>
          </Row>
        )}
      </Form.List>
    </InputContainer>
  );
};

export default memo(KeyValueInput);
