import React from 'react';
import { X, FileText, Building2, Calendar, DollarSign, User, Tag, Info, TrendingUp, Shield, Clock, MapPin, Mail, Users, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

interface ContractViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any | null;
}

const Field: React.FC<{ label: string; value: string | number | undefined | null; icon?: React.ReactNode; highlight?: boolean }> = ({ label, value, icon, highlight }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-0.5 text-primary/60">{icon}</div>}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>{value || '—'}</p>
    </div>
  </div>
);

export const ContractViewModal: React.FC<ContractViewModalProps> = ({ isOpen, onClose, contract }) => {
  if (!isOpen || !contract) return null;

  const formatCurrency = (val: number) =>
    (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const execPercent = contract.totalValue > 0
    ? ((contract.executedValue / contract.totalValue) * 100).toFixed(1)
    : '0';

  const statusColor =
    contract.status === 'vigente' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
    contract.status === 'suspenso' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
    'bg-red-500/10 text-red-400 border-red-500/20';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass border border-primary/20 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-primary/10 bg-black/60 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-0.5">Nexuris Legal — Visualização</p>
                <h2 className="text-xl font-black tracking-tighter text-foreground">Instrumento Nº {contract.instrumentNumber}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black border uppercase tracking-widest ${statusColor}`}>
                {contract.status}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-8">
            {/* Identificação */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 rounded-full bg-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Identificação do Instrumento</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-primary/5 rounded-2xl p-6 border border-primary/5">
                <Field label="Tipo" value={contract.instrumentType?.toUpperCase()} icon={<Tag className="h-4 w-4" />} />
                <Field label="Número" value={contract.instrumentNumber} icon={<FileText className="h-4 w-4" />} highlight />
                <Field label="UF" value={contract.uf} icon={<MapPin className="h-4 w-4" />} />
                <Field label="Órgão Contratante" value={contract.contractingOrgan} icon={<Building2 className="h-4 w-4" />} />
                <Field label="Contratada / Consórcio" value={contract.contractedParty} icon={<Users className="h-4 w-4" />} />
                <Field label="E-mail de Contato" value={contract.email} icon={<Mail className="h-4 w-4" />} />
                <div className="md:col-span-2 lg:col-span-3">
                  <Field label="Objeto Contratual" value={contract.object} icon={<Info className="h-4 w-4" />} />
                </div>
              </div>
            </section>

            {/* Financeiro */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 rounded-full bg-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Financeiro</h3>
              </div>
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/5 space-y-4">
                <div className="grid gap-6 md:grid-cols-3">
                  <Field label="Valor Total (Global)" value={formatCurrency(contract.totalValue)} icon={<DollarSign className="h-4 w-4" />} highlight />
                  <Field label="Executado / Liquidado" value={formatCurrency(contract.executedValue)} icon={<DollarSign className="h-4 w-4" />} />
                  <Field label="Saldo Restante" value={formatCurrency(contract.totalValue - contract.executedValue)} icon={<DollarSign className="h-4 w-4" />} />
                </div>
                {/* Barra de progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Execução Financeira</span>
                    <span className="text-primary">{execPercent}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${execPercent}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full gold-gradient rounded-full"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Cronograma */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 rounded-full bg-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Cronograma e Prazos</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-3 bg-primary/5 rounded-2xl p-6 border border-primary/5">
                <Field label="Início da Vigência" value={contract.startDate} icon={<Calendar className="h-4 w-4" />} />
                <Field label="Término da Vigência" value={contract.endDate} icon={<Calendar className="h-4 w-4" />} />
                <Field label="Data de Assinatura" value={contract.signatureDate} icon={<Calendar className="h-4 w-4" />} />
                <Field label="Prazo de Execução (dias)" value={contract.executionDays} icon={<Clock className="h-4 w-4" />} />
                <Field label="Término da Execução" value={contract.executionEndDate} icon={<Calendar className="h-4 w-4" />} />
                <div className={`flex items-start gap-3 p-3 rounded-xl border ${Number(contract.delayDays) > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                  <Shield className={`h-4 w-4 mt-0.5 ${Number(contract.delayDays) > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Dias de Atraso</p>
                    <p className={`text-sm font-black ${Number(contract.delayDays) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {contract.delayDays || '0'} {Number(contract.delayDays) > 0 ? 'dias em atraso' : '— Em dia'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Performance */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-6 rounded-full bg-primary" />
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Análise de Performance</h3>
              </div>
              <div className="grid gap-6 md:grid-cols-3 bg-primary/5 rounded-2xl p-6 border border-primary/5">
                <Field label="Margem Estimada (%)" value={`${contract.estimatedMargin || 0}%`} icon={<Percent className="h-4 w-4" />} />
                <Field label="Margem Real (%)" value={`${contract.realMargin || 0}%`} icon={<Percent className="h-4 w-4" />} highlight />
                <Field label="Prob. de Prorrogação (%)" value={`${contract.renewalProb || 0}%`} icon={<TrendingUp className="h-4 w-4" />} />
                <Field label="Aditamento (%)" value={`${contract.aditivePercent || 0}%`} icon={<TrendingUp className="h-4 w-4" />} />
                <Field label="Gestor do Contrato" value={contract.manager} icon={<User className="h-4 w-4" />} />
                <Field label="Fiscal do Contrato" value={contract.fiscal} icon={<User className="h-4 w-4" />} />
              </div>
            </section>

            {/* Governança */}
            {(contract.managingOrgan || contract.participants || contract.notes) && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-6 rounded-full bg-primary" />
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-primary">Governança e Notas</h3>
                </div>
                <div className="grid gap-6 bg-primary/5 rounded-2xl p-6 border border-primary/5">
                  <Field label="Órgão Gerenciador" value={contract.managingOrgan} icon={<Building2 className="h-4 w-4" />} />
                  {contract.participants && (
                    <Field label="Órgãos Participantes / Aderentes" value={contract.participants} icon={<Users className="h-4 w-4" />} />
                  )}
                  {contract.notes && (
                    <Field label="Notas e Observações" value={contract.notes} icon={<Info className="h-4 w-4" />} />
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex justify-end p-6 border-t border-primary/10 bg-black/60 backdrop-blur-md">
            <Button
              onClick={onClose}
              className="gold-gradient text-black font-black px-8 h-11 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all"
            >
              Fechar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
