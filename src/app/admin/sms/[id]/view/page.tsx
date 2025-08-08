import SMSViewClient from '@/components/sms/SMSViewClient';
import { useParams } from 'next/navigation';

export default function SMSViewPage() {

  return (
    <div className="p-4">
      <SMSViewClient />
    </div>
  );
}
