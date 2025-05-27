import styled from "styled-components";

export const MessageCard = styled.div`
  width: 100%;
  border-radius: 6px;
  background: ${(props) =>
    props.isagent
      ? "rgb(240 253 244)"
      : props.istool
      ? "rgb(255 251 235)"
      : props?.isblank
      ? "#ffffff"
      : "rgb(239 246 255)"};
`;

export const MessageCardHeader = styled.div`
  padding: 12px;
  width: 100%;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid hsl(0 0% 89.8%);
  display: flex;
  gap: 10px;
`;

export const MessageCardContent = styled.div`
  padding: 12px;
  width: 100%;
  border-radius: 0 0 6px 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ToolCallCard = styled.div`
  width: 100%;
  border-radius: 6px;
  background: rgb(255 251 235);
  border: 1px solid hsl(0 0% 89.8%);
`;

export const ToolCallHeader = styled.div`
  padding: 12px;
  width: 100%;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid hsl(0 0% 89.8%);
  display: flex;
  gap: 10px;
`;

export const ToolCallContent = styled.div`
  padding: 12px;
  width: 100%;
  border-radius: 0 0 6px 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
