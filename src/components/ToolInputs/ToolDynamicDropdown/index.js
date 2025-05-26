import { Avatar, Flex, Form, Popover, Select, Space, Tag } from "antd";
import _authHttp from "../../../services/authHttp";

import { UndoOutlined } from "@ant-design/icons";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useFetchData } from "../../../hooks/useApi";
import config from "../../../utils/apiEndpoints";
import {
  ALL_DATA_PAGE_SIZE,
  DEFAULT_PAGE,
  DEFAULT_PAGE_FROM_ONE,
} from "../../../utils/constants";
import { decrypt } from "../../../utils/encryptDecrypt";
import BracketsIcon from "../../Icons/BracketsIcon";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import VariablePopOver from "../../VariablePopOver";
import {
  ShortTextInputArea,
  ShortTextInputContainer,
} from "../ShortText/style";
import { InputContainer } from "../style";
import { DynamicToolDropdown } from "./style";

const ToolDynamicDropdown = ({
  apiId,
  form,
  inputDetails,
  itemName,
  inputFieldName,
  index,
  inputForm,
  toggleEnabled = true,
}) => {
  const [textField, setTextField] = useState("default");
  const ShortTextRef = useRef();

  const valueIsString = useMemo(
    () =>
      (inputDetails?.type == "array" &&
        inputDetails?.items?.type == "string") ||
      inputDetails?.type === "string",
    [inputDetails],
  );

  const addVariableToText = useCallback(
    (values) => {
      const newValue = form.getFieldValue(inputFieldName);

      const startPos = ShortTextRef?.current?.input?.selectionStart;
      const endPos = ShortTextRef?.current?.input?.selectionEnd;

      form.setFields([
        {
          name: inputFieldName,
          value:
            (newValue?.substring(0, startPos) ?? "") +
            `{{${values}}}` +
            (newValue?.substring(endPos) ?? ""),
        },
      ]);
      ShortTextRef?.current?.setSelectionRange(
        endPos + values?.length + 4,
        endPos + values?.length + 4,
      );

      ShortTextRef?.current.focus();
    },
    [form, inputFieldName],
  );

  const selectedKnowledgebase = Form.useWatch(inputFieldName, form);

  const { data, isLoading, isError } = useFetchData(
    apiId === "kb_id" || apiId === "kb_id_sql"
      ? config.knowledgebase.list
      : apiId === "model_id" ||
        apiId === "translate_model_id" ||
        apiId === "lvm_id" ||
        apiId === "embedding_model"
      ? config.workspace.models
      : apiId === "email_connector_id"
      ? `${config.integrate.connection}/mail/gmail/all-connectors`
      : apiId === "connector_id"
      ? `${config.integrate.connection}/data/big-query/all-connectors`
      : apiId === "postgres_connector_id"
      ? `${config.integrate.connection}/data/rds-postgres/all-connectors`
      : apiId === "sharepoint_connector_id"
      ? `${config.integrate.connection}/data/sharepoint/all-connectors`
      : apiId === "elastic_connector_id"
      ? `${config.integrate.connection}/data/elastic/all-connectors`
      : apiId === "mongodb_connector_id"
      ? `${config.integrate.connection}/data/mongo/all-connectors`
      : apiId === "google_sheet_connector_id"
      ? `${config.integrate.connection}/mail/googleSheet/all-connectors`
      : apiId === "google_doc_connector_id"
      ? `${config.integrate.connection}/mail/googleDoc/all-connectors`
      : apiId === "google_drive_connector_id"
      ? `${config.integrate.connection}/mail/googleDrive/all-connectors`
      : apiId === "google_calendar_connector_id"
      ? `${config.integrate.connection}/mail/googleCalendar/all-connectors`
      : apiId === "linkedin_connector_id"
      ? `${config.integrate.connection}/connector/linkedin/all-connectors`
      : apiId === "tool_id"
      ? config.workflow2.publishedList
      : apiId === "slack_channel_id"
      ? config.integrate.allChannels
      : apiId === "lvm_api_key"
      ? config.serviceProvider.allSources
      : config.knowledgebase.list,
    {
      page: apiId === "tool_id" ? DEFAULT_PAGE_FROM_ONE : DEFAULT_PAGE,
      size: ALL_DATA_PAGE_SIZE,
      ...(apiId === "model_id"
        ? { modelStatus: "DEPLOYED", function: "LLM,LVM" }
        : apiId === "lvm_id"
        ? { function: "LVM", modelStatus: "DEPLOYED" }
        : apiId === "translate_model_id"
        ? { function: "translate", modelStatus: "DEPLOYED" }
        : apiId === "embedding_model"
        ? { function: "Embedding", modelStatus: "DEPLOYED" }
        : apiId === "kb_id_sql"
        ? { kbType: "TABLE_SQL" }
        : apiId === "tool_id"
        ? {
            type: `BASIC_TOOLADVANCED_TOOL`,
          }
        : apiId === "slack_channel_id"
        ? { chatChannelName: "slack" }
        : apiId === "lvm_api_key"
        ? { serviceType: "Models", name: "openai" }
        : { ...(inputDetails?.metadata?.filters || {}) }),
    },
  );

  const getDependenciesData = useCallback(
    async (selectedKb, option) => {
      try {
        if (apiId === "kb_id" && !!inputDetails?.metadata?.dependencies) {
          const knowledgebaseFiles = await _authHttp.get(
            config.knowledgebase.files,
            {
              params: {
                page: DEFAULT_PAGE,
                size: 2,
                knowledgebase_id: selectedKb,
              },
            },
          );
          if (knowledgebaseFiles?.status === 200) {
            inputDetails?.metadata?.dependencies?.forEach?.(
              async (dependency) => {
                if (
                  dependency !== "data_to_insert" &&
                  dependency !== "vector_db" &&
                  dependency !== "collection_name" &&
                  dependency !== "embed_model_name" &&
                  dependency !== "embedding_source" &&
                  dependency !== "kb_type"
                ) {
                  const dependencyValue =
                    knowledgebaseFiles?.data?.document_details?.[0]?.[
                      dependency
                    ];

                  form.setFields([
                    {
                      name: ["steps", index, "inputs", dependency],
                      value: dependencyValue,
                    },
                  ]);
                } else if (dependency == "data_to_insert") {
                  try {
                    const parsedFileContent = await _authHttp.get(
                      config.rag.csvParser,
                      {
                        params: {
                          s3url:
                            knowledgebaseFiles?.data?.document_details?.[0]
                              ?.s3_url,
                          num_rows: 1,
                        },
                      },
                    );

                    form.setFields([
                      {
                        name: ["steps", index, "inputs", dependency],
                        value: JSON.stringify(
                          parsedFileContent?.data?.[0] || {},
                          null,
                          2,
                        ),
                      },
                    ]);
                  } catch (error) {
                    form.setFields([
                      {
                        name: ["steps", index, "inputs", dependency],
                        value: JSON.stringify({}, null, 2),
                      },
                    ]);
                  }
                } else if (dependency == "kb_type") {
                  form.setFields([
                    {
                      name: ["steps", index, "inputs", dependency],
                      value: knowledgebaseFiles?.data?.knowledge_base?.kb_type,
                    },
                  ]);
                } else if (dependency == "vector_db") {
                  form.setFields([
                    {
                      name: ["steps", index, "inputs", dependency],
                      value:
                        knowledgebaseFiles?.data?.knowledge_base?.vector_db,
                    },
                  ]);
                } else if (dependency == "collection_name") {
                  form.setFields([
                    {
                      name: ["steps", index, "inputs", dependency],
                      value:
                        knowledgebaseFiles?.data?.knowledge_base
                          ?.vector_db_name,
                    },
                  ]);
                } else if (
                  dependency == "embed_model_name" ||
                  dependency == "embedding_source"
                ) {
                  const dependencyValue =
                    knowledgebaseFiles?.data?.knowledge_base?.[dependency];

                  form.setFields([
                    {
                      name: ["steps", index, "inputs", dependency],
                      value: dependencyValue,
                    },
                  ]);
                }
              },
            );
          }
        }
        if (
          apiId === "embedding_model" &&
          !!inputDetails?.metadata?.dependencies
        ) {
          inputDetails?.metadata?.dependencies?.forEach?.(
            async (dependency) => {
              if (dependency === "source") {
                form.setFields([
                  {
                    name: ["steps", index, "inputs", dependency],
                    value: option?.source,
                  },
                ]);
              }
            },
          );
        }
      } catch (error) {
        inputDetails?.metadata?.dependencies?.forEach?.(async (dependency) => {
          form.setFields([
            {
              name: ["steps", index, "inputs", dependency],
              value: undefined,
            },
          ]);
        });
      }
    },
    [apiId, inputDetails, index, form],
  );

  const showToggle = useMemo(() => {
    return (
      !(apiId === "kb_id" && !!inputDetails?.metadata?.dependencies) &&
      !(apiId === "embedding_model" && !!inputDetails?.metadata?.dependencies)
    );
  }, [apiId, inputDetails]);

  const validateSelect = useMemo(() => {
    const optionsHasValue =
      apiId === "email_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.mail_connector_id}`
                    : option?.mail_connector_id,
                )
              : valueIsString
              ? `${option?.mail_connector_id}` == selectedKnowledgebase
              : option?.mail_connector_id == selectedKnowledgebase,
          )
        : apiId === "connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.bigquery_connector_id}`
                    : option?.bigquery_connector_id,
                )
              : valueIsString
              ? `${option?.bigquery_connector_id}` == selectedKnowledgebase
              : option?.bigquery_connector_id == selectedKnowledgebase,
          )
        : apiId === "slack_channel_id"
        ? data?.result?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.chat_channel_id}` == selectedKnowledgebase
                    : option?.chat_channel_id == selectedKnowledgebase,
                )
              : valueIsString
              ? `${option?.chat_channel_id}` == selectedKnowledgebase
              : option?.chat_channel_id == selectedKnowledgebase,
          )
        : apiId === "sharepoint_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.bigquery_connector_id}`
                    : option?.bigquery_connector_id,
                )
              : valueIsString
              ? `${option?.bigquery_connector_id}` == selectedKnowledgebase
              : option?.bigquery_connector_id == selectedKnowledgebase,
          )
        : apiId === "postgres_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.bigquery_connector_id}`
                    : option?.bigquery_connector_id,
                )
              : valueIsString
              ? `${option?.bigquery_connector_id}` == selectedKnowledgebase
              : option?.bigquery_connector_id == selectedKnowledgebase,
          )
        : apiId === "elastic_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.bigquery_connector_id}`
                    : option?.bigquery_connector_id,
                )
              : valueIsString
              ? `${option?.bigquery_connector_id}` == selectedKnowledgebase
              : option?.bigquery_connector_id == selectedKnowledgebase,
          )
        : apiId === "mongodb_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.bigquery_connector_id}`
                    : option?.bigquery_connector_id,
                )
              : valueIsString
              ? `${option?.bigquery_connector_id}` == selectedKnowledgebase
              : option?.bigquery_connector_id == selectedKnowledgebase,
          )
        : apiId === "google_sheet_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.mail_connector_id}`
                    : option?.mail_connector_id,
                )
              : valueIsString
              ? `${option?.mail_connector_id}` == selectedKnowledgebase
              : option?.mail_connector_id == selectedKnowledgebase,
          )
        : apiId === "google_doc_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.mail_connector_id}`
                    : option?.mail_connector_id,
                )
              : valueIsString
              ? `${option?.mail_connector_id}` == selectedKnowledgebase
              : option?.mail_connector_id == selectedKnowledgebase,
          )
        : apiId === "google_drive_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.mail_connector_id}`
                    : option?.mail_connector_id,
                )
              : valueIsString
              ? `${option?.mail_connector_id}` == selectedKnowledgebase
              : option?.mail_connector_id == selectedKnowledgebase,
          )
        : apiId === "google_calendar_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.mail_connector_id}`
                    : option?.mail_connector_id,
                )
              : valueIsString
              ? `${option?.mail_connector_id}` == selectedKnowledgebase
              : option?.mail_connector_id == selectedKnowledgebase,
          )
        : apiId === "linkedin_connector_id"
        ? data?.content?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${option?.connector_id}`
                    : option?.connector_id,
                )
              : valueIsString
              ? `${option?.connector_id}` == selectedKnowledgebase
              : option?.connector_id == selectedKnowledgebase,
          )
        : apiId === "tool_id"
        ? data?.workflows?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString ? `${option?.id}` : option?.id,
                )
              : valueIsString
              ? `${option?.id}` == selectedKnowledgebase
              : option?.id == selectedKnowledgebase,
          )
        : apiId === "embedding_model"
        ? data?.result?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString ? `${option?.name}` : option?.name,
                )
              : valueIsString
              ? `${option?.name}` == selectedKnowledgebase
              : option?.name == selectedKnowledgebase,
          )
        : apiId === "lvm_api_key"
        ? data?.result?.["Models"]?.[0]?.api_keys?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString
                    ? `${decrypt(option?.key)}`
                    : decrypt(option?.key),
                )
              : valueIsString
              ? `${decrypt(option?.key)}` == selectedKnowledgebase
              : decrypt(option?.key) == selectedKnowledgebase,
          )
        : data?.result?.some((option) =>
            inputDetails?.metadata?.multiple
              ? selectedKnowledgebase?.includes(
                  valueIsString ? `${option?.id}` : option?.id,
                )
              : valueIsString
              ? `${option?.id}` == selectedKnowledgebase
              : option?.id == selectedKnowledgebase,
          );

    if (!optionsHasValue && !!selectedKnowledgebase) {
      return {
        validateStatus: "error",
        help: "This value is invalid",
      };
    }
    return {};
  }, [apiId, selectedKnowledgebase, data, inputDetails, valueIsString]);

  return (
    <InputContainer>
      <Flex justify="space-between" align="center" style={{ width: "100%" }}>
        <Flex align="center" gap="12px">
          <Space>
            <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
            <InfoIconTooltip title={inputDetails?.description} />
            {inputDetails?.required && <Tag color="red">Required</Tag>}
          </Space>
        </Flex>
        {toggleEnabled &&
          showToggle &&
          (textField === "default" ? (
            <Avatar
              size={24}
              shape="square"
              style={{ background: "#F8F2FF", cursor: "pointer" }}
              onClick={() => {
                setTextField("variable");
              }}
              icon={<BracketsIcon />}
            />
          ) : (
            <Avatar
              size={24}
              shape="square"
              style={{ background: "#F8F2FF", cursor: "pointer" }}
              onClick={() => {
                setTextField("default");
              }}
              icon={<UndoOutlined />}
            />
          ))}
      </Flex>
      <DynamicToolDropdown>
        {textField === "variable" ? (
          <Popover
            getPopupContainer={(node) => node.parentNode}
            content={
              <VariablePopOver
                form={form}
                inputForm={inputForm}
                index={index}
                addVariableToText={addVariableToText}
              />
            }
            overlayStyle={{
              minWidth: "100%",
              wordBreak: "break-all",
            }}
            overlayInnerStyle={{
              width: "100%",
            }}
            trigger={"click"}
            placement="bottom"
            arrow={false}
            autoAdjustOverflow={false}
          >
            <ShortTextInputContainer>
              <Form.Item name={itemName} noStyle>
                <ShortTextInputArea
                  onFocus={() => ShortTextRef?.current.focus()}
                  onChange={() => ShortTextRef?.current.focus()}
                  ref={ShortTextRef}
                  placeholder="Type your message here..."
                  style={{ resize: "none" }}
                />
              </Form.Item>
            </ShortTextInputContainer>
          </Popover>
        ) : (
          textField === "default" && (
            <Form.Item name={itemName} noStyle {...validateSelect}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={
                  apiId === "email_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.email,
                        value: valueIsString
                          ? `${dynamicData?.mail_connector_id}`
                          : dynamicData?.mail_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.connector_name,
                        value: valueIsString
                          ? `${dynamicData?.bigquery_connector_id}`
                          : dynamicData?.bigquery_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "slack_channel_id"
                    ? data?.result
                        ?.filter(
                          (dynamicData) => !!dynamicData?.chat_channel_id,
                        )
                        ?.map((dynamicData) => ({
                          label: dynamicData?.bot_name,
                          value: valueIsString
                            ? `${dynamicData?.chat_channel_id}`
                            : dynamicData?.chat_channel_id,
                          ...dynamicData,
                        })) || []
                    : apiId === "sharepoint_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.connector_name,
                        value: valueIsString
                          ? `${dynamicData?.bigquery_connector_id}`
                          : dynamicData?.bigquery_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "postgres_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.connector_name,
                        value: valueIsString
                          ? `${dynamicData?.bigquery_connector_id}`
                          : dynamicData?.bigquery_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "elastic_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.connector_name,
                        value: valueIsString
                          ? `${dynamicData?.bigquery_connector_id}`
                          : dynamicData?.bigquery_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "mongodb_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.connector_name,
                        value: valueIsString
                          ? `${dynamicData?.bigquery_connector_id}`
                          : dynamicData?.bigquery_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "google_sheet_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.email,
                        value: valueIsString
                          ? `${dynamicData?.mail_connector_id}`
                          : dynamicData?.mail_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "google_doc_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.email,
                        value: valueIsString
                          ? `${dynamicData?.mail_connector_id}`
                          : dynamicData?.mail_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "google_drive_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.email,
                        value: valueIsString
                          ? `${dynamicData?.mail_connector_id}`
                          : dynamicData?.mail_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "google_calendar_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.email,
                        value: valueIsString
                          ? `${dynamicData?.mail_connector_id}`
                          : dynamicData?.mail_connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "linkedin_connector_id"
                    ? data?.content?.map((dynamicData) => ({
                        label: dynamicData?.connector_name,
                        value: valueIsString
                          ? `${dynamicData?.connector_id}`
                          : dynamicData?.connector_id,
                        ...dynamicData,
                      })) || []
                    : apiId === "tool_id"
                    ? data?.workflows?.map((dynamicData) => ({
                        label: dynamicData?.name,
                        value: valueIsString
                          ? `${dynamicData?.id}`
                          : dynamicData?.id,
                        ...dynamicData,
                      })) || []
                    : apiId === "embedding_model"
                    ? data?.result?.map((dynamicData) => ({
                        label: dynamicData?.name,
                        value: valueIsString
                          ? `${dynamicData?.name}`
                          : dynamicData?.name,
                        ...dynamicData,
                      })) || []
                    : apiId === "lvm_api_key"
                    ? data?.result?.["Models"]?.[0]?.api_keys?.map?.(
                        (dynamicData) => ({
                          label: `***********${decrypt(dynamicData?.key)?.slice(
                            -4,
                          )}`,
                          value: valueIsString
                            ? `${decrypt(dynamicData?.key)}`
                            : decrypt(dynamicData?.key),
                          ...dynamicData,
                        }),
                      ) || []
                    : data?.result?.map((dynamicData) => ({
                        label: dynamicData?.name,
                        value: valueIsString
                          ? `${dynamicData?.id}`
                          : dynamicData?.id,
                        ...dynamicData,
                      })) || []
                }
                onChange={async (value, option) => {
                  getDependenciesData(value, option);
                }}
                loading={isLoading}
                mode={inputDetails?.metadata?.multiple ? "multiple" : undefined}
                maxTagCount="responsive"
                placeholder={`Select ${inputDetails?.title}`}
              />
            </Form.Item>
          )
        )}
      </DynamicToolDropdown>
    </InputContainer>
  );
};

export default memo(ToolDynamicDropdown);
