import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  FileText, 
  Calendar, 
  DollarSign, 
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const valueByContractData = [
  { name: 'Prefeitura ABC', value: 2500000, type: 'Licitação' },
  { name: 'Empresa XYZ', value: 1200000, type: 'Contrato Direto' },
  { name: 'Construtora Delta', value: 850000, type: 'Assessoria' },
  { name: 'Hospital Central', value: 1800000, type: 'Licitação' },
  { name: 'Tecnologia SA', value: 600000, type: 'Contrato Direto' },
];

const deadlineData = [
  { month: 'Jan', vencendo: 4, concluidos: 12 },
  { month: 'Fev', vencendo: 6, concluidos: 8 },
  { month: 'Mar', vencendo: 3, concluidos: 15 },
  { month: 'Abr', vencendo: 8, concluidos: 10 },
  { month: 'Mai', vencendo: 5, concluidos: 18 },
  { month: 'Jun', vencendo: 12, concluidos: 5 },
];

const biddingStatusData = [
  { name: 'Vencidas', value: 45, color: '#c5a059' },
  { name: 'Em Análise', value: 25, color: '#d4af37' },
  { name: 'Perdidas', value: 20, color: '#8b6508' },
  { name: 'Suspensas', value: 10, color: '#444' },
];

const growthData = [
  { month: 'Jan', revenue: 400000 },
  { month: 'Fev', revenue: 450000 },
  { month: 'Mar', revenue: 420000 },
  { month: 'Abr', revenue: 580000 },
  { month: 'Mai', revenue: 620000 },
  { month: 'Jun', revenue: 680000 },
];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Inteligência de Dados e Performance</p>
          <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Relatórios Analíticos</h1>
          <p className="text-muted-foreground font-medium">Análise profunda de valores, prazos e performance de licitações.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="glass border-primary/20 text-primary font-bold">
            <Filter className="mr-2 h-4 w-4" />
            FILTRAR
          </Button>
          <Button className="gold-gradient text-black font-black shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            EXPORTAR PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Valor Total em Carteira', value: 'R$ 12.4M', icon: DollarSign, change: '+15%', trend: 'up' },
          { title: 'Taxa de Conversão Licitações', value: '64%', icon: TrendingUp, change: '+5%', trend: 'up' },
          { title: 'Média de Prazo (Dias)', value: '184', icon: Calendar, change: '-12', trend: 'down' },
          { title: 'Instrumentos Analisados', value: '342', icon: FileText, change: '+28', trend: 'up' },
        ].map((kpi, i) => (
          <Card key={i} className="glass border-primary/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-destructive'}`}>
                {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.title}</p>
            <p className="text-2xl font-black text-foreground">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Values by Contract */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Valores por Contrato / Órgão</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valueByContractData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v/1000000}M`} />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #c5a05944', borderRadius: '12px' }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Bar dataKey="value" fill="#c5a059" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Growth Trend */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Evolução de Receita</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #c5a05944', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#c5a059" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Deadlines Analysis */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Análise de Prazos e Conclusões</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deadlineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #c5a05944', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="vencendo" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="concluidos" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Vencendo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase text-muted-foreground">Concluídos</span>
            </div>
          </div>
        </Card>

        {/* Bidding Status */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Status de Licitações</h2>
          <div className="h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={biddingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {biddingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {biddingStatusData.map((status) => (
              <div key={status.name} className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">{status.name}</span>
                </div>
                <span className="text-xs font-black text-foreground">{status.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
