import {NextResponse} from "next/server";
import {db} from '../../../firebase';
import {doc, setDoc} from "firebase/firestore";

export async function GET(){
    try{
        const packs=[
            {
                id:"goldMini",
                name:"Gold Mini",
                amount: 10,
                apy: 8,
                risk:"high",
                description:"Safe digital gold investment with stable growth and low risk."
            },{
                id:"tenDaily",
                name:"₹10 Daily Saver",
                amount: 10,
                apy:7,
                risk:"low",
                description:"Build a daily savings habit with ₹10 per day."
            },{
                id:"monthly50",
                name:"₹50 Monthly Secure Plan",
                amount:50,
                apy:7.5,
                risk: "low",
                description: "Monthly safe investment with stable returns.",
            },{
                id:"emergencyFund",
                name:"Emergency Fund Builder",
                amount:50,
                apy:7,
                risk: "low",
                description: "Emergency ready saving for tough times."
            }
        ]

        for(const pack of packs){
            await setDoc(doc(db,"investment_packs",pack.id),pack);
        }

        return NextResponse.json({
            success:true,
            message:"Investment packs seeded successfully."
        });



    }catch(err : any){
        return NextResponse.json({
            success:false,
            message:err.message
        });
    }
}