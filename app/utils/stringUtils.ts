export const stripId = (title: string) =>
  title.replaceAll(/[^\w]/g, "").toLowerCase();
