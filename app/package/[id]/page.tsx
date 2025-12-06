"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PackagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    console.log("Package ID from URL:", id);

    const fetchPack = async () => {
      try {
        const res = await fetch(`/api/package/${id}`);
        const data = await res.json();

        if (data.success) {
          setPack(data.pack);
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [id]);

  if (loading) {
    return <div className="p-10">Loading package...</div>;
  }
  if (!pack) {
    return <div className="p-10">Package data not found</div>;
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{pack.name}</h1>
      <h1 className="mb-4">💸 Amount: ₹{pack.amount}</h1>
      <h1 className="mb-4">📈 APY: {pack.apy}%</h1>
      <h1 className="mb-4 flex justify-start items-center gap-2">
        {pack.risk === "low" ? (
          <div className="rounded-full bg-green-500 w-4 h-4" />
        ) : (
          <div className="rounded-full bg-red-700 w-4 h-4" />
        )}{" "}
        Risk: {pack.risk}
      </h1>
      <h1 className="text-gray-600 mb-2">Description: {pack.description}</h1>

      <button
        onClick={() => router.push("/dashboard")}
        className="bg-amber-500 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
