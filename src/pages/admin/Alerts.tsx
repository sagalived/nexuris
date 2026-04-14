import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Notificações</p>
        <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Alertas</h1>
      </div>

      <div className="space-y-4">
        <Card className="glass border-primary/10 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-8 flex items-center gap-6">
              <div className="rounded-full bg-emerald-500/20 p-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-500 uppercase tracking-tight">Tudo em ordem</h3>
                <p className="text-emerald-500/80 font-bold">Sem alertas críticos no momento. Sua carteira está operando dentro dos parâmetros normais.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future alerts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass border-primary/10 opacity-50 grayscale">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <p className="text-sm font-bold text-muted-foreground">Alertas de vencimento aparecerão aqui.</p>
            </CardContent>
          </Card>
          <Card className="glass border-primary/10 opacity-50 grayscale">
            <CardContent className="p-6 flex items-center gap-4">
              <Info className="h-6 w-6 text-blue-500" />
              <p className="text-sm font-bold text-muted-foreground">Notificações de sistema aparecerão aqui.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
