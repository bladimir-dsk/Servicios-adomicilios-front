import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/apis/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import AuthShell from "./AuthShell";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden");

    setLoading(true);
    try {
      const { name, email, password } = form;
      await register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1500);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear la cuenta"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Crea tu cuenta" subtitle="Regístrate en unos segundos">
      <Card>
        <CardContent className="pt-6">
          {success ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="font-medium">¡Cuenta creada!</p>
              <p className="text-sm text-muted-foreground">Redirigiendo al inicio de sesión…</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" placeholder="Tu nombre" autoComplete="name" required value={form.name} onChange={onChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" autoComplete="email" required value={form.email} onChange={onChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPass ? "text" : "password"} placeholder="Mínimo 8 caracteres" autoComplete="new-password" required className="pr-10" value={form.password} onChange={onChange} />
                  <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Mostrar contraseña">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar contraseña</Label>
                <Input id="confirm" name="confirm" type={showPass ? "text" : "password"} placeholder="Repite la contraseña" autoComplete="new-password" required value={form.confirm} onChange={onChange} />
              </div>

              {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" loading={loading}>Crear cuenta</Button>
            </form>
          )}

          {!success && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">Inicia sesión</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </AuthShell>
  );
}
