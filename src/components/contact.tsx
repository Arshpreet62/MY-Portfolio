import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Contact() {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Let us build together</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              I am open to new projects starting this season. Share a short
              brief and I will get back within two business days.
            </p>
            <Button variant="secondary" className="w-fit">
              Send a brief
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="rounded-md border bg-muted px-3 py-2">
              hello@example.com
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Based in Punjab, Mohali
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
