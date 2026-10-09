import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, LogOut, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "signin" | "signup";

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, signIn, signUp, signOut, error: contextError, clearError } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear fields and errors when modal opens/closes or changes mode
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      setSuccessMessage(null);
      clearError();
    }
  }, [isOpen, mode, clearError]);

  const handleModeSwitch = (newMode: AuthMode) => {
    setMode(newMode);
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
  };

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setLocalError("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match. Please re-enter.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === "signin") {
        await signIn(trimmedEmail, password);
        setSuccessMessage("Welcome back to Queen's Bakery.");
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        await signUp(trimmedEmail, password);
        setSuccessMessage("Your account has been created successfully!");
        setTimeout(() => {
          onClose();
        }, 1400);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await signOut();
      setSuccessMessage("You have been signed out.");
      setTimeout(() => {
        setSuccessMessage(null);
        setMode("signin");
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign out.";
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || contextError;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#171614]/50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            id="auth-modal-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md bg-[#F7F4EE] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#D8D0C3] overflow-hidden p-6 sm:p-8 text-[#171614]"
          >
            {/* Header with Close */}
            <div className="flex items-start justify-between pb-4 border-b border-[#D8D0C3]/70">
              <div>
                <span className="font-serif text-2xl font-semibold text-[#171614] tracking-tight block">
                  Queen's Bakery
                </span>
                <span className="text-xs text-[#171614]/60 tracking-wider uppercase">
                  Haute Pâtisserie Account
                </span>
              </div>
              <button
                id="auth-modal-close-btn"
                onClick={onClose}
                className="p-1.5 text-[#171614]/60 hover:text-[#6B1E2B] transition-colors rounded-full hover:bg-[#EFE9DE] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authenticated State vs Guest State */}
            {user ? (
              <div className="py-6 space-y-6">
                <div className="text-center space-y-3 pt-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#EAE3D4] border border-[#D8D0C3] flex items-center justify-center text-[#6B1E2B] font-serif text-xl font-bold shadow-inner">
                    {user.email ? user.email.charAt(0).toUpperCase() : "Q"}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#171614]/50 font-medium">
                      Signed in as
                    </div>
                    <div className="text-base font-semibold text-[#171614] mt-0.5 break-all">
                      {user.email}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAE3D4]/80 text-[#6B1E2B] text-xs border border-[#D8D0C3]/80">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Royal Patron Member</span>
                  </div>
                </div>

                {successMessage && (
                  <div className="p-3 rounded-xl bg-[#E8F3EB] border border-[#A7D7B5] text-[#20603D] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {activeError && (
                  <div className="p-3 rounded-xl bg-[#FDEDEC] border border-[#F5B7B1] text-[#922B21] text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{activeError}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#D8D0C3]/70 space-y-3">
                  <button
                    id="auth-signout-btn"
                    onClick={handleSignOut}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#EFE9DE] hover:bg-[#E2D9CA] text-[#6B1E2B] font-medium text-sm border border-[#D8D0C3] transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SIGNING OUT...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-xs text-[#171614]/60 hover:text-[#171614] text-center transition-colors cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-5 space-y-5">
                {/* Switcher Tabs */}
                <div className="grid grid-cols-2 p-1 bg-[#EAE3D4] rounded-xl border border-[#D8D0C3]">
                  <button
                    id="tab-signin-btn"
                    type="button"
                    onClick={() => handleModeSwitch("signin")}
                    className={`py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                      mode === "signin"
                        ? "bg-[#F7F4EE] text-[#6B1E2B] shadow-xs"
                        : "text-[#171614]/60 hover:text-[#171614]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    id="tab-signup-btn"
                    type="button"
                    onClick={() => handleModeSwitch("signup")}
                    className={`py-2 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${
                      mode === "signup"
                        ? "bg-[#F7F4EE] text-[#6B1E2B] shadow-xs"
                        : "text-[#171614]/60 hover:text-[#171614]"
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Status Messages */}
                {successMessage && (
                  <div className="p-3 rounded-xl bg-[#E8F3EB] border border-[#A7D7B5] text-[#20603D] text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {activeError && (
                  <div className="p-3 rounded-xl bg-[#FDEDEC] border border-[#F5B7B1] text-[#922B21] text-xs flex items-start gap-2 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{activeError}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-email-input"
                      className="block text-xs font-semibold tracking-wide uppercase text-[#171614]/70"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#171614]/40">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-email-input"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#EFE9DE]/70 border border-[#D8D0C3] rounded-xl text-sm text-[#171614] placeholder-[#171614]/40 focus:outline-none focus:border-[#6B1E2B] focus:ring-1 focus:ring-[#6B1E2B] transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="auth-password-input"
                      className="block text-xs font-semibold tracking-wide uppercase text-[#171614]/70"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#171614]/40">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-password-input"
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === "signin" ? "current-password" : "new-password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                        className="w-full pl-10 pr-10 py-2.5 bg-[#EFE9DE]/70 border border-[#D8D0C3] rounded-xl text-sm text-[#171614] placeholder-[#171614]/40 focus:outline-none focus:border-[#6B1E2B] focus:ring-1 focus:ring-[#6B1E2B] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#171614]/40 hover:text-[#171614]/70 cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (Only for Sign Up) */}
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <label
                        htmlFor="auth-confirm-password-input"
                        className="block text-xs font-semibold tracking-wide uppercase text-[#171614]/70"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#171614]/40">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="auth-confirm-password-input"
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-4 py-2.5 bg-[#EFE9DE]/70 border border-[#D8D0C3] rounded-xl text-sm text-[#171614] placeholder-[#171614]/40 focus:outline-none focus:border-[#6B1E2B] focus:ring-1 focus:ring-[#6B1E2B] transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="auth-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 rounded-xl bg-[#6B1E2B] hover:bg-[#541722] text-[#F7F4EE] font-serif text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{mode === "signin" ? "SIGNING IN..." : "CREATING ACCOUNT..."}</span>
                        </>
                      ) : (
                        <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Switch Prompt */}
                <div className="text-center pt-2 text-xs text-[#171614]/60">
                  {mode === "signin" ? (
                    <span>
                      Don't have an account yet?{" "}
                      <button
                        type="button"
                        onClick={() => handleModeSwitch("signup")}
                        className="text-[#6B1E2B] font-semibold underline underline-offset-2 hover:text-[#541722] cursor-pointer"
                      >
                        Create one here
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => handleModeSwitch("signin")}
                        className="text-[#6B1E2B] font-semibold underline underline-offset-2 hover:text-[#541722] cursor-pointer"
                      >
                        Sign in instead
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
