"use client";

import { useActionState, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, MailCheck } from "lucide-react";
import { Button, Field, FieldError, FieldHint, Input, Label } from "@netlium/ui";
import { signup } from "../actions";
import { initialAuthActionState } from "../schema";
import { AuthShell } from "../components/AuthShell";
import { AuthCard } from "../components/AuthCard";
import { StepTransition } from "../components/StepTransition";
import { NetliumMark } from "../components/NetliumMark";

type Step = "welcome" | "email" | "password";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "h-10 rounded-[8px] border-[color:var(--color-border-whisper)] bg-surface-1 transition-[border-color,box-shadow] focus:border-accent-emerald focus:shadow-[var(--shadow-focus-ring-emerald)]";
const ctaClass = "h-11 w-full rounded-[8px]";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialAuthActionState);
  const [step, setStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [capsLock, setCapsLock] = useState(false);

  function handleEmailContinue() {
    if (!EMAIL_PATTERN.test(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);
    setStep("password");
  }

  function handleEmailKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleEmailContinue();
    }
  }

  function trackCapsLock(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState?.("CapsLock") ?? false);
  }

  function handleCreateAccount(event: FormEvent<HTMLFormElement>) {
    if (password.length < 8) {
      event.preventDefault();
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      event.preventDefault();
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError(null);
  }

  if (state.success) {
    return (
      <AuthShell>
        <AuthCard className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-accent-emerald/10 text-accent-emerald">
            <MailCheck className="size-4" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-h4 font-semibold tracking-tight text-text-warm">Check your email</h1>
            <p className="text-body-sm text-text-secondary text-balance">
              We sent a confirmation link to your email address. Follow it to activate your account.
            </p>
          </div>
          <Link href="/login" className="text-body-sm font-medium text-accent-emerald hover:brightness-110">
            Return to sign in
          </Link>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AnimatePresence mode="wait">
        {isPending ? (
          <StepTransition stepKey="authenticating">
            <AuthCard className="flex flex-col items-center gap-4 py-12 text-center">
              <NetliumMark size={36} animated />
              <div className="space-y-1">
                <p className="text-body font-semibold text-text-warm">Creating your workspace</p>
                <p className="text-body-sm text-text-muted">One moment&hellip;</p>
              </div>
            </AuthCard>
          </StepTransition>
        ) : (
          <StepTransition stepKey={step}>
            <AuthCard>
              <form action={formAction} onSubmit={handleCreateAccount} className="contents">
                <input type="hidden" name="email" value={email} readOnly />
                <input type="hidden" name="password" value={password} readOnly />
                <input type="hidden" name="confirmPassword" value={confirmPassword} readOnly />

                {step === "welcome" && (
                  <div className="flex flex-col items-center gap-6 text-center">
                    <NetliumMark size={40} />
                    <div className="space-y-2">
                      <h1 className="text-h2 font-semibold leading-tight tracking-tight text-text-warm text-balance">
                        Built for professional operators.
                      </h1>
                      <p className="text-body-sm text-text-secondary text-balance">
                        Create your institutional capital workspace.
                      </p>
                    </div>
                    <Button type="button" variant="accent" className={ctaClass} onClick={() => setStep("email")}>
                      Continue
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}

                {step === "email" && (
                  <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                      <h2 className="text-h4 font-semibold leading-tight tracking-tight text-text-warm">
                        Create your account
                      </h2>
                      <p className="text-body-sm text-text-secondary">
                        Enter the email address for your Netlium workspace.
                      </p>
                    </div>
                    <Field>
                      <Label htmlFor="signup-email">Email address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        autoFocus
                        autoComplete="email"
                        inputMode="email"
                        placeholder="investor@example.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (emailError) setEmailError(null);
                        }}
                        onKeyDown={handleEmailKeyDown}
                        aria-invalid={Boolean(emailError)}
                        className={inputClass}
                      />
                      <FieldError>{emailError}</FieldError>
                    </Field>
                    <Button type="button" variant="accent" className={ctaClass} onClick={handleEmailContinue}>
                      Continue
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                    <p className="text-center text-body-sm text-text-secondary">
                      Already have an account?{" "}
                      <Link href="/login" className="font-medium text-accent-emerald hover:brightness-110">
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}

                {step === "password" && (
                  <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                      <h2 className="text-h4 font-semibold leading-tight tracking-tight text-text-warm">
                        Create a password
                      </h2>
                      <button
                        type="button"
                        onClick={() => setStep("email")}
                        className="text-body-sm text-text-secondary hover:text-text-primary"
                      >
                        {email} · <span className="font-medium text-accent-emerald">Change</span>
                      </button>
                    </div>
                    <Field>
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        autoFocus
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (passwordError) setPasswordError(null);
                        }}
                        onKeyUp={trackCapsLock}
                        aria-invalid={Boolean(passwordError ?? state.error)}
                        className={inputClass}
                      />
                      {capsLock && <FieldHint>Caps Lock is on</FieldHint>}
                      <FieldHint>At least 8 characters.</FieldHint>
                    </Field>
                    <Field>
                      <Label htmlFor="signup-confirm-password">Confirm password</Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          if (passwordError) setPasswordError(null);
                        }}
                        aria-invalid={Boolean(passwordError)}
                        className={inputClass}
                      />
                      <FieldError>{passwordError ?? state.error}</FieldError>
                    </Field>
                    <Button type="submit" variant="accent" className={ctaClass} loading={isPending}>
                      Create account
                    </Button>
                  </div>
                )}
              </form>
            </AuthCard>
          </StepTransition>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
