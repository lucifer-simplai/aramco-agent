import { cloneDeep } from "lodash";
import React from "react";
import MarkdownComponent from "../Markdown";
import { DynamicTableContainer } from "./style";
const isPrimitive = (value) => {
  return (
    value === null || (typeof value !== "object" && typeof value !== "function")
  );
};

const arrayContainsNonPrimitives = (arr) => {
  return arr.some((item) => !isPrimitive(item));
};

const jsonToMarkdown = (obj, indent = 0) => {
  if (isPrimitive(obj)) {
    // Base case: if obj is a primitive value, render it as a list item
    return `${String(obj)}\n`;
  }

  if (Array.isArray(obj)) {
    // If obj is an array, map over its elements
    const items = obj.map((item) => jsonToMarkdown(item, indent));
    if (arrayContainsNonPrimitives(obj)) {
      // Insert horizontal lines between non-primitive items
      return items.join(`${" ".repeat(indent)}--------\n`);
    }
    return items.join("");
  }

  // If obj is an object, iterate over its keys
  return Object.entries(obj)
    .map(([key, value]) => {
      const keyLine = `${" ".repeat(indent)}- **${key}**:\n`;
      const valueLine = jsonToMarkdown(value, indent + 2);
      return keyLine + valueLine;
    })
    .join("");
};

// Function to dynamically generate columns
const generateColumns = (data) => {
  if (!data || data?.length === 0) {
    return [];
  }

  data = cloneDeep(data);
  if (!Array.isArray(data)) {
    if (typeof data === "object" && data != null) {
      return Object.keys(data || {}).map((key) => {
        // Check if the value is an array of objects
        let isfieldObject = false;
        if (Array.isArray(data?.[key])) {
          isfieldObject = data?.[key]?.some((value) => {
            return typeof value === "object";
          });
        }
        if (
          Array.isArray(data?.[key]) &&
          typeof data?.[key]?.[0] === "object"
        ) {
          return {
            title: key,
            width: 250,
            children: Object.keys(data?.[key]?.[0] || {})?.map?.((subKey) => ({
              title: subKey,
              dataIndex: `${key}.${subKey}`, // Use dot notation for nested access
              key: `${key}.${subKey}`,
              width: 250,
              render: (value, record) =>
                typeof record?.[key] === "object" ? (
                  Array.isArray(record?.[key]) && record?.[key]?.length < 1 ? (
                    "-"
                  ) : Array.isArray(record?.[key]) &&
                    record?.[key]?.length > 0 &&
                    (typeof record?.[key]?.[0] === "string" ||
                      typeof record?.[key]?.[0] === "number") ? (
                    record?.[key]?.join?.(", ")
                  ) : (
                    <div
                      style={{
                        maxWidth: "250px",
                        maxHeight: "100px",
                        overflow: "auto",
                      }}
                    >
                      <MarkdownComponent
                        markdown={jsonToMarkdown(record?.[key] || {})}
                      />
                    </div>
                  )
                ) : (
                  record?.[key] || "-"
                ), // Render primitive value
            })),
          };
        }

        return {
          title: key,
          dataIndex: key,
          key,
          width: 250,
          render: (value) =>
            typeof value === "object" ? (
              Array.isArray(value) && value?.length < 1 ? (
                "-"
              ) : Array.isArray(value) &&
                value?.length > 0 &&
                (typeof value?.[0] === "string" ||
                  typeof value?.[0] === "number") ? (
                value?.join?.(", ")
              ) : (
                <div
                  style={{
                    maxWidth: "250px",
                    maxHeight: "100px",
                    overflow: "auto",
                  }}
                >
                  <MarkdownComponent markdown={jsonToMarkdown(value || {})} />
                </div>
              )
            ) : (
              value || "-"
            ), // Render primitive value
        };
      });
    }
    return [];
  }
  const firstRow = data?.[0];

  const secondRow = data?.[1];

  return Object.keys(firstRow || {}).map((key) => {
    // Check if the value is an array of objects

    if (
      (!!!firstRow?.[key] ||
        (Array.isArray(firstRow?.[key]) && firstRow?.[key]?.length < 1)) &&
      (!!secondRow?.[key] ||
        (Array.isArray(secondRow?.[key]) && secondRow?.[key]?.length > 0))
    ) {
      firstRow[key] = secondRow?.[key];
    }

    if (
      typeof firstRow?.[key] === "object" &&
      firstRow?.[key] != null &&
      !Array.isArray(firstRow?.[key])
    ) {
      return {
        title: key,
        width: 250,
        children: Object.keys(firstRow?.[key] || {})?.map?.((subKey) => ({
          title: subKey,
          dataIndex: `${key}.${subKey}`, // Use dot notation for nested access
          key: `${key}.${subKey}`,
          width: 250,
          render: (_, record) =>
            typeof record?.[key]?.[subKey] === "object" ? (
              Array.isArray(record?.[key]?.[subKey]) &&
              record?.[key]?.[subKey]?.length < 1 ? (
                "-"
              ) : Array.isArray(record?.[key]?.[subKey]) &&
                record?.[key]?.[subKey]?.length > 0 &&
                (typeof record?.[key]?.[subKey]?.[0] === "string" ||
                  typeof record?.[key]?.[subKey]?.[0] === "number") ? (
                record?.[key]?.[subKey]?.join?.(", ")
              ) : (
                <div
                  style={{
                    maxWidth: "250px",
                    maxHeight: "100px",
                    overflow: "auto",
                  }}
                >
                  <MarkdownComponent
                    markdown={jsonToMarkdown(record?.[key]?.[subKey] || {})}
                  />
                </div>
              )
            ) : (
              record?.[key]?.[subKey] || "-"
            ), // Render primitive value
        })),
      };
    }

    return {
      title: key,
      dataIndex: key,
      key,
      width: 250,
      render: (value) =>
        typeof value === "object" ? (
          Array.isArray(value) && value?.length < 1 ? (
            "-"
          ) : Array.isArray(value) && value?.length > 0 ? (
            <div
              style={{
                maxWidth: "250px",
                maxHeight: "100px",
                overflow: "auto",
              }}
            >
              <MarkdownComponent markdown={jsonToMarkdown(value || {})} />
            </div>
          ) : (
            value || "-"
          )
        ) : (
          value || "-"
        ), // Render primitive value
    };
  });
};

