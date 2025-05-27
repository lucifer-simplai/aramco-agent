import {
  Button,
  Col,
  Flex,
  Result,
  Row,
  Skeleton,
  Space,
  Splitter,
  Tree,
  Typography,
} from "antd";
import { isEqual } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFetchData } from "../../../hooks/useApi";
import config, { CHATBOT_BASE_URL } from "../../../utils/apiEndpoints";
import { dateTimeFormatYMDWithMillisecondsWithoutTimeZone } from "../../../utils/constants";
import dayjs from "../../../utils/date";
import CollapseDetailIcon from "../../Icons/CollapseDetailIcon";
import DownArrowIcon from "../../Icons/DownArrowIcon";
import ExpandDetailIcon from "../../Icons/ExpandDetailIcon";
import ZoominIcon from "../../Icons/ZoomIcon";
import ZoomInDisabledIcon from "../../Icons/ZoomInDisabledIcon";
import ZoomOutDisabledIcon from "../../Icons/ZoomOutDisabledIcon";
import ZoomOutIcon from "../../Icons/ZoomOutIcon";
import Waterfall from "../../Waterfall";
import TracingDetailItem from "../TracingDetailItem";
import { WaterfallChartBarColor } from "./constant";
import {
  ActionItemContainer,
  TracingDetailsContainer,
  TracingDrawerContainer,
  TracingTreeContainer,
  TracingTreeHeaderContainer,
  WaterFallViewContainer,
} from "./style";

const { Text } = Typography;

const tracingDetailsMetadata = [
  {
    key: "input",
    type: "input_type",
    title: "Input",
    variableKey: "raw_input",
  },
  {
    key: "output",
    type: "output_type",
    title: "Output",
    variableKey: "output",
  },
  // { key: "error_response", type: "error_type", title: "Exception" },
];

// Flatten nested runs based on expandedMap
const flattenRuns = (runs, expandedMap, depth = 0) => {
  let result = [];
  for (const run of runs) {
    result.push({ ...run, depth });
    if (run.children && expandedMap[run.id]) {
      result.push(...flattenRuns(run.children, expandedMap, depth + 1));
    }
  }
  return result;
};

