import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  CodeOutlined,
  DeleteColumnOutlined,
  DeleteOutlined,
  DeleteRowOutlined,
  HighlightOutlined,
  InsertRowAboveOutlined,
  InsertRowBelowOutlined,
  InsertRowLeftOutlined,
  InsertRowRightOutlined,
  ItalicOutlined,
  LineOutlined,
  OrderedListOutlined,
  ReadOutlined,
  StrikethroughOutlined,
  TableOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Drawer, Tooltip } from "antd";
import html2pdf from "html2pdf.js"; // Import html2pdf.js
import { useEffect, useRef, useState } from "react";
import DrawerCloseIcon from "../Icons/DrawerCloseIcon";
// import CustomHTML from "../CustomHTML";

import Gapcursor from "@tiptap/extension-gapcursor";

import Table from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { drawerSize } from "../../constants";
import { DivExtension } from "../../utils/Tiptap/tiptapDivExtension";
import { HeadingExtension } from "../../utils/Tiptap/tiptapHeadingExtension";
import { PExtension } from "../../utils/Tiptap/tiptapPExtension";
import { SpanExtension } from "../../utils/Tiptap/tiptapSpanExtension";
import { DrawerTitle } from "../UIComponents/UIComponents.style";
import {
  EditorContainer,
  EditorShortcutContainer,
  EditorWrapper,
  MenuContainer,
} from "./style";

const EditorDrawer = ({ open, onClose, initialContent }) => {
  const [loading, setLoading] = useState(false);
  // Ref for the content wrapper (to target for PDF export)
  const editorRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      DivExtension,
      PExtension,
      SpanExtension,
      HeadingExtension,
      Table.configure({
        resizable: true,
        cellMinWidth: 150,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link,
      Bold,
      Italic,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      Color,
      Highlight,
      Image,
      Gapcursor,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
  });

  // Function to export as PDF
  const exportToPDF = () => {
    try {
      setLoading(true);

      const element = editorRef.current; // Get the editor wrapper reference
      if (!element) return;

      const originalWidth = element.style.width; // Save original width

      // Find the table wrapper (or the specific content you want to export)
      const allElements = element.querySelectorAll("*");
      // Calculate the maximum width among all table containers
      let maxWidth = 0;
      allElements.forEach((childElement) => {
        const childWidth = childElement.scrollWidth;
        if (childWidth > maxWidth) {
          maxWidth = childWidth;
        }
      });

      // Conditionally apply the max width if it exceeds the current element width

      if (maxWidth + 16 > element.scrollWidth) {
        element.style.width = `${maxWidth + 16}px`; // Expand to max width
      }

      const options = {
        margin: 10,
        filename: "document.pdf",
        html2canvas: {
          scale: 2, // High resolution
          scrollX: 0,
          scrollY: 0,
          width:
            maxWidth + 16 > element.scrollWidth
              ? maxWidth + 16
              : element.scrollWidth, // Dynamically set width
          windowWidth:
            maxWidth + 16 > element.scrollWidth
              ? maxWidth + 16
              : element.scrollWidth, // Dynamically set window width
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      };

      // Use jsPDF to render selectable text
      html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          pdf.setFontSize(12); // Set font size for text
        })
        .save()
        .finally(() => {
          element.style.width = originalWidth;
        });
    } catch (error) {
      console.error("Error while exporting PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialContent) {
      editor?.commands?.setContent(initialContent);
    }
  }, [initialContent]);

  const MenuBar = ({ editor, handleImageUpload }) => {
    if (!editor) {
      return null;
    }

    const isTableActive = editor.isActive("table");

    return (
      <MenuContainer>
        <EditorShortcutContainer active={editor.isActive("bold")}>
          <BoldOutlined
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer active={editor.isActive("italic")}>
          <ItalicOutlined
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer active={editor.isActive("strike")}>
          <StrikethroughOutlined
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer active={editor.isActive("blockquote")}>
          <ReadOutlined
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer active={editor.isActive("underline")}>
          <UnderlineOutlined
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </EditorShortcutContainer>

        <EditorShortcutContainer active={editor.isActive("codeBlock")}>
          <CodeOutlined
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer>
          <LineOutlined
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer active={editor.isActive("bulletList")}>
          <UnorderedListOutlined
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        </EditorShortcutContainer>

        <EditorShortcutContainer active={editor.isActive("orderedList")}>
          <OrderedListOutlined
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer active={editor.isActive("highlight")}>
          <HighlightOutlined
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: "#ff0" }).run()
            }
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeftOutlined
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenterOutlined
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          />
        </EditorShortcutContainer>
        <EditorShortcutContainer
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRightOutlined
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          />
        </EditorShortcutContainer>

        <Tooltip title="Add table">
          <EditorShortcutContainer>
            <TableOutlined
              onClick={() =>
                editor.commands.insertTable({
                  rows: 2,
                  cols: 3,
                  withHeaderRow: true,
                })
              }
            />
          </EditorShortcutContainer>
        </Tooltip>

        {isTableActive && (
          <>
            <Tooltip title="Add column before">
              <EditorShortcutContainer>
                <InsertRowLeftOutlined
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                />
              </EditorShortcutContainer>
            </Tooltip>
            <Tooltip title="Add column after">
              <EditorShortcutContainer>
                <InsertRowRightOutlined
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                />
              </EditorShortcutContainer>
            </Tooltip>
            <Tooltip title="Add row before">
              <EditorShortcutContainer>
                <InsertRowAboveOutlined
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                />
              </EditorShortcutContainer>
            </Tooltip>
            <Tooltip title="Add row after">
              <EditorShortcutContainer>
                <InsertRowBelowOutlined
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                />
              </EditorShortcutContainer>
            </Tooltip>
            <Tooltip title="Delete column">
              <EditorShortcutContainer>
                <DeleteColumnOutlined
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                />
              </EditorShortcutContainer>
            </Tooltip>
            <Tooltip title="Delete row">
              <EditorShortcutContainer>
                <DeleteRowOutlined
                  onClick={() => editor.chain().focus().deleteRow().run()}
                />
              </EditorShortcutContainer>
            </Tooltip>
            <Tooltip title="Delete table">
              <EditorShortcutContainer>
                <DeleteOutlined onClick={() => editor.commands.deleteTable()} />
              </EditorShortcutContainer>
            </Tooltip>
          </>
        )}
      </MenuContainer>
    );
  };

  return (
    <Drawer
      title={<DrawerTitle>{"Edit Document"}</DrawerTitle>}
      open={open}
      getContainer={() => document.getElementById("popoverchat-container")}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      closeIcon={
        <DrawerCloseIcon
          style={{
            cursor: loading ? "no-drop" : "pointer",
          }}
        />
      }
      width={drawerSize.medium}
      maskClosable={true}
      destroyOnClose
      closable
      styles={{
        body: {
          background: "#F1F3F4",
        },
      }}
      extra={
        <Button type="primary" onClick={() => exportToPDF()}>
          Download as PDF
        </Button>
      }
    >
      <EditorContainer>
        <MenuBar editor={editor} />
        <EditorWrapper ref={editorRef}>
          <EditorContent editor={editor} />
        </EditorWrapper>
      </EditorContainer>
    </Drawer>
  );
};

export default EditorDrawer;
