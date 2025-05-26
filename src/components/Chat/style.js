import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import { keyframes, styled } from "styled-components";
import {
  PRIMARY_ACTIVE_BRAND_COLOR,
  PRIMARY_BRAND_COLOR,
  TEXT_HOVER_BG_COLOR,
} from "../../theme/theme.antd";

const { Text } = Typography;
export const ChatContainer = styled.div`
  display: flex;
  flex: ${(props) => (props.hasMessages ? 1 : "")};
  flex-grow: ${(props) => (props.hasMessages ? 1 : "")};
  flex-direction: column;
  padding-right: 4px;
  width: 100%;

  transition: all 0.3s ease-in-out;

  overflow: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 4px;
  }
`;

export const LeftControls = styled.div`
  padding: 0px 5px 0px 0px;
`;

export const RemoveUploadedFileIcon = styled(CloseCircleFilled)`
  font-size: 16px !important;
  color: #ff4d4f;
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  transform: translate(50%, -50%) !important;
  cursor: pointer !important;
  visibility: hidden !important;
  opacity: 0 !important;
`;

export const UploadedFileCard = styled.div`
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 0.5px solid #c8d9f0;
  background: var(--Support, #f8fafc);
  position: relative;
  &:hover ${RemoveUploadedFileIcon} {
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

export const UploadedFileName = styled(Text)`
  color: var(--Text-Color-950, #0b0b0b) !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;

  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-word;
  display: inline-block;
`;

export const ChatInputContainer = styled.div`
  display: flex;
  width: 80% !important;
  max-width: 80% !important;
  margin: 0px auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 20px;
  position: relative;

  background: var(--Text-Color-50, #fff);
  padding: 8px;

  ${(props) =>
    props.connecting
      ? `
    background: linear-gradient(90deg, #602edf, #ff7a59);
    padding: 2px; /* Consistent border thickness */
    `
      : `
    border: 1px solid var(--Stroke, #C3D0E2);
    padding: 10px 16px; /* No extra padding in default case */
    `}

  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    ${(props) =>
      props.connecting
        ? ``
        : `
    border: 1px solid var(--blue-purple-500, #602EDF);
    box-shadow: 0px 3px 8.4px 2px rgba(173, 173, 173, 0.15);
    `}
  }

  & > .inner-container {
    background: var(--Text-Color-50, #fff); /* Inner background */
    border-radius: inherit;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 12px; /* Actual content padding */
  }
  .ant-input {
    border: 0px !important;
    border-radius: 10px;
    box-shadow: none !important;
    margin-right: 8px;
    padding: 4px 0px;
  }
  transition: all 0.4s ease !important;
`;

export const MessageContainer = styled.div`
  display: flex;
  /* flex-direction: column; */
  gap: 12px;
  align-items: flex-end !important;
  justify-content: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return "flex-start !important";
      case "user":
        return "flex-end !important";
      default:
        return "flex-start !important";
    }
  }};
  width: 100%;
  margin-left: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return "0 !important";
      case "user":
        return "auto !important";
      default:
        return "0 !important";
    }
  }};
  margin-right: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return "auto !important";
      case "user":
        return "0 !important";
      default:
        return "auto !important";
    }
  }};
  margin-bottom: ${(props) => {
    switch (props.islastmessage) {
      case "true":
        return "46px";
      case "false":
        return "40px";
      default:
        return "40px";
    }
  }};
`;
export const IconContainer = styled.div`
  display: flex;
  background: #e6eaf5;
  justify-content: center;
  align-items: center;
  min-height: 32px;
  min-width: 32px;
  border-radius: 50%;
  color: $primary-color;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px; /* 200% */
  letter-spacing: 0.12px;
