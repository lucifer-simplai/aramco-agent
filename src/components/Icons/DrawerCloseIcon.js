import Icon from "@ant-design/icons";
import React from "react";
const DrawerCloseLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g opacity="0.7" clipPath="url(#clip0_5510_4032)">
      <path
        d="M9.46585 8.01311L15.6959 1.78284C16.1014 1.37759 16.1014 0.722346 15.6959 0.317093C15.2907 -0.0881603 14.6354 -0.0881603 14.2302 0.317093L7.99991 6.54737L1.76983 0.317093C1.36438 -0.0881603 0.709336 -0.0881603 0.304082 0.317093C-0.101361 0.722346 -0.101361 1.37759 0.304082 1.78284L6.53416 8.01311L0.304082 14.2434C-0.101361 14.6486 -0.101361 15.3039 0.304082 15.7091C0.506045 15.9113 0.771595 16.0128 1.03695 16.0128C1.30232 16.0128 1.56768 15.9113 1.76983 15.7091L7.99991 9.47886L14.2302 15.7091C14.4323 15.9113 14.6977 16.0128 14.9631 16.0128C15.2284 16.0128 15.4938 15.9113 15.6959 15.7091C16.1014 15.3039 16.1014 14.6486 15.6959 14.2434L9.46585 8.01311Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_5510_4032">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const DrawerCloseIcon = ({ ...props }) => {
  return <Icon component={() => <DrawerCloseLogo />} {...props} />;
};

export default DrawerCloseIcon;
