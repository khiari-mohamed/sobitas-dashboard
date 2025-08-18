import ContactEditForm from '@/components/contacts/ContactEditForm';

export default function ContactEditPage() {
  // The actual id will be passed as a prop in the client component
  // or fetched via useParams in a client component
  return (
    <div className="p-4">
      <ContactEditForm />
    </div>
  );
}
