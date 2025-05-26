import { Mark, mergeAttributes } from "@tiptap/core";

export const SpanExtension = Mark.create({
  name: "span",

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
        tag: "span",
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
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
});
