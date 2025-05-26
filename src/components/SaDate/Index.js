import { Divider, Space, Typography } from "antd";
import {
  dateFormatForFrontend,
  timeFormatForFrontend,
} from "../../utils/constants";
import dayjs from "../../utils/date";

const { Text } = Typography;

const SaDate = ({
  date,
  isDate = true,
  time = true,
  inline = false,
  dateFormat = dateFormatForFrontend,
}) => (
  <>
    {date ? (
      <Space direction={inline ? "horizontal" : "vertical"} size={0}>
        <Text>{dayjs(date)?.format(dateFormat)}</Text>
        {inline && time && (
          <Divider
            type="vertical"
            style={{ marginInline: "4px", borderColor: "inherit" }}
          />
        )}
        {time && <Text>{dayjs(date)?.format(timeFormatForFrontend)}</Text>}
      </Space>
    ) : (
      "--"
    )}
  </>
);

export default SaDate;
