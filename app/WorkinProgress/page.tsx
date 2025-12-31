import Image from "next/image";


const Page = () =>{
    return (
        <>
            <div className={"flex justify-center items-center min-h-screen"}>
                <Image src={"/workInProgress.png"} alt={"Work in Progress"} width={600} height={600} className={"absolute top-0 center-0"} />
            </div>
            <p className={"relative text-center font-[Antigravity] text-2xl"}>Please return back...</p>
        </>
    );
}

export default Page;