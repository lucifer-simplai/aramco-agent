import { Input } from "antd";
import { styled } from "styled-components";

export const ShortTextInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 0.5px solid rgba(166, 188, 218, 0.5);
  background: #fff;
  width: 100%;
`;

export const ShortTextInputArea = styled(Input)`
  flex: 1;
  border-radius: 4px;
  width: 100%;
  border: 0px !important;
  box-shadow: none !important;
  padding: 11px 12px;
`;
