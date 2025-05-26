import { Divider, Flex, Popover } from "antd";
import React, { useState } from "react";
import FileIcon from "../Icons/FileIcon";
import ChatCitationDetails from "./ChatCitationDetails";
import ToolUseOutput from "./ChatToolCitationsDetails";
import {
  CitationContainer,
  CitationFileCard,
  CitationFileName,
  CitationTitle,
} from "./style";

const ChatCitation = ({ citation, filename }) => {
  const handleCitationPopoverChange = (open) => {
    setCitationOpen(open);
  };

  const [citationOpen, setCitationOpen] = useState(false);

  const hide = () => {
    setCitationOpen(false);
  };

  return (
    <Popover
      onOpenChange={handleCitationPopoverChange}
      open={citationOpen}
      content={
        <ChatCitationDetails
          citation={citation}
          filename={filename}
          hide={hide}
        ></ChatCitationDetails>
      }
      getPopupContainer={() => document.getElementById("popoverchat-container")}
      trigger={["click", "hover"]}
      arrow={false}
      overlayInnerStyle={{
        padding: 0,
        borderRadius: "10px",
        overflow: "auto",
      }}
      overlayStyle={{
        maxWidth: "90%",
        maxHeight: "55%",
        overflow: "auto",
        borderRadius: "10px",
        border: "0.8px solid var(--Text-Color-150, #d5d5d5)",
        background: "var(--Text-Color-50, #fff)",
        boxShadow: "0px 3px 8px 0px rgba(158, 158, 158, 0.15)",
      }}
      autoAdjustOverflow={true}
      placement="topRight"
    >
      <CitationFileCard title={filename}>
        <FileIcon style={{ fontSize: "16px", width: "16px" }} />
        <CitationFileName ellipsis>{filename}</CitationFileName>
      </CitationFileCard>
    </Popover>
  );
};

const ChatToolCitation = ({ tool }) => {
  const handleToolOutputPopoverChange = (open) => {
    setToolOutputOpen(open);
  };

  const [toolOutputOpen, setToolOutputOpen] = useState(false);

  return (
    <>
      {Object.keys?.(tool?.tool_call_result?.outputs || {})?.length > 0 ? (
        <Popover
          onOpenChange={handleToolOutputPopoverChange}
          open={toolOutputOpen}
          content={
            <>
              <ToolUseOutput
                outputs={tool?.tool_call_result?.outputs}
                toolUseOutput={{
                  data: tool?.tool_call_result?.outputs,
                }}
              />
            </>
          }
          getPopupContainer={() =>
            document.getElementById("popoverchat-container")
          }
          trigger={["click", "hover"]}
          arrow={false}
          overlayInnerStyle={{
            padding: 0,
            borderRadius: "10px",
            overflow: "auto",
          }}
          overlayStyle={{
            maxWidth: "90%",
            maxHeight: "55%",
            overflow: "auto",
            borderRadius: "10px",
            border: "0.8px solid var(--Text-Color-150, #d5d5d5)",
            background: "var(--Text-Color-50, #fff)",
            boxShadow: "0px 3px 8px 0px rgba(158, 158, 158, 0.15)",
          }}
          autoAdjustOverflow={true}
          placement="topRight"
        >
          <CitationFileCard title={tool?.tool_name}>
            <FileIcon style={{ fontSize: "16px", width: "16px" }} />
            <CitationFileName ellipsis>{tool?.tool_name}</CitationFileName>
          </CitationFileCard>
        </Popover>
      ) : (
        <CitationFileCard title={tool?.tool_name}>
          <FileIcon style={{ fontSize: "16px", width: "16px" }} />
          <CitationFileName ellipsis>{tool?.tool_name}</CitationFileName>
        </CitationFileCard>
      )}
    </>
  );
};

const ChatCitations = ({ citationDetails, toolDetails }) => {
  return (
    <CitationContainer>
      <Divider orientation="left" orientationMargin={0}>
        <CitationTitle>Citation</CitationTitle>
      </Divider>
      <Flex wrap="wrap" gap={12}>
        {Object.entries(citationDetails || {})?.map(([filename, citation]) => {
          return <ChatCitation citation={citation} filename={filename} />;
        })}
        {toolDetails?.map((tool, index) => {
          return <ChatToolCitation tool={tool?.tool_citation_message} />;
        })}
      </Flex>
    </CitationContainer>
  );
};

export default ChatCitations;
