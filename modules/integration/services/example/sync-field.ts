export default defineEventHandler(async (event) => {
  const { visit, apiKey, value } = await readBody(event);
  return {};
});
