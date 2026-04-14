import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, BadgeCheck, Shield } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: 'Dr. João Dias',
    role: 'Sócio Fundador / Advogado Sênior',
    email: 'joao.dias@nexuris.com',
    phone: '(11) 99876-5432',
    location: 'São Paulo, SP',
    specialty: 'Direito Administrativo e Licitações',
    image: 'https://picsum.photos/seed/joao/200/200',
    status: 'Ativo',
    isAdmin: true
  },
  {
    id: 2,
    name: 'Dra. Maria Santos',
    role: 'Advogada Pleno',
    email: 'maria.santos@nexuris.com',
    phone: '(11) 98765-4321',
    location: 'São Paulo, SP',
    specialty: 'Direito Civil e Contratos',
    image: 'https://picsum.photos/seed/maria/200/200',
    status: 'Ativo',
    isAdmin: false
  },
  {
    id: 3,
    name: 'Dr. Ricardo Oliveira',
    role: 'Consultor Financeiro',
    email: 'ricardo.oliveira@nexuris.com',
    phone: '(11) 97654-3210',
    location: 'Rio de Janeiro, RJ',
    specialty: 'Gestão de Riscos e Compliance',
    image: 'https://picsum.photos/seed/ricardo/200/200',
    status: 'Ativo',
    isAdmin: false
  },
  {
    id: 4,
    name: 'Ana Paula Lima',
    role: 'Analista de Controladoria',
    email: 'ana.lima@nexuris.com',
    phone: '(11) 96543-2109',
    location: 'São Paulo, SP',
    specialty: 'Auditoria de Contratos',
    image: 'https://picsum.photos/seed/ana/200/200',
    status: 'Ativo',
    isAdmin: false
  },
  {
    id: 5,
    name: 'Dr. Felipe Mendes',
    role: 'Advogado Júnior',
    email: 'felipe.mendes@nexuris.com',
    phone: '(11) 95432-1098',
    location: 'Belo Horizonte, MG',
    specialty: 'Direito Público',
    image: 'https://picsum.photos/seed/felipe/200/200',
    status: 'Em Audiência',
    isAdmin: false
  }
];

export const TeamPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Gestão de Capital Humano</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Nossa Equipe</h1>
        <p className="text-muted-foreground font-medium">Profissionais especializados em gestão jurídica e financeira de contratos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <Card key={member.id} className="glass border-primary/10 hover:border-primary/30 transition-all duration-500 group overflow-hidden">
            <div className="h-2 gold-gradient opacity-50 group-hover:opacity-100 transition-opacity" />
            <CardContent className="pt-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/20 p-1 bg-black">
                    <AvatarImage src={member.image} className="rounded-full object-cover" />
                    <AvatarFallback className="bg-primary text-black font-black text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {member.isAdmin && (
                    <div className="absolute -top-1 -right-1 bg-primary text-black p-1 rounded-full shadow-lg" title="Administrador">
                      <Shield className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">{member.role}</p>
                </div>

                <div className="w-full pt-4 space-y-3 border-t border-primary/5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary/40" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary/40" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary/40" />
                    <span>{member.location}</span>
                  </div>
                </div>

                <div className="w-full pt-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Especialidade</div>
                  <div className="px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-[11px] font-bold text-foreground">
                    {member.specialty}
                  </div>
                </div>

                <div className="w-full pt-4 flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                    member.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {member.status}
                  </span>
                  <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver Perfil</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
