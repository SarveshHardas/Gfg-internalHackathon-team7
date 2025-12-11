import { NextResponse } from "next/server";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { userId, packId, amount } = await req.json();

    const packRef = doc(db, "investment_packs", packId);
    const packSnapShot = await getDoc(packRef);

    if (!packSnapShot.exists()) {
      return NextResponse.json({
        success: false,
        message: "Investment pack not found.",
      });
    }

    const pack = packSnapShot.data();
    const investedAmount = amount ?? pack.amount;
    const expectedReturn = Number(
      (investedAmount * (1 + pack.apy / 100)).toFixed(2)
    );

    const investmentRef = doc(db, "investments", crypto.randomUUID());

    await setDoc(investmentRef, {
      userId,
      packId,
      packName: pack.name,
      amount: investedAmount,
      apy: pack.apy,
      expectedReturn,
      createdAt: Date.now(),
    });

    const userRef = doc(db, "users", userId);
    const userSnapShot = await getDoc(userRef);
    const userData = userSnapShot.data();

    let newStreak = 1;
    const today = new Date().toDateString();
    if (userData?.lastInvestedOn) {
      const lastDate = new Date(userData.lastInvestedOn).toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      if (lastDate === today) {
        newStreak = userData.streak;
      } else if (lastDate === yesterdayStr) {
        newStreak = userData.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const newTotalInvestment =
      (userData?.totalInvested || 0) + investedAmount;

    await updateDoc(userRef, {
      streak: newStreak,
      lastInvestedOn: Date.now(),
      totalInvested: newTotalInvestment,
    });

    return NextResponse.json({
      success: true,
      investedAmount,
      expectedReturn,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
