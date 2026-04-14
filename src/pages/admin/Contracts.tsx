import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  Eye,
  MessageSquare,
  Pencil,
  ExternalLink,
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

import { ContractModal } from '@/src/components/admin/ContractModal';
import { ContractViewModal } from '@/src/components/admin/ContractViewModal';
import { FollowUpModal } from '@/src/components/admin/FollowUpModal';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export const ContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetailId, setSelectedDetailId] = useState('');

  // Modal states
  const [isNewModalOpen, setIsNewModalOpen]         = useState(false);
  const [isViewModalOpen, setIsViewModalOpen]       = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen]       = useState(false);

  // Selected contract for actions
  const [activeContract, setActiveContract]         = useState<any | null>(null);

  useEffect(() => {
    const path = 'contracts';
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContracts(docs);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  const filteredContracts = contracts.filter(c => 
    c.instrumentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractingOrgan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contractedParty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleView = (contract: any) => {
    setActiveContract(contract);
    setIsViewModalOpen(true);
  };

  const handleFollowUp = (contract: any) => {
    setActiveContract(contract);
    setIsFollowUpModalOpen(true);
  };

  const handleEdit = (contract: any) => {
    setActiveContract(contract);
    setIsEditModalOpen(true);
  };

  const handleOpenDetail = () => {
    if (!selectedDetailId) return;
    const found = contracts.find(c => c.id === selectedDetailId);
    if (found) {
      navigate(`/admin/contract-details?id=${found.id}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Padrão Contratual</p>
          <h1 className="text-4xl font-black tracking-tighter text-foreground gold-text-gradient">Contratos e Atas</h1>
          <p className="text-muted-foreground font-medium">Cadastro, edição e seleção da carteira para análise detalhada.</p>
        </div>
        <Button 
          onClick={() => setIsNewModalOpen(true)}
          className="gold-gradient text-black font-black h-12 px-8 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
        >
          <Plus className="mr-2 h-5 w-5" />
          NOVO INSTRUMENTO
        </Button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Pesquisar</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Digite para buscar..." 
              className="glass border-primary/10 h-14 pl-12 text-lg font-medium focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <Card className="glass border-primary/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow className="border-primary/10 hover:bg-transparent">
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Número</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Órgão</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Cliente</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Tipo</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Total</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Executado</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Saldo</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Prazo</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Execução %</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Score</TableHead>
                <TableHead className="text-primary font-bold uppercase tracking-wider text-[10px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={12} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Carregando instrumentos...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                    Nenhum instrumento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                  <TableRow 
                    key={contract.id} 
                    className="border-primary/5 hover:bg-primary/5 transition-colors cursor-pointer group/row"
                    onClick={(e) => {
                      // Prevent navigation if clicking action buttons
                      if ((e.target as HTMLElement).closest('button')) return;
                      navigate(`/admin/contract-details?id=${contract.id}`);
                    }}
                  >
                    <TableCell className="font-mono text-xs font-bold">{contract.instrumentNumber}</TableCell>
                    <TableCell className="text-xs font-medium">{contract.contractingOrgan}</TableCell>
                    <TableCell className="text-xs font-medium">{contract.contractedParty}</TableCell>
                    <TableCell className="text-xs font-medium uppercase">{contract.instrumentType}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        contract.status === 'vigente' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        contract.status === 'suspenso' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        {contract.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-xs">{formatCurrency(contract.totalValue)}</TableCell>
                    <TableCell className="font-bold text-xs">{formatCurrency(contract.executedValue)}</TableCell>
                    <TableCell className="font-bold text-xs">{formatCurrency(contract.totalValue - contract.executedValue)}</TableCell>
                    <TableCell className="font-mono text-xs">{contract.executionDays || '-'}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {contract.totalValue > 0 ? ((contract.executedValue / contract.totalValue) * 100).toFixed(1) : 0}%
                    </TableCell>
                    <TableCell className="font-mono text-xs font-black text-primary">
                      {contract.realMargin || 0}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* Abrir Detalhes (Página) */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary opacity-0 group-hover/row:opacity-100 transition-opacity"
                          title="Abrir Detalhes"
                          onClick={() => navigate(`/admin/contract-details?id=${contract.id}`)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        {/* Visualizar (Modal) */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
                          title="Visualizar Resumo"
                          onClick={() => handleView(contract)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* Acompanhamento */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
                          title="Solicitar Acompanhamento"
                          onClick={() => handleFollowUp(contract)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {/* Editar */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-amber-500/10 text-amber-400"
                          title="Editar Contrato"
                          onClick={() => handleEdit(contract)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Detail Selection */}
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Abrir Detalhe do Contrato</label>
            <Select value={selectedDetailId} onValueChange={setSelectedDetailId}>
              <SelectTrigger className="glass border-primary/10 h-14 font-bold text-lg">
                <SelectValue placeholder="Selecione um contrato..." />
              </SelectTrigger>
              <SelectContent className="glass border-primary/10">
                {contracts.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.instrumentNumber} — {c.contractingOrgan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleOpenDetail}
            disabled={!selectedDetailId}
            className="gold-gradient text-black font-black h-12 px-8 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            ABRIR DETALHE
          </Button>
        </div>
      </div>
      
      {/* Modal: Novo Contrato */}
      <ContractModal 
        isOpen={isNewModalOpen} 
        onClose={() => setIsNewModalOpen(false)} 
      />

      {/* Modal: Editar Contrato */}
      <ContractModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setActiveContract(null); }}
        contractId={activeContract?.id}
        initialData={activeContract}
      />

      {/* Modal: Visualizar Contrato */}
      <ContractViewModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setActiveContract(null); }}
        contract={activeContract}
      />

      {/* Modal: Solicitar Acompanhamento */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => { setIsFollowUpModalOpen(false); setActiveContract(null); }}
        contract={activeContract}
      />
    </div>
  );
};
