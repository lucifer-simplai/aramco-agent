import { Input } from "antd";
import { styled } from "styled-components";

const { TextArea } = Input;

export const LongTextInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 0.5px solid rgba(166, 188, 218, 0.5);
  background: #fff;
  width: 100%;
`;

export const LongTextInputBottomHint = styled.div`
  width: 100%;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 0px 0px 4px 4px;
  border-top: 0.5px solid rgba(166, 188, 218, 0.5);
  background: #f3f3f3;
`;

export const LongTextInputArea = styled(TextArea)`
  flex: 1;
  border-radius: 4px 4px 0 0;
  width: 100%;
  border: 0px !important;
  box-shadow: none !important;
  padding: 11px 12px;
  margin-right: 50px;
`;
