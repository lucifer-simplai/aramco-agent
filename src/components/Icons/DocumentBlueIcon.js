import Icon from "@ant-design/icons";
import React from "react";
const DocumentBlueLogo = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.6912 6.57352V22.4539C20.6912 23.3079 19.9984 24 19.1451 24H4.85492C4.0009 24 3.30884 23.3079 3.30884 22.4539V1.54608C3.30879 0.692063 4.00085 0 4.85492 0H14.1177L20.6912 6.57352Z"
      fill="#518EF8"
    />
    <path d="M16.4439 12.0488H7.55518V13.0365H16.4439V12.0488Z" fill="white" />
    <path d="M16.4439 14.2539H7.55518V15.2416H16.4439V14.2539Z" fill="white" />
    <path d="M16.4439 16.4609H7.55518V17.4486H16.4439V16.4609Z" fill="white" />
    <path d="M13.8765 18.666H7.55518V19.6537H13.8765V18.666Z" fill="white" />
    <path
      d="M15.0145 6.43052L20.6912 8.76916V6.57334L17.4727 5.62305L15.0145 6.43052Z"
      fill="#3A5BBC"
    />
    <path
      d="M20.6912 6.57351H15.6638C14.8097 6.57351 14.1177 5.88145 14.1177 5.02744V0L20.6912 6.57351Z"
      fill="#ACD1FC"
    />
  </svg>
);

const DocumentBlueIcon = ({ ...props }) => {
  return <Icon component={() => <DocumentBlueLogo />} {...props} />;
};

export default DocumentBlueIcon;
