import styled from "styled-components";
import { NODE_SELECT_BG, PRIMARY_BRAND_COLOR } from "../../theme/theme.antd";

export const EditorContainer = styled.div`
  /* Add your styles here */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 480px;
  overflow: auto;
  border: 0.68px solid var(--Text-Color-150, rgba(213, 213, 213, 1));
  background: #ffffff;
`;

export const MenuContainer = styled.div`
  border-radius: 10px 10px 0 0;
  border-bottom: 0.68px solid var(--Text-Color-150, rgba(213, 213, 213, 1));
  padding: 8px;
  background: #fff;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const EditorWrapper = styled.div`
  padding: 8px;

  .ProseMirror-focused {
    outline: none !important;
  }

  .tiptap {
    /* Table-specific styling */
    table {
      border-collapse: collapse;
      margin: 0;
      overflow: hidden;
      table-layout: fixed;
      width: 100%;

      td,
      th {
        border: 1px solid #000;
        box-sizing: border-box;
        min-width: 1em;
        padding: 6px 8px;
        position: relative;
        vertical-align: top;

        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: #e0e0e0;
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        background: rgba(61, 37, 20, 0.08);
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        position: absolute;
        z-index: 2;
      }

      .column-resize-handle {
        background-color: ${PRIMARY_BRAND_COLOR};
        bottom: ${NODE_SELECT_BG} -2px;
        pointer-events: none;
        position: absolute;
        right: -2px;
        top: 0;
        width: 4px;
      }
    }

    .tableWrapper {
      margin: 1.5rem 0;
      overflow-x: auto;
    }

    &.resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
`;

export const EditorShortcutContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  background: ${(props) => {
    switch (props.active) {
      case true:
        return `${NODE_SELECT_BG}`;
      case false:
        return "#fff";
      default:
        return "#fff";
    }
  }};
  color: #000;
  overflow: hidden;
`;

export const AiOutputContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;
