import BottomNavbar from "@/components/BottomNavbar";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="space-y-25">
      {children}
      <BottomNavbar />
      </div>
    </div>
  );
}
