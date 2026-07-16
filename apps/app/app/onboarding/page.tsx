import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/auth/session";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();
  if (profile?.provisionedAt) redirect("/dashboard");

  return <OnboardingWizard email={user.email ?? "Verified account"} />;
}