const TracingDetailDrawer = ({
  title,
  open,
  onClose,
  tracingTreeDetails,
  setTracingTreeDetails,
  selectedNode,
  setSelectedNode,
  loading,
}) => {
  const [format, setFormat] = useState("json");
  const [isWaterfallView, setIsWaterfallView] = useState(false);
  const [expandedMap, setExpandedMap] = useState({});

  const [isExpandedAll, setIsExpandedAll] = useState(true);
  const initialRender = useRef(true); // Flag to track initial render
  const [showTraceIdCopied, setShowTraceIdCopied] = useState(false);
  const lastIsExpandedAll = useRef(isExpandedAll);
  const [splitterResized, setSplitterResized] = useState(false);
  const [zoomFactor, setZoomFactor] = useState(1);
  const [selectedTab, setSelectedTab] = useState("tracing");
  const { data: steps, isLoading: stepsLoading } = useFetchData(
    config.tools.allsteps,
  );

  const { data: allNodes, isLoading: allNodesLoading } = useFetchData(
    config.workflow2.nodeConfig,
  );

  const onSelect = (keys, info) => {
    if (keys?.[0]) setSelectedNode(keys?.[0]);
  };

  const handleNodeSelect = (selectedNodeId) => {
    setSelectedNode(selectedNodeId);
  };

  const getTreeNode = (treeDetails) => {
    const newTreeDetails =
      treeDetails?.map?.((treeDetail) => {
        let imageURL;
        if (treeDetail?.entity_type === "TOOL_STEP") {
          const stepConfig =
            steps?.find((step) => {
              return step?.type == treeDetail?.name;
            }) ||
            allNodes?.find((step) => {
              return step?.type == treeDetail?.name;
            }) ||
            undefined;
          imageURL = stepConfig?.image_url;
        }
        const newTreeDetail = {
          title: (
            <>
              {/* Show error icon when there is some error */}
              {/* {treeDetail?.data?.error_response ? (
              <StopTwoTone twoToneColor="#eb2f2f" style={{ fontSize: 18 }} />
            ) : ( */}
              <img
                src={
                  imageURL
                    ? imageURL
                    : `${CHATBOT_BASE_URL}/${treeDetail?.entity_type?.toUpperCase()}.svg`
                }
                alt="google"
                width={24}
                height={24}
              />
              {/* )} */}
              <Text style={{ padding: "6px" }}>{`${treeDetail?.name} - ${(
                treeDetail?.data?.response_time / 1000
              )?.toFixed?.(2)}s`}</Text>
            </>
          ),
          key: treeDetail?.id,
        };
        if (treeDetail?.children) {
          newTreeDetail.children = getTreeNode(treeDetail.children);
        }

        return newTreeDetail;
      }) || [];

    return [...newTreeDetails];
  };

  const formatTraceData = (traceData) => {
    const startTime = dayjs(
      traceData.execution_time,
      dateTimeFormatYMDWithMillisecondsWithoutTimeZone,
    ).valueOf();

    const calculateRelativeTime = (node, rootStartTime) => {
      const nodeStartTime = dayjs(
        node.execution_time,
        dateTimeFormatYMDWithMillisecondsWithoutTimeZone,
      ).valueOf();
      const relativeStartTime = (nodeStartTime - rootStartTime) / 1000; // convert ms to seconds
      const duration = node.data.response_time / 1000;
      const color =
        WaterfallChartBarColor?.[node?.entity_type?.toUpperCase()]?.color ??
        "#D3C4F7";
      const hoverColor =
        WaterfallChartBarColor?.[node?.entity_type?.toUpperCase()]
          ?.hoverColor ?? "#D3C4F7";

      let imageURL;
      if (node?.entity_type === "TOOL_STEP") {
        const stepConfig =
          steps?.find((step) => {
            return step?.type == node?.name;
          }) ||
          allNodes?.find((step) => {
            return step?.type == node?.name;
          }) ||
          undefined;
        imageURL = stepConfig?.image_url;
      }

      const formattedNode = {
        ...node,
        label: node.name,
        start: relativeStartTime,
        end: relativeStartTime + duration,
        id: node.id,
        children: node.children?.map((child) =>
          calculateRelativeTime(child, rootStartTime),
        ),
        ...WaterfallChartBarColor?.[node?.entity_type?.toUpperCase()],
        ...(imageURL
          ? {
              icon: (
                <image
                  href={imageURL}
                  // fallback for older specs:
                  xlinkHref={imageURL}
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  preserveAspectRatio="xMidYMid meet"
                />
              ),
            }
          : {}),
      };

      return formattedNode;
    };

    return calculateRelativeTime(traceData, startTime);
  };

  const getWaterfallData = (treeDetails) => {
    const newTreeDetails =
      treeDetails?.map?.((treeDetail) => {
        const newTreeDetail = formatTraceData(treeDetail);
        return newTreeDetail;
      }) || [];

    return [...newTreeDetails];
  };

  const getSelectedNodeDetails = (treeDetails) => {
    return treeDetails?.reduce((acc, treeDetail) => {
      if (treeDetail?.id === selectedNode) {
        return treeDetail;
      }
      if (treeDetail?.children) {
        return getSelectedNodeDetails(treeDetail?.children) ?? acc;
      }
      return acc;
    }, undefined);
  };

  const treeData = useMemo(() => {
    return getTreeNode(tracingTreeDetails);
  }, [steps, allNodes, tracingTreeDetails]);

  const waterfallData = useMemo(
    () => getWaterfallData(tracingTreeDetails),
    [tracingTreeDetails],
  );

  const selectedNodeDetails = useMemo(
    () => getSelectedNodeDetails(tracingTreeDetails),
    [tracingTreeDetails, selectedNode],
  );

  // Flatten data according to expandedMap
  const flattened = useMemo(
    () => flattenRuns(waterfallData, expandedMap),
    [expandedMap, waterfallData],
  );

  // Expand/Collapse all
  const handleExpandAll = () => {
    const newMap = {};
    const fillMap = (items) => {
      items.forEach((item) => {
        if (item?.children?.length) {
          newMap[item.id] = true;
        }
        if (item.children) fillMap(item.children);
      });
    };
    fillMap(waterfallData);
    setExpandedMap(newMap);
  };

  useEffect(() => {
    initialRender.current = true;
  }, [tracingTreeDetails]);

  useEffect(() => {
    if (open && waterfallData?.length) {
      const newMap = {};
      const fillMap = (items) => {
        items.forEach((item) => {
          if (item?.children?.length) {
            newMap[item.id] = true;
          }
          if (item.children) fillMap(item.children);
        });
      };
      fillMap(waterfallData);
      setExpandedMap(newMap);
      initialRender.current = false; // After the first run, prevent further updates
    }
  }, [waterfallData, open]);

  const handleCollapseAll = () => setExpandedMap({});

  const toggleItem = (id) => {
    setExpandedMap((prev) => {
      var newMap = {};
      if (prev?.[id]) {
        delete prev?.[id];
        newMap = { ...prev };
      } else {
        newMap = {
          ...prev,
          [id]: true,
        };
      }
      return {
        ...newMap,
      };
    });
  };

  // Use effect to track the last state of isExpandedAll and ensure persistence
  const updateIsExpandedAll = () => {
    const newMap = {};
    const fillMap = (items) => {
      items.forEach((item) => {
        if (item?.children?.length) {
          newMap[item.id] = true;
        }
        if (item.children) fillMap(item.children);
      });
    };
    fillMap(waterfallData);

    if (isEqual(expandedMap, newMap)) {
      setIsExpandedAll(true);
    } else if (
      !expandedMap ||
      Object.keys(expandedMap).length === 0 ||
      !isEqual(expandedMap, newMap)
    ) {
      setIsExpandedAll(false);
    } else {
      setIsExpandedAll(lastIsExpandedAll?.current);
    }
  };

  // Update the state whenever necessary
  useEffect(updateIsExpandedAll, [expandedMap, waterfallData]);

  const treeExpandedKeys = useMemo(() => {
    return Object.keys(expandedMap).filter((key) => {
      return expandedMap[key];
    });
  }, [expandedMap]);

  return (
    <TracingDrawerContainer
      onResizeEnd={() => {
        setSplitterResized((prev) => !prev);
      }}
    >
      <Splitter.Panel defaultSize="40%" min="30%" max="60%">
        <TracingTreeContainer>
          <Skeleton loading={loading} paragraph={{ rows: 5 }}>
            <TracingTreeHeaderContainer>
              <Space>
                <WaterFallViewContainer
                  onClick={() => {
                    setIsWaterfallView((prev) => !prev);
                  }}
                  isWaterfallView={isWaterfallView}
                >
                  <img
                    height={16}
                    width={16}
                    // preview={false}
                    src={`${CHATBOT_BASE_URL}/${
                      !isWaterfallView
                        ? "waterfallIcon"
                        : "waterfallSelectedIcon"
                    }.svg`}
                    alt="waterfall icon image"
                  />
                  Waterfall
                </WaterFallViewContainer>
                <ActionItemContainer
                  onClick={() => {
                    if (isExpandedAll) {
                      handleCollapseAll();
                    } else {
                      handleExpandAll();
                    }
                  }}
                >
                  {isExpandedAll ? (
                    <CollapseDetailIcon />
                  ) : (
                    <ExpandDetailIcon />
                  )}
                </ActionItemContainer>
              </Space>
              {isWaterfallView && (
                <Space>
                  <Button
                    type="text"
                    disabled={zoomFactor === 1}
                    block
                    size="small"
                    onClick={() => setZoomFactor(1)}
                  >
                    Reset
                  </Button>
                  <ActionItemContainer
                    onClick={() => {
                      setZoomFactor((prev) => Math.min(prev + 0.1, 2));
                    }}
                  >
                    {zoomFactor === 2 ? <ZoomInDisabledIcon /> : <ZoominIcon />}
                  </ActionItemContainer>
                  <ActionItemContainer
                    onClick={() => {
                      setZoomFactor((prev) => Math.max(prev - 0.1, 1));
                    }}
                  >
                    {zoomFactor === 1 ? (
                      <ZoomOutDisabledIcon />
                    ) : (
                      <ZoomOutIcon />
                    )}
                  </ActionItemContainer>
                </Space>
              )}
            </TracingTreeHeaderContainer>
            {!isWaterfallView ? (
              <div
                style={{
                  width: "100%",
                  // scrollBehavior: "smooth",
                  position: "relative",
                  flex: 1,
                }}
              >
                <Tree
                  showLine={true}
                  switcherIcon={<DownArrowIcon />}
                  defaultExpandAll={true}
                  onSelect={onSelect}
                  treeData={treeData}
                  selectedKeys={[selectedNode]}
                  blockNode={true}
                  expandedKeys={treeExpandedKeys}
                  onExpand={(expandedKeys) => {
                    const newExpandedMap = {};
                    expandedKeys.forEach((key) => {
                      newExpandedMap[key] = true;
                    });
                    setExpandedMap(newExpandedMap);
                  }}
                />
              </div>
            ) : (
              <Waterfall
                flattened={flattened}
                expandedMap={expandedMap}
                toggleItem={toggleItem}
                zoomFactor={zoomFactor}
                handleNodeSelect={handleNodeSelect}
                selectedNode={selectedNode}
                splitterResized={splitterResized}
              />
            )}
          </Skeleton>
        </TracingTreeContainer>
      </Splitter.Panel>
      <Splitter.Panel>
        <TracingDetailsContainer>
          <Skeleton loading={loading} title={false} paragraph={{ rows: 8 }}>
            <Flex
              vertical
              gap={24}
              style={{ overflow: "auto", height: "100%" }}
            >
              {!selectedNodeDetails ? (
                <Row justify="center">
                  <Col>
                    <Result title="No Details Available" />
                  </Col>
                </Row>
              ) : (
                tracingDetailsMetadata?.map((tracingDetail) => {
                  if (
                    tracingDetail?.key === "output" &&
                    !!selectedNodeDetails?.data?.error_response
                  ) {
                    return (
                      <TracingDetailItem
                        key={tracingDetail?.key}
                        selectedNodeDetails={selectedNodeDetails}
                        tracingDetail={tracingDetail}
                        format={format}
                        setFormat={setFormat}
                        isError={true}
                      />
                    );
                  }
                  return (
                    <TracingDetailItem
                      key={tracingDetail?.key}
                      selectedNodeDetails={selectedNodeDetails}
                      tracingDetail={tracingDetail}
                      format={format}
                      setFormat={setFormat}
                      allNodes={allNodes}
                      steps={steps}
                    />
                  );
                })
              )}
            </Flex>
          </Skeleton>
        </TracingDetailsContainer>
      </Splitter.Panel>
    </TracingDrawerContainer>
  );
};

export default TracingDetailDrawer;