`;

export const MessageActionContainer = styled.div`
  display: flex;
  gap: 12px;
  min-height: 16px;
  position: absolute;
  right: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        switch (props.isshortmessage) {
          case "true":
            return "";
          case "false":
            return "6px";
          default:
            return "6px";
        }
      case "user":
        return "6px";
      default:
        return "6px";
    }
  }};
  bottom: -36px;
  padding: 5px;
  color: var(--Text-Color-850, #222) !important;
  visibility: hidden !important;
  opacity: 0 !important;
  transition: all 0.1s ease;

  border-radius: 4px;
  background: #fff;
  box-shadow: 0px 2.339px 6.239px 0px rgba(162, 161, 165, 0.46);
`;

export const PromptContainer = styled.div`
  display: inline-flex;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-direction: column;

  max-width: 80%;
  word-break: break-word;
  transition: all 0.1s ease;
  // text-wrap:wrap;
  // white-space: pre;
  border-radius: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return "15px 15px 15px 0 !important";
      case "user":
        return "15px 15px 0 15px !important";
      default:
        return "15px 15px 15px 0 !important";
    }
  }};

  background: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return "#FFF !important";
      case "user":
        return "#032c92 !important";
      default:
        return "#FFF !important";
    }
  }};

  ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return `.markdown-body {
        color:var(--Text-Color-850, #222) !important
        }
        `;
      case "user":
        return `.markdown-body {
        color:var(--Text-Color-850, #fff) !important
        }
        `;
      default:
        return `.markdown-body {
        color:var(--Text-Color-850, #222) !important
        }
        `;
    }
  }};
  position: relative;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  border: ${(props) => {
    switch (props.role) {
      case "SimplAi":
        return "0px !important";
      case "user":
        return "0px !important";
      default:
        return "0px !important";
    }
  }};
  & > span > .ant-typography:last-child {
    margin-bottom: 0 !important;
  }

  &:hover ${MessageActionContainer} {
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

export const BottomControls = styled.div`
  display: flex;
  // width: 100%;
  justify-content: space-between;
  align-items: center;
  min-height: 45px;
  border-radius: 0px 0px 10px 10px;
  background: #fbfafe;
  padding: 14px 16px;
`;

export const BottonRightControl = styled.div`
  display: flex;
  gap: 20px;
`;

export const BottonLeftControl = styled.div`
  display: flex;
  gap: 20px;
`;

export const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  color: var(--Text-Color-800, #2e2e2e);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const WelcomeText = styled.div`
  display: flex;
  gap: 3px;
  text-align: center;
  color: var(--Text-Color-900, #171717);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-top: 8px;
  margin-bottom: 13px;
`;

export const GetStartedText = styled.div`
  display: flex;
  position: relative;
  color: #222222;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  .markdown-body {
    color: #222222 !important;
    font-size: 32px !important;
  }
`;
export const GetStartedSubText = styled.div`
  display: flex;
  position: relative;
  color: #727272;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 30px;
  .markdown-body {
    color: #727272 !important;
    font-size: 32px !important;
  }
`;

export const RightControls = styled.div``;

export const ChatInputActionContainer = styled.div`
  padding: 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.4s ease-in-out;
  cursor: ${(props) => props?.cursor || "pointer"};
  &:hover {
    background-color: #f2f4f8;
  }
`;

export const AudioCallContainer = styled.div`
  width: -webkit-fill-available !important;
  height: 100% !important;
  min-height: 50px !important;
  border-radius: 18px !important;
  background-color: #fff !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: ${(props) =>
    props?.connecting ? "0 16px !important" : "0 !important"};
  gap: 24px !important;
`;

export const ConnectingText = styled(Text)`
  color: #000 !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 700 !important;
  line-height: normal !important;
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

export const ActionItemContainer = styled.div`
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #f2f4f8;
  }
`;

export const CitationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
`;

export const CitationTitle = styled(Text)`
  color: var(--Text-Color-950, #0b0b0b) !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 700 !important;
  line-height: normal !important;
  text-transform: uppercase !important;
`;

export const CitationFileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  width: max-content;
  height: 31px;
  padding: 8px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 0.5px solid #c8d9f0;
  background: var(--Support, #f8fafc);
  cursor: pointer;
`;

export const CitationFileName = styled(Text)`
  max-width: 180px !important;
  color: var(--Text-Color-950, #0b0b0b) !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
`;

export const ChatCitationDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
  border-radius: 10px;
  border: 0.8px solid var(--Text-Color-150, #d5d5d5);
  background: var(--Text-Color-50, #fff);
  box-shadow: 0px 3px 8px 0px rgba(158, 158, 158, 0.15);
`;

export const ChatCitationDetailsHeader = styled.div`
  height: 63px;
  padding: 16px;
  flex-shrink: 0;
  border-radius: 10px 10px 0px 0px;
  background: var(--Support, #f8fafc);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  width: calc(100% - 0.8px);
`;

export const ChatCitationDetailsContent = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border-radius: 0px 0px 10px 10px;
  padding: 16px;
  margin-top: 64px;
  overflow: auto;
`;

export const CitationPopoverHeading = styled(Text)`
  color: var(--headings, #000b34) !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
`;

export const CitationChunkCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ChatChunkDivider = styled.div`
  background: #dadcde;
  width: 100%;
  height: 1px;
`;

export const CitationChunkHashtag = styled.div`
  display: inline-flex;
  height: 31px;
  padding: 3px 6px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 4px;
  border: 0.5px solid #c8d9f0;
  background: var(--Support, #f8fafc);
`;

export const CitationChunkFileLink = styled(Text)`
  color: ${PRIMARY_BRAND_COLOR} !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
  text-decoration-line: underline !important;
  display: flex !important;
  align-items: center !important;
  gap: 2px;
`;

export const NoOutputHeading = styled(Text)`
  color: #171717 !important;
  font-size: 24px !important;
  font-weight: 700 !important;
  line-height: 42px !important;
  letter-spacing: 0em !important;
  text-align: left !important;
  margin: 2px 0 6px !important;
  text-align: center !important;
`;

export const NoOutputDescription = styled(Text)`
  font-size: 16px !important;
  font-weight: 400 !important;
  line-height: 21px !important;
  letter-spacing: 0em !important;
  text-align: center !important;
  color: #171717 !important;
`;

export const ToolOutputTitle = styled(Text)`
  color: var(--Text-Color-900, #171717) !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 700 !important;
  line-height: normal !important;
`;

export const OutputContainer = styled.div`
  height: 100% !important;
  width: 100%;
  overflow: auto !important;
  padding: 12px;
`;

export const ToolOutputContainer = styled.div`
  border-radius: 10px;
  border: 1px solid #d7e1ef;
  width: 100%;
  padding: 0 16px 16px;
  background: #fff;
  /* height: 800px !important; */
  /* min-height: 800px !important; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  &:hover {
    border: 1px solid var(--G1, #c266e7);
    background: #fdfeff;
    box-shadow: 0px 2px 3px 1px rgba(120, 120, 120, 0.15);
  }
`;

export const ChatChunkPreview = styled(Text)`
  color: var(--Text-Color-850, #222) !important;
  font-size: 12px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 18px !important; /* 150% */
`;

// Define the keyframes for the animation
const animLoader = keyframes`
  0% {
    box-shadow: -22px -4px 0 0 currentColor, -8px 4px 0 0 currentColor, 6px -4px 0 0 currentColor;
  }
  33% {
    box-shadow: -22px 4px 0 0 currentColor, -8px -4px 0 0 currentColor, 6px 4px 0 0 currentColor;
  }
  66% {
    box-shadow: -22px -4px 0 0 currentColor, -8px 4px 0 0 currentColor, 6px -4px 0 0 currentColor;
  }
  100% {
    box-shadow: -22px 4px 0 0 currentColor, -8px -4px 0 0 currentColor, 6px 4px 0 0 currentColor;
  }
`;

// Create the styled component
export const ChatLoadingAnimationIcon = styled.span`
  width: 6px; /* Radius size of dots */
  height: 6px;
  border-radius: 50%;
  display: block;
  margin: 2px auto;
  position: relative;
  color: ${PRIMARY_ACTIVE_BRAND_COLOR}; /* Set color of the dots */
  box-sizing: border-box;
  animation: ${animLoader} 1s linear infinite alternate;
`;

export const MessageActionButtonContainer = styled.div`
  display: flex;
  border-radius: 4px;
  background: #fff;
  padding: 4px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: max-content;
  gap: 4px;

  &:hover {
    background: #f2f4f8;
  }
`;

export const ConnectModalComponent = styled(Modal)`
  .ant-modal-title {
    font-size: 20px !important;
    font-weight: 700 !important;
    line-height: 26px !important;
    letter-spacing: 0px !important;
    text-align: left !important;
  }
  .ant-input {
    display: flex;
    min-height: 50px;
    padding: 12px;
    align-items: center;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid var(--Stroke, #a6bcda);
    background: var(--Neutral-white, #fff);
  }
`;

export const ModalTitle = styled.div`
  color: var(--headings, #000b34);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SubmitButton = styled(Button)`
  display: flex !important;
  padding: 15px 40px !important;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  min-height: 50px;
  color: var(--White, #fff) !important;
  text-align: center;
  font-size: 16px !important;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  .ant-modal .ant-modal-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 0px;
    text-align: left;
  }
  .ant-input {
    display: flex;
    min-height: 50px;
    padding: 12px;
    align-items: center;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid var(--Stroke, #a6bcda);
    background: var(--Neutral-white, #fff);
  }
  .ant-form-item-label {
    overflow: hidden;
    color: var(--Primary-Color, #141414);
    font-feature-settings: "clig" off, "liga" off;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

export const FirstQueryMessageContainer = styled.div`
  display: flex;
  height: 43px;
  padding: 0px 12px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  max-width: max-content;

  border-radius: 18px;
  border: 0.5px solid rgba(166, 188, 218, 0.7);
  background: #fff !important;
  cursor: pointer;

  &:hover {
    background-color: ${TEXT_HOVER_BG_COLOR};
    border: 0.5px solid var(--blue-purple-400, #8058e5) !important;
    box-shadow: 0px 2px 8px -6px rgba(140, 138, 138, 0.25);
  }
`;
