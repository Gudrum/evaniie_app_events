import EventDashboard from "@/components/dashboard/EventDashboard";

export const metadata = {
  title: "Dashboard de Eventos | Evaniie",
  description: "Gestiona y crea eventos para tu comunidad con Evaniie",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <EventDashboard />
    </div>
  );
}
