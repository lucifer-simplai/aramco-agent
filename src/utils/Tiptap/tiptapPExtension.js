import { Node, mergeAttributes } from "@tiptap/core";

export const PExtension = Node.create({
  name: "paragraph",

  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      class: {
        default: null,
      },
      style: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "p",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          return {
            class: node.getAttribute("class"),
            style: node.getAttribute("style"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(HTMLAttributes), 0];
  },
});
