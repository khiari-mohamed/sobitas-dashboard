import { Client } from "@/types/client";

export function exportClientsToCsv(clients: Client[]) {
  const headers = ["Name", "Email", "Phone", "Adresse", "Ville", "Subscriber"];
  const rows = clients.map(c => [
    c.name, c.email, c.phone_1, c.adresse, c.ville, c.subscriber ? "Yes" : "No"
  ]);
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "clients.csv";
  a.click();
  URL.revokeObjectURL(url);
}