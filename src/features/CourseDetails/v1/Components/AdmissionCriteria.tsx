import { CheckCircle2, FileText, GraduationCap } from "lucide-react";
import Card from "./Card";

interface AdmissionCriteriaProps {
  criteria?: string[];
  eligibility?: string;
}

export default function AdmissionCriteria({ criteria, eligibility }: AdmissionCriteriaProps) {
  const displayCriteria = Array.isArray(criteria) && criteria.length > 0
    ? criteria
    : [
        eligibility || "10+2 with minimum 50% aggregate marks from a recognized board.",
        "Valid academic transcript and proof of prior coursework.",
        "Good analytical and programming aptitude.",
      ];

  return (
    <Card className="p-8">
      <div className="flex items-center gap-3">
        <GraduationCap className="text-violet-400" />
        <h2 className="text-2xl font-bold text-white">Admission Criteria</h2>
      </div>

      <p className="mt-4 leading-7 text-zinc-400">
        Applicants must satisfy the minimum eligibility requirements, submit the required academic
        documents, and complete the admission process before the application deadline.
      </p>

      {/* Eligibility */}
      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-white">Eligibility Guidelines</h3>

        <div className="space-y-4">
          {displayCriteria.map((item, index) => (
            <Item key={index}>{item}</Item>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-3">
          <FileText className="text-violet-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Required Documents</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DocumentCard title="10th Marksheet" />
          <DocumentCard title="12th Marksheet" />
          <DocumentCard title="Government ID Proof (Aadhaar / Voter ID)" />
          <DocumentCard title="Passport Size Photographs" />
          <DocumentCard title="Transfer / Migration Certificate" />
          <DocumentCard title="Category / Caste Certificate (if applicable)" />
        </div>
      </section>
    </Card>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-zinc-300">
      <CheckCircle2 className="mt-1 text-emerald-400 shrink-0" size={18} />
      <span>{children}</span>
    </div>
  );
}

function DocumentCard({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="h-2 w-2 rounded-full bg-violet-400 shrink-0" />
      <span className="text-sm text-zinc-300">{title}</span>
    </div>
  );
}
