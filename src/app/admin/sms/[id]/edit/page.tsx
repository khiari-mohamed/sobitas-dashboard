import SMSEditForm from '@/components/sms/SMSEditForm';
import { useParams } from 'next/navigation';

export default function SMSEditPage() {
 
  return (
    <div className="p-4">
      <SMSEditForm />
    </div>
  );
}
