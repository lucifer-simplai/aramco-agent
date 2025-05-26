import { Table } from "@tiptap/extension-table";

export const CustomTable = Table.extend({
  addAttributes() {
    return {
      class: {
        default: "custom-table",
      },
      style: {
        default: "width: 100%; border-collapse: collapse;",
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return ["table", HTMLAttributes, 0];
  },
});
