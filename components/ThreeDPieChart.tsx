"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useState } from "react";

interface PieData {
  name: string;
  value: number;
}

interface ThreeDPieChartProps {
  data: PieData[];
  totalInvestment: number; // ✅ NEW
}

const COLORS = ["#22c55e", "#0ea5e9", "#f59e0b", "#6366f1", "#ec4899"];

function PieSlice({
  startAngle,
  endAngle,
  color,
  label,
  percent,
  amount,
}: {
  startAngle: number;
  endAngle: number;
  color: string;
  label: string;
  percent: number;
  amount: number;
}) {
  const [hovered, setHovered] = useState(false);

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.arc(0, 0, 2, startAngle, endAngle, false);
  shape.lineTo(0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.4,
    bevelEnabled: false,
  });

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.3} />

      {/* ✅ HOVER TOOLTIP */}
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black text-white px-3 py-2 rounded-lg text-sm shadow-lg">
            <p className="font-bold">{label.toUpperCase()}</p>
            <p>📊 {percent.toFixed(1)}%</p>
            <p>💰 ₹{amount.toFixed(0)}</p>
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function ThreeDPieChart({
  data,
  totalInvestment,
}: ThreeDPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="w-full h-[300px]">
      <Canvas camera={{ position: [0, 3, 4] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {data.map((item, index) => {
          const sliceAngle = (item.value / total) * Math.PI * 2;
          const start = currentAngle;
          const end = currentAngle + sliceAngle;
          currentAngle += sliceAngle;

          const investedAmount =
            (item.value / 100) * totalInvestment;

          return (
            <PieSlice
              key={item.name}
              startAngle={start}
              endAngle={end}
              color={COLORS[index % COLORS.length]}
              label={item.name}
              percent={item.value}
              amount={investedAmount}
            />
          );
        })}

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}