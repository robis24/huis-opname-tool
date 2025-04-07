import { doc, getDoc } from "firebase/firestore";
import { db } from "~/firebase";

export default async (key: string, value: string) => {
  try {
    const docRef = doc(db, key, value);
    const data = await getDoc(docRef);

    if (data.exists()) {
      return data.data();
    } else {
      console.log(`No data! ${key}: ${value}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
