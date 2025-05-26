import { Splitter, Typography } from "antd";
import { styled } from "styled-components";
import {
  PRIMARY_ACTIVE_BRAND_COLOR,
  PRIMARY_BRAND_COLOR,
} from "../../../theme/theme.antd";

const { Text } = Typography;
export const TracingDrawerContainer = styled(Splitter)`
  height: 100%;
  display: flex;
  .ant-tree .ant-tree-treenode {
    width: 100%;
    min-width: max-content;
    min-height: 36px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 0px;
    &:hover {
      background: #f8fafc !important;
    }
  }
  .ant-tree-list-holder-inner {
    gap: 2px;
    width: 100%;
  }
  .ant-tree .ant-tree-treenode-selected {
    background: #ece9f7 !important;
    &:hover {
      background: #ece9f7 !important;
    }
  }
  .ant-tree-list-holder {
    display: flex;
    min-width: max-content;
    & > :first-child {
      display: flex;
      width: 100%;
    }
  }
  .ant-tree .ant-tree-node-content-wrapper {
    line-height: 32px;
  }
  .ant-tree-title {
    display: flex;
    align-items: center;
  }
  .ant-tree .ant-tree-switcher {
    align-items: center;
    display: flex;
    justify-content: center;
  }
  .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background: transparent !important;
  }
  .ant-tree .ant-tree-node-content-wrapper:hover {
    background: transparent !important;
  }
`;

export const TraceDivider = styled.div`
  width: 1.5px;
  background: var(--blue-purple-50, #efeafc);
`;

export const TracingTreeContainer = styled.div`
  height: 95%;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
  width: 100%;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const TracingTreeHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const WaterFallViewContainer = styled.div`
  display: flex;
  min-height: 36px;
  padding: 4px 15px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  cursor: pointer;

  border-radius: 4px;
  border: ${(props) => {
    switch (props.isWaterfallView) {
      case true:
        return `0.5px solid var(--blue-purple-400, ${PRIMARY_ACTIVE_BRAND_COLOR})`;
      case false:
        return "1px solid #D5D5D5";
      default:
        return "1px solid #D5D5D5";
    }
  }};
  background: ${(props) => {
    switch (props.isWaterfallView) {
      case true:
        return "#ECF5FF";
      case false:
        return " #ffffff";
      default:
        return "#ffffff";
    }
  }};

  /* typography */
  color: ${(props) => {
    switch (props.isWaterfallView) {
      case true:
        return PRIMARY_BRAND_COLOR;
      case false:
        return "#222";
      default:
        return "#222";
    }
  }};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const TracingDetailsContainer = styled.div`
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
  height: 94%;

  .ant-tabs-content-holder {
    overflow: auto !important;
  }
`;

export const ActionItemContainer = styled.div`
  cursor: pointer;
  display: flex;
  min-height: 36px;
  min-width: 36px;
  padding: 4px 4px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  border-radius: 4px;
  border: 1px solid #d5d5d5;
  background: var(--Text-Color-50, #fff);
`;

export const TraceDetailContainer = styled.div`
  display: flex;
  padding: 14px;
  border-radius: 10px;
  border: 0.5px solid var(--Stroke, #c3d0e2);
  background: #fff;
`;

export const TraceDetailHeading = styled.div`
  color: var(--Text-Color-800, #2e2e2e);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const TraceDetailValue = styled.div`
  color: var(--Text-Color-850, #222);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
