import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required",
      });
    }
    const q = query(
      collection(db, "investments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapShot = await getDocs(q);
    const transactions = snapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (error: any) {
    console.error("Transaction API Error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch transactions",
    });
  }
}