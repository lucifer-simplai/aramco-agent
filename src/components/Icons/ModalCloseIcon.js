import Icon from "@ant-design/icons";
import React from "react";
const ModalCloseLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M21.1878 4.85819L19.143 2.80859L12.0006 9.95099L4.85819 2.80859L2.80859 4.85819L9.95099 12.0006L2.80859 19.143L4.85819 21.1878L12.0006 14.0454L19.143 21.1878L21.1878 19.143L14.0454 12.0006L21.1878 4.85819Z"
      fill="#E6E6E6"
    />
    <path
      d="M21.1878 4.85819L19.143 2.80859L12.0006 9.95099L4.85819 2.80859L2.80859 4.85819L9.95099 12.0006L2.80859 19.143L4.85819 21.1878L12.0006 14.0454L19.143 21.1878L21.1878 19.143L14.0454 12.0006L21.1878 4.85819Z"
      fill="#AAAAAA"
    />
  </svg>
);

const ModalCloseIcon = ({ ...props }) => {
  return <Icon component={() => <ModalCloseLogo />} {...props} />;
};

export default ModalCloseIcon;
