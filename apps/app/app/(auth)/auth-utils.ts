export function readRequiredField(
  formData: FormData,
  field: string,
): string | null {
  const value = formData.get(field);
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;

export function isValidEmail(value: string | null): value is string {
  return Boolean(value && emailPattern.test(value));
}

export function meetsPasswordRequirements(
  value: string | null,
): value is string {
  return Boolean(value && passwordPattern.test(value));
}

export function safeInternalPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://neptlium.invalid");
    return url.origin === "https://neptlium.invalid"
      ? `${url.pathname}${url.search}`
      : fallback;
  } catch {
    return fallback;
  }
}
