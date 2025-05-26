import { Tooltip } from "antd";
import InfoIcon from "../Icons/InfoIcon";

const InfoIconTooltip = ({
  title,
  infoIconWidth,
  trigger = "hover",
  placement,
  style = {},
}) => {
  return (
    <Tooltip
      placement={placement ?? "top"}
      trigger={trigger}
      title={title}
      styles={{ root: { maxWidth: "375px" } }}
    >
      <div style={{ ...style }}>
        <InfoIcon />
      </div>
    </Tooltip>
  );
};

export default InfoIconTooltip;
