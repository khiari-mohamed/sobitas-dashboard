import ContactViewClient from '@/components/contacts/ContactViewClient';

export default function ContactViewPage() {
  // The actual id will be passed as a prop in the client component
  // or fetched via useParams in a client component
  return (
    <div className="p-4">
      <ContactViewClient />
    </div>
  );
}
