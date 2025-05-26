import {
  CaretDownOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Popover, Switch, Tag, Typography } from "antd";
import { memo, useCallback, useState } from "react";
import CheckIcon from "../../Icons/CheckIcon";
import {
  DatatypeText,
  FieldConfig,
  FieldRowContainer,
  LeftSide,
  PopoverButton,
  RightSide,
  TypeSelectorPopover,
} from "./style";

const SchemaField = ({
  node,
  parentType,
  optionIndex,
  onChangeName,
  onChangeType,
  onChangeArrayItemType,
  onAddChild,
  onDeleteNode,
  onChangeDescription,
  onChangeEnum,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [enableEnum, setEnableEnum] = useState(!!node.enum?.length);

  const baseTypes = ["string", "number", "boolean", "object", "array", "anyOf"];

  const handleModelTypeChange = useCallback(
    (type) => {
      onChangeType(node.id, type);
    },
    [onChangeType, node],
  );

  const handleItemTypeChange = useCallback(
    (itemType) => {
      if (node.type === "array" && node.children?.[0]) {
        onChangeArrayItemType(node.children[0].id, itemType);
      }
    },
    [onChangeArrayItemType, node],
  );

  const renderPopoverContent = useCallback(
    () => (
      <TypeSelectorPopover>
        {parentType !== "array" && (
          <Flex vertical gap={12}>
            <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
              Model Type
            </Typography.Text>
            <Flex gap={4} wrap flex={1}>
              {baseTypes.map((type) => (
                <PopoverButton
                  key={type}
                  onClick={() => {
                    setEnableEnum(false);
                    handleModelTypeChange(type);
                  }}
                  selected={node.type === type}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </PopoverButton>
              ))}
            </Flex>
          </Flex>
        )}

        {(node.type === "array" || parentType === "array") && (
          <Flex vertical gap={12}>
            <Typography.Text style={{ fontSize: 16, fontWeight: 600 }}>
              Array Items Type
            </Typography.Text>
            <Flex gap={4} wrap flex={1}>
              {baseTypes
                .filter((t) => t !== "array")
                .map((type) => (
                  <PopoverButton
                    key={type}
                    onClick={() =>
                      parentType === "array"
                        ? handleModelTypeChange(type)
                        : handleItemTypeChange(type)
                    }
                    selected={
                      parentType === "array"
                        ? node.type === type
                        : node.children?.[0]?.type === type
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </PopoverButton>
                ))}
            </Flex>
          </Flex>
        )}
      </TypeSelectorPopover>
    ),
    [baseTypes, handleModelTypeChange, node, handleItemTypeChange, parentType],
  );

  return (
    <FieldRowContainer expanded={showConfig}>
      <Flex flex={1} style={{ width: "100%" }}>
        <LeftSide>
          {(node.type === "object" || node.type === "anyOf") && (
            <Button
              size="small"
              type="text"
              onClick={() => onAddChild(node.id)}
              icon={<PlusCircleOutlined style={{ fontSize: 16 }} />}
            />
          )}

          {parentType !== "array" && (
            <Input
              defaultValue={node.name}
              onChange={(e) => onChangeName(node.id, e.target.value)}
              placeholder="Field name"
              style={{ width: 160, height: 36 }}
            />
          )}

          <Popover
            trigger="click"
            placement="bottomLeft"
            content={renderPopoverContent()}
          >
            <DatatypeText>
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
              {node.type === "array"
                ? ` (${
                    node?.children?.[0]?.type
                      ? node?.children?.[0]?.type?.charAt(0)?.toUpperCase() +
                        node?.children?.[0]?.type.slice(1)
                      : ""
                  })`
                : ""}
              <CaretDownOutlined style={{ marginLeft: 4 }} />
            </DatatypeText>
          </Popover>
          {enableEnum && <Tag>Enum</Tag>}
        </LeftSide>

        <RightSide>
          <Button
            size="small"
            type="text"
            onClick={() => setShowConfig((prev) => !prev)}
            icon={
              !showConfig ? (
                <EditOutlined style={{ fontSize: 16 }} />
              ) : (
                <CheckIcon
                  style={{ height: 14, width: 14, color: "#032c92" }}
                />
              )
            }
          />
          {parentType && parentType !== "array" && (
            <Button
              size="small"
              danger
              type="text"
              onClick={() => onDeleteNode(node.id)}
              icon={<DeleteOutlined style={{ fontSize: 16 }} />}
            />
          )}
        </RightSide>
      </Flex>

      {showConfig && (
        <FieldConfig>
          <label>
            Description:
            <Input.TextArea
              rows={2}
              defaultValue={node.description || ""}
              onChange={(e) => onChangeDescription(node.id, e.target.value)}
              placeholder="Describe this field..."
            />
          </label>

          {node.type === "string" && (
            <>
              <Flex align="center" gap={8}>
                Enable Enum:
                <Switch
                  checked={enableEnum}
                  onChange={(checked) => {
                    setEnableEnum(checked);
                  }}
                />
              </Flex>
              {enableEnum && (
                <label>
                  Enum values:
                  <Input
                    placeholder="Option1, Option2, Option3, etc."
                    defaultValue={node.enum?.join(", ") || ""}
                    onChange={(e) => {
                      onChangeEnum(node.id, e.target.value);
                    }}
                  />
                </label>
              )}
            </>
          )}
        </FieldConfig>
      )}
    </FieldRowContainer>
  );
};

export default memo(SchemaField);
