import { useState } from "react";
import {
  Scissors,
  Layers,
  Ruler,
  Package,
  Sparkles,
  CheckCircle2,
  Clock,
  Gauge,
  ArrowRight,
  Leaf,
  AlertCircle,
  Check
} from "lucide-react";

function getStepIcon(stepText) {
  const lower = (stepText || "").toLowerCase();
  if (lower.includes("cut") || lower.includes("trim") || lower.includes("shear") || lower.includes("deconstruct")) {
    return Scissors;
  }
  if (lower.includes("stitch") || lower.includes("sew") || lower.includes("hem") || lower.includes("pin")) {
    return Layers;
  }
  if (lower.includes("measure") || lower.includes("align") || lower.includes("lay") || lower.includes("prep")) {
    return Ruler;
  }
  if (lower.includes("attach") || lower.includes("strap") || lower.includes("handle") || lower.includes("zipper") || lower.includes("pocket")) {
    return Package;
  }
  if (lower.includes("press") || lower.includes("iron") || lower.includes("finish") || lower.includes("complete")) {
    return Sparkles;
  }
  return CheckCircle2;
}

function parseStepDetails(stepText, index, total) {
  const text = stepText || "";
  const parts = text.split(/(?<=[.!?])\s+/);
  
  let title = parts[0] || `Step ${index + 1}`;
  if (title.length > 55) {
    title = title.substring(0, 50) + "...";
  }

  let tip = null;
  const lower = text.toLowerCase();
  if (lower.includes("cut") || lower.includes("trim") || lower.includes("deconstruct")) {
    tip = "Pro Tip: Use sharp fabric shears and follow natural seamlines to maximize usable material.";
  } else if (lower.includes("stitch") || lower.includes("sew") || lower.includes("pin")) {
    tip = "Pro Tip: Pin fabric layers every 2-3 inches to keep edges aligned during stitching.";
  } else if (lower.includes("press") || lower.includes("iron") || lower.includes("finish")) {
    tip = "Pro Tip: Pressing seams flat with a warm iron gives your upcycled creation a crisp finish.";
  } else if (index === 0) {
    tip = "Pro Tip: Seam-rip carefully without tugging to preserve edge threads.";
  } else if (index === total - 1) {
    tip = "Pro Tip: Double-stitch stress points (like handle joints) for extra durability.";
  }

  return { title, instruction: text, tip };
}

export default function GuidePage({ apiData, onComplete }) {
  const guideSteps = apiData?.guideSteps || [];
  const transformationPlan = apiData?.transformationPlan;
  const selectedIdea = apiData?.selectedIdea;
  const finalResult = apiData?.finalResult;

  const toProduct = transformationPlan?.toProduct || selectedIdea?.title || "Upcycled Product";
  const fromProduct = transformationPlan?.fromProduct || apiData?.garment?.garmentType || "Original Garment";
  const difficulty = transformationPlan?.difficulty || selectedIdea?.difficulty || "Easy";
  const estimatedTime = transformationPlan?.estimatedTime || selectedIdea?.estimatedTime || "1.5 Hours";
  const wasteReduced = finalResult?.wasteReduced || selectedIdea?.wasteReduced || "0.5 kg";

  const [completedSteps, setCompletedSteps] = useState({});

  if (!guideSteps || guideSteps.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto text-amber-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-gray-900">
            No Transformation Guide Available
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please analyze a garment and select an upcycling idea to view the creation guide.
          </p>
        </div>
      </div>
    );
  }

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isFullyCompleted = completedCount === guideSteps.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
              <span>{fromProduct}</span>
              <ArrowRight size={12} className="text-green-600" />
              <span>{toProduct}</span>
            </div>
            <h1 className="mt-3 text-xl font-bold text-gray-900">
              How to Create Your {toProduct}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Follow this step-by-step tutorial to complete your upcycling transformation.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-green-50/50 px-4 py-3 text-xs">
            <Leaf size={18} className="text-green-700 shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{wasteReduced} Waste Reduced</p>
              <p className="text-gray-500 text-[11px]">Eco Impact</p>
            </div>
          </div>
        </div>

        {/* Info Badges */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 text-center text-xs">
          <div className="flex items-center justify-center gap-1.5 text-gray-600">
            <Gauge size={15} className="text-green-700 shrink-0" />
            <span>Difficulty: <strong className="text-gray-900">{difficulty}</strong></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-gray-600">
            <Clock size={15} className="text-green-700 shrink-0" />
            <span>Time: <strong className="text-gray-900">{estimatedTime}</strong></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-gray-600">
            <Sparkles size={15} className="text-green-700 shrink-0" />
            <span>Total Steps: <strong className="text-green-700">{guideSteps.length} Steps</strong></span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Header */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          {guideSteps.length} Steps to Transform Your Garment
        </h2>
        <span className="text-xs font-medium text-green-700">
          {completedCount} of {guideSteps.length} steps checked
        </span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-green-700 transition-all duration-300"
          style={{ width: `${(completedCount / guideSteps.length) * 100}%` }}
        />
      </div>

      {/* Vertical Connecting Timeline */}
      <div className="relative mt-8 ml-4 border-l-2 border-green-200 pl-6 space-y-6 md:ml-6 md:pl-8">
        {guideSteps.map((stepText, index) => {
          const StepIcon = getStepIcon(stepText);
          const { title, instruction, tip } = parseStepDetails(stepText, index, guideSteps.length);
          const isDone = !!completedSteps[index];

          return (
            <div key={index} className="relative group">
              {/* Timeline Node Icon */}
              <div
                onClick={() => toggleStep(index)}
                className={`absolute -left-[2.15rem] md:-left-[2.65rem] top-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isDone
                    ? "bg-green-700 text-white ring-4 ring-[#f7f8f6]"
                    : "bg-white border-2 border-green-600 text-green-800 ring-4 ring-[#f7f8f6] group-hover:bg-green-50"
                }`}
              >
                {isDone ? <Check size={16} /> : index + 1}
              </div>

              {/* Step Card */}
              <div
                className={`rounded-lg border p-5 transition-all ${
                  isDone
                    ? "border-green-300 bg-green-50/30"
                    : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 text-green-800 shrink-0">
                      <StepIcon size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold tracking-wider text-green-700 uppercase">
                        Step {index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStep(index)}
                    className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      isDone
                        ? "bg-green-700 text-white"
                        : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 size={13} />
                        Done
                      </>
                    ) : (
                      "Mark Complete"
                    )}
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                  {instruction}
                </p>

                {tip && (
                  <div className="mt-3 flex items-start gap-2 rounded-md border border-green-200 bg-green-50/60 p-3 text-xs text-green-900">
                    <Sparkles size={14} className="mt-0.5 text-green-700 shrink-0" />
                    <span>{tip}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      <div className="mt-10 rounded-lg border border-green-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
          🎉
        </div>
        <h2 className="mt-3 text-lg font-bold text-gray-900">
          Your {toProduct} is Ready!
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Congratulations on giving your {fromProduct} a stylish second life! You reduced approximately{" "}
          <strong className="text-green-700">{wasteReduced}</strong> of textile waste.
        </p>

        <button
          onClick={onComplete}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-800 shadow-sm"
        >
          <span>Complete & View Impact Summary</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
