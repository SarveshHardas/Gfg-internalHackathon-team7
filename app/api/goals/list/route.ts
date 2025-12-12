import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "No userId provided",
      });
    }

    console.log("GOALS API HIT");
    console.log("userId from client:", userId);

    const q = query(
      collection(db, "goals"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    console.log("QUERYING FIRESTORE...");
    const snapshot = await getDocs(q);
    console.log("SNAPSHOT SIZE:", snapshot.size);

    const goals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ success: true, goals });
  } catch (error: any) {
    console.error("GOALS_FETCH_ERROR:", error);
    console.error("GOAL ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to load goals.",
    });
  }
}
