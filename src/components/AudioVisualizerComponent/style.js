import { Progress, Typography } from "antd";
import styled, { keyframes } from "styled-components";

const { Text } = Typography;

export const ConnectingText = styled(Text)`
  font-size: 16px !important;
  background: linear-gradient(0deg, #c266e7 24.52%, #602edf 110.56%);
  background: -webkit-linear-gradient(
    0deg,
    #c266e7 24.52%,
    #602edf 110.56%
  ) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
`;

export const SpeakerName = styled(Text)`
  color: #000 !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 700 !important;
  line-height: normal !important;

  /* responsive ellipsis for text of one line */
  display: -webkit-box !important;
  -webkit-box-orient: vertical !important;
  -webkit-line-clamp: 1 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  /* change max width according to the portion of width text should cover */
  max-width: 100%;
`;

export const AgentConnectingText = styled(Text)`
  font-size: 16px !important;
  font-weight: bolder !important;
  background: linear-gradient(0deg, #c266e7 24.52%, #602edf 110.56%);
  background: -webkit-linear-gradient(
    0deg,
    #c266e7 24.52%,
    #602edf 110.56%
  ) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const RotatingProgress = styled(Progress)`
  .ant-progress-circle {
    animation: ${rotate} 1s linear infinite !important;
  }
`;

export const ActionText = styled(Text)`
  color: #000 !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: normal !important;
`;
