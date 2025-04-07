import { doc, setDoc } from "firebase/firestore";
import { db } from "~/firebase";

export default async (
  key: string,
  value: string,
  data: Record<string, any>
) => {
  console.log("try to save:", { key, value, data });
  try {
    const docRef = doc(db, key, value);
    await setDoc(docRef, data);
    console.log("data saved", data);
  } catch (error) {
    console.error("Failed to save online", error, data);
  }
};
