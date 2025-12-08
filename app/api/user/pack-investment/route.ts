import {NextResponse} from 'next/server';
import {db} from "../../../../firebase";
import {collection, getDocs, query, where} from 'firebase/firestore';
import { count } from 'console';

export async function POST(req: Request){
    try{
        const {userId, packId} = await req.json();

        const q = query(
            collection(db, "investments"),
            where("userId","==",userId),
            where("packId","==",packId)
        );

        const snapShot = await getDocs(q);

        let totalInvested = 0;

        snapShot.forEach((doc) => {
            const data = doc.data();
            totalInvested += data.amount;
        });

        return NextResponse.json({
            success:true,
            totalInvested,
            count: snapShot.size,
        });
    }catch(err: any){
        return NextResponse.json({
            success: false,
            message: err.message,
        });
    }
}