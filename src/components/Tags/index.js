import { Tag } from "antd";

const Tags = ({ tag, tagProps, icon }) => {
  return (
    <Tag
      style={{
        color: tagProps?.color ?? "#222222",
        background: tagProps?.background ?? "#FFFFFF",
        border: tagProps?.border ?? "#222222",
        boxShadow: tagProps?.boxShadow ?? "0px 2px 0px 0px rgba(0, 0, 0, 0.02)",
        padding: tagProps?.padding ?? "0 15px",
        borderRadius: tagProps?.borderRadius ?? "8px",
        height: "23px",
        fontSize: "12px",
        fontStyle: "normal",
        fontWeight: tagProps?.fontWeight ?? "400",
        lineHeight: "22px",
        marginInlineEnd: "0",
        gap: tagProps?.gap ?? "",
        display: "flex",
        alignItems: "center",
      }}
      icon={icon ?? null}
    >
      {tag}
    </Tag>
  );
};

export default Tags;
