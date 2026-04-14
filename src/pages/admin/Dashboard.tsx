import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  FileText, 
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { collection, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for visual effect
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-32 w-full bg-secondary" />)}
        </div>
        <Skeleton className="h-[400px] w-full bg-secondary" />
      </div>
    );
  }

  const kpis = [
    { title: 'Contratos Ativos', value: '48', icon: FileText, change: '+12%', trend: 'up' },
    { title: 'Receita Mensal', value: 'R$ 680k', icon: DollarSign, change: '+8%', trend: 'up' },
    { title: 'Taxa de Sucesso', value: '94%', icon: TrendingUp, change: '+3%', trend: 'up' },
    { title: 'Prazos Próximos', value: '7', icon: AlertCircle, change: '-2', trend: 'down' },
  ];

  const chartData = [
    { name: 'Jan', receitas: 450000, despesas: 320000 },
    { name: 'Fev', receitas: 520000, despesas: 350000 },
    { name: 'Mar', receitas: 480000, despesas: 380000 },
    { name: 'Abr', receitas: 650000, despesas: 410000 },
    { name: 'Mai', receitas: 720000, despesas: 450000 },
    { name: 'Jun', receitas: 680000, despesas: 380000 },
  ];

  const recentActivities = [
    { id: 1, type: 'contract', title: 'Novo contrato cadastrado', desc: 'Contrato de prestação de serviços - ...', time: 'Há 2 horas', icon: FileText, color: 'text-primary' },
    { id: 2, type: 'payment', title: 'Pagamento recebido', desc: 'R$ 45.000,00 - Processo 2023/001', time: 'Há 4 horas', icon: DollarSign, color: 'text-emerald-500' },
    { id: 3, type: 'deadline', title: 'Prazo processual próximo', desc: 'Resposta à contestação - Processo 2...', time: 'Há 6 horas', icon: Clock, color: 'text-amber-500' },
    { id: 4, type: 'renewal', title: 'Contrato renovado', desc: 'Licitação Municipal - Prefeitura ABC', time: 'Há 1 dia', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  const featuredContracts = [
    { id: 1, title: 'Prestação de Serviços Jurídicos', client: 'Empresa XYZ Ltda', value: 'R$ 150.000,00', start: '01/01/2024', end: '31/12/2024', type: 'Civil', status: 'Ativo' },
    { id: 2, title: 'Licitação Municipal - Obras Públicas', client: 'Prefeitura Municipal ABC', value: 'R$ 2.500.000,00', start: '15/03/2023', end: '30/06/2024', type: 'Licitação', status: 'Vencendo' },
    { id: 3, title: 'Assessoria Jurídica Permanente', client: 'Construtora Delta', value: 'R$ 85.000,00', start: '10/02/2024', end: '10/02/2025', type: 'Civil', status: 'Ativo' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Nexuris Dashboard</p>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Dashboard</h1>
          <p className="text-muted-foreground font-medium">Visão geral do seu escritório jurídico</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-muted-foreground">Última atualização</div>
          <div className="text-xs text-primary font-mono">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="glass border-primary/10 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                {kpi.title}
              </CardTitle>
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <kpi.icon className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight text-foreground mb-2">{kpi.value}</div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-destructive'}`}>
                  {kpi.change}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Chart */}
        <Card className="lg:col-span-2 glass border-primary/10 p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Fluxo de Caixa</h2>
            <p className="text-xs text-muted-foreground font-medium">Receitas e despesas dos últimos 6 meses</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `R$ ${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #c5a05944', borderRadius: '12px' }}
                  itemStyle={{ color: '#c5a059' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="receitas" 
                  stroke="#c5a059" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorReceitas)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-8 mt-6 pt-6 border-t border-primary/5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Receitas</p>
                <p className="text-lg font-black text-foreground">R$ 680.000</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive" />
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Despesas</p>
                <p className="text-lg font-black text-foreground">R$ 380.000</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Atividades Recentes</h2>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group cursor-pointer">
                <div className={`h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{activity.title}</p>
                  <p className="text-xs text-muted-foreground font-medium line-clamp-1">{activity.desc}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Featured Contracts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Contratos em Destaque</h2>
          <button className="px-4 py-2 rounded-lg gold-gradient text-black text-xs font-black uppercase tracking-widest shadow-lg">Ver Todos</button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredContracts.map((contract) => (
            <Card key={contract.id} className="glass border-primary/10 p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                  {contract.type}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                  contract.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                  {contract.status}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-foreground mb-1 group-hover:text-primary transition-colors">{contract.title}</h3>
              <p className="text-xs text-muted-foreground font-medium mb-6">{contract.client}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Valor</span>
                  <span className="text-sm font-black text-primary">{contract.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Início</span>
                  <span className="text-xs font-bold text-foreground">{contract.start}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Término</span>
                  <span className="text-xs font-bold text-foreground">{contract.end}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
