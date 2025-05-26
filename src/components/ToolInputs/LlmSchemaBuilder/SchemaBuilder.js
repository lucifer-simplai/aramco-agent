import {
  CaretDownOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Button, Flex, Space, Tree, Typography } from "antd";
import { memo, useCallback, useEffect } from "react";
import SchemaField from "./SchemaField";
import {
  BuilderCardContainer,
  EmptySchemaContainer,
  SchemaBuilderHeading,
  TreeContainer,
} from "./style";

const SchemaBuilder = ({
  schema,
  onChangeName,
  onChangeType,
  onChangeArrayItemType,
  onAddChild,
  onDeleteNode,
  updateNodeDescription,
  schemaNodeToJsonSchema,
  onChangeEnum,
  initialValueSet,
  onSchemaChange,
  handleClearJsonFormat,
  error,
  setError,
  expandedKeys,
  setExpandedKeys,
}) => {
  const generateJsonSchema = useCallback(() => {
    const hasChildren = schema.children && schema.children.length > 0;

    // If no children, empty the JSON editor
    if (!hasChildren) {
      return "";
    }

    // Update JSON whenever schema changes
    const out = {
      json_schema: {
        schema: schemaNodeToJsonSchema(schema),
        name: "JSON_Schema",
        strict: true,
      },
      type: "json_schema",
    };
    return out;
  }, [schema, schemaNodeToJsonSchema]);

  const handleSchemaChange = useCallback(() => {
    if (initialValueSet && onSchemaChange) {
      const schema = generateJsonSchema();
      onSchemaChange(schema ? JSON.stringify(schema, null, 2) : "");
    }
  }, [initialValueSet, onSchemaChange, generateJsonSchema]);

  useEffect(() => {
    handleSchemaChange();
  }, [schema, handleSchemaChange]);

  const renderTreeNodes = useCallback(
    (node, parentType, index) => {
      const key = node.id;
      const title = (
        <SchemaField
          node={node}
          parentType={parentType}
          optionIndex={index}
          onChangeName={onChangeName}
          onChangeType={onChangeType}
          onChangeArrayItemType={onChangeArrayItemType}
          onAddChild={onAddChild}
          onDeleteNode={onDeleteNode}
          onChangeDescription={updateNodeDescription}
          onChangeEnum={onChangeEnum}
        />
      );

      if (node.children && node.children.length > 0) {
        return (
          <Tree.TreeNode key={key} title={title}>
            {node.children.map((child, idx) =>
              renderTreeNodes(child, node.type, idx),
            )}
          </Tree.TreeNode>
        );
      }

      return <Tree.TreeNode key={key} title={title} />;
    },
    [
      onChangeName,
      onChangeType,
      onChangeArrayItemType,
      onAddChild,
      onDeleteNode,
      updateNodeDescription,
    ],
  );

  const onExpand = useCallback((keys) => {
    setExpandedKeys(keys);
  }, []);

  return (
    <Flex vertical gap={24}>
      <Flex justify="space-between" align="center">
        <SchemaBuilderHeading>
          Create your desired output structure using the no-code JSON schema
          builder.
        </SchemaBuilderHeading>
      </Flex>

      <BuilderCardContainer>
        {error ? (
          <EmptySchemaContainer>
            <WarningOutlined style={{ fontSize: 42 }} />
            <Typography.Text
              style={{ fontSize: 16, fontWeight: 500, color: "#FF0000" }}
            >
              {error}
            </Typography.Text>
            <Button
              type="text"
              danger
              onClick={() => {
                handleClearJsonFormat();
                setError(null);
              }}
              size="middle"
            >
              Clear format
            </Button>
          </EmptySchemaContainer>
        ) : (
          <>
            {schema?.children?.length > 0 ? (
              <TreeContainer>
                <Tree
                  showLine={true}
                  defaultExpandAll={false}
                  selectable={false}
                  switcherIcon={
                    <CaretDownOutlined
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        height: 24,
                        paddingTop: 4,
                      }}
                    />
                  }
                  expandedKeys={expandedKeys} // ✅ Controlled prop
                  onExpand={onExpand} // ✅ Controlled handler
                >
                  {schema.children?.map((child, idx) =>
                    renderTreeNodes(child, schema.type, idx),
                  )}
                </Tree>
              </TreeContainer>
            ) : (
              <EmptySchemaContainer>
                <FileTextOutlined style={{ fontSize: 42 }} />
                <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
                  Start by adding fields to your schema
                </Typography.Text>
                <Button
                  type="default"
                  onClick={() => onAddChild(schema.id)}
                  size="middle"
                >
                  <PlusCircleOutlined />
                  Add Your First Field
                </Button>
              </EmptySchemaContainer>
            )}

            {schema?.children?.length > 0 && (
              <Space>
                <Button
                  type="primary"
                  onClick={() => onAddChild(schema.id)}
                  size="middle"
                >
                  <PlusCircleOutlined />
                  Add Field
                </Button>
              </Space>
            )}
          </>
        )}
      </BuilderCardContainer>
    </Flex>
  );
};

export default memo(SchemaBuilder);
