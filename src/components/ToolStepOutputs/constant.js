export const getToolStepOutputItems = (outputs) => {
  return (
    Object.keys(outputs || {})?.map((output) => ({
      key: output,
      label: output,
    })) || []
  );
};

export const getToolStepForeachOutputItems = (length) => {
  return Array.from({ length }, (_, index) => ({
    key: index,
    label: `foreach[${index}]`,
  }));
};
