import Icon from "@ant-design/icons";
import React from "react";
const SimplaiLogo = () => {
  const randomNum = Math.abs(Math.random() * 1000);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="32"
      viewBox="0 0 31 32"
      fill="none"
    >
      <rect
        y="0.416992"
        width="30.8414"
        height="30.8414"
        rx="15.4207"
        fill="url(#paint0_linear_15120_46682)"
      />
      <path
        d="M17.2797 13.0402L10.9292 17.2469C10.0886 15.9774 10.4346 14.2658 11.7057 13.4234L18.0562 9.2168C18.8968 10.4862 18.5491 12.1979 17.2797 13.0402Z"
        fill="white"
      />
      <path
        d="M18.512 10.6128C18.49 10.1317 18.3415 9.64894 18.0562 9.2168L11.7041 13.4234C10.8381 13.9974 10.4009 14.9764 10.4785 15.9454L18.3381 10.7394C18.3972 10.6989 18.4563 10.6567 18.512 10.6128Z"
        fill="white"
      />
      <path
        d="M18.954 21.687L12.6035 25.8953C11.7629 24.6259 12.1089 22.9142 13.38 22.0719L19.7305 17.8652C20.5728 19.1347 20.2251 20.8463 18.954 21.687Z"
        fill="white"
      />
      <path
        d="M12.1532 24.1751C12.111 24.7625 12.2544 25.3668 12.6039 25.8952L18.9543 21.6886C19.9182 21.0505 20.3503 19.9094 20.1343 18.8408L12.5127 23.8915C12.3827 23.9759 12.2629 24.0721 12.1532 24.1751Z"
        fill="white"
      />
      <path
        d="M17.9816 16.676L10.5154 15.1602C10.2115 16.6524 11.1771 18.1092 12.6693 18.413L20.1356 19.9289C20.4394 18.435 19.4739 16.9799 17.9816 16.676Z"
        fill="white"
      />
      <path
        d="M10.5259 16.3066C10.7555 17.338 11.5691 18.1888 12.6697 18.4133L20.136 19.9292C20.2524 19.357 20.1815 18.7898 19.9655 18.2901C19.7865 18.2108 19.5958 18.1483 19.3949 18.1078L10.5259 16.3066Z"
        fill="white"
      />
      <circle cx="18.505" cy="6.85363" r="1.34093" fill="white" />
      <defs>
        <linearGradient
          id="paint0_linear_15120_46682"
          x1="-1.20474"
          y1="17.0425"
          x2="34.2147"
          y2="17.2834"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#C266E7" />
          <stop offset="1" stop-color="#602EDF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const SimplaiIcon = ({ ...props }) => {
  return <Icon component={() => <SimplaiLogo />} {...props} />;
};

export default SimplaiIcon;
