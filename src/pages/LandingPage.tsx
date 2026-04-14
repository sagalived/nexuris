import React, { useState } from 'react';
import { useAuth } from '@/src/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Mail, Lock, AlertCircle } from 'lucide-react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/src/lib/firebase';
import { Navigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const { user, profile, loading, isAdmin, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showDemoOption, setShowDemoOption] = useState(false);

  if (loading) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    setShowDemoOption(false);
    
    // CONSTRUCTION MODE: Immediate bypass for admin/admin
    if (email.toLowerCase() === 'admin' && password === 'admin') {
      loginAsDemo();
      setAuthLoading(false);
      return;
    }
    
    try {
      // Normalize 'admin' to 'admin@nexuris.com' for Firebase compatibility
      const isSimpleAdmin = email.toLowerCase() === 'admin';
      const loginEmail = isSimpleAdmin ? 'admin@nexuris.com' : email;
      
      try {
        await signInWithEmailAndPassword(auth, loginEmail, password);
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/operation-not-allowed') {
          setError("ERRO CRÍTICO: O provedor de E-mail/Senha não está ativado no Firebase Console. Por favor, acesse o Console > Authentication > Sign-in method e ative 'E-mail/Senha'.");
          if (isSimpleAdmin && password === 'admin') {
            setShowDemoOption(true);
          }
          return;
        }
        
        // If it's the default admin and doesn't exist, create it
        if (loginEmail === 'admin@nexuris.com' && (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential')) {
          try {
            await createUserWithEmailAndPassword(auth, loginEmail, password);
          } catch (createErr: any) {
            if (createErr.code === 'auth/operation-not-allowed') {
              setError("ERRO CRÍTICO: O provedor de E-mail/Senha não está ativado no Firebase Console. Por favor, acesse o Console > Authentication > Sign-in method e ative 'E-mail/Senha'.");
              setShowDemoOption(true);
              return;
            }
            if (createErr.code === 'auth/email-already-in-use') {
              throw new Error("Senha incorreta para o usuário administrador.");
            }
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      setError(err.message || "Falha no login. Verifique suas credenciais.");
      if (email.toLowerCase() === 'admin' && password === 'admin') {
        setShowDemoOption(true);
      }
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Decorative background elements - extremely subtle */}
      <div className="absolute top-[-20%] right-[-20%] w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[250px]" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-[250px]" />

      <div className="w-full max-w-md z-10">
        <div className="mb-16 flex flex-col items-center text-center relative">
          {/* Intense dark glow behind logo - pure black blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-black blur-[80px] rounded-full -z-10" />
          
          <div className="mb-8 rounded-3xl bg-black p-6 border border-primary/60 shadow-[0_0_80px_rgba(212,175,55,0.25)]">
            <ShieldCheck className="h-24 w-24 text-primary" />
          </div>
          <h1 className="text-9xl font-black tracking-tighter gold-text-gradient drop-shadow-[0_0_40px_rgba(0,0,0,1)]">Nexuris</h1>
          <p className="mt-6 text-primary font-black uppercase tracking-[0.5em] text-[16px] drop-shadow-md">Financial & Legal Control</p>
        </div>

        <Card className="glass border-primary/40 shadow-[0_40px_100px_rgba(0,0,0,1)]">
          <CardHeader className="space-y-2 text-center pb-6 border-b border-primary/10">
            <div className="text-primary font-black text-sm uppercase tracking-[0.3em] mb-2">Nexuris</div>
            <CardTitle className="text-4xl font-bold text-foreground">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Entre com suas credenciais de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-10">
            <form onSubmit={handleEmailLogin} className="space-y-8">
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-black/50 z-10" />
                  <Input
                    type="text"
                    placeholder="Usuário ou E-mail"
                    className="bg-white border-none pl-14 text-black placeholder:text-black/30 h-16 text-xl font-bold focus-visible:ring-primary focus-visible:ring-offset-0 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-black/50 z-10" />
                  <Input
                    type="password"
                    placeholder="Senha"
                    className="bg-white border-none pl-14 text-black placeholder:text-black/30 h-16 text-xl font-bold focus-visible:ring-primary focus-visible:ring-offset-0 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex flex-col gap-3 rounded-xl bg-destructive/20 p-5 text-sm text-destructive border border-destructive/40 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center gap-3 font-bold">
                    <AlertCircle className="h-6 w-6 shrink-0" />
                    ATENÇÃO: CONFIGURAÇÃO NECESSÁRIA
                  </div>
                  <p className="leading-relaxed font-medium">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full gold-gradient text-black font-bold h-12 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300" 
                disabled={authLoading}
              >
                {authLoading ? "Autenticando..." : "ENTRAR NO SISTEMA"}
              </Button>

              {showDemoOption && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full border-primary/50 text-primary hover:bg-primary/10 font-bold h-12 animate-in fade-in slide-in-from-bottom-2 duration-500"
                  onClick={() => loginAsDemo()}
                >
                  ENTRAR EM MODO DE DEMONSTRAÇÃO
                </Button>
              )}
            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button 
                onClick={() => {
                  const rescueBtn = document.getElementById('rescue-google');
                  if (rescueBtn) rescueBtn.classList.toggle('hidden');
                }}
                className="text-[10px] text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
              >
                Problemas com login?
              </button>
              
              <div id="rescue-google" className="hidden w-full animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-tighter mb-2">
                  Use o Google como alternativa (Acesso de Emergência)
                </p>
                <Button 
                  variant="outline"
                  className="w-full border-primary/20 text-primary hover:bg-primary/10"
                  onClick={async () => {
                    try {
                      const { signInWithPopup, googleProvider } = await import('@/src/lib/firebase');
                      await signInWithPopup(auth, googleProvider);
                    } catch (err: any) {
                      setError(err.message);
                    }
                  }}
                >
                  Entrar com Google
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                Protegido por Criptografia de Ponta a Ponta
              </p>
            </div>

            {user && !isAdmin && (
              <div className="mt-6 rounded-lg bg-primary/5 p-4 text-center border border-primary/10">
                <p className="text-sm text-primary font-medium">
                  Logado como {user.displayName || user.email}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground uppercase tracking-tighter">
                  Aguardando permissão de administrador.
                </p>
                <Button 
                  variant="link" 
                  className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => auth.signOut()}
                >
                  Sair da conta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
