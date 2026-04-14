import React, { useState } from 'react';
import { X, MessageSquare, Send, User, CheckCircle, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any | null;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, contract }) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgente' | 'critico'>('normal');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen || !contract) return null;

  const responsaveis = [
    contract.manager,
    contract.fiscal,
  ].filter(Boolean);

  const priorityConfig = {
    normal:  { label: 'Normal',  color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',   dot: 'bg-blue-400' },
    urgente: { label: 'Urgente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
    critico: { label: 'Crítico', color: 'bg-red-500/10 text-red-400 border-red-500/30',       dot: 'bg-red-400' },
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await addDoc(collection(db, 'notifications'), {
        type: 'follow_up_request',
        contractId: contract.id,
        contractNumber: contract.instrumentNumber,
        contractingOrgan: contract.contractingOrgan,
        contractedParty: contract.contractedParty,
        message: message || `Solicitação de acompanhamento para o contrato ${contract.instrumentNumber}`,
        priority,
        recipients: responsaveis,
        status: 'pendente',
        createdAt: serverTimestamp(),
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setPriority('normal');
        onClose();
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notifications');
    } finally {
      setIsSending(false);
    }
  };

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
          className="relative w-full max-w-lg glass border border-primary/20 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-black/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Nexuris — Acompanhamento</p>
                <h2 className="text-lg font-black tracking-tighter text-foreground">Solicitar Acompanhamento</h2>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Contrato info */}
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contrato</p>
              <p className="text-base font-black text-primary">{contract.instrumentNumber}</p>
              <p className="text-xs text-muted-foreground font-medium">{contract.contractingOrgan} — {contract.contractedParty}</p>
            </div>

            {/* Destinatários */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <Bell className="h-3 w-3" /> Notificação será enviada para:
              </p>
              {responsaveis.length > 0 ? (
                <div className="space-y-2">
                  {responsaveis.map((r: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-primary/5 rounded-xl px-4 py-3 border border-primary/10">
                      <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{r}</span>
                      <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{i === 0 ? 'Gestor' : 'Fiscal'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 font-medium">
                  ⚠️ Este contrato não possui Gestor ou Fiscal cadastrado. A notificação será enviada para a administração.
                </div>
              )}
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Prioridade</p>
              <div className="flex gap-2">
                {(Object.keys(priorityConfig) as (keyof typeof priorityConfig)[]).map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                      priority === p
                        ? priorityConfig[p].color + ' shadow-sm'
                        : 'border-primary/10 text-muted-foreground hover:border-primary/20'
                    }`}
                  >
                    <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${priority === p ? priorityConfig[p].dot : 'bg-muted-foreground'}`} />
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mensagem */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mensagem (opcional)</p>
              <textarea
                placeholder={`Descreva o motivo do acompanhamento para o contrato ${contract.instrumentNumber}...`}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full min-h-[100px] glass border border-primary/10 rounded-xl p-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-primary/10 bg-black/30">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || sent}
              className={`flex-[2] h-12 rounded-xl font-black uppercase tracking-widest transition-all ${
                sent
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'gold-gradient text-black shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]'
              }`}
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : sent ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Notificação Enviada!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Notificação
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
