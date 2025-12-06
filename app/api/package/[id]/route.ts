import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { doc, getDoc } from "firebase/firestore";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("API received pack ID:", id);
    const packRef = doc(db, "investment_packs", id);
    const snap = await getDoc(packRef);

    if (!snap.exists()) {
      return NextResponse.json({
        success: false,
        message: "Package not found",
        requestedId: id,
      });
    }

    return NextResponse.json({
      success: true,
      pack: { id: snap.id, ...snap.data() },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}