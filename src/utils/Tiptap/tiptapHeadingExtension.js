import { Node, mergeAttributes } from "@tiptap/core";

export const HeadingExtension = Node.create({
  name: "heading",

  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      level: {
        default: 1,
        parseHTML: (element) => parseInt(element.tagName.replace("H", ""), 10),
        renderHTML: (attributes) => {
          if (
            !attributes.level ||
            attributes.level < 1 ||
            attributes.level > 6
          ) {
            return { level: 1 };
          }
          return { level: attributes.level };
        },
      },
      class: {
        default: null,
      },
      style: {
        default: null,
      },
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "h1,h2,h3,h4,h5,h6",
        getAttrs: (node) => {
          if (typeof node === "string") return false;
          return {
            level: parseInt(node.tagName.replace("H", ""), 10),
            class: node.getAttribute("class"),
            style: node.getAttribute("style"),
            id: node.getAttribute("id"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { level, ...attributes } = HTMLAttributes;

    // Ensure the level is within valid range
    const tag = `h${level ?? 1}`;
    return [tag, mergeAttributes(attributes), 0];
  },
});
