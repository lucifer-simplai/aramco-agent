import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { EditorView } from "@codemirror/view";
import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Flex, Select, Typography } from "antd";
import yaml from "js-yaml";
import { useEffect, useMemo, useState } from "react";
import { useFetchData } from "../../../hooks/useApi";
import config from "../../../utils/apiEndpoints";
import { handleCopy } from "../../../utils/helperFunction";
import MarkdownComponent from "../../Markdown";
import ToolStepInputs from "../../ToolStepInputs";
import ToolStepOutputs from "../../ToolStepOutputs";
import TracingAgentInput from "../../TracingAgentInput";
import TracingAgentOutput from "../../TracingAgentOutput";
import TracingAgentRootInput from "../../TracingAgentRootInput";
import TracingAgentRootOutput from "../../TracingAgentRootOutput";
import { CustomSegmented } from "../../UIComponents/UIComponents.style";
import {
  ActionButtonContainer,
  FormatSelectionContainer,
  TracingCodeMirrorContainer,
  TracingDetailItemContainer,
  TracingDetailItemTitle,
  TracingResultContainer,
} from "./style";

const { Text } = Typography;

// Custom YAML options
const yamlOptions = {
  lineWidth: -1, // Disables folding of long lines
};

const TracingDetailItem = ({
  selectedNodeDetails,
  tracingDetail,
  format,
  setFormat,
  allNodes,
  steps,
  isError = false,
}) => {
  console.log("🚀 ~ selectedNodeDetails:", selectedNodeDetails);
  console.log("🚀 ~ tracingDetail:", tracingDetail);
  const { data: toolDetails, isLoading: toolDetailsLoading } = useFetchData(
    `${config.workflow2.details}/${selectedNodeDetails?.entity_id}`,
    {},
    {},
    {
      enabled:
        selectedNodeDetails?.entity_type === "TOOLS" &&
        !!selectedNodeDetails?.entity_id,
    },
  );

  const [showCopied, setShowCopied] = useState(false);
  const [selectedInputView, setSelectedInputView] = useState("Values");
  const handleFormatUpdate = (value) => {
    setFormat((prevFormat) => (prevFormat === "json" ? "yaml" : "json"));
  };

  const stepConfig = useMemo(() => {
    if (selectedNodeDetails?.entity_type === "TOOL_STEP") {
      return (
        steps?.find((step) => step?.type === selectedNodeDetails?.name) ||
        allNodes?.find((step) => step?.type === selectedNodeDetails?.name) ||
        undefined
      );
    }
    return undefined;
  }, [selectedNodeDetails, allNodes, steps]);
  console.log("🚀 ~ stepConfig ~ stepConfig:", stepConfig);

  const getCodeMirrorValue = useMemo(() => {
    const data = isError
      ? selectedNodeDetails?.data?.error_response || {}
      : selectedInputView === "Values"
      ? selectedNodeDetails?.data?.[tracingDetail?.key] || {}
      : selectedNodeDetails?.data?.[tracingDetail?.variableKey] || {};
    if (format === "json") {
      return JSON.stringify(data, null, 2);
    } else {
      try {
        return yaml.dump(data, yamlOptions);
      } catch (e) {
        return "Error converting to YAML";
      }
    }
  }, [isError, selectedNodeDetails, format, selectedInputView]);

  useEffect(() => {
    setSelectedInputView("Values");
  }, [selectedNodeDetails]);

  const getCodeMirrorExtensions = () => {
    return format === "json" ? [langs.json()] : [langs.yaml()];
  };

  return (
    <TracingDetailItemContainer key={tracingDetail?.key}>
      <Flex justify="space-between" align="center">
        <TracingDetailItemTitle strong>
          {tracingDetail?.title}
        </TracingDetailItemTitle>
        {tracingDetail?.title?.toUpperCase() === "INPUT" &&
          !!selectedNodeDetails?.data?.input &&
          !!selectedNodeDetails?.data?.raw_input && (
            <Flex gap={12} align="center">
              <Text
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  color: "#000000D9",
                }}
              >
                Show variable
              </Text>
              <CustomSegmented
                value={selectedInputView}
                onChange={(val) => {
                  setSelectedInputView(val);
                }}
                options={[
                  {
                    value: "Values",
                    label: "Values",
                  },
                  {
                    value: "Names",
                    label: "Names",
                  },
                ]}
              />
            </Flex>
          )}
      </Flex>

      {selectedNodeDetails?.entity_type === "TOOL_STEP" &&
        tracingDetail?.title?.toUpperCase() === "INPUT" && (
          <ToolStepInputs
            stepConfig={stepConfig}
            selectedNodeDetails={selectedNodeDetails}
            selectedInputView={selectedInputView}
          />
        )}

      {selectedNodeDetails?.entity_type === "TOOL_STEP" &&
        tracingDetail?.title?.toUpperCase() === "OUTPUT" && (
          <ToolStepOutputs
            stepConfig={stepConfig}
            selectedNodeDetails={selectedNodeDetails}
          />
        )}

      {selectedNodeDetails?.entity_type === "AGENT" &&
        selectedNodeDetails?.name === "llm_call" &&
        tracingDetail?.title?.toUpperCase() === "INPUT" && (
          <TracingAgentInput selectedNodeDetails={selectedNodeDetails} />
        )}

      {selectedNodeDetails?.entity_type === "AGENT" &&
        selectedNodeDetails?.name === "llm_call" &&
        tracingDetail?.title?.toUpperCase() === "OUTPUT" && (
          <TracingAgentOutput selectedNodeDetails={selectedNodeDetails} />
        )}

      {selectedNodeDetails?.entity_type === "AGENT" &&
        selectedNodeDetails?.name !== "llm_call" &&
        tracingDetail?.title?.toUpperCase() === "INPUT" && (
          <TracingAgentRootInput selectedNodeDetails={selectedNodeDetails} />
        )}

      {selectedNodeDetails?.entity_type === "AGENT" &&
        selectedNodeDetails?.name !== "llm_call" &&
        tracingDetail?.title?.toUpperCase() === "OUTPUT" && (
          <TracingAgentRootOutput selectedNodeDetails={selectedNodeDetails} />
        )}

      {!(
        (selectedNodeDetails?.entity_type === "TOOL_STEP" && !!stepConfig) ||
        selectedNodeDetails?.entity_type === "AGENT"
      ) && (
        <>
          {(isError &&
            typeof selectedNodeDetails?.data?.error_response === "object") ||
          (!isError &&
            selectedNodeDetails?.data?.[tracingDetail?.type] === "JSON") ? (
            <>
              <TracingCodeMirrorContainer>
                <ReactCodeMirror
                  theme={xcodeDark}
                  value={getCodeMirrorValue}
                  height="200px"
                  extensions={[
                    ...getCodeMirrorExtensions(),
                    EditorView.editable.of(false), // Correctly disable editing with types
                    EditorView.domEventHandlers({
                      paste: (event) => {
                        event.preventDefault(); // Block paste events
                      },
                    }),
                  ]}
                  contentEditable={false}
                  style={{
                    borderRadius: "15px 15px 0px 0px",
                    overflow: "hidden",
                    width: "100%",
                  }}
                />
                <FormatSelectionContainer>
                  <Flex justify="space-between" align="center">
                    <Select
                      style={{ width: 100, height: 40 }}
                      className="custom-select"
                      popupClassName="custom-select-dropdown"
                      placeholder="Select format"
                      optionFilterProp="label"
                      options={[
                        {
                          value: "json",
                          label: "JSON",
                        },
                        {
                          value: "yaml",
                          label: "YAML",
                        },
                      ]}
                      onChange={handleFormatUpdate}
                      value={format}
                    />
                    {showCopied ? (
                      <ActionButtonContainer>
                        <CheckOutlined
                          style={{
                            height: "16px",
                            width: "16px",
                          }}
                        />
                        COPIED
                      </ActionButtonContainer>
                    ) : (
                      <ActionButtonContainer
                        onClick={() => {
                          handleCopy(getCodeMirrorValue);
                          setShowCopied(true);
                          setTimeout(() => {
                            setShowCopied(false);
                          }, 700);
                        }}
                      >
                        <CopyOutlined
                          style={{
                            height: "16px",
                            width: "16px",
                          }}
                        />
                        COPY
                      </ActionButtonContainer>
                    )}
                  </Flex>
                </FormatSelectionContainer>
              </TracingCodeMirrorContainer>
            </>
          ) : (
            <TracingResultContainer>
              <MarkdownComponent
                markdown={
                  isError
                    ? selectedNodeDetails?.data?.error_response
                    : selectedInputView === "Values"
                    ? selectedNodeDetails?.data?.[tracingDetail?.key]
                    : selectedNodeDetails?.data?.[tracingDetail?.variableKey]
                }
              />
            </TracingResultContainer>
          )}
        </>
      )}
    </TracingDetailItemContainer>
  );
};

export default TracingDetailItem;
