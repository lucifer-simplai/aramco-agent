import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import styled from "styled-components";

export const PlaceholderRect = styled.rect``;

export const WaterFallBar = styled(Bar)`
  fill: ${(props) => {
    return props?.fillColor || "#ECF5FF";
  }};
`;

export const WaterfallBarGroup = styled(Group)`
  cursor: pointer;
  &:hover {
    ${WaterFallBar} {
      fill: ${(props) => {
        return props?.hoverFillColor || "#ecf5fff5";
      }};
      stroke: ${(props) => {
        return props?.hoverBorderColor || "3287e7d6";
      }};
    }

    ${PlaceholderRect} {
      fill: rgb(248, 250, 252, 1) !important;
    }
  }
`;

export const ExpandRect = styled.rect`
  cursor: pointer;
  stroke: #c3d0e2;
  fill: #f8fafc;

  &:hover {
    stroke: #8058e5 !important;
    fill: #f7f5ff !important;
  }
`;

export const ExpandGroup = styled(Group)`
  /* transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); */
  &:hover {
    ${ExpandRect} {
      stroke: #8058e5 !important;
      fill: #f7f5ff !important;
    }

    svg {
      stroke: #8058e5 !important;
    }
  }
`;
