"use client";

import { useActionState, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button, Field, FieldError, FieldHint, Input, Label } from "@netlium/ui";
import { login } from "../actions";
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

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialAuthActionState);
  const [step, setStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [capsLock, setCapsLock] = useState(false);

  function goToEmail() {
    setStep("email");
  }

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

  return (
    <AuthShell>
      <AnimatePresence mode="wait">
        {isPending ? (
          <StepTransition stepKey="authenticating">
            <AuthCard className="flex flex-col items-center gap-4 py-12 text-center">
              <NetliumMark size={36} animated />
              <div className="space-y-1">
                <p className="text-body font-semibold text-text-warm">Authenticating</p>
                <p className="text-body-sm text-text-muted">Opening your secure workspace&hellip;</p>
              </div>
            </AuthCard>
          </StepTransition>
        ) : (
          <StepTransition stepKey={step}>
            <AuthCard>
              <form action={formAction} className="contents">
                <input type="hidden" name="email" value={email} readOnly />
                <input type="hidden" name="password" value={password} readOnly />

                {step === "welcome" && (
                  <div className="flex flex-col items-center gap-6 text-center">
                    <NetliumMark size={40} />
                    <div className="space-y-2">
                      <h1 className="text-h2 font-semibold leading-tight tracking-tight text-text-warm text-balance">
                        Capital operations without compromise.
                      </h1>
                      <p className="text-body-sm text-text-secondary text-balance">
                        One secure workspace for institutional capital.
                      </p>
                    </div>
                    <Button type="button" variant="accent" className={ctaClass} onClick={goToEmail}>
                      Continue
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}

                {step === "email" && (
                  <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                      <h2 className="text-h4 font-semibold leading-tight tracking-tight text-text-warm">
                        Sign in
                      </h2>
                      <p className="text-body-sm text-text-secondary">
                        Enter the email address for your Netlium workspace.
                      </p>
                    </div>
                    <Field>
                      <Label htmlFor="login-email">Email address</Label>
                      <Input
                        id="login-email"
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
                      Don&apos;t have an account?{" "}
                      <Link href="/signup" className="font-medium text-accent-emerald hover:brightness-110">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}

                {step === "password" && (
                  <div className="flex flex-col gap-6">
                    <div className="space-y-2">
                      <h2 className="text-h4 font-semibold leading-tight tracking-tight text-text-warm">
                        Enter your password
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
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        autoFocus
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyUp={trackCapsLock}
                        aria-invalid={Boolean(state.error)}
                        className={inputClass}
                      />
                      {capsLock && <FieldHint>Caps Lock is on</FieldHint>}
                      <FieldError>{state.error}</FieldError>
                    </Field>
                    <Button type="submit" variant="accent" className={ctaClass} loading={isPending}>
                      Sign in
                    </Button>
                    <p className="text-center text-body-sm">
                      <Link href="/reset-password" className="text-text-secondary hover:text-text-primary">
                        Forgot your password?
                      </Link>
                    </p>
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
