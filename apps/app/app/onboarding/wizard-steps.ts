export const onboardingSteps = [
  { key: "identity", label: "Identity" },
  { key: "purpose", label: "Purpose" },
  { key: "profile", label: "Profile" },
  { key: "security", label: "Security" },
  { key: "compliance", label: "Compliance" },
  { key: "provisioning", label: "Provisioning" }
] as const;

export type OnboardingStepKey = (typeof onboardingSteps)[number]["key"];
