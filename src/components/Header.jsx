import { Leaf } from "lucide-react";

const STEP_LABELS = [
  "Home",
  "Upload",
  "Analysis",
  "Ideas",
  "Feasibility",
  "Guide",
  "Result",
];

export default function Header({ step }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-700 text-white">
            <Leaf size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-green-800">
              RELOOP
            </p>
            <p className="text-[11px] leading-none text-gray-500">
              AI Upcycling Designer
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400">
          Step {step} of {STEP_LABELS.length}
          <span className="ml-1 text-gray-500 font-medium">
            · {STEP_LABELS[step - 1]}
          </span>
        </p>
      </div>
    </header>
  );
}
