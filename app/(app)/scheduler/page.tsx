import SchedulerDashboard from '@/common/components/SchedulerDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Scheduler | herocast',
    description: 'Manage your upcoming Farcaster posts.',
};

export default function SchedulerPage() {
    return <SchedulerDashboard />;
}
