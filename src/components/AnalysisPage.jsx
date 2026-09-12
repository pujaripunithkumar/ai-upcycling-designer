import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

export default function AnalysisPage({ garment, apiData, onNext }) {
  const analysisData = apiData?.analysisData;

  if (!analysisData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto text-amber-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-gray-900">
            No Analysis Data Available
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please return to the Upload page and submit a garment for analysis.
          </p>
        </div>
      </div>
    );
  }

  const rows = [
    ["Garment Type", garment?.garmentType || "Garment"],
    ["Material", garment?.material || "Fabric"],
    ["Color", analysisData.color],
    ["Condition", garment?.condition || analysisData.conditionScore],
    ["User Preference", garment?.userPreference || "Bags & Accessories"],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Material & Garment Analysis
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is what RELOOP AI Vision detected in your garment item.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            {garment?.imageUrl ? (
              <img
                src={garment.imageUrl}
                alt="Uploaded garment"
                className="h-56 w-full rounded-md border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center rounded-md border border-gray-200 bg-green-50/40 text-sm text-gray-400">
                No image provided
              </div>
            )}
          </div>

          <div className="space-y-4">
            <dl className="divide-y divide-gray-100 rounded-md border border-gray-200">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-3 py-2 text-sm"
                >
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-md border border-gray-200 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Usable Material</span>
                <span className="font-medium text-green-700">
                  {analysisData.usableMaterial}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-green-700 transition-all"
                  style={{ width: `${analysisData.usableMaterial}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {analysisData.reusableParts && analysisData.reusableParts.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-gray-700">
              Reusable Parts & Components
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {analysisData.reusableParts.map((part) => (
                <li
                  key={part}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
                >
                  <CheckCircle2 size={15} className="text-green-700 shrink-0" />
                  {part}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysisData.visibleDamage && analysisData.visibleDamage.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-gray-700">
              Visible Wear / Fabric Damage Notes
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {analysisData.visibleDamage.map((damage) => (
                <li
                  key={damage}
                  className="flex items-center gap-2 rounded-md border border-gray-200 bg-amber-50/50 px-3 py-2 text-sm text-gray-700"
                >
                  <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                  {damage}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onNext}
          className="mt-6 w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
        >
          Explore Upcycling Ideas
        </button>
      </div>
    </div>
  );
}
