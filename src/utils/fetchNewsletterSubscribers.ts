import { NewsletterSubscriber } from "@/types/newsletter-subscriber";

/** Fetch all newsletter subscribers */
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  const res = await fetch("/api/newsletter/subscribers", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch newsletter subscribers");
  return res.json();
}

/** Add a new subscriber */
export async function addSubscriber(email: string): Promise<void> {
  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      customerName: "Manual Add",
      customerEmail: email,
      unsubscribeLink: "https://protein.tn/unsubscribe?email=" + encodeURIComponent(email),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add subscriber");
}

/** Delete a subscriber */
export async function deleteSubscriber(id: string): Promise<void> {
  const res = await fetch(`/api/newsletter/subscribers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete subscriber");
}

/** Send a campaign to all subscribers */
export async function sendCampaign(subject: string, body: string, recipients: string[]): Promise<void> {
  const res = await fetch("/api/newsletter/send-campaign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, body, recipients }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send campaign");
}