import { DatePicker, Flex, Form, Space, Tag } from "antd";
import dayjs from "dayjs";
import { memo } from "react";
import { dateFormatForBackend } from "../../../utils/constants";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import { InputContainer } from "../style";

const DatePickerInput = ({ inputDetails, itemName }) => {
  return (
    <InputContainer>
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
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        getValueProps={(value) => ({
          value: value ? dayjs(value) : null,
        })}
        getValueFromEvent={(value) =>
          value ? value.format(dateFormatForBackend) : null
        }
      >
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          style={{ width: "100%", height: 44 }}
        />
      </Form.Item>
    </InputContainer>
  );
};

export default memo(DatePickerInput);
