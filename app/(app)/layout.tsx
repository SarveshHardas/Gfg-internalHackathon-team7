import BottomNavbar from "@/components/BottomNavbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNavbar />
    </>
  );
}
