import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Video, Mail, Lock, User } from "lucide-react";
import AuthGlobe from "../components/AuthGlobe";
import { useAuth0 } from "@auth0/auth0-react";
import Notice from "../components/Notice";

export default function Auth() {
  const [notice, setNotice] = useState({ type: "", msg: "" });

  const [form, setForm] = useState({
    identifier: "",
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [mode, setMode] = useState("login"); // login | signup

  const { loginWithRedirect, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  const navigate = useNavigate();

  const showNotice = (type, msg, time = 3000) => {
    setNotice({ type, msg });
    if (time) setTimeout(() => setNotice({ type: "", msg: "" }), time);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuth = async () => {
    try {
      // ✅ frontend validations (no empty backend calls)
      if (mode === "login") {
        if (!form.identifier.trim() || !form.password.trim()) {
          showNotice("error", "Please enter username/email and password");
          return;
        }
      }

      if (mode === "signup") {
        if (
          !form.name.trim() ||
          !form.username.trim() ||
          !form.email.trim() ||
          !form.password.trim()
        ) {
          showNotice("error", "Please fill all signup fields");
          return;
        }
      }

      const url =
        mode === "login"
          ? "http://localhost:8080/api/v1/auth/login"
          : "http://localhost:8080/api/v1/auth/register";

      const payload =
        mode === "login"
          ? {
              identifier: form.identifier,
              password: form.password,
            }
          : {
              name: form.name,
              username: form.username,
              email: form.email,
              password: form.password,
            };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // backend might return error inside message/data
        const backendMsg =
          data?.message || data?.data || "Authentication failed";
        showNotice("error", backendMsg);
        return;
      }

      // ✅ LOGIN success
      if (mode === "login") {
        // Your backend structure:
        // {
        //   statusCode: 200,
        //   data: "Login successful",
        //   message: { token, user },
        //   success: true
        // }
        const token = data?.message?.token || data?.data?.token;
        const userObj = data?.message?.user || data?.data?.user;

        if (!token) {
          showNotice("error", "No token returned from backend");
          return;
        }

        localStorage.setItem("token", token);

        // ✅ store user so Home doesn’t show Guest
        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
        }

        showNotice("success", "Login successful ✅ Redirecting...", 1200);
        setTimeout(() => navigate("/home"), 600);
        return;
      }

      // ✅ SIGNUP success
      showNotice("success", "Account created ✅ Now login!", 1200);
      setTimeout(() => {
        setMode("login");
        setNotice({ type: "", msg: "" });
      }, 1200);
    } catch (err) {
      console.error(err);
      showNotice("error", "Something went wrong");
    }
  };

  // ✅ reset form when switching mode
  useEffect(() => {
    setForm({
      identifier: "",
      username: "",
      name: "",
      email: "",
      password: "",
    });
  }, [mode]);

  // ✅ Auth0 flow sync -> backend jwt
  useEffect(() => {
    const syncAuth0ToBackend = async () => {
      try {
        if (!isAuthenticated) return;

        const alreadyHasToken = localStorage.getItem("token");
        if (alreadyHasToken) {
          navigate("/home");
          return;
        }

        const auth0Token = await getAccessTokenSilently();

        const res = await fetch("http://localhost:8080/api/v1/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth0Token}`,
          },
        });

        const data = await res.json();

        const token = data?.token || data?.data?.token || data?.message?.token;
        const userObj = data?.user || data?.data?.user || data?.message?.user;

        if (token) {
          localStorage.setItem("token", token);
          if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
          navigate("/home");
        } else {
          console.log("Auth backend failed:", data);
          showNotice("error", "Google login failed");
        }
      } catch (err) {
        console.error("Auth0 sync error:", err);
        showNotice("error", "Google login sync failed");
      }
    };

    syncAuth0ToBackend();
  }, [isAuthenticated, getAccessTokenSilently, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-white">
      {/* Navbar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
            <Video className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wide">
            VideoConnect
          </span>
        </Link>

        <Link
          to="/"
          className="rounded-xl px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 transition"
        >
          Back to Home
        </Link>
      </header>

      {/* Auth */}
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Globe Panel */}
          <div className="hidden lg:flex relative h-[520px] rounded-[2rem] overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

            <div className="relative w-full p-10 flex flex-col justify-between">
              <div>
                <p className="text-3xl font-bold">Connect globally.</p>
                <p className="mt-2 text-sm text-zinc-300 max-w-sm leading-relaxed">
                  Real-time peer-to-peer video meetings with secure rooms and
                  JWT login.
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <AuthGlobe />
              </div>

              <p className="text-xs text-zinc-400">
                WebRTC • Socket.io • Secure rooms
              </p>
            </div>
          </div>

          {/* Right card */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem]" />
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
              {/* Toggle */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-black/30 border border-white/10 p-2">
                <button
                  onClick={() => setMode("login")}
                  className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-white text-black cursor-pointer"
                      : "text-white hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`w-full rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-white text-black cursor-pointer"
                      : "text-white hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  Sign up
                </button>
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {mode === "login"
                  ? "Login to start or join meetings instantly."
                  : "Sign up to access your meeting history."}
              </p>

              <Notice
                notice={notice}
                onClose={() => setNotice({ type: "", msg: "" })}
              />

              {/* Form */}
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => e.preventDefault()}
              >
                {mode === "login" && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                    <User className="h-5 w-5 text-zinc-400" />
                    <input
                      type="text"
                      name="identifier"
                      value={form.identifier}
                      onChange={handleChange}
                      placeholder="Username or Email"
                      autoComplete="off"
                      className="w-full bg-transparent text-white outline-none text-sm placeholder:text-zinc-500"
                    />
                  </div>
                )}

                {mode === "signup" && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                    <User className="h-5 w-5 text-zinc-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      autoComplete="off"
                      className="w-full bg-transparent text-white outline-none text-sm placeholder:text-zinc-500"
                    />
                  </div>
                )}

                {mode === "signup" && (
                  <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                    <User className="h-5 w-5 text-zinc-400" />
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Username"
                      autoComplete="off"
                      className="w-full bg-transparent text-white outline-none text-sm placeholder:text-zinc-500"
                    />
                  </div>
                )}

                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    autoComplete="off"
                    className="w-full bg-transparent text-white outline-none text-sm placeholder:text-zinc-500"
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3 focus-within:ring-2 focus-within:ring-purple-500/40 transition">
                  <Lock className="h-5 w-5 text-zinc-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full bg-transparent text-white outline-none text-sm placeholder:text-zinc-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAuth}
                  className="w-full rounded-2xl px-6 py-3 font-semibold bg-white text-black hover:bg-zinc-200 transition cursor-pointer"
                >
                  {mode === "login" ? "Login" : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: {
                        connection: "google-oauth2",
                      },
                    })
                  }
                  className="w-full rounded-2xl px-6 py-3 font-semibold bg-white/10 hover:bg-white/15 transition cursor-pointer"
                >
                  Continue with Google
                </button>

                {mode === "login" && (
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Forgot password?</span>
                    <button
                      type="button"
                      className="hover:text-white transition"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </form>

              <p className="mt-6 text-xs text-zinc-500">
                By continuing, you agree to our{" "}
                <span className="text-zinc-300 hover:text-white cursor-pointer transition">
                  Terms
                </span>{" "}
                and{" "}
                <span className="text-zinc-300 hover:text-white cursor-pointer transition">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
