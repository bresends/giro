import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { GiroMark } from "@/components/giro/GiroLogo";
import { GiroButton } from "@/components/giro/giro-button";
import vehicle from "../../design/assets/viaturas-realistas/abts-fenix-cbmgo.png";
import "./login.css";

export function LoginPage() {
  const { signIn } = useAuthActions();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function onGoogleSignIn() {
    setAuthError(null);
    setIsRedirecting(true);
    try {
      await signIn("google");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Erro ao autenticar");
      setIsRedirecting(false);
    }
  }

  return (
    <main className="garage-login" aria-labelledby="login-title">
      <header className="login-brand">
        <GiroMark size={28} />
        GIRO
      </header>

      <section className="login-access">
        <div className="login-content">
          <p className="login-kicker">CBMGO  /  FROTA</p>
          <h1 id="login-title">Acesso à frota</h1>
          <p className="login-instructions">
            Entre com sua conta Google para acessar o GIRO.
          </p>

          <GiroButton
            className="login-google"
            variant="ghost"
            size="xl"
            type="button"
            disabled={isRedirecting}
            aria-busy={isRedirecting}
            onClick={() => void onGoogleSignIn()}
          >
            <GoogleIcon />
            {isRedirecting ? "Redirecionando..." : "Entrar com Google"}
          </GiroButton>
          {authError && <p className="login-error" role="alert">{authError}</p>}
        </div>
      </section>

      <figure className="login-garage">
        <div className="login-scene">
          <span className="login-vehicle-type" aria-hidden="true">ABTS</span>
          <img
            className="login-vehicle"
            src={vehicle}
            width={1536}
            height={1024}
            fetchPriority="high"
            alt="Viatura ABTS do CBMGO com a fênix na porta da cabine"
          />
        </div>
      </figure>

      <footer className="login-credit">
        Corpo de Bombeiros Militar do Estado de Goiás
      </footer>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}
