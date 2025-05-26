import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 80%;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  min-height: 100%;
  max-height: 100%;
  max-width: 80%;
  margin: auto;
`;

export const TracingSection = styled.div`
  visibility: ${(props) => (props?.show ? "visible" : "hidden")};
  background-color: #fff;
  border-radius: 10px;
  width: ${(props) => (props?.show ? "100%" : "0")};
  height: 100%;
  flex-grow: 1;
  max-width: ${(props) => (props?.show ? "912px" : "0")};
  padding: ${(props) => (props?.show ? "12px" : "0")};
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* overflow: auto; */
`;
