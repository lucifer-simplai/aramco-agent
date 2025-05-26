import Icon from "@ant-design/icons";
import React from "react";
const ChatLoadingLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <circle cx="9" cy="9" r="9" fill="#D7CEEC" />
    <circle cx="9" cy="9" r="5" fill="#602EDF" />
  </svg>
);

const ChatLoadingIcon = ({ ...props }) => {
  return (
    <Icon
      component={() => (
        <img
          src={"/assets/Images/chatLoading.gif"}
          alt="loading"
          width={40}
          height={28}
        />
      )}
      {...props}
    />
  );
};

export default ChatLoadingIcon;
