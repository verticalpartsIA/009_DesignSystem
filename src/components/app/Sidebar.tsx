import { useState, type ElementType } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useAuth, type Profile } from '@/lib/auth'
import { cn } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  icon: ElementType
}

interface SidebarProps {
  navItems: NavItem[]
  collapsed?: boolean
  onToggle?: () => void
}

function UserBadge({ profile, collapsed }: { profile: Profile; collapsed: boolean }) {
  const initials = (profile.name || profile.email).slice(0, 2).toUpperCase()
  return (
    <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-2 ring-primary/30">
        <span className="text-xs font-bold text-primary">{initials}</span>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white leading-none">{profile.name}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">{profile.level}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Sidebar escura com navegação, logo, usuário e botão de colapso.
 * Ponto de entrada padrão para todos os apps VerticalParts.
 */
export function Sidebar({ navItems, collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const { profile, signOut } = useAuth()

  const collapsed   = controlledCollapsed ?? internalCollapsed
  const handleToggle = onToggle ?? (() => setInternalCollapsed((c) => !c))

  return (
    <aside
      className={cn(
        'dark-scroll flex h-full flex-col overflow-y-auto bg-surface border-r border-surface-border transition-all duration-200',
        collapsed ? 'w-[60px]' : 'w-[220px]',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center border-b border-surface-border px-4 py-5', collapsed && 'justify-center px-0')}>
        {collapsed
          ? <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"><span className="text-[11px] font-black text-black">VP</span></div>
          : <Logo variant="dark" size="sm" />}
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-0.5 p-2 pt-3">
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-slate-400 hover:bg-surface-card hover:text-white',
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé: usuário + logout */}
      <div className="border-t border-surface-border p-3 space-y-2">
        {profile && <UserBadge profile={profile} collapsed={collapsed} />}
        <button
          onClick={() => signOut()}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-surface-card hover:text-red-400',
            collapsed && 'justify-center px-0',
          )}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && 'Sair'}
        </button>
        <button
          onClick={handleToggle}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-600 transition-colors hover:bg-surface-card hover:text-white',
            collapsed && 'justify-center px-0',
          )}
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5" />
            : <><ChevronLeft className="h-3.5 w-3.5" /><span>Recolher</span></>}
        </button>
      </div>
    </aside>
  )
}
