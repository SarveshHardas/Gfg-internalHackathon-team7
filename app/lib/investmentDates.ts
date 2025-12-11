import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const getInvestmentDates = async (userId: string) => {
  const q = query(
    collection(db, "investments"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const dates = snapshot.docs.map((doc) => {
    const data = doc.data();
    const created = new Date(data.createdAt);
    const yyyy = created.getFullYear();
    const mm = String(created.getMonth() + 1).padStart(2, "0");
    const dd = String(created.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  return [...new Set(dates)];
};
