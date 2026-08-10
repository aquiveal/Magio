import { redirect } from 'next/navigation';
import { SidebarNav } from '@/components/sidebar-nav';
import { getCurrentUser } from '@/lib/auth/session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav username={user.username} />
      <div className="flex-1 ml-56">
        {children}
      </div>
    </div>
  );
}
