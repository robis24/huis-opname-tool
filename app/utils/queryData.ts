import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "~/firebase";

export default async (key: string, user: string) => {
  const visitsCollectionRef = collection(db, key);
  const q = query(visitsCollectionRef, where("user", "==", user));

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs;
};
