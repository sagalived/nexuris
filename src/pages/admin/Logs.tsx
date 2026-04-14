import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { db, OperationType, handleFirestoreError } from '@/src/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Log {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: any;
}

export const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      const logsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Log));
      setLogs(logsData);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'logs'));

    return () => unsub();
  }, []);

  if (loading) {
    return <Skeleton className="h-[600px] w-full bg-secondary" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gold-text-gradient">Logs de Atividade</h1>
        <Badge variant="outline" className="border-primary/10 text-muted-foreground">
          Últimas 100 entradas
        </Badge>
      </div>

      <div className="rounded-md border border-primary/10 glass overflow-hidden">
        <Table>
          <TableHeader className="border-primary/10 bg-primary/5">
            <TableRow className="hover:bg-transparent border-primary/10">
              <TableHead className="text-muted-foreground">Data/Hora</TableHead>
              <TableHead className="text-muted-foreground">Usuário</TableHead>
              <TableHead className="text-muted-foreground">Ação</TableHead>
              <TableHead className="text-muted-foreground">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhum log encontrado.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-primary/10 hover:bg-primary/5">
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '---'}
                  </TableCell>
                  <TableCell className="text-foreground">{log.userEmail || 'Sistema'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
