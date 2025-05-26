import { styled } from "styled-components";

export const ToolLoadingContainer = styled.div`
  display: flex;
  max-height: 100%;
  max-width: 100%;
  min-height: 100%;
  min-width: 100%;
  justify-content: center;
  align-items: center;
`;

export const EbmedChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* min-height: 480px; */
  height: 100vh;
  justify-content: space-between;
  overflow: auto;
  max-height: 100%;
  max-width: 100%;
  border: 0.68px solid var(--Text-Color-150, rgba(213, 213, 213, 1));
  position: relative;
  background: rgb(241, 243, 244);
`;

export const ChatBotContainer = styled.div`
  display: flex;
  /* position: absolute; */
  /* top: 60px; */
  margin: 80px 20px 0px 20px;
  min-width: calc(100% - 40px);
  min-height: calc(100% - 100px);
  max-height: calc(100% - 100px);
`;
