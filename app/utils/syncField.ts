export default async function sync(
  value: any,
  apiKey: string | undefined,
  visit: string
) {
  if (!apiKey) return;
  try {
    const response = await fetch(`/api/sync-field`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: formatUUID(apiKey),
        value,
        visit,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("synced", data);
  } catch (error) {
    console.error("Error fetching resource:", error);
    throw error;
  }
}

function formatUUID(uuid: string) {
  let formatted = uuid.replace(/-/g, "__");
  return /^\d/.test(formatted) ? `_${formatted}` : formatted;
}
