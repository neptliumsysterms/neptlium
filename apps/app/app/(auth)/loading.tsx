import { AuthShell } from "./components/AuthShell";
import { AuthCard } from "./components/AuthCard";
import { NetliumMark } from "./components/NetliumMark";

export default function AuthLoading() {
  return (
    <AuthShell>
      <AuthCard className="flex flex-col items-center gap-4 py-12 text-center">
        <NetliumMark size={36} animated />
        <p className="text-body-sm text-text-muted">Loading&hellip;</p>
      </AuthCard>
    </AuthShell>
  );
}
