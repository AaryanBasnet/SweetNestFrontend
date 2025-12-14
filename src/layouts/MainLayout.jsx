import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />
      <main className="grow ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
