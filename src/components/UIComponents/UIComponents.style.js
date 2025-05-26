import { Button, Radio, Segmented, Typography } from "antd";
import { styled } from "styled-components";
const { Text } = Typography;

export const FlexBox = styled.div`
  display: flex;
`;
export const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const FlexEndContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const FlexStartContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100vh - 114px);
`;

export const PageSubHeading = styled.div`
  font-size: 14px;
  color: #14141480;
  font-family: var(--font-dm-sans);
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const PageTitle = styled.div`
  display: flex;
  color: var(--Text-Color-900, #171717);
  font-family: var(--font-dm-sans);
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-right: 22px;
`;
export const PageAbout = styled.div`
  display: flex;
  color: var(--Text-Color-850, #222);
  text-overflow: ellipsis;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 154%; /* 24.64px */
`;

export const MediumRadioGroup = styled(Radio.Group)`
  .ant-radio-button-wrapper {
    height: 40px;
    padding: 9px 30px;
    color: var(--Text-Color-850, #222);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 157.143% */
    border: 0.5px solid $primary-color !important;

    /* drop-shadow/button-secondary */
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  }
  .ant-radio-button-wrapper:not(:first-child) {
    border-left: 0px !important;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    width: 0px !important;
  }
`;

export const RemoveButton = styled(Button)`
  color: #ff0000 !important;
  border-color: #ff0000 !important;
  &:hover {
    background-color: #ff0000 !important;
    color: #fff !important;
  }
`;

export const DrawerTitle = styled(Text)`
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: var(--Text-Color-900, #171717) !important;
  font-size: 20px !important;
  font-style: normal !important;
  font-weight: 500 !important;
  line-height: normal !important;
`;

export const DrawerTabTitle = styled(Text)`
  color: currentColor !important;
  text-align: center !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 22px !important; /* 137.5% */
`;

export const CustomSegmented = styled(Segmented)`
  border-radius: 20px !important;
  border: 1px solid var(--Stroke, #c3d0e2) !important;
  background: #fff !important;
  padding: 5px !important;

  .ant-segmented-item:hover {
    color: #222 !important;
  }

  .ant-segmented-item-selected:hover {
    color: #fff !important;
  }

  .ant-segmented-item-selected {
    border-radius: 16px !important;
    color: #fff !important;
  }
  .ant-segmented-item {
    border-radius: 16px !important;
  }

  .ant-segmented-thumb {
    border-radius: 16px !important;
    color: #fff !important;
  }

  transition: all 10s ease-out !important;
`;

export const ToolInputLabel = styled(Text)`
  color: var(--Text-Color-900, #171717) !important;
  font-feature-settings: "clig" off, "liga" off;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 700 !important;
  line-height: normal !important;
`;

export const ClickableText = styled(Text)`
  display: flex;
  color: ${(props) =>
    props.disabled
      ? "var(--New-Main-Color, #444) !important"
      : "var(--New-Main-Color, #032c92) !important"};
  opacity: ${(props) => (props?.disabled ? 0.5 : 1)};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  gap: 4px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    color: ${(props) =>
      props.disabled
        ? "var(--New-Main-Color, #444) !important"
        : "var(--New-Main-Color,  #032c92) !important"};
  }
`;

export const ArrayInputCard = styled.div`
  display: flex !important;
  flex-direction: column;
  gap: ${(props) => (props?.nostyle ? "12px !important" : "18px !important")};
  padding: ${(props) => (props?.nostyle ? "unset" : "16px !important")};
  border-radius: ${(props) => (props?.nostyle ? "unset" : "20px !important")};
  border: ${(props) =>
    props?.nostyle
      ? "unset"
      : "1px solid var(--Text-Color-150, #d5d5d5) !important"};
  background: ${(props) =>
    props?.nostyle ? "unset" : "var(--Text-Color-50, #fff) !important"};
`;
