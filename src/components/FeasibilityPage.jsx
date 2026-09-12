import { CheckCircle2, Package, AlertCircle, AlertTriangle, Layers, Ruler, ShieldCheck } from "lucide-react";

export default function FeasibilityPage({ apiData, onNext }) {
  const feasibilityData = apiData?.feasibilityData;
  const smartMaterialData = apiData?.smartMaterialData;
  const projectTitle = apiData?.transformationPlan?.toProduct || apiData?.selectedIdea?.title || "Selected Transformation";

  if (!feasibilityData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto text-amber-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-gray-900">
            No Feasibility Data Available
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please select an upcycling idea to view detailed feasibility scores.
          </p>
        </div>
      </div>
    );
  }

  // Fallback calculations for smart material if called without full backend payload
  const availableMat = smartMaterialData?.availableMaterial ?? (apiData?.analysisData?.usableMaterial || 80);
  const requiredMat = smartMaterialData?.requiredMaterial ?? (apiData?.transformationPlan?.materialUtilization || 70);
  const compatScore = smartMaterialData?.compatibilityScore ?? (apiData?.feasibilityData?.score || 85);
  const status = smartMaterialData?.status ?? (availableMat >= requiredMat ? "Enough Material" : "Limited Material");
  const warnings = smartMaterialData?.warnings || ["Ensure clean cuts along natural seamlines to maximize material yield."];
  const reusableParts = smartMaterialData?.reusableParts || apiData?.analysisData?.reusableParts || [];
  const additionalMaterials = smartMaterialData?.additionalMaterials || feasibilityData?.additionalMaterials || [];

  const getStatusBadge = (st) => {
    if (st === "Enough Material") {
      return "bg-green-100 text-green-800 border-green-300";
    }
    if (st === "Limited Material") {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Main Feasibility Summary Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Feasibility Analysis: {projectTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Evaluating garment condition, material yield, and project difficulty.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-center">
            <ShieldCheck size={20} className="text-green-700 shrink-0" />
            <div>
              <span className="text-[10px] font-semibold text-gray-500 block uppercase">Project Score</span>
              <span className="text-xl font-extrabold text-green-800">{feasibilityData.score}%</span>
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        {feasibilityData.checklist && feasibilityData.checklist.length > 0 && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-semibold text-gray-700">Feasibility Verification Checklist</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {feasibilityData.checklist.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-700 bg-gray-50/50"
                >
                  <CheckCircle2 size={14} className="text-green-700 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Feature 1 — Smart Material Calculator Card 🧵 */}
      <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-100 text-green-800">
              <Ruler size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Smart Material Calculator 🧵
              </h2>
              <p className="text-xs text-gray-500">
                Comparing available garment fabric yield vs project requirements
              </p>
            </div>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(status)}`}>
            {status}
          </span>
        </div>

        {/* Material Yield Progress Comparison */}
        <div className="grid gap-4 sm:grid-cols-2 rounded-lg border border-gray-200 bg-green-50/30 p-4 text-xs">
          <div>
            <div className="flex items-center justify-between text-gray-700 font-medium">
              <span>Available Usable Material</span>
              <span className="font-bold text-green-800">{availableMat}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-700 transition-all"
                style={{ width: `${availableMat}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-gray-700 font-medium">
              <span>Estimated Required Material</span>
              <span className="font-bold text-green-800">{requiredMat}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-600 transition-all"
                style={{ width: `${requiredMat}%` }}
              />
            </div>
          </div>
        </div>

        {/* Material Compatibility Score */}
        <div className="mt-4 flex items-center justify-between rounded-md border border-gray-200 px-4 py-3 bg-white text-xs">
          <span className="font-medium text-gray-700">Material Compatibility Score</span>
          <span className="text-lg font-bold text-green-800">{compatScore} / 100</span>
        </div>

        {/* Reusable Parts & Additional Supplies */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Layers size={14} className="text-green-700 shrink-0" />
              Reusable Parts Available
            </p>
            <ul className="space-y-1.5 text-xs">
              {reusableParts.map((part) => (
                <li
                  key={part}
                  className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700"
                >
                  <CheckCircle2 size={13} className="text-green-700 shrink-0" />
                  {part}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <Package size={14} className="text-green-700 shrink-0" />
              Additional Materials Needed
            </p>
            <ul className="space-y-1.5 text-xs">
              {additionalMaterials.map((item) => (
                <li
                  key={item}
                  className="rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practical Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1">
              <AlertTriangle size={15} className="text-amber-600 shrink-0" />
              <span>Practical Fabric & Cutting Notes</span>
            </div>
            <ul className="space-y-1 pl-5 list-disc text-amber-800">
              {warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onNext}
        className="w-full rounded-md bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 shadow-sm"
      >
        View Step-by-Step Transformation Guide
      </button>
    </div>
  );
}
