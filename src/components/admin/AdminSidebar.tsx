import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  Users, 
  Settings, 
  LogOut,
  FileText,
  DollarSign,
  Scale,
  Calendar,
  TrendingUp,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Contratos', path: '/admin/contracts' },
  { icon: DollarSign, label: 'Financeiro', path: '/admin/financial' },
  { icon: Scale, label: 'Jurídico', path: '/admin/legal' },
  { icon: TrendingUp, label: 'Relatórios', path: '/admin/reports' },
  { icon: Users, label: 'Equipe', path: '/admin/team' },
  { icon: Settings, label: 'Configurações', path: '/admin/settings' },
];

export const AdminSidebar: React.FC = () => {
  const { logout, profile } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-primary/10 bg-[#050505] transition-transform md:translate-x-0">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-10 flex items-center px-2">
          <X className="mr-3 h-8 w-8 text-primary" strokeWidth={2.5} />
          <span className="text-2xl font-black tracking-[0.1em] text-primary uppercase">Nexuris</span>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 group",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(212,175,55,0.1)] border border-primary/20" 
                    : "text-[#888] hover:text-white hover:bg-white/5"
                )
              }
            >
              <item.icon className={cn(
                "mr-4 h-5 w-5 transition-colors",
                "group-hover:text-white"
              )} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-[#111] p-4 border border-white/5 flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-primary/20">
              <AvatarImage src={profile?.photoURL || ''} />
              <AvatarFallback className="bg-primary text-black font-black">
                {profile?.displayName ? getInitials(profile.displayName) : 'JD'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {profile?.displayName || 'João Dias'}
              </p>
              <p className="text-[10px] font-medium text-[#666] uppercase tracking-wider">
                {profile?.role === 'admin' ? 'Administrador' : profile?.role === 'lawyer' ? 'Advogado Sênior' : 'Usuário'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#444] hover:text-destructive transition-colors"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
