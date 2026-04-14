import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  User,
  Building2,
  Tag,
  Info,
  DollarSign,
  Percent,
  Clock,
  MapPin,
  Mail,
  Users,
  TrendingUp,
  Shield,
  ArrowLeft,
  Printer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Field: React.FC<{ label: string; value: string | number | undefined | null; icon?: React.ReactNode; highlight?: boolean }> = ({ label, value, icon, highlight }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-0.5 text-primary/60">{icon}</div>}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value ?? '—'}</p>
    </div>
  </div>
);

export const ContractDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractId = searchParams.get('id');

  const [contract, setContract] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!contractId) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'contracts', contractId));
        if (snap.exists()) {
          setContract({ id: snap.id, ...snap.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `contracts/${contractId}`);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [contractId]);

  const formatCurrency = (val: number) =>
    (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Carregando contrato...
        </div>
      </div>
    );
  }

  if (notFound || !contract) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-lg font-bold text-muted-foreground">Contrato não encontrado.</p>
        <Button onClick={() => navigate('/admin/contracts')} variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Contratos
        </Button>
      </div>
    );
  }

  const execPercent = contract.totalValue > 0
    ? ((contract.executedValue / contract.totalValue) * 100).toFixed(1)
    : '0';

  const statusColor =
    contract.status === 'vigente'   ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
    contract.status === 'suspenso'  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
    'bg-red-500/10 text-red-400 border-red-500/20';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <button
            onClick={() => navigate('/admin/contracts')}
            className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para Contratos
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Análise Detalhada</p>
          <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Detalhes do Contrato</h1>
          <p className="text-muted-foreground font-medium">{contract.instrumentNumber} — {contract.contractingOrgan}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black border uppercase tracking-widest ${statusColor}`}>
            {contract.status}
          </span>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            <Printer className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Valor Total', value: formatCurrency(contract.totalValue), icon: <DollarSign className="h-4 w-4 text-primary" /> },
          { label: 'Executado', value: formatCurrency(contract.executedValue), icon: <TrendingUp className="h-4 w-4 text-emerald-400" /> },
          { label: 'Saldo', value: formatCurrency(contract.totalValue - contract.executedValue), icon: <DollarSign className="h-4 w-4 text-amber-400" /> },
          { label: 'Execução', value: `${execPercent}%`, icon: <Percent className="h-4 w-4 text-primary" /> },
        ].map((kpi, i) => (
          <Card key={i} className="glass border-primary/10">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-1">
                {kpi.icon}
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
              </div>
              <p className="text-2xl font-black text-foreground">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card className="glass border-primary/10">
        <CardContent className="p-6">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
            <span className="text-muted-foreground">Execução Financeira</span>
            <span className="text-primary">{execPercent}%</span>
          </div>
          <div className="h-3 w-full bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full gold-gradient rounded-full transition-all duration-1000"
              style={{ width: `${execPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Identificação */}
        <Card className="glass border-primary/10">
          <CardHeader className="border-b border-primary/5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Identificação
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-5 sm:grid-cols-2">
            <Field label="Tipo de Instrumento" value={contract.instrumentType?.toUpperCase()} icon={<Tag className="h-4 w-4" />} />
            <Field label="Número" value={contract.instrumentNumber} icon={<FileText className="h-4 w-4" />} highlight />
            <Field label="UF" value={contract.uf} icon={<MapPin className="h-4 w-4" />} />
            <Field label="E-mail de Contato" value={contract.email} icon={<Mail className="h-4 w-4" />} />
            <div className="sm:col-span-2">
              <Field label="Órgão Contratante" value={contract.contractingOrgan} icon={<Building2 className="h-4 w-4" />} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Contratada / Consórcio" value={contract.contractedParty} icon={<Users className="h-4 w-4" />} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Objeto Contratual" value={contract.object} icon={<Info className="h-4 w-4" />} />
            </div>
          </CardContent>
        </Card>

        {/* Cronograma */}
        <Card className="glass border-primary/10">
          <CardHeader className="border-b border-primary/5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Cronograma e Prazos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-5 sm:grid-cols-2">
            <Field label="Início da Vigência" value={contract.startDate} icon={<Calendar className="h-4 w-4" />} />
            <Field label="Término da Vigência" value={contract.endDate} icon={<Calendar className="h-4 w-4" />} />
            <Field label="Data de Assinatura" value={contract.signatureDate} icon={<Calendar className="h-4 w-4" />} />
            <Field label="Término da Execução" value={contract.executionEndDate} icon={<Calendar className="h-4 w-4" />} />
            <Field label="Prazo de Execução (dias)" value={contract.executionDays} icon={<Clock className="h-4 w-4" />} />
            <div className={`flex items-start gap-3 p-3 rounded-xl border ${Number(contract.delayDays) > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
              <Shield className={`h-4 w-4 mt-0.5 ${Number(contract.delayDays) > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Inadimplência</p>
                <p className={`text-sm font-black ${Number(contract.delayDays) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {contract.delayDays || '0'} {Number(contract.delayDays) > 0 ? 'dias em atraso' : '— Em dia'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="glass border-primary/10">
          <CardHeader className="border-b border-primary/5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Performance e Margens
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-5 sm:grid-cols-2">
            <Field label="Margem Estimada (%)" value={`${contract.estimatedMargin || 0}%`} icon={<Percent className="h-4 w-4" />} />
            <Field label="Margem Real (%)" value={`${contract.realMargin || 0}%`} icon={<Percent className="h-4 w-4" />} highlight />
            <Field label="Prob. de Prorrogação (%)" value={`${contract.renewalProb || 0}%`} icon={<TrendingUp className="h-4 w-4" />} />
            <Field label="Aditamento (%)" value={`${contract.aditivePercent || 0}%`} icon={<TrendingUp className="h-4 w-4" />} />
          </CardContent>
        </Card>

        {/* Responsáveis */}
        <Card className="glass border-primary/10">
          <CardHeader className="border-b border-primary/5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Responsáveis e Governança
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-5 sm:grid-cols-2">
            <Field label="Gestor do Contrato" value={contract.manager} icon={<User className="h-4 w-4" />} highlight />
            <Field label="Fiscal do Contrato" value={contract.fiscal} icon={<User className="h-4 w-4" />} />
            <div className="sm:col-span-2">
              <Field label="Órgão Gerenciador" value={contract.managingOrgan} icon={<Building2 className="h-4 w-4" />} />
            </div>
            {contract.participants && (
              <div className="sm:col-span-2">
                <Field label="Órgãos Participantes / Caronas" value={contract.participants} icon={<Users className="h-4 w-4" />} />
              </div>
            )}
            {contract.notes && (
              <div className="sm:col-span-2">
                <Field label="Notas e Observações" value={contract.notes} icon={<Info className="h-4 w-4" />} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
