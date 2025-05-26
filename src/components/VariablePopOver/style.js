import { Row } from "antd";
import { styled } from "styled-components";

export const VariablePopoverContainer = styled(Row)`
  display: flex;
  width: 100%;
  margin: auto;
  word-break: break-all;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 250px;
  min-height: 250px;
  .ant-collapse {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: none;
  }
  .ant-collapse-header {
    background: #f5f8fb;
    padding: 8px, 15px, 8px, 15px;
    gap: 10px;
    border-radius: 4px !important;
    min-height: 40px;
    align-items: center;
  }
  .ant-collapse-content {
    margin: 12px 0px;
  }
  .ant-collapse-content-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0px !important;
  }
`;

export const CollapseTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  line-height: 18.23px;
  text-align: left;
  color: #222222;
`;

export const VariableContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
  gap: 10px;
  border-radius: 4px !important;
  opacity: 0px;
  background: #f9f9ff;
  padding: 8px 16px;
  &:hover {
    background: #f5f8fb;
  }
`;

export const VariableTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const VariableType = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 15.62px;
  text-align: left;
  color: rgba(46, 46, 46, 1);
`;
