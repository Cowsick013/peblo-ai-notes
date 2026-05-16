'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Archive,
  Share2,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/button'
import { Separator } from '@/components/separator'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'All Notes', href: '/dashboard/notes', icon: FileText },
  { label: 'Archived', href: '/dashboard/archived', icon: Archive },
  { label: 'Shared', href: '/dashboard/shared', icon: Share2 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-60 border-r flex flex-col h-full shrink-0 bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">P</span>
        </div>
        <span className="font-semibold text-base">Peblo</span>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
           className={cn(
  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
  (pathname === href || (href !== '/dashboard' && pathname.startsWith(href)))
    ? 'bg-secondary text-foreground font-medium'
    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
)}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground text-sm"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Sign out
        </Button>
      </div>
    </aside>
  )
}