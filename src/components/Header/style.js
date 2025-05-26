import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  box-shadow: 0px 2.55px 6.79px 0px rgba(158, 158, 158, 0.15);
  background: #032c92;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  padding: 15px;
  gap: 8px;

  // text styles
  font-size: 16px;
  font-weight: 500;
  line-height: 17.68px;
  text-align: left;
  color: rgba(255, 255, 255, 1);
`;

export const ChatBotNameContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 100%;
  justify-content: center;
  position: absolute;
  //typography
  font-weight: 800;
  font-size: 20px;
`;