// Function to generate data source for the table
const generateDataSource = (data) => {
  if (!data || data?.length === 0) {
    return [];
  }
  if (!Array.isArray(data)) {
    if (typeof data === "object" && data != null) {
      return [data];
    }
    return [];
  }
  return data?.map((item, index) => {
    return {
      key: index, // Ant Design requires a unique key
      ...(item || {}),
    };
  });
};

// Main Component
const DynamicTable = ({ jsonData }) => {
  const columns = generateColumns(jsonData);
  const dataSource = generateDataSource(jsonData);

  return (
    <DynamicTableContainer
      dataSource={dataSource}
      columns={columns}
      bordered
      scroll={{ x: "max-content", y: "200px" }}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default DynamicTable;

// const JsonToUl = ({ jsonData }: any) => {
//   // Recursive function to render JSON data as nested lists
//   const renderList = (obj: any) => {
//     if (typeof obj !== "object" || obj === null) {
//       // Base case: if obj is not an object or is null, render it as a list item
//       return <li>{String(obj)}</li>;
//     }

//     if (Array.isArray(obj)) {
//       // If obj is an array, map over its elements
//       return (
//         <ul>
//           {obj.map((item, index) => (
//             <li key={index}>{renderList(item)}</li>
//           ))}
//         </ul>
//       );
//     }

//     // If obj is an object, iterate over its keys
//     return (
//       <ul>
//         {Object.entries(obj).map(([key, value]) => (
//           <li key={key}>
//             {key}:
//             {typeof value === "object" && value !== null ? (
//               renderList(value)
//             ) : (
//               <ul>
//                 <li>{String(value)}</li>
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   return (
//     <div>
//       {
//         // renderList(jsonData)
//         <MarkdownComponent markdown={jsonToMarkdown(jsonData)} />
//       }
//     </div>
//   );
// };

// export default JsonToUl;
