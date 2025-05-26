import { Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

export const SchemaBuilderTabTitle = styled(Text)`
  color: currentColor !important;
  text-align: center !important;
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 22px !important; /* 137.5% */
`;

export const JsonSchemaTabContainer = styled.div`
  /* padding: 12px; */
`;

export const SchemaBuilderHeading = styled(Text)`
  color: var(--Neutral-10, #262626);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const BuilderCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid var(--Stroke, #c3d0e2);
  background: #fff;
`;

export const EmptySchemaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 4px;
  border: 1px dashed var(--Stroke, #c3d0e2);
  background: #fff;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  width: 100%;
`;

export const TreeContainer = styled.div`
  width: 100%;
  .ant-tree-node-content-wrapper {
    width: 100% !important;
    padding: 0px;
  }
  .ant-tree-title {
    width: 100% !important;
  }
  .ant-tree .ant-tree-treenode {
    width: 100% !important;
  }
  .ant-tree-switcher_close,
  .ant-tree-switcher_open {
    align-self: center !important;
  }
  .ant-motion-collapse-leave-active,
  .ant-motion-collapse-appear-active,
  .ant-motion-collapse-leave,
  .ant-motion-collapse-appear {
    width: 100% !important;
  }

  .ant-tree .ant-tree-node-content-wrapper {
    cursor: unset;
  }

  .ant-tree .ant-tree-switcher-leaf-line:after,
  .ant-tree .ant-tree-treenode-leaf-last .ant-tree-switcher-leaf-line:before {
    height: 30px !important;
  }

  .ant-tree .ant-tree-switcher-leaf-line:before,
  .ant-tree .ant-tree-switcher-leaf-line:after,
  .ant-tree-show-line .ant-tree-indent-unit:before {
    border-color: #000 !important;
  }

  .ant-tree-indent-unit {
    width: 40px; /* Default is around 16px */
  }

  .ant-tree-show-line .ant-tree-indent-unit:before {
    inset-inline-end: 28px !important;
  }
`;

export const TypeSelectorPopover = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .section-title {
    font-weight: 600;
    font-size: 13px;
    color: #1890ff;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 4px;
  }

  .option-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  button {
    border: none;
    background: #fafafa;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background: #e6f7ff;
    }
    &.active {
      background: #1890ff;
      color: white;
    }
  }
`;

export const FieldConfig = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 100%;
`;

export const FieldRowContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 10px;
  background: ${(props) => {
    if (props?.expanded) {
      return "#f9f9ff";
    } else {
      return "transparent";
    }
  }};
  border-radius: 6px;
  .ant-flex {
    width: 100%;
  }
`;

export const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const PopoverButton = styled.div`
  display: flex;
  min-height: 32px;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  background: ${(props) => {
    if (props?.selected) {
      return "var(--New-Main-Color, #032c92)";
    } else {
      return "transparent";
    }
  }};

  /* drop-shadow/button-secondary */
  box-shadow: ${(props) => {
    if (props?.selected) {
      return "0px 2px 0px 0px rgba(0, 0, 0, 0.02)";
    } else {
      return "";
    }
  }};

  /* typography */
  color: ${(props) => {
    if (props?.selected) {
      return "#fff";
    } else {
      return "#2E2E2E";
    }
  }};
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px; /* 157.143% */
  cursor: pointer;

  &:hover {
    background: var(--New-Main-Color, #032c92);
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
    color: #fff;
  }
`;

export const DatatypeText = styled(Text)`
  color: var(--blue-purple-500, #032c92);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-left: 6px;
  cursor: pointer;
`;
