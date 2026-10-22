import { LoginCard } from "./v1/components/LoginCard";
import { ToastContainer } from "react-toastify";
import LoginPageFooter from "./v1/components/LoginPageFooter";

const LoginPage = () => {
  return (
    <main className="relative min-h-screen bg-[#06070B] text-white flex flex-col justify-center py-6 sm:py-10 lg:py-16 px-3.5 sm:px-6 lg:px-8 overflow-hidden select-none">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      {/* Ambient background glow & subtle cyber grid */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#312e810a_1px,transparent_1px),linear-gradient(to_bottom,#312e810a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto flex item-center gap-8 lg:gap-14  z-10">
        {/* Right Column: Login Card */}
        <div className="lg:col-span-6 flex justify-center w-full">
          <LoginCard />
        </div>
      </div>

      <LoginPageFooter />
    </main>
  );
};

export default LoginPage;
