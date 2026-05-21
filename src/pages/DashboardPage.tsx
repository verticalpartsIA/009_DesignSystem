import { LayoutDashboard, Users, BarChart2, Package, ClipboardList } from 'lucide-react'
import { AppShell } from '@/components/app/AppShell'
import ShowcasePage from './ShowcasePage'

const NAV = [
  { label: 'Dashboard',  href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clientes',   href: '/clientes',  icon: Users           },
  { label: 'Relatórios', href: '/relatorios',icon: BarChart2       },
  { label: 'Estoque',    href: '/estoque',   icon: Package         },
  { label: 'Tarefas',    href: '/tarefas',   icon: ClipboardList   },
]

export default function DashboardPage() {
  return (
    <AppShell navItems={NAV} pageTitle="Design System — Vitrine de Componentes">
      <ShowcasePage embedded />
    </AppShell>
  )
}
