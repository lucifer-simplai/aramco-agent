import Icon from "@ant-design/icons";

const DownArrowLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <g clipPath="url(#clip0_4273_85021)">
      <path
        d="M4.94 5.72656L8 8.7799L11.06 5.72656L12 6.66656L8 10.6666L4 6.66656L4.94 5.72656Z"
        fill="#2E2E2E"
      />
    </g>
    <defs>
      <clipPath id="clip0_4273_85021">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="matrix(0 1 -1 0 16 0)"
        />
      </clipPath>
    </defs>
  </svg>
);

const DownArrowIcon = ({ ...props }) => {
  return <Icon component={() => <DownArrowLogo />} {...props} />;
};

export default DownArrowIcon;
