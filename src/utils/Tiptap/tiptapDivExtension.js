import { Node, mergeAttributes } from "@tiptap/core";

export const DivExtension = Node.create({
  name: "div",

  group: "block",
  content: "block+",

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
        tag: "div",
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
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },
});
