import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header wide />
      <main className="grow ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
