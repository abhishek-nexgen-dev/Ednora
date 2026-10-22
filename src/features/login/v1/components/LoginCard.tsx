import { toast } from "react-toastify";
import useLoginForm from "../hooks/useLoginForm";
import useLogin, { LoginResult } from "../hooks/useLogin";
import { getErrorMessage } from "../../../../Utils/api.utils";
import { Building2, Mail, Lock, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";
import { SocialLogin } from "./SocialLogin";
import { SecurityBadges } from "./SecurityBadges";
import { AuthFooter } from "./AuthFooter";
import Input from "../../../../Components/Input";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStorage from "../hooks/useAuthStorage";

export function LoginCard() {
  const { watch, setValue, formState, handleSubmit } = useLoginForm();
  const { errors } = formState;
  const [email, setEmail] = useState(watch("email"));
  const [password, setPassword] = useState(watch("password"));
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const TEST_CREDENTIALS = {
    email: "admin@gmail.com",
    password: "Admin@123",
  };

  const fillTestCredentials = () => {
    setValue("email", TEST_CREDENTIALS.email, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("password", TEST_CREDENTIALS.password, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setEmail(TEST_CREDENTIALS.email);
    setPassword(TEST_CREDENTIALS.password);
    toast.info("Demo credentials loaded! Click 'Sign In' to proceed.");
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const res: LoginResult = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      const user = res?.data?.user || res?.user || res?.data;

      if (user && user.role && user.role !== "admin") {
        toast.error("You are not authorized to access this portal.");
        return;
      }

      toast.success("Credentials clearance verified! Entering dashboard...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-zinc-800/90 bg-[#0A0B10]/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] p-6 sm:p-8 relative overflow-hidden">
      {/* Top subtle highlight glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <Header />

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 p-3 sm:p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <KeyRound size={15} />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white">Default Admin</span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded border border-indigo-500/30">
                SuperAdmin
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono truncate">
              admin@gmail.com • Admin@123
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fillTestCredentials}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 shrink-0"
        >
          Autofill
        </button>
      </div>

      <form className="space-y-4 sm:space-y-5 mt-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          name="email"
          label="Institutional Email"
          placeholder="admin@gmail.com"
          type="email"
          value={email}
          leftIcon={<Mail size={16} />}
          onChange={(_name, value) => {
            setValue("email", value);
            setEmail(value);
          }}
          error={errors.email?.message}
          readonly={false}
        />

        <Input
          name="password"
          label="Security Password"
          placeholder="Enter access password"
          type={showPassword ? "text" : "password"}
          value={password}
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-500 hover:text-zinc-300 p-1 focus:outline-none transition"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          onChange={(_name, value) => {
            setValue("password", value);
            setPassword(value);
          }}
          error={errors.password?.message}
          readonly={false}
        />

        <Options />

        <SignInButton loading={loginMutation.isPending} />
      </form>

      <SocialLogin />

      <SecurityBadges />

      <AuthFooter />
    </div>
  );
}

function Header() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 text-white items-center justify-center rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 shadow-lg shadow-indigo-500/20">
        <Building2 size={28} className="text-indigo-400" />
      </div>

      <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
        CIITM ERP
      </h1>

      <p className="mt-1 text-xs sm:text-sm text-zinc-400">
        Institutional Governance & Administrative Portal
      </p>
    </div>
  );
}

function Options() {
  const isRememberMe = useAuthStorage((state) => state.isRememberMe);
  const setIsRememberMe = useAuthStorage((state) => state.setIsRememberMe);

  const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsRememberMe(event.target.checked);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isRememberMe}
          onChange={handleRememberMeChange}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0"
        />
        Remember session
      </label>

      <Link
        to="/forgot-password"
        className="font-medium text-indigo-400 hover:text-indigo-300 transition"
      >
        Forgot Password?
      </Link>
    </div>
  );
}

function SignInButton({ loading }: { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="
      h-12
      w-full
      rounded-xl
      bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400
      font-semibold
      text-xs sm:text-sm
      text-white
      shadow-xl shadow-indigo-600/25
      transition-all
      active:scale-[0.99]
      disabled:opacity-60
      flex items-center justify-center gap-2
    "
    >
      {loading ? (
        <>
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Authenticating Clearance...</span>
        </>
      ) : (
        <>
          <ShieldCheck size={17} />
          <span>Sign In to Portal</span>
        </>
      )}
    </button>
  );
}
