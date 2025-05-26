import { Button, Divider, Flex } from "antd";
import React from "react";
import { PRIMARY_BRAND_COLOR } from "../../theme/theme.antd";
import DocumentBlueIcon from "../Icons/DocumentBlueIcon";
import { CitationContainer, CitationTitle } from "./style";
const DocEditorCitation = ({
  setDocumentContent,
  toolOutput,
  setShowEditorDrawer,
}) => {
  const htmlContent = JSON.parse?.(toolOutput?.content)?.HTMLForDocument ?? "";
  return (
    <CitationContainer>
      <Divider orientation="left" orientationMargin={0}>
        <CitationTitle>Generated Document</CitationTitle>
      </Divider>
      <Flex wrap="wrap" gap={12}>
        <Button
          type="default"
          style={{
            color: PRIMARY_BRAND_COLOR,
          }}
          onClick={() => {
            if (setDocumentContent) {
              setDocumentContent(htmlContent);
            }
            if (setShowEditorDrawer) {
              setShowEditorDrawer(true);
            }
          }}
          icon={<DocumentBlueIcon />}
        >
          View/ Edit document
        </Button>
      </Flex>
    </CitationContainer>
  );
};

export default DocEditorCitation;
