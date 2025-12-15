import Link from "next/link";

export default function Page() {
    return (
        <div
            className="flex justify-center items-center min-h-screen bg-[linear-gradient(to_bottom_left,rgba(0,0,0,0.6),rgba(0,0,0,0.8)),url('/login-bg.jpg')] bg-cover bg-center">
            <form
                className={"flex flex-col justify-between items-center bg-gray-50/6 px-15 py-35 rounded-xl w-fit max-w-7xl border-2 border-black"}>
                <input
                    type={"text"}
                    placeholder={"Enter your mobile number"}
                    className={"px-3 py-2 rounded-lg border-b-3 focus:outline-0 text-black"}
                />
                <Link href={"/WorkinProgress"}>
                    <button type="submit" className={"text-white font-bold bg-emerald-600 p-4 rounded-lg w-full hover:scale-105 transition-transform duration-200"}>
                        Send OTP
                    </button>
                </Link>
            </form>
        </div>
    );
}