import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha para continuar.");
      return;
    }

    // MVP: não há backend de autenticação real neste protótipo.
    // Qualquer e-mail/senha válidos "entram" no aplicativo localmente.
    login({ name: name.trim() || email.split("@")[0], email: email.trim() });
    navigate("/dashboard");
  }

  function handleDemoAccess() {
    login({ name: "Confeitaria Demo", email: "demo@docegestao.com" });
    navigate("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-cocoa">
            <Sparkles className="h-6 w-6 text-gold" strokeWidth={1.75} />
            <span className="font-display text-2xl font-semibold">Doce Gestão</span>
          </div>
          <p className="mt-2 max-w-xs text-sm text-cocoa/60">
            Transforme receitas em lucro. Estoque, precificação e vendas em um só lugar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-7">
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="label-field">
              Nome da confeitaria (opcional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Doce Gestão Artesanal"
              className="input-field"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="label-field">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/35" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="label-field">
              Senha
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/35" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa/40 hover:text-cocoa"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            Entrar
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-cocoa/10" />
            <span className="text-xs text-cocoa/40">ou</span>
            <span className="h-px flex-1 bg-cocoa/10" />
          </div>

          <button type="button" onClick={handleDemoAccess} className="btn-secondary w-full">
            Acessar com dados de demonstração
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-cocoa/45">
          Protótipo funcional — autenticação simplificada, sem backend real.
        </p>
      </div>
    </div>
  );
}
