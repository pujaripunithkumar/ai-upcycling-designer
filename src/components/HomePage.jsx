import { Upload, Search, Layers, CheckCircle2, BookOpen } from "lucide-react";

const steps = [
  { icon: Upload, label: "Upload Garment" },
  { icon: Search, label: "Analyze Material" },
  { icon: Layers, label: "Create Transformation Plan" },
  { icon: CheckCircle2, label: "Check Feasibility" },
  { icon: BookOpen, label: "Follow the Guide" },
];

export default function HomePage({ onStart }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm font-medium tracking-wide text-green-700">
          RELOOP
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">
          Give Your Old Clothes a New Life
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-gray-600">
          RELOOP helps transform old clothes and textile waste into useful
          new products by analyzing the material and creating a practical
          transformation plan.
        </p>
        <button
          onClick={onStart}
          className="mt-6 rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Get Started
        </button>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">How it works</h2>
        <ul className="mt-4 space-y-3">
          {steps.map(({ icon: Icon, label }, i) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md border border-gray-200 bg-green-50 text-green-700">
                <Icon size={15} />
              </span>
              <span className="text-sm text-gray-700">
                {i + 1}. {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
