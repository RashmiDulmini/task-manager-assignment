// LLM: Show the initial Task Manager page while task screens are being implemented.
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-5 px-6 py-16 sm:px-10">
      <div>
        <Badge variant="secondary">Setup complete</Badge>
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">LLM Task Manager</h1>
      <p className="max-w-xl text-muted-foreground">
        The frontend is ready. Task management will be added next.
      </p>
    </main>
  );
}
