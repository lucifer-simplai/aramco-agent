import { Tabs } from "antd";
import { memo, useMemo, useState } from "react";
import MarkdownComponent from "../Markdown";
import {
  getToolStepForeachOutputItems,
  getToolStepOutputItems,
} from "./constant";
import { ToolStepOutputContainer, ToolStepOutputsContainer } from "./style";

const ToolStepOutputs = ({ stepConfig, selectedNodeDetails }) => {
  const [activeKey, setActiveKey] = useState();

  const onChange = (key) => {
    setActiveKey(key);
  };

  const items = useMemo(() => {
    if (selectedNodeDetails && stepConfig) {
      if (!!selectedNodeDetails?.output?.foreach) {
        setActiveKey(0);
        return getToolStepForeachOutputItems(
          selectedNodeDetails?.output?.data?.foreach?.length,
        );
      }
      setActiveKey(Object.keys(stepConfig?.outputs?.properties || {})?.[0]);
      return getToolStepOutputItems(stepConfig?.outputs?.properties);
    } else {
      return [];
    }
  }, [selectedNodeDetails, stepConfig]);

  const renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar
      {...props}
      style={{
        background: "#fbfdff",
        padding: "0 16px",
        borderRadius: "10px 10px 0 0",
      }}
    />
  );

  return (
    <ToolStepOutputsContainer>
      <>
        <Tabs
          style={{ width: "100%" }}
          onChange={onChange}
          activeKey={activeKey}
          items={items}
          size="small"
          renderTabBar={renderTabBar}
        />
        <ToolStepOutputContainer>
          <MarkdownComponent
            markdown={
              typeof selectedNodeDetails?.data?.output?.[activeKey] === "object"
                ? `<pre>${JSON.stringify(
                    selectedNodeDetails?.data?.output?.[activeKey],
                    null,
                    2,
                  )}</pre>`
                : `${selectedNodeDetails?.data?.output?.[activeKey] ?? ""}`
            }
          />
        </ToolStepOutputContainer>
      </>
    </ToolStepOutputsContainer>
  );
};

export default memo(ToolStepOutputs);
