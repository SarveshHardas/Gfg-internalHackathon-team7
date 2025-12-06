import {NextResponse} from "next/server";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../../../firebase";

export async function GET(){
    try{
        const packSnapShot = await getDocs(collection(db, "investment_packs"));
        const packs = packSnapShot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return NextResponse.json({
            success: true,
            message: "Investment packs fetched successfully.",
            packs
        });
    }catch(err: any){
        console.log(err)
        return NextResponse.json({
            success: false,
            message: err.message,
        });
    }


}