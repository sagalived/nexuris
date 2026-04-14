import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Gavel, 
  Clock,
  AlertTriangle,
  CheckCircle2,
  User
} from 'lucide-react';

export const LegalPage: React.FC = () => {
  const kpis = [
    { title: 'Processos Ativos', value: '124', icon: Gavel, color: 'text-primary' },
    { title: 'Prazos Próximos', value: '7', icon: Clock, color: 'text-amber-500' },
    { title: 'Urgentes', value: '3', icon: AlertTriangle, color: 'text-destructive' },
    { title: 'Concluídos (Mês)', value: '18', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  const ongoingProcesses = [
    { id: '2024/001', type: 'Administrativo', title: 'Processo Administrativo Municipal', client: 'Prefeitura ABC', deadline: '25/04/2024', lawyer: 'Dr. João Silva', status: 'Em andamento' },
    { id: '2024/015', type: 'Cível', title: 'Ação de Cobrança Contratual', client: 'Empresa XYZ', deadline: '30/04/2024', lawyer: 'Dra. Maria Santos', status: 'Aguardando' },
  ];

  const criticalDeadlines = [
    { id: 1, title: 'Resposta à contestação', process: 'Processo 2024/015', date: '18/04/2024', remaining: '96h restantes', type: 'urgent' },
    { id: 2, title: 'Protocolo de recurso', process: 'Processo 2023/089', date: '20/04/2024', remaining: '144h restantes', type: 'warning' },
    { id: 3, title: 'Audiência de conciliação', process: 'Processo 2024/001', date: '25/04/2024', remaining: '264h restantes', type: 'info' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Gestão de processos, prazos e atividades jurídicas</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Acompanhamento Jurídico</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="glass border-primary/10 hover:border-primary/30 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{kpi.title}</p>
              <div className="text-3xl font-black tracking-tight text-foreground">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Ongoing Processes */}
        <Card className="lg:col-span-2 glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Processos em Andamento</h2>
          <div className="space-y-6">
            {ongoingProcesses.map((proc) => (
              <div key={proc.id} className="p-6 rounded-2xl bg-primary/5 border border-primary/5 hover:border-primary/20 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                      {proc.id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest border border-amber-500/20">
                      {proc.type}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    {proc.status}
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">{proc.title}</h3>
                <p className="text-xs text-muted-foreground font-medium mb-6">{proc.client}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-primary/5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/40" />
                    <span className="text-xs font-bold text-muted-foreground">Prazo: {proc.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary/40" />
                    <span className="text-xs font-bold text-muted-foreground">{proc.lawyer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Critical Deadlines */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Prazos Críticos</h2>
          <div className="space-y-4">
            {criticalDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-4 rounded-xl bg-primary/5 border border-primary/5 hover:border-primary/20 transition-all group relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    deadline.type === 'urgent' ? 'bg-destructive/10 text-destructive' :
                    deadline.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{deadline.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{deadline.process}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground">{deadline.date}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                    deadline.type === 'urgent' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    deadline.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {deadline.remaining}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
