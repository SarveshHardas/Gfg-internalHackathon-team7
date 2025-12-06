import { NextResponse } from "next/server";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const q = query(
      collection(db, "investments"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);

    let totalInvested = 0;

    snap.forEach(doc => {
      totalInvested += doc.data().amount;
    });

    const userSnap = await getDocs(
      query(collection(db, "users"), where("__name__", "==", userId))
    );

    const userData = userSnap.docs[0]?.data();

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        totalInvested
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    });
  }
}
