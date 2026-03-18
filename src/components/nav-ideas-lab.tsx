"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OptionCardProps = {
  title: string;
  vibe: string;
  children: React.ReactNode;
};

function OptionCard({ title, vibe, children }: OptionCardProps) {
  return (
    <Card className="border-border/60 bg-background/75 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {vibe}
        </p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function OrbitDotPreview() {
  return (
    <div className="relative h-24 overflow-hidden rounded-lg border border-border/70 bg-gradient-to-r from-cyan-500/10 via-background to-emerald-500/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.18),_transparent_70%)]" />
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.65)]" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-[spin_4s_linear_infinite]">
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.65)]" />
      </div>
    </div>
  );
}

function ProgressPulsePreview() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const value = total <= 0 ? 0 : (window.scrollY / total) * 100;
      setProgress(Math.max(0, Math.min(100, value)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const markerStates = useMemo(
    () => [20, 40, 60, 80].map((marker) => marker <= progress),
    [progress],
  );

  return (
    <div className="space-y-3">
      <div className="h-3 overflow-hidden rounded-full border border-border/70 bg-muted/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-1">
        {markerStates.map((isPassed, index) => (
          <span
            key={index}
            className={`h-2.5 w-2.5 rounded-full transition ${
              isPassed ? "bg-emerald-400" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Scroll-reactive nav pulse</p>
    </div>
  );
}

function SnakePreview() {
  const [position, setPosition] = useState(5);
  const [food, setFood] = useState(2);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosition((current) => {
        const next = (current + 1) % 10;
        if (next === food) {
          setScore((value) => value + 1);
          setFood(Math.floor(Math.random() * 10));
        }
        return next;
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [food]);

  const moveLeft = () => setPosition((current) => (current - 1 + 10) % 10);
  const moveRight = () => setPosition((current) => (current + 1) % 10);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-10 gap-1 rounded-lg border border-border/70 bg-background/60 p-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`h-4 rounded-sm ${
              index === position
                ? "bg-cyan-400"
                : index === food
                  ? "bg-emerald-400"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={moveLeft}
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs"
          >
            Left
          </Button>
          <Button
            onClick={moveRight}
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs"
          >
            Right
          </Button>
        </div>
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Score {score}
        </span>
      </div>
    </div>
  );
}

function TypingRacerPreview() {
  const words = ["render", "deploy", "latency", "design", "accessibility"];
  const [target, setTarget] = useState(words[0]);
  const [input, setInput] = useState("");
  const [hits, setHits] = useState(0);

  useEffect(() => {
    setTarget(words[Math.floor(Math.random() * words.length)]);
  }, [hits]);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm">
        Type: <span className="font-semibold text-cyan-500">{target}</span>
      </div>
      <input
        value={input}
        onChange={(event) => {
          const value = event.target.value;
          setInput(value);
          if (value.trim().toLowerCase() === target) {
            setHits((count) => count + 1);
            setInput("");
          }
        }}
        className="h-9 w-full rounded-md border border-border/70 bg-background/70 px-3 text-sm outline-none ring-0 focus:border-cyan-400"
        placeholder="Start typing"
      />
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Burst hits: {hits}
      </p>
    </div>
  );
}

function WeatherTimePreview() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = now.getHours();
  const mode = hour >= 6 && hour < 18 ? "Day" : "Night";

  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 px-3 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {mode} Mode
        </p>
        <p className="text-lg font-semibold tabular-nums text-cyan-500">
          {now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
      <div className="relative h-9 w-9">
        <span className="absolute inset-0 animate-pulse rounded-full bg-cyan-400/30" />
        <span className="absolute inset-1 rounded-full bg-gradient-to-br from-cyan-300 to-emerald-300" />
      </div>
    </div>
  );
}

function EqualizerPreview() {
  const [bars, setBars] = useState([20, 40, 60, 35, 55, 30, 45]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBars((current) =>
        current.map(() => 18 + Math.floor(Math.random() * 60)),
      );
    }, 350);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex h-20 items-end gap-1 rounded-lg border border-border/70 bg-background/60 px-2 py-2">
        {bars.map((height, index) => (
          <span
            key={index}
            className="w-full rounded-t-sm bg-gradient-to-t from-cyan-500 to-emerald-400 transition-all duration-300"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Ambient equalizer animation
      </p>
    </div>
  );
}

export function NavIdeasLab() {
  return (
    <section id="nav-ideas" className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Top Nav Idea Lab (Temporary)</h2>
        <p className="text-sm text-muted-foreground">
          Check these live previews and tell me the option number that feels
          right.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <OptionCard title="1. Orbit Dot" vibe="Ambient / premium motion">
          <OrbitDotPreview />
        </OptionCard>

        <OptionCard title="2. Progress Pulse" vibe="Useful + animated">
          <ProgressPulsePreview />
        </OptionCard>

        <OptionCard title="3. Mini Snake (2-key)" vibe="Playful / interactive">
          <SnakePreview />
        </OptionCard>

        <OptionCard title="4. Typing Racer Chip" vibe="Developer personality">
          <TypingRacerPreview />
        </OptionCard>

        <OptionCard title="5. Pixel Weather + Time" vibe="Elegant utility">
          <WeatherTimePreview />
        </OptionCard>

        <OptionCard title="6. Audio Bars" vibe="Music-like ambient">
          <EqualizerPreview />
        </OptionCard>
      </div>
    </section>
  );
}
