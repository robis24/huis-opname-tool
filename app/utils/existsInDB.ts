import { db } from "~/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async (key: string, value: string) => {
  const docRef = doc(db, key, value);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};
