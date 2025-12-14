import Image from "next/image";


const Page = () =>{
    return (
        <>
            <div className={"flex justify-center items-center min-h-screen"}>
                <Image src={"/work-in-progress.png"} alt={"Work in Progress"} width={800} height={800} className={"absolute top-0 center-0"} />
            </div>
        </>
    );
}

export default Page;