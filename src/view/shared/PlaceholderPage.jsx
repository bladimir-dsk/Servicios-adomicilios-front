import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

// Pantalla base: reemplázala por tu contenido real
export default function PlaceholderPage({ title, description }) {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>Hola, {user?.name} 👋</CardTitle>
          <CardDescription>Esta es la vista «{title}». Aquí va tu contenido.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
            Contenido de {title}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
