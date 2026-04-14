import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BrainCircuit, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Monitor
} from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const kpis = [
    { title: 'Pontuação média', value: '82,0', icon: CheckCircle2 },
    { title: 'Contratos atrasados', value: '0', icon: Clock },
    { title: 'Renovação média', value: '55,0%', icon: TrendingUp },
    { title: 'Carteira monitorada', value: '1', icon: Monitor },
  ];

  const insights = [
    "Você concentra 100,0% da receita nos 2 maiores contratos.",
    "Pontuação média da carteira em 82,0 pontos."
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Análises</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Inteligência</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="glass border-primary/10 hover:border-primary/30 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-primary/40 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black tracking-tight text-foreground">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <Card key={index} className="glass border-primary/10 border-l-4 border-l-primary/50">
            <CardContent className="p-6">
              <p className="text-foreground font-bold text-lg">{insight}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
