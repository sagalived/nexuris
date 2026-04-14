import React, { useState } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Hash, 
  Building2, 
  MapPin, 
  Users, 
  Target, 
  DollarSign, 
  Calendar, 
  Clock, 
  Percent, 
  UserCheck, 
  ShieldAlert,
  Info,
  TrendingUp,
  Plus,
  Upload,
  Eye,
  FileUp,
  Mail,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId?: string;       // if present → edit mode
  initialData?: Record<string, any>; // pre-fill form for editing
}

export const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, contractId, initialData }) => {
  const isEditMode = !!contractId;
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const buildInitial = (data?: Record<string, any>) => ({
    instrumentType: data?.instrumentType || 'contrato',
    instrumentNumber: data?.instrumentNumber || '',
    contractingOrgan: data?.contractingOrgan || '',
    uf: data?.uf || 'CE',
    contractedParty: data?.contractedParty || '',
    object: data?.object || '',
    email: data?.email || '',
    totalValue: data?.totalValue ? String(data.totalValue) : '',
    executedValue: data?.executedValue ? String(data.executedValue) : '',
    status: data?.status || 'vigente',
    startDate: data?.startDate || '',
    endDate: data?.endDate || '',
    executionDays: data?.executionDays ? String(data.executionDays) : '',
    signatureDate: data?.signatureDate || '',
    executionEndDate: data?.executionEndDate || '',
    delayDays: data?.delayDays ? String(data.delayDays) : '0',
    estimatedMargin: data?.estimatedMargin ? String(data.estimatedMargin) : '',
    realMargin: data?.realMargin ? String(data.realMargin) : '',
    renewalProb: data?.renewalProb ? String(data.renewalProb) : '',
    aditivePercent: data?.aditivePercent ? String(data.aditivePercent) : '',
    manager: data?.manager || '',
    fiscal: data?.fiscal || '',
    managingOrgan: data?.managingOrgan || '',
    participants: data?.participants || '',
    notes: data?.notes || '',
    contractFile: null as File | null
  });

  const [formData, setFormData] = useState(() => buildInitial(initialData));

  // Sync when initialData changes (e.g. opening edit mode for different contract)
  React.useEffect(() => {
    setFormData(buildInitial(initialData));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate delay days automatically
  React.useEffect(() => {
    if (formData.endDate && formData.status !== 'concluido') {
      const [year, month, day] = formData.endDate.split('-').map(Number);
      const end = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (today > end) {
        const diffTime = Math.abs(today.getTime() - end.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, delayDays: diffDays.toString() }));
      } else {
        setFormData(prev => ({ ...prev, delayDays: '0' }));
      }
    } else {
      setFormData(prev => ({ ...prev, delayDays: '0' }));
    }
  }, [formData.endDate, formData.status]);

  if (!isOpen) return null;

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return (Number(num) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatPercent = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return num + '%';
  };

  const handleInputChange = (field: string, value: string) => {
    let finalValue = value;

    if (['totalValue', 'executedValue'].includes(field)) {
      finalValue = formatCurrency(value);
    } else if (['estimatedMargin', 'realMargin', 'renewalProb', 'aditivePercent'].includes(field)) {
      finalValue = formatPercent(value);
    }

    setFormData(prev => ({ ...prev, [field]: finalValue }));
    
    // Validation logic
    if (['totalValue', 'executedValue', 'estimatedMargin', 'realMargin', 'renewalProb', 'aditivePercent'].includes(field)) {
      const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
      if (value && (isNaN(numericValue) || numericValue < 0)) {
        setErrors(prev => ({ ...prev, [field]: 'O valor deve ser positivo' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, email: 'E-mail inválido' }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors['email'];
          return newErrors;
        });
      }
    }
  };

  const handleSave = async () => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      alert('Por favor, corrija os erros antes de salvar.');
      return;
    }

    setIsSaving(true);
    const payload = {
      ...formData,
      totalValue: parseFloat(formData.totalValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      executedValue: parseFloat(formData.executedValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      estimatedMargin: parseFloat(formData.estimatedMargin.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      realMargin: parseFloat(formData.realMargin.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      renewalProb: parseFloat(formData.renewalProb.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      aditivePercent: parseFloat(formData.aditivePercent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      contractFile: formData.contractFile ? formData.contractFile.name : null
    };
    try {
      const path = 'contracts';
      if (isEditMode && contractId) {
        await updateDoc(doc(db, path, contractId), { ...payload, updatedAt: serverTimestamp() });
        alert('Instrumento atualizado com sucesso!');
      } else {
        await addDoc(collection(db, path), { ...payload, createdAt: serverTimestamp() });
        alert('Instrumento salvo com sucesso!');
      }
      onClose();
    } catch (error) {
      handleFirestoreError(error, isEditMode ? OperationType.UPDATE : OperationType.CREATE, 'contracts');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWithFeedback = async () => {
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      alert('Por favor, corrija os erros antes de salvar.');
      return;
    }

    setIsSaving(true);
    const payload = {
      ...formData,
      totalValue: parseFloat(formData.totalValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      executedValue: parseFloat(formData.executedValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      estimatedMargin: parseFloat(formData.estimatedMargin.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      realMargin: parseFloat(formData.realMargin.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      renewalProb: parseFloat(formData.renewalProb.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      aditivePercent: parseFloat(formData.aditivePercent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
      delayDays: parseInt(formData.delayDays) || 0,
      contractFile: formData.contractFile ? formData.contractFile.name : null
    };
    try {
      const path = 'contracts';
      if (isEditMode && contractId) {
        await updateDoc(doc(db, path, contractId), { ...payload, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, path), { ...payload, createdAt: serverTimestamp() });
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      handleFirestoreError(error, isEditMode ? OperationType.UPDATE : OperationType.CREATE, 'contracts');
    } finally {
      setIsSaving(false);
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

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass border border-primary/20 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-primary/10 bg-black/50 backdrop-blur-md">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Nexuris Legal</p>
              <h2 className="text-2xl font-black tracking-tighter text-foreground">
                {isEditMode ? 'Editar Instrumento Jurídico' : 'Cadastro de Instrumento Jurídico'}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-12">
            {/* Section 1: Identificação do Instrumento */}
            <div className="relative group">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Identificação do Instrumento</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Dados básicos e registro legal</p>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-4 bg-primary/5 p-6 rounded-2xl border border-primary/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Instrumento Jurídico</label>
                  <Select 
                    value={formData.instrumentType} 
                    onValueChange={(val) => handleInputChange('instrumentType', val)}
                  >
                    <SelectTrigger className="glass border-primary/10 h-12 font-bold focus:ring-primary/30">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/10">
                      <SelectItem value="contrato">Contrato</SelectItem>
                      <SelectItem value="ata">Ata de Registro de Preços</SelectItem>
                      <SelectItem value="convenio">Convênio</SelectItem>
                      <SelectItem value="aditivo">Termo Aditivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Número do Instrumento</label>
                  <Input 
                    placeholder="Ex: NX-001/2026" 
                    value={formData.instrumentNumber}
                    onChange={(e) => handleInputChange('instrumentNumber', e.target.value)}
                    className="glass border-primary/10 h-12 font-bold focus-visible:ring-primary/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Órgão Contratante</label>
                  <Input 
                    placeholder="Ex: Secretaria de Saúde" 
                    value={formData.contractingOrgan}
                    onChange={(e) => handleInputChange('contractingOrgan', e.target.value)}
                    className="glass border-primary/10 h-12 font-bold focus-visible:ring-primary/30" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Unidade Federativa (UF)</label>
                  <Input 
                    value={formData.uf}
                    onChange={(e) => handleInputChange('uf', e.target.value)}
                    className="glass border-primary/10 h-12 font-bold uppercase focus-visible:ring-primary/30" 
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Contratada / Consórcio</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      placeholder="Razão Social da Empresa ou Grupo" 
                      value={formData.contractedParty}
                      onChange={(e) => handleInputChange('contractedParty', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30" 
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">E-mail de Contato</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="email"
                      placeholder="contato@empresa.com.br" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.email ? 'border-destructive/50' : ''}`} 
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-destructive font-bold ml-1">{errors.email}</p>}
                </div>

                <div className="space-y-2 md:col-span-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Objeto Contratual</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-4 h-4 w-4 text-primary/40" />
                    <textarea 
                      placeholder="Descrição detalhada do objeto licitado..." 
                      value={formData.object}
                      onChange={(e) => handleInputChange('object', e.target.value)}
                      className="w-full min-h-[120px] glass border border-primary/10 rounded-xl p-4 pl-12 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Financeiro e Situação */}
            <div className="relative group">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Financeiro e Situação</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Valores globais e status atual</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3 bg-primary/5 p-6 rounded-2xl border border-primary/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Valor Global (Total)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="text" 
                      placeholder="R$ 0,00" 
                      value={formData.totalValue}
                      onChange={(e) => handleInputChange('totalValue', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.totalValue ? 'border-destructive/50 focus-visible:ring-destructive/30' : ''}`} 
                    />
                  </div>
                  {errors.totalValue && <p className="text-[10px] text-destructive font-bold ml-1">{errors.totalValue}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Valor Liquidado / Executado</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="text" 
                      placeholder="R$ 0,00" 
                      value={formData.executedValue}
                      onChange={(e) => handleInputChange('executedValue', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.executedValue ? 'border-destructive/50 focus-visible:ring-destructive/30' : ''}`} 
                    />
                  </div>
                  {errors.executedValue && <p className="text-[10px] text-destructive font-bold ml-1">{errors.executedValue}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Situação Contratual</label>
                  <Select 
                    value={formData.status}
                    onValueChange={(val) => handleInputChange('status', val)}
                  >
                    <SelectTrigger className="glass border-primary/10 h-12 font-bold focus:ring-primary/30">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="glass border-primary/10">
                      <SelectItem value="vigente">Vigente</SelectItem>
                      <SelectItem value="suspenso">Suspenso</SelectItem>
                      <SelectItem value="rescindido">Rescindido</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 3: Cronograma e Prazos */}
            <div className="relative group">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Cronograma e Prazos</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Datas críticas e marcos temporais</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3 bg-primary/5 p-6 rounded-2xl border border-primary/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Início da Vigência</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 pr-10 font-bold focus-visible:ring-primary/30 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.7] [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg] [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Término da Vigência</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 pr-10 font-bold focus-visible:ring-primary/30 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.7] [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg] [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Prazo de Execução (Dias)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={formData.executionDays}
                      onChange={(e) => handleInputChange('executionDays', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Data de Assinatura</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="date" 
                      value={formData.signatureDate}
                      onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 pr-10 font-bold focus-visible:ring-primary/30 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.7] [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg] [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Término da Execução</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="date" 
                      value={formData.executionEndDate}
                      onChange={(e) => handleInputChange('executionEndDate', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 pr-10 font-bold focus-visible:ring-primary/30 [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.7] [&::-webkit-calendar-picker-indicator]:sepia-[1] [&::-webkit-calendar-picker-indicator]:saturate-[5] [&::-webkit-calendar-picker-indicator]:hue-rotate-[10deg] [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Inadimplência (Dias de Atraso)</label>
                  <div className="relative">
                    <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive/50" />
                    <Input 
                      type="text" 
                      readOnly
                      placeholder="0" 
                      value={formData.delayDays}
                      className="glass border-primary/10 h-12 pl-12 font-bold text-destructive focus-visible:ring-destructive/30 cursor-not-allowed opacity-80" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Análise de Performance */}
            <div className="relative group">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Análise de Performance</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Indicadores de eficiência e gestão</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3 bg-primary/5 p-6 rounded-2xl border border-primary/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Margem de Lucro Estimada (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="text" 
                      placeholder="0,00%" 
                      value={formData.estimatedMargin}
                      onChange={(e) => handleInputChange('estimatedMargin', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.estimatedMargin ? 'border-destructive/50 focus-visible:ring-destructive/30' : ''}`} 
                    />
                  </div>
                  {errors.estimatedMargin && <p className="text-[10px] text-destructive font-bold ml-1">{errors.estimatedMargin}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Margem de Lucro Real (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="text" 
                      placeholder="0,00%" 
                      value={formData.realMargin}
                      onChange={(e) => handleInputChange('realMargin', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.realMargin ? 'border-destructive/50 focus-visible:ring-destructive/30' : ''}`} 
                    />
                  </div>
                  {errors.realMargin && <p className="text-[10px] text-destructive font-bold ml-1">{errors.realMargin}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Probabilidade de Prorrogação (%)</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="text" 
                      placeholder="0,00%" 
                      value={formData.renewalProb}
                      onChange={(e) => handleInputChange('renewalProb', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.renewalProb ? 'border-destructive/50 focus-visible:ring-destructive/30' : ''}`} 
                    />
                  </div>
                  {errors.renewalProb && <p className="text-[10px] text-destructive font-bold ml-1">{errors.renewalProb}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Percentual de Aditamento (%)</label>
                  <div className="relative">
                    <Plus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      type="text" 
                      placeholder="0,00%" 
                      value={formData.aditivePercent}
                      onChange={(e) => handleInputChange('aditivePercent', e.target.value)}
                      className={`glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30 ${errors.aditivePercent ? 'border-destructive/50 focus-visible:ring-destructive/30' : ''}`} 
                    />
                  </div>
                  {errors.aditivePercent && <p className="text-[10px] text-destructive font-bold ml-1">{errors.aditivePercent}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Gestor do Contrato</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      placeholder="Nome do Gestor" 
                      value={formData.manager}
                      onChange={(e) => handleInputChange('manager', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Fiscal do Contrato</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      placeholder="Nome do Fiscal" 
                      value={formData.fiscal}
                      onChange={(e) => handleInputChange('fiscal', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Governança e Notas */}
            <div className="relative group">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Governança e Notas</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Observações e controle de stakeholders</p>
                </div>
              </div>

              <div className="grid gap-6 bg-primary/5 p-6 rounded-2xl border border-primary/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Órgão Gerenciador</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <Input 
                      placeholder="Órgão responsável pela gestão da Ata/Contrato" 
                      value={formData.managingOrgan}
                      onChange={(e) => handleInputChange('managingOrgan', e.target.value)}
                      className="glass border-primary/10 h-12 pl-12 font-bold focus-visible:ring-primary/30" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Órgãos Participantes / Aderentes (Caronas)</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 h-4 w-4 text-primary/40" />
                    <textarea 
                      placeholder="Liste os órgãos participantes ou que pegaram carona..." 
                      value={formData.participants}
                      onChange={(e) => handleInputChange('participants', e.target.value)}
                      className="w-full min-h-[100px] glass border border-primary/10 rounded-xl p-4 pl-12 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Notas e Observações Gerais</label>
                  <div className="relative">
                    <Info className="absolute left-4 top-4 h-4 w-4 text-primary/40" />
                    <textarea 
                      placeholder="Informações adicionais relevantes..." 
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full min-h-[120px] glass border border-primary/10 rounded-xl p-4 pl-12 text-sm font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Documentação Digital */}
            <div className="relative group">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                  <FileUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-foreground">Documentação Digital</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Upload do instrumento assinado (PDF/Imagens)</p>
                </div>
              </div>

              <div className="bg-primary/5 p-8 rounded-2xl border border-dashed border-primary/30 hover:border-primary/60 transition-all group/upload">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover/upload:scale-110 transition-transform duration-500">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest text-foreground">Arraste o arquivo aqui</p>
                    <p className="text-xs text-muted-foreground font-medium">Ou clique para selecionar do seu computador</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="contract-upload" 
                    onChange={(e) => setFormData(prev => ({ ...prev, contractFile: e.target.files?.[0] || null }))}
                  />
                  <label 
                    htmlFor="contract-upload" 
                    className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-primary/20 bg-background px-4 py-2 text-sm font-bold glass hover:bg-primary/10 transition-all"
                  >
                    Selecionar Arquivo
                  </label>
                  
                  {formData.contractFile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3 bg-primary/10 rounded-xl border border-primary/20 mt-4"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-foreground truncate max-w-[200px]">{formData.contractFile.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{(formData.contractFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/20 text-primary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-full hover:bg-destructive/20 text-destructive"
                        onClick={() => setFormData(prev => ({ ...prev, contractFile: null }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 pt-6 border-t border-primary/10">
              <Button 
                onClick={onClose}
                variant="ghost" 
                className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveWithFeedback}
                disabled={isSaving || saveSuccess}
                className={`flex-[2] h-14 rounded-2xl font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 ${
                  saveSuccess 
                    ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' 
                    : 'gold-gradient text-black shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]'
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </div>
                ) : saveSuccess ? (
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    Salvo com Sucesso!
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    {isEditMode ? 'Atualizar Instrumento' : 'Salvar Instrumento'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
