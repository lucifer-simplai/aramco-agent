import { Flex, Form, Input } from "antd";
import { memo, useEffect } from "react";
import { noStyleFormItem } from "../../utils/constants";
import CodeInput from "../ToolInputs/CodeInput";
import DatePickerInput from "../ToolInputs/DatePickerInput";
import KeyValueInput from "../ToolInputs/KeyValueInput";
import LlmSchemaBuilder from "../ToolInputs/LlmSchemaBuilder";
import LongText from "../ToolInputs/LongText";
import ShortText from "../ToolInputs/ShortText";
import SwitchInput from "../ToolInputs/SwitchInput";
import ToolDynamicDropdown from "../ToolInputs/ToolDynamicDropdown";
import ToolNumberInput from "../ToolInputs/ToolNumberInput";
import ToolSelectInput from "../ToolInputs/ToolSelectInput";
import { ArrayInputCard } from "../UIComponents/UIComponents.style";
import { ToolStepInputsContainer } from "./style";

const ToolStepInputs = ({
  stepConfig,
  selectedNodeDetails,
  selectedInputView,
}) => {
  console.log("🚀 ~ ToolStepInputs ~ stepConfig:", stepConfig);
  console.log(
    "🚀 ~ ToolStepInputs ~ selectedNodeDetails:",
    selectedNodeDetails,
  );
  const [dummyForm] = Form.useForm();

  const inputFields = Object.entries(
    stepConfig?.inputs?.properties || {},
  )?.map?.((inputProperties) => ({
    ...inputProperties?.[1],
    name: inputProperties?.[0],
  }));

  useEffect(() => {
    if (selectedNodeDetails) {
      dummyForm.setFieldsValue(
        selectedInputView === "Values"
          ? selectedNodeDetails?.data?.input
          : selectedNodeDetails?.data?.raw_input,
      );
    }
  }, [selectedNodeDetails, selectedInputView]);

  const getToolStepsInput = (type, inputDetails, stepFieldVariables) => {
    switch (type) {
      case "boolean":
        return (
          <SwitchInput
            key={inputDetails?.name}
            inputDetails={inputDetails}
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
      case "code":
      case "query_sql":
        return (
          <CodeInput
            disabled={true}
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
          />
        );
      case "response_format":
        return (
          <LlmSchemaBuilder
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
      case "textArea":
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
      case "text":
        return (
          <ShortText
            key={inputDetails?.name}
            form={dummyForm}
            disabled={true}
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
            index={0}
          />
        );
      case "number":
        return (
          <ToolNumberInput
            toggleEnabled={false}
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
      case "kb_id":
      case "model_id":
      case "lvm_id":
      case "translate_model_id":
      case "email_connector_id":
      case "lvm_api_key":
      case "connector_id":
      case "slack_channel_id":
      case "sharepoint_connector_id":
      case "kb_id_sql":
      case "embedding_model":
      case "postgres_connector_id":
      case "elastic_connector_id":
      case "mongodb_connector_id":
      case "google_sheet_connector_id":
      case "google_doc_connector_id":
      case "google_drive_connector_id":
      case "google_calendar_connector_id":
      case "linkedin_connector_id":
        return (
          <ToolDynamicDropdown
            toggleEnabled={false}
            key={inputDetails?.name}
            apiId={type}
            form={dummyForm}
            index={0}
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
      case "http_headers":
        return (
          <KeyValueInput
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
      case "select":
        return (
          <ToolSelectInput
            toggleEnabled={false}
            key={inputDetails?.name}
            inputDetails={inputDetails}
            options={(inputDetails?.enum || [])?.map((option) => ({
              label: option,
              value: option,
            }))}
            form={dummyForm}
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
      case "select_one_of":
        return (
          <ToolSelectInput
            form={dummyForm}
            toggleEnabled={false}
            key={inputDetails?.name}
            inputDetails={inputDetails}
            options={(inputDetails?.oneOf || [])?.map((option) => ({
              label: option?.title,
              value: option?.const,
              description: option?.description,
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
      case "array":
        const inputSubFields = Object.entries(
          inputDetails?.items?.properties || {},
        )?.map?.((inputProperties) => ({
          ...inputProperties?.[1],
          name: inputProperties?.[0],
        }));

        return (
          <Form.List name={inputDetails?.name} key={inputDetails?.name}>
            {(fields, { add, remove }) => (
              <Flex vertical gap={24}>
                {fields.map(
                  ({ key: fieldKey, name, ...restField }, fieldIndex) => (
                    <ArrayInputCard>
                      {inputDetails.items.type === "object" ? (
                        inputSubFields?.map?.((subInput) =>
                          getToolStepsInput(
                            subInput?.metadata?.content_type,
                            {
                              ...subInput,
                              name:
                                subInput?.metadata?.content_type ===
                                "http_headers"
                                  ? [name, "object_key_value", subInput?.name]
                                  : [name, subInput?.name],
                              overrideKey: true,
                              parentName: inputDetails?.name,
                            },
                            {},
                          ),
                        )
                      ) : (
                        <Flex gap={24}>
                          <Form.Item
                            style={{ ...noStyleFormItem, flex: 1 }}
                            {...restField}
                            name={name}
                            key={fieldKey}
                            tooltip={inputDetails.description}
                          >
                            <Input placeholder={inputDetails.title} />
                          </Form.Item>
                        </Flex>
                      )}
                    </ArrayInputCard>
                  ),
                )}
              </Flex>
            )}
          </Form.List>
        );
      case "date_picker":
        return (
          <DatePickerInput
            key={inputDetails?.name}
            inputDetails={inputDetails}
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
      default:
    }
  };

  return (
    <Form form={dummyForm} disabled={true}>
      <ToolStepInputsContainer nopadding={true}>
        {inputFields?.map?.((input) =>
          getToolStepsInput(input?.metadata?.content_type, input, {}),
        )}
      </ToolStepInputsContainer>
    </Form>
  );
};

export default memo(ToolStepInputs);
