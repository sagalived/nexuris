import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const financialData = [
  { name: 'NX-001/2026', total_value: 250000 },
];

export const FinancialPage: React.FC = () => {
  const kpis = [
    { title: 'Receitas do Mês', value: 'R$ 680.000', icon: ArrowUpRight, change: '+8.2%', trend: 'up', color: 'text-emerald-500' },
    { title: 'Despesas do Mês', value: 'R$ 380.000', icon: ArrowDownRight, change: '-3.1%', trend: 'down', color: 'text-destructive' },
    { title: 'Lucro Líquido', value: 'R$ 300.000', icon: TrendingUp, change: '+15.3%', trend: 'up', color: 'text-primary' },
  ];

  const chartData = [
    { name: 'Jan', receitas: 450000, despesas: 320000 },
    { name: 'Fev', receitas: 520000, despesas: 350000 },
    { name: 'Mar', receitas: 480000, despesas: 380000 },
    { name: 'Abr', receitas: 650000, despesas: 410000 },
    { name: 'Mai', receitas: 720000, despesas: 450000 },
    { name: 'Jun', receitas: 680000, despesas: 380000 },
  ];

  const categoryData = [
    { name: 'Salários', value: 180000, color: '#c5a059' },
    { name: 'Infraestrutura', value: 85000, color: '#d4af37' },
    { name: 'Marketing', value: 45000, color: '#b8860b' },
    { name: 'Outros', value: 70000, color: '#8b6508' },
  ];

  const recentTransactions = [
    { id: 1, title: 'Honorários - Processo 2024/001', date: '12/04/2024', amount: '+R$ 45.000', status: 'Confirmado', type: 'income' },
    { id: 2, title: 'Salários - Abril/2024', date: '10/04/2024', amount: 'R$ 180.000', status: 'Pago', type: 'expense' },
    { id: 3, title: 'Contrato XYZ - Mensalidade', date: '08/04/2024', amount: '+R$ 25.000', status: 'Confirmado', type: 'income' },
    { id: 4, title: 'Aluguel - Escritório', date: '05/04/2024', amount: 'R$ 15.000', status: 'Pago', type: 'expense' },
    { id: 5, title: 'Consultoria - Empresa ABC', date: '03/04/2024', amount: '+R$ 38.000', status: 'Pendente', type: 'income' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Acompanhamento de receitas, despesas e fluxo de caixa</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Controle Financeiro</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((kpi, index) => (
          <Card key={index} className="glass border-primary/10 hover:border-primary/30 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <span className={`text-xs font-bold ${kpi.trend === 'up' ? 'text-emerald-500' : 'text-destructive'}`}>
                {kpi.change}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{kpi.title}</p>
              <div className="text-3xl font-black tracking-tight text-foreground">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cash Flow Chart */}
        <Card className="lg:col-span-2 glass border-primary/10 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Fluxo de Caixa</h2>
            <p className="text-xs text-muted-foreground font-medium">Receitas e despesas dos últimos 6 meses</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReceitasFin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #c5a05944', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="receitas" stroke="#c5a059" strokeWidth={3} fillOpacity={1} fill="url(#colorReceitasFin)" />
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

        {/* Expenses by Category */}
        <Card className="glass border-primary/10 p-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Despesas por Categoria</h2>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-bold text-muted-foreground">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-foreground">R$ {cat.value.toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Transações Recentes</h2>
        <div className="space-y-4">
          {recentTransactions.map((tx) => (
            <Card key={tx.id} className="glass border-primary/10 p-4 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors`}>
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{tx.title}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${tx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {tx.amount}
                  </p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    tx.status === 'Confirmado' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    tx.status === 'Pago' ? 'bg-primary/10 text-primary border-primary/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
