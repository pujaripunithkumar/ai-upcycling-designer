import { Leaf, ChevronRight, Sparkles } from "lucide-react";

const STEP_LABELS = [
  "Home",
  "Upload",
  "Analysis",
  "Ideas",
  "Feasibility",
  "Guide",
  "Result",
];

export default function Header({ step, onHome }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Side — Brand */}
        <div
          onClick={onHome}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
          role="button"
          tabIndex={0}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-700 to-emerald-800 text-white shadow-xs shadow-green-900/20">
            <Leaf size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold leading-none tracking-tight text-green-900">
                RELOOP
              </span>
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-green-800 uppercase">
                AI
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-gray-500">
              AI Upcycling Designer
            </p>
          </div>
        </div>

        {/* Center — Progress Journey (Desktop) */}
        <div className="hidden items-center gap-1 text-xs font-medium md:flex">
          {STEP_LABELS.map((label, idx) => {
            const stepNum = idx + 1;
            const isCurrent = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <div key={label} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={stepNum === 1 ? onHome : undefined}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all ${
                    stepNum === 1 ? "cursor-pointer hover:bg-green-100/70" : ""
                  } ${
                    isCurrent
                      ? "border border-green-300 bg-green-100/90 font-bold text-green-900 shadow-2xs"
                      : isCompleted
                      ? "font-medium text-green-700"
                      : "text-gray-400"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                      isCurrent
                        ? "bg-green-700 font-bold text-white"
                        : isCompleted
                        ? "bg-green-200 font-semibold text-green-800"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? "✓" : stepNum}
                  </span>
                  <span>{label}</span>
                </button>

                {idx < STEP_LABELS.length - 1 && (
                  <ChevronRight
                    size={12}
                    className={isCompleted ? "text-green-500" : "text-gray-300"}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Center/Right Mobile Progress View */}
        <div className="flex flex-col items-end gap-1 md:hidden">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800">
              Step {step} of {STEP_LABELS.length}
            </span>
            <span className="font-medium text-gray-600">
              · {STEP_LABELS[step - 1]}
            </span>
          </div>
          {/* Mobile Progress Bar */}
          <div className="h-1.5 w-24 overflow-hidden rounded-full border border-gray-200/60 bg-gray-100">
            <div
              className="h-full rounded-full bg-green-700 transition-all duration-300"
              style={{ width: `${(step / STEP_LABELS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Side Status Pill (Desktop/Tablet) */}
        <div className="hidden items-center gap-2 rounded-full border border-green-200/80 bg-green-50/80 px-3 py-1 text-xs font-semibold text-green-800 shadow-2xs lg:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
          </span>
          <div className="flex items-center gap-1">
            <Sparkles size={12} className="text-green-600" />
            <span>Ready to Transform</span>
          </div>
        </div>
      </div>
    </header>
  );
}
