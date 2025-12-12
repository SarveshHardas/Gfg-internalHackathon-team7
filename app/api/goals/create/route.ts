import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId, goalName, targetAmount, deadline, dailyAmount } =
      await req.json();

    if (!userId || !goalName || !targetAmount || !deadline) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newGoal = {
      userId,
      goalName,
      targetAmount,
      deadline,
      dailyAmount,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const docRef = await addDoc(collection(db, "goals"), newGoal);

    return NextResponse.json({
      success: true,
      goalId: docRef.id,
      goal: newGoal,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Goal could not be created",
    });
  }
}
