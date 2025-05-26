import { Col, Collapse, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { cloneDeep } from "lodash";
import { useMemo, useState } from "react";
import { useFetchData } from "../../hooks/useApi";
import config from "../../utils/apiEndpoints";
import {
  ALL_DATA_PAGE_SIZE,
  DEFAULT_PAGE_FROM_ONE,
} from "../../utils/constants";
import Tags from "../Tags";
import {
  CollapseTitle,
  VariableContainer,
  VariablePopoverContainer,
  VariableTitle,
  VariableType,
} from "./style";

const VariablePopOver = ({
  index,
  form,
  inputForm,
  addVariableToText,
  includeCurrentIndexForeach = true,
}) => {
  const [previewText, setPreviewText] = useState("Preview not supported yet");
  const formValues = Form.useWatch([], form);
  const currentInputValues = Form.useWatch(["inputs", "properties"], inputForm);

  const { data: steps, isLoading: stepsLoading } = useFetchData(
    config.tools.allsteps,
  );

  const { data: tools, isLoading: toolsLoading } = useFetchData(
    config.workflow2.publishedList,
    {
      page: DEFAULT_PAGE_FROM_ONE,
      size: ALL_DATA_PAGE_SIZE,
      type: `BASIC_TOOL,ADVANCED_TOOL`,
    },
  );

  const variables = useMemo(() => {
    let newVariables = {};

    const currentIndexHasForeach = formValues?.steps?.[index]?.foreach;

    if (includeCurrentIndexForeach && currentIndexHasForeach)
      newVariables = {
        ...(newVariables || {}),
        foreach: ["foreach.item", "foreach.index"],
      };

    for (let i = 0; i < index; i++) {
      const prevStepType = formValues?.steps?.[i]?.type;
      const prevStepHasForeach = formValues?.steps?.[i]?.foreach;
      const prevStepId = formValues?.steps?.[i]?.inputs?.tool_id;

      const prevStep =
        prevStepType === "tool_as_step_executor"
          ? cloneDeep(
              tools?.workflows?.find((tool) => tool?.id === prevStepId) || {},
            )
          : cloneDeep(steps?.find((step) => step?.type === prevStepType) || {});

      // add logic to add prev steps nexted output as variables
      const prevStepVariable = Object.keys(prevStep?.outputs?.properties || {});

      const stepOutputName = formValues?.steps?.[i]?.name;

      newVariables[stepOutputName] = [stepOutputName];
      if (prevStepVariable?.length > 0)
        newVariables[stepOutputName]?.push(
          ...prevStepVariable?.map?.(
            (currentStepVariable) =>
              `${stepOutputName}${
                !!prevStepHasForeach ? ".foreach[*]" : ""
              }.${currentStepVariable}`,
          ),
        );
    }

    if (inputForm)
      if (currentInputValues?.length > 0)
        newVariables = {
          ...(newVariables || {}),
          Inputs: currentInputValues?.map((inputValue) => inputValue?.name),
        };

    return newVariables;
  }, [
    index,
    inputForm,
    currentInputValues,
    formValues,
    steps,
    tools,
    includeCurrentIndexForeach,
  ]);

  const getVariableItems = (newVariables) => {
    return Object.entries(newVariables || {})?.map((variableDetails) => {
      return {
        key: variableDetails?.[0],
        label: <CollapseTitle>{variableDetails?.[0]}</CollapseTitle>,
        children: (
          <div key={`${variableDetails?.[0]}_values`}>
            {variableDetails?.[1]?.map?.((variable) => (
              <VariableContainer
                key={variable}
                onMouseEnter={() => {
                  setPreviewText(variable);
                }}
                onClick={(e) => {
                  e?.preventDefault();
                  addVariableToText(variable);
                }}
              >
                <VariableTitle>
                  T
                  <Tags
                    tag="text"
                    tagProps={{
                      color: "#032c92",
                      background: "#EFEAFC",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 10px 2px 10px",
                      boxShadow: "none !important",
                    }}
                  />
                </VariableTitle>
                <VariableType>{variable}</VariableType>
              </VariableContainer>
            ))}
          </div>
        ),
      };
    });
  };
  const items = useMemo(() => getVariableItems(variables), [variables]);

  return (
    <VariablePopoverContainer gutter={[12, 12]}>
      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
        <Collapse
          expandIconPosition="end"
          items={items}
          ghost
          defaultActiveKey={[...(items?.map((item) => item?.key) || [])]}
        />
      </Col>
      <Col xl={12} lg={12} md={12} sm={24} xs={24}>
        <TextArea
          autoSize={{ maxRows: 10, minRows: 10 }}
          style={{
            gap: "0px",
            borderRadius: "4px",
            opacity: "0px",
            background: "#F5F8FB",
            border: "0.5px solid #A6BCDA !important",
            cursor: "text",
          }}
          disabled
          value={previewText}
        />
      </Col>
    </VariablePopoverContainer>
  );
};

export default VariablePopOver;
