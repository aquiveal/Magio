'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Mail, Radar, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, href: '/overview' },
  { label: 'Emails', icon: <Mail className="w-4 h-4" />, href: '/emails' },
];

export function SidebarNav({ username }: { username?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <aside className="w-56 border-r border-border bg-sidebar flex flex-col h-screen fixed left-0 top-0">
      <div className="p-5 border-b border-border">
        <Link href="/overview" className="flex items-center gap-2.5">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">Magio</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {username && (
        <div className="p-3 border-t border-border">
          <div className="px-3 py-1.5 text-[11px] text-muted-foreground truncate">
            Signed in as <span className="font-medium text-foreground">{username}</span>
          </div>
          <button
            onClick={logout}
            className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
