import { Flex, Form, Space, Switch, Tag } from "antd";
import { memo, useCallback, useState } from "react";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import { HorizontalInputContainer } from "../style";

const SwitchInput = ({ inputDetails, itemName }) => {
  const [value, setValue] = useState();
  const onChange = useCallback((val, viewUpdate) => {
    setValue(val);
  }, []);
  return (
    <HorizontalInputContainer>
      <Flex align="center" gap="12px">
        <Space>
          <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
          <InfoIconTooltip title={inputDetails?.description} />
          {inputDetails?.required && <Tag color="red">Required</Tag>}
        </Space>
      </Flex>
      <Form.Item
        name={itemName}
        noStyle
        style={{ width: "100%" }}
        valuePropName="checked"
        labelCol={{ span: 4 }} // Label width
        wrapperCol={{ span: 24 }} // Input width
      >
        <Switch />
      </Form.Item>
    </HorizontalInputContainer>
  );
};

export default memo(SwitchInput);
