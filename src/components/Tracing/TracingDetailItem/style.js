import { Typography } from "antd";
import { styled } from "styled-components";

const { Text } = Typography;

export const TracingDetailItemContainer = styled.div`
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  .cm-theme-light {
    border: 0.5px solid var(--Stroke, #a6bcda) !important;
  }
`;

export const TracingCodeMirrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  .cm-theme-light {
    border: 0.5px solid var(--Stroke, #a6bcda) !important;
  }
`;

export const TracingResultContainer = styled.div`
  display: flex;
  border-radius: 5px;
  border: 0.5px solid var(--Stroke, #a6bcda);
  width: calc(100% - 24px);
  padding: 12px;
  min-height: 100px;
`;
export const TracingDetailItemTitle = styled(Text)`
  color: #000;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

export const FormatSelectionContainer = styled.div`
  padding: 8px;
  overflow: hidden;
  width: 100%;
  border-radius: 0px 0px 10px 10px;
  border-top: 0.5px solid #9e9b9b;
  background: #292a30;
`;

export const ActionButtonContainer = styled.div`
  border-radius: 8px !important;
  min-height: 40px !important;
  background: #292a30 !important;
  color: #fff !important;
  padding: 4px 12px !important;
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
  gap: 4px;

  &:hover {
    color: #fff !important;
    background: #333 !important;
  }
`;
