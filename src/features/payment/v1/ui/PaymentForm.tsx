import { memo, useCallback, useId, useMemo, useState } from "react";
import { CreditCard, Send, CheckCircle2 } from "lucide-react";
import { FEE_TYPES, PAYMENT_METHODS } from "../config/payment.config";
import useStudentStore, { Student } from "../../../Course/v1/store/student.store";
import api from "../../../../Utils/api.utils";
import { toast } from "react-toastify";

type FeeType = (typeof FEE_TYPES)[number];
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

function PaymentForm() {
  const feeTypeId = useId();
  const paymentMethodId = useId();
  const amountId = useId();
  const notesId = useId();

  const student = useStudentStore((state: { students: Student[] }) => state.students[0]);
  const updateStudent = useStudentStore(
    (state: { updateStudent: (student: Student) => void }) => state.updateStudent,
  );

  const [feeType, setFeeType] = useState<FeeType>(FEE_TYPES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled = useMemo(
    () => amount.trim().length === 0 || isNaN(Number(amount)) || Number(amount) <= 0 || !student,
    [amount, student],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!student) {
        toast.error("Please select a student record first.");
        return;
      }

      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        toast.error("Please enter a valid payment amount.");
        return;
      }

      setIsSubmitting(true);
      try {
        await api.patch("/api/v1/Student/FeeUpdate", {
          uniqueId: student.uniqueId,
          Paid_amount: numAmount,
          PaymentType: feeType,
          paymentMethod,
          amount: numAmount,
          feeType,
          notes,
        });

        const courseFee = student.fee.course_Fee ?? 60000;
        const currentPaid = student.fee.amount_paid ?? 0;
        const newPaid = currentPaid + numAmount;
        const updatedStudent: Student = {
          ...student,
          fee: {
            ...student.fee,
            amount_paid: newPaid,
            amount_due: Math.max(0, courseFee - newPaid),
          },
        };
        updateStudent(updatedStudent);

        toast.success(
          `Payment of ₹${numAmount} recorded for ${student.student.firstName} ${student.student.lastName}! Receipt queued in payments_queue.`,
        );
        setAmount("");
        setNotes("");
      } catch {
        toast.error("Failed to process payment recording.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [student, amount, feeType, paymentMethod, notes, updateStudent],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-violet-300/80">
            Fee collection action
          </p>
          <h3 className="mt-1 text-xl font-semibold text-white">Record Tuition Payment</h3>
        </div>

        <div className="hidden rounded-2xl border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200 md:flex md:items-center md:gap-2">
          <CreditCard size={15} /> Cashier Terminal
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor={feeTypeId} className="text-xs text-zinc-300">
            Fee Category
          </label>
          <select
            id={feeTypeId}
            value={feeType}
            onChange={(event) => setFeeType(event.target.value as FeeType)}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#0C0D14] px-3 text-sm text-white outline-none transition focus:border-violet-400/50"
          >
            {FEE_TYPES.map((option) => (
              <option key={option} value={option} className="bg-[#0C0D14] text-white">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={paymentMethodId} className="text-xs text-zinc-300">
            Payment Mode
          </label>
          <select
            id={paymentMethodId}
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
            className="h-11 w-full rounded-xl border border-white/10 bg-[#0C0D14] px-3 text-sm text-white outline-none transition focus:border-violet-400/50"
          >
            {PAYMENT_METHODS.map((option) => (
              <option key={option} value={option} className="bg-[#0C0D14] text-white">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor={amountId} className="text-xs text-zinc-300">
            Collection Amount (₹)
          </label>
          <input
            id={amountId}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="e.g. 15000"
            className="h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor={notesId} className="text-xs text-zinc-300">
            Payment Notes & Bank Transaction Ref
          </label>
          <textarea
            id={notesId}
            rows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="e.g. UPI Ref 9842109842 / Bank Challan copy verified"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitDisabled || isSubmitting}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={15} /> {isSubmitting ? "Recording..." : "Record Fee Receipt"}
        </button>

        <button
          type="button"
          onClick={() => {
            if (student) setAmount(String(student.fee.amount_due));
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-semibold text-zinc-200 transition hover:bg-white/10"
        >
          <CheckCircle2 size={14} /> Full Due
        </button>
      </div>
    </form>
  );
}

export default memo(PaymentForm);
