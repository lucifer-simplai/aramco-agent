import { LoadingOutlined } from "@ant-design/icons";
import { langs } from "@uiw/codemirror-extensions-langs";
import { xcodeDark } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import { Flex, Image, Table, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import { downloadDocumentApi } from "../../api/storage";
import {
  clickDefaultBehaviourDiscardHandler,
  openFileInNewTab,
} from "../../utils/helperFunction";
import { imageUrlPattern } from "../../utils/regex";
import ModalCloseIcon from ".././Icons/ModalCloseIcon";
import RedirectIcon from ".././Icons/RedirectIcon";
import {
  ChatChunkDivider,
  ChatChunkPreview,
  ChatCitationDetailsContainer,
  ChatCitationDetailsContent,
  ChatCitationDetailsHeader,
  CitationChunkCard,
  CitationChunkFileLink,
  CitationChunkHashtag,
  CitationPopoverHeading,
} from "./style";

const { Text } = Typography;

const ChatCitationDetails = ({ filename, citation, hide }) => {
  const [downloading, setDownloading] = useState(false);

  const downloadCitationDocument = async (chunk) => {
    try {
      setDownloading(true);
      if (!!!chunk?.metadata?.document_id) {
        return null;
      } else {
        const downloadDocumentResponse = await downloadDocumentApi({
          doc_id: chunk?.metadata?.document_id,
        });
        openFileInNewTab(
          downloadDocumentResponse?.data,
          chunk?.metadata?.file_name,
        );
      }
    } catch (error) {
    } finally {
      setDownloading(false);
    }
  };

  const citationColumns =
    Object.keys(citation?.[0]?.doc || {})?.map((csvKbColumns) => ({
      title: csvKbColumns,
      dataIndex: csvKbColumns,
      key: csvKbColumns,
      width: 200,
      render: (val) => {
        if (typeof val == "object" && val != null) {
          return (
            <ReactCodeMirror
              value={JSON.stringify(val || {}, undefined, 2)}
              editable={false}
              maxHeight="250px"
              extensions={[langs.json()]}
              theme={xcodeDark}
              autoSave={"true"}
              style={{
                borderRadius: "15px",
                overflow: "auto",
                maxWidth: "350px",
              }}
            />
          );
        } else if (imageUrlPattern?.test(val)) {
          return (
            <Image
              height={64}
              width={64}
              src={val}
              onClick={(e) => {
                clickDefaultBehaviourDiscardHandler(e);
              }}
              preview={{
                focusTriggerAfterClose: true,
                destroyOnClose: true,
              }}
            />
          );
        } else {
          return (
            <Tooltip title={val} placement="topLeft">
              <Text ellipsis style={{ width: 180 }}>
                {val}
              </Text>
            </Tooltip>
          );
        }
      },
    })) || [];

  const citationData =
    citation?.map((csvKbResponse) => ({
      ...csvKbResponse?.doc,
    })) || [];

  return (
    <ChatCitationDetailsContainer>
      <ChatCitationDetailsHeader>
        <CitationPopoverHeading ellipsis>{filename}</CitationPopoverHeading>
        <ModalCloseIcon style={{ cursor: "pointer" }} onClick={hide} />
      </ChatCitationDetailsHeader>
      <ChatCitationDetailsContent>
        {citation?.[0]?.doc ? (
          <Table
            columns={citationColumns}
            dataSource={citationData}
            pagination={false}
            scroll={{ x: "max-content", y: 600 }}
          />
        ) : (
          citation?.map((chunk, i) => (
            <>
              {i !== 0 && <ChatChunkDivider />}
              <CitationChunkCard>
                <Flex justify="space-between" align="center">
                  <CitationChunkHashtag>#{i + 1}</CitationChunkHashtag>

                  <CitationChunkFileLink
                    disabled={!!!chunk?.metadata?.document_id}
                    style={{
                      cursor: !!!chunk?.metadata?.document_id
                        ? "no-drop"
                        : "pointer",
                    }}
                    onClick={() => downloadCitationDocument(chunk)}
                  >
                    View knowledge base{" "}
                    {downloading ? <LoadingOutlined /> : <RedirectIcon />}
                  </CitationChunkFileLink>
                </Flex>
                <ChatChunkPreview>{chunk?.text}</ChatChunkPreview>
              </CitationChunkCard>
            </>
          ))
        )}
      </ChatCitationDetailsContent>
    </ChatCitationDetailsContainer>
  );
};

export default ChatCitationDetails;
