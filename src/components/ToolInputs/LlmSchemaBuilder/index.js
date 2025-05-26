import { Flex, Form, Space, Tabs, Tag } from "antd";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import InfoIconTooltip from "../../InfoIconTooltip";
import { ToolInputLabel } from "../../UIComponents/UIComponents.style";
import { InputContainer } from "../style";
import JsonPaste from "./JsonPaste";
import SchemaBuilder from "./SchemaBuilder";
import { JsonSchemaTabContainer, SchemaBuilderTabTitle } from "./style";

const LlmSchemaBuilder = ({
  inputDetails,
  itemName,
  inputFieldName,
  form,
  inputForm,
  index,
}) => {
  const idCounter = useRef(0);
  const generateId = () => `node-${++idCounter.current}`;

  const [schema, setSchema] = useState({
    id: generateId(),
    name: "Root",
    type: "object",
    description: "",
    enum: undefined,
    children: [],
  });

  const [selectedTab, setSelectedTab] = useState("Json Schema");

  const [initialValueSet, setInitialValueSet] = useState(false);
  const [error, setError] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const cloneNode = useCallback(
    (node) => ({
      ...node,
      children: node.children ? node.children.map(cloneNode) : [],
    }),
    [],
  );

  const findNode = useCallback((current, targetId) => {
    if (current.id === targetId) return { node: current };
    for (let child of current.children || []) {
      if (child.id === targetId) return { node: child, parent: current };
      const res = findNode(child, targetId);
      if (res.node) return { node: res.node, parent: res.parent || child };
    }
    return {};
  }, []);

  const updateNodeName = useCallback(
    (id, newName) => {
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, id);
        if (res.node) res.node.name = newName;
        return tree;
      });
    },
    [setSchema, cloneNode, findNode],
  );

  const UpdateNodeEnum = useCallback(
    (id, newEnum) => {
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, id);
        if (res.node)
          res.node.enum = newEnum?.split?.(",")?.map?.((v) => v?.trim());
        return tree;
      });
    },
    [setSchema, cloneNode, findNode],
  );

  const updateNodeType = useCallback(
    (id, newType) => {
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, id);
        if (!res.node) return tree;
        const node = res.node;

        if (newType === "object") {
          node.children = [];
        } else if (newType === "array") {
          node.children = [
            {
              id: generateId(),
              name: "Items",
              type: "string",
              description: "",
              enum: undefined,
              children: [],
            },
          ];
        } else if (newType === "anyOf") {
          node.children = [
            {
              id: generateId(),
              name: "",
              type: "string",
              description: "",
              enum: undefined,
              children: [],
            },
          ];
        } else {
          node.children = [];
        }
        node.description = "";
        node.enum = [];

        node.type = newType;
        return tree;
      });
    },
    [setSchema, cloneNode, findNode, generateId],
  );

  const updateArrayItemType = useCallback(
    (itemNodeId, itemType) => {
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, itemNodeId);
        if (res.node) {
          res.node.type = itemType;
          res.node.children = itemType === "object" ? [] : [];
        }
        return tree;
      });
    },
    [setSchema, cloneNode, findNode],
  );

  const updateNodeDescription = useCallback(
    (id, description) => {
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, id);
        if (res.node) res.node.description = description;
        return tree;
      });
    },
    [setSchema, cloneNode, findNode],
  );

  const addChildNode = useCallback(
    (parentId) => {
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, parentId);
        if (!res.node) return tree;

        const parent = res.node;
        parent.children = parent.children || [];

        if (parent.type === "object") {
          const baseName = "field";
          let idx = 1;
          const names = parent.children.map((c) => c.name);
          while (names.includes(`${baseName}${idx}`)) idx++;

          parent.children.push({
            id: generateId(),
            name: `${baseName}${idx}`,
            type: "string",
            description: "",
            enum: undefined,
            children: [],
          });
        } else if (parent.type === "anyOf") {
          parent.children.push({
            id: generateId(),
            name: "",
            type: "string",
            description: "",
            enum: undefined,
            children: [],
          });
        }

        return tree;
      });
      setExpandedKeys((prev) => Array.from(new Set([...prev, parentId])));
    },
    [setSchema, cloneNode, findNode, generateId, setExpandedKeys],
  );

  const deleteNode = useCallback(
    (id) => {
      if (id === schema.id) return;
      setSchema((prev) => {
        const tree = cloneNode(prev);
        const res = findNode(tree, id);
        if (res.parent?.children) {
          res.parent.children = res.parent.children.filter(
            (child) => child.id !== id,
          );
        }
        return tree;
      });
    },
    [setSchema, cloneNode, findNode],
  );

  const schemaNodeToJsonSchema = useCallback((node) => {
    const schemaObj = {};

    if (node.type === "object") {
      schemaObj.type = "object";
      schemaObj.properties = {};
      schemaObj.required = [];
      schemaObj.additionalProperties = false;

      for (const child of node.children || []) {
        schemaObj.properties[child.name] = schemaNodeToJsonSchema(child);
        schemaObj.required.push(child.name);
      }
      if (node.description) schemaObj.description = node.description;
    } else if (node.type === "array") {
      schemaObj.type = "array";
      schemaObj.items =
        node.children && node.children[0]
          ? schemaNodeToJsonSchema(node.children[0])
          : {};
      if (node.description) schemaObj.description = node.description;
    } else if (node.type === "anyOf") {
      schemaObj.anyOf = node?.children?.map(schemaNodeToJsonSchema);
      if (node.description) schemaObj.description = node.description;
    } else {
      schemaObj.type = node.type;
      if (node.description) schemaObj.description = node.description;
      if (node.enum?.length) {
        schemaObj.enum = node.enum.map((val) => {
          if (node.type === "number") {
            const n = Number(val);
            return isNaN(n) ? val : n;
          }
          if (node.type === "boolean") {
            const v = `${val}`.toLowerCase();
            return v === "true" ? true : v === "false" ? false : val;
          }
          return val;
        });
      }
    }

    return schemaObj;
  }, []);

  const jsonSchemaToSchemaNode = useCallback(
    (name, obj) => {
      const node = {
        id: generateId(),
        name,
        type: "string",
        description: obj.description || "",
        enum: obj.enum || undefined,
        children: [],
      };

      if (obj.type === "object") {
        node.type = "object";
        const props = obj.properties || {};
        for (const key in props) {
          node?.children?.push(jsonSchemaToSchemaNode(key, props[key]));
        }
      } else if (obj.type === "array") {
        node.type = "array";
        const items = Array.isArray(obj.items) ? obj.items[0] : obj.items || {};
        const itemNode = jsonSchemaToSchemaNode("Items", items);
        node.children = [itemNode];
      } else if (obj.anyOf) {
        node.type = "anyOf";
        node.children = obj.anyOf.map((s) => jsonSchemaToSchemaNode("", s));
      } else {
        const t = obj.type;
        if (["string", "number", "boolean"].includes(t)) node.type = t;
      }

      return node;
    },
    [generateId],
  );

  useEffect(() => {
    const jsonFormat = form.getFieldValue(inputFieldName);
    if (!jsonFormat) {
      setSchema({
        id: generateId(),
        name: "Root",
        type: "object",
        description: "",
        enum: undefined,
        children: [],
      });
    } else {
      try {
        const parsed = JSON.parse(jsonFormat);
        if (!parsed?.json_schema?.schema?.properties) {
          setError(
            "The response format provided is incorrect. Please provide a valid response format supported by LLM models.",
          );
          return;
        } else {
          const raw = parsed?.json_schema?.schema || parsed;
          const root = jsonSchemaToSchemaNode("Root", raw);
          root.id = schema.id;
          setError(null);
          setSchema(root);
        }
      } catch (err) {
        setError("Invalid JSON schema.");
      }
    }
    if (!initialValueSet) {
      setInitialValueSet(true);
    }
  }, [selectedTab]);

  const handleSchemaBuilderChange = useCallback(
    (json) => {
      form.setFields([{ name: inputFieldName, value: json }]);
    },
    [form, inputFieldName],
  );

  const onChange = useCallback((key) => {
    setSelectedTab(key);
  }, []);

  const handleJsonPasteChange = useCallback(
    (value) => {
      try {
        const parsed = JSON.parse(value);
        if (!parsed?.json_schema?.schema?.properties) {
          setError(
            "The response format provided is incorrect. Please provide a valid response format supported by LLM models.",
          );
          return;
        } else {
          setError(null);
        }
      } catch (err) {
        setError("Invalid JSON schema.");
      }
    },
    [setError],
  );

  const handleClearJsonFormat = useCallback(() => {
    form.setFields([{ name: inputFieldName, value: "" }]);
    setSchema({
      id: generateId(),
      name: "Root",
      type: "object",
      description: "",
      enum: undefined,
      children: [],
    });
  }, [form, inputFieldName, setSchema]);

  const items = useMemo(() => {
    return [
      {
        key: "Json Schema",
        destroyInactiveTabPane: false,
        label: <SchemaBuilderTabTitle>Json Schema</SchemaBuilderTabTitle>,
        children: (
          <JsonSchemaTabContainer>
            <JsonPaste
              handleClearJsonFormat={handleClearJsonFormat}
              itemName={itemName}
              error={error}
              setError={setError}
              handleJsonPasteChange={handleJsonPasteChange}
              inputFieldName={inputFieldName}
              form={form}
            />
          </JsonSchemaTabContainer>
        ),
      },
      {
        key: "Schema Builder",
        destroyInactiveTabPane: false,
        label: <SchemaBuilderTabTitle>Schema Builder</SchemaBuilderTabTitle>,
        children: (
          <JsonSchemaTabContainer>
            <SchemaBuilder
              schema={schema}
              onChangeName={updateNodeName}
              onChangeType={updateNodeType}
              onChangeArrayItemType={updateArrayItemType}
              onAddChild={addChildNode}
              onDeleteNode={deleteNode}
              updateNodeDescription={updateNodeDescription}
              schemaNodeToJsonSchema={schemaNodeToJsonSchema}
              onChangeEnum={UpdateNodeEnum}
              initialValueSet={initialValueSet}
              onSchemaChange={handleSchemaBuilderChange}
              handleClearJsonFormat={handleClearJsonFormat}
              error={error}
              setError={setError}
              expandedKeys={expandedKeys}
              setExpandedKeys={setExpandedKeys}
            />
          </JsonSchemaTabContainer>
        ),
      },
    ];
  }, [
    selectedTab,
    schema,
    updateNodeName,
    updateNodeType,
    updateArrayItemType,
    addChildNode,
    deleteNode,
    updateNodeDescription,
    schemaNodeToJsonSchema,
    UpdateNodeEnum,
    error,
    form,
    inputFieldName,
    handleSchemaBuilderChange,
    handleJsonPasteChange,
    handleClearJsonFormat,
    itemName,
    setError,
    initialValueSet,
  ]);

  return (
    <InputContainer>
      <Form.Item name={itemName} noStyle hidden />
      <Flex align="center" gap="12px">
        <Space>
          <ToolInputLabel>{inputDetails?.title}</ToolInputLabel>
          <InfoIconTooltip title={inputDetails?.description} />
          {inputDetails?.required && <Tag color="red">Required</Tag>}
        </Space>
      </Flex>
      <Tabs
        size="small"
        items={items}
        onChange={onChange}
        activeKey={selectedTab}
        animated
        style={{ width: "100%" }}
      />
    </InputContainer>
  );
};

export default memo(LlmSchemaBuilder);
