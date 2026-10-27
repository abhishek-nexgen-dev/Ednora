import Card from "./Card";
import StatCard from "./StatCard";

interface ProgramDescriptionProps {
  description?: string;
}

export default function ProgramDescription({ description }: ProgramDescriptionProps) {
  return (
    <Card className="p-8">
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-white">Program Description</h2>

        <p className="mt-2 text-zinc-400 leading-7 whitespace-pre-line">
          {description ||
            "Our academic curriculum is designed to prepare students for technical careers, industry projects, and research-oriented learning to ensure graduates become capable professionals in their respective domains."}
        </p>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard label="Placement Rate" value="98%" />
        <StatCard label="Industry Partners" value="120+" />
        <StatCard label="Students Enrolled" value="4,500+" />
      </div>

      {/* Highlights */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold text-white">Program Highlights</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Highlight text="Industry-oriented curriculum designed with current technological standards." />
          <Highlight text="Hands-on learning with real-world datasets and live projects." />
          <Highlight text="Dedicated placement assistance and internship opportunities." />
          <Highlight text="Expert faculty from academia and industry." />
          <Highlight text="Modern computing and laboratory facilities." />
          <Highlight text="Research opportunities and hackathons." />
        </div>
      </div>
    </Card>
  );
}

function Highlight({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="h-2 w-2 rounded-full bg-violet-400" />
      <span className="text-sm text-zinc-300">{text}</span>
    </div>
  );
}
