import Navbar from "@/components/shared/Navbar";

const commonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
};
export default commonLayout;
