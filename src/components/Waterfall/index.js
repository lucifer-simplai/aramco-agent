import { Axis } from "@visx/axis";
import { GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ExpandGroup,
  ExpandRect,
  PlaceholderRect,
  WaterFallBar,
  WaterfallBarGroup,
} from "./style";

const margin = { top: 30, right: 10, bottom: 20, left: 50 };
const rowHeight = 44;
const barHeight = 32;

const Waterfall = ({
  flattened,
  expandedMap,
  toggleItem,
  zoomFactor = 1,
  handleNodeSelect,
  selectedNode,
  splitterResized,
}) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(800 * zoomFactor);
  const [containerHeight, setContainerHeight] = useState(600);
  const [scrollX, setScrollX] = useState(0); // Track the scroll position

  // Effect to handle dynamic resizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(Math.max(containerRef.current.offsetWidth, 400));
        setContainerHeight(
          Math.max(rowHeight + 50, flattened.length * rowHeight + 50),
        ); // Dynamic height
      }
    };

    updateSize();

    // Listen for scroll events and update the scrollX state
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollX(containerRef.current.scrollLeft); // Update scrollX on scroll
      }
    };

    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [flattened, zoomFactor, splitterResized]);

  // Find max time dynamically
  const maxTime = Math.max(...flattened.map((d) => d.end));

  // Always 8 grid lines with dynamic step size
  const numGridLines = 8 * zoomFactor;
  const stepSize = maxTime / numGridLines;

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, maxTime],
        range: [0, containerWidth * zoomFactor - margin.left - margin.right],
      }),
    [maxTime, containerWidth, zoomFactor],
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        overflowX: "auto",
        overflowY: "scroll",
        scrollBehavior: "smooth",
        position: "relative",
        flex: 1,
      }}
    >
      {/* Sticky header with expand/collapse + top axis */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#ffffff",
          width: "max-content",
        }}
      >
        <svg width={containerWidth * zoomFactor} height={30}>
          <Group top={30} left={30}>
            <Axis
              orientation="top"
              scale={xScale}
              stroke="rgba(204, 211, 222, 0.5)"
              tickStroke="rgba(204, 211, 222, 0.5)"
              tickLabelProps={() => ({
                fill: "rgba(89, 89, 89, 1)",
                fontSize: 12,
                lineHeight: 15.62,
                textAnchor: "middle",
              })}
              tickFormat={(value) => `${value}s`}
              numTicks={numGridLines}
            />
          </Group>
        </svg>
      </div>
      <svg width={containerWidth * zoomFactor} height={containerHeight}>
        <Group left={30}>
          {/* Dynamic grid lines */}
          <GridColumns
            scale={xScale}
            height={containerHeight - margin.top - margin.bottom}
            stroke="rgba(204, 211, 222, 0.5)"
            numTicks={numGridLines}
          />

          {flattened.map((run, i) => {
            console.log("🚀 ~ {flattened.map ~ run:", run);
            const barX = xScale(run.start);
            const barWidth = xScale(run.end) - xScale(run.start);
            const yPos = i * rowHeight;
            const barY = yPos + (rowHeight - barHeight) / 2;
            const hasChildren = run.children && run.children.length > 0;
            const isExpanded = expandedMap[run.id];

            const caretSize = 20;
            const caretX =
              containerWidth * zoomFactor - margin.left - caretSize - 2;

            // Adjust the transformX to scrollX value dynamically
            const transformX = scrollX - 25;

            return (
              <WaterfallBarGroup
                fillColor={run.color}
                hoverFillColor={run.hoverColor}
                hoverBorderColor={run.hoverBorderColor}
                key={i}
                onClick={() => {
                  handleNodeSelect(run?.id);
                }}
              >
                <PlaceholderRect
                  x={0}
                  y={yPos}
                  width={
                    containerWidth * zoomFactor - margin.left - margin.right
                  }
                  height={rowHeight}
                  fill={selectedNode === run?.id ? "#ece9f7" : "transparent"}
                />

                <WaterFallBar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={run.color}
                  rx={4}
                  fillColor={run.color}
                  hoverFillColor={run.hoverColor}
                  hoverBorderColor={run.hoverBorderColor}
                  className="visx-bar transition-[fill] duration-300 ease-in-out"
                />

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  x={barX + 4}
                  y={barY + 6}
                >
                  {run.icon}
                </svg>

                <Text
                  x={barX + 28}
                  y={barY + 15}
                  fill="#171717"
                  fontSize={12}
                  verticalAnchor="middle"
                >
                  {`${run.label} - ${(run.end - run.start).toFixed(2)}s`}
                </Text>

                {hasChildren && (
                  <ExpandGroup
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(run.id);
                    }}
                    style={{
                      transform: `translate(${transformX}px, ${
                        yPos + (rowHeight - caretSize) / 2
                      }px)`,
                    }}
                  >
                    <ExpandRect height={20} width={20} rx="4" />
                    {isExpanded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={caretSize}
                        height={caretSize}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2px"
                          d="m6 9 6 6 6-6"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={caretSize}
                        height={caretSize}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2px"
                          d="m9 18 6-6-6-6"
                        ></path>
                      </svg>
                    )}
                  </ExpandGroup>
                )}
              </WaterfallBarGroup>
            );
          })}
        </Group>
      </svg>
    </div>
  );
};

export default Waterfall;
