import { Col, Form, Result, Row } from "antd";
import { useEffect } from "react";
import LongText from "../ToolInputs/LongText";
import ShortText from "../ToolInputs/ShortText";
import ToolJson from "../ToolInputs/ToolJson";
import ToolNumberInput from "../ToolInputs/ToolNumberInput";
import ToolSelectInput from "../ToolInputs/ToolSelectInput";
import { ToolStepInputsContainer } from "../ToolStepInputs/style";
import { InputOptions } from "./constant";

const ToolAsStepInputs = ({ toolDetails, selectedNodeDetails }) => {
  console.log("🚀 ~ ToolAsStepInputs ~ toolDetails:", toolDetails);
  const [dummyForm] = Form.useForm();

  useEffect(() => {
    if (selectedNodeDetails) {
      dummyForm.setFieldsValue(selectedNodeDetails?.data?.input);
    }
  }, [selectedNodeDetails]);

  const inputFields = Object.entries(
    toolDetails?.inputs?.properties || {},
  )?.map?.((inputProperties) => ({
    ...inputProperties?.[1],
    name: inputProperties?.[0],
  }));
  console.log("🚀 ~ ToolAsStepInputs ~ inputFields:", inputFields);

  const getToolStepsInput = (type, inputDetails, stepFieldVariables) => {
    switch (type) {
      case InputOptions.text:
      case InputOptions.file:
        return (
          <ShortText
            key={inputDetails?.name}
            inputDetails={inputDetails}
            form={dummyForm}
            itemName={inputDetails?.name}
            inputFieldName={
              inputDetails?.overrideKey
                ? [
                    ...(Array.isArray(inputDetails?.name)
                      ? inputDetails?.name
                      : [inputDetails?.name]),
                  ]
                : inputDetails?.name
            }
          />
        );
      case InputOptions.textArea:
        return (
          <LongText
            key={inputDetails?.name}
            form={dummyForm}
            inputDetails={inputDetails}
            itemName={inputDetails?.name}
            inputFieldName={
              inputDetails?.overrideKey
                ? [
                    inputDetails?.parentName,
                    ...(Array.isArray(inputDetails?.name)
                      ? inputDetails?.name
                      : [inputDetails?.name]),
                  ]
                : [inputDetails?.name]
            }
            index={0}
          />
        );
      case InputOptions.number:
        return (
          <ToolNumberInput
            key={inputDetails?.name}
            inputDetails={inputDetails}
            itemName={inputDetails?.name}
            inputFieldName={
              inputDetails?.overrideKey
                ? [
                    inputDetails?.parentName,
                    ...(Array.isArray(inputDetails?.name)
                      ? inputDetails?.name
                      : [inputDetails?.name]),
                  ]
                : inputDetails?.name
            }
            form={dummyForm}
            index={0}
          />
        );
      case InputOptions.select:
        return (
          <ToolSelectInput
            key={inputDetails?.name}
            form={dummyForm}
            inputDetails={inputDetails}
            options={(inputDetails?.enum || [])?.map((option) => ({
              label: option,
              value: option,
            }))}
            itemName={inputDetails?.name}
            inputFieldName={
              inputDetails?.overrideKey
                ? [
                    inputDetails?.parentName,
                    ...(Array.isArray(inputDetails?.name)
                      ? inputDetails?.name
                      : [inputDetails?.name]),
                  ]
                : inputDetails?.name
            }
            index={0}
          />
        );
      case InputOptions.object:
        return (
          <ToolJson
            key={inputDetails?.name}
            form={dummyForm}
            inputDetails={inputDetails}
            itemName={inputDetails?.name}
            inputFieldName={
              inputDetails?.overrideKey
                ? [
                    inputDetails?.parentName,
                    ...(Array.isArray(inputDetails?.name)
                      ? inputDetails?.name
                      : [inputDetails?.name]),
                  ]
                : inputDetails?.name
            }
          />
        );
      default:
        return (
          <LongText
            key={inputDetails?.name}
            form={dummyForm}
            inputDetails={inputDetails}
            itemName={inputDetails?.name}
            inputFieldName={
              inputDetails?.overrideKey
                ? [
                    inputDetails?.parentName,
                    ...(Array.isArray(inputDetails?.name)
                      ? inputDetails?.name
                      : [inputDetails?.name]),
                  ]
                : [inputDetails?.name]
            }
            index={0}
          />
        );
    }
  };

  return (
    <Form form={dummyForm} disabled={true}>
      <ToolStepInputsContainer nopadding={true}>
        {inputFields?.length > 0 ? (
          inputFields?.map?.((input) =>
            getToolStepsInput(input?.metadata?.content_type, input, {}),
          )
        ) : (
          <Row justify="center">
            <Col>
              <Result title="No Details Available" />
            </Col>
          </Row>
        )}
      </ToolStepInputsContainer>
    </Form>
  );
};

export default ToolAsStepInputs;
