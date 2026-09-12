import { useState } from "react";
import { CheckCircle2, Clock, Gauge, Layers, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { selectIdeaAPI } from "../services/api";

export default function TransformationPage({ garment, analysisData, ideas, onIdeaSelected }) {
  const [selectedId, setSelectedId] = useState(ideas && ideas.length > 0 ? ideas[0].id : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!ideas || ideas.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <AlertCircle className="mx-auto text-amber-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-gray-900">
            No Upcycling Ideas Available
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please analyze a garment to view personalized upcycling suggestions.
          </p>
        </div>
      </div>
    );
  }

  const handleProceed = async () => {
    const chosenIdea = ideas.find((item) => item.id === selectedId) || ideas[0];
    setLoading(true);
    setError(null);

    try {
      const res = await selectIdeaAPI(garment, analysisData, chosenIdea);
      if (res && res.feasibilityData) {
        onIdeaSelected(res);
      } else {
        setError("Unable to process selected idea. Please ensure backend is running.");
      }
    } catch (e) {
      console.error("Error selecting idea:", e);
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Personalized Upcycling Ideas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              AI generated 3–4 tailored concepts based on your garment and style preference. Select one to proceed.
            </p>
          </div>
          <Sparkles className="text-green-700 shrink-0" size={24} />
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {ideas.map((idea) => {
            const isSelected = idea.id === selectedId;
            return (
              <div
                key={idea.id}
                onClick={() => setSelectedId(idea.id)}
                className={`cursor-pointer rounded-lg border p-5 transition-all ${
                  isSelected
                    ? "border-green-600 bg-green-50/40 shadow-sm ring-1 ring-green-600"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 mb-2">
                      {idea.category || "Accessories"}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">
                      {idea.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-green-600 bg-green-600" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-600">{idea.description}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-md border border-gray-100 bg-white p-2 text-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Difficulty</span>
                    <span className="font-medium text-gray-800">{idea.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Time</span>
                    <span className="font-medium text-gray-800">{idea.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Material Use</span>
                    <span className="font-medium text-green-700">{idea.materialUtilization}%</span>
                  </div>
                </div>

                {idea.reusableParts && idea.reusableParts.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-600">
                    <span className="font-medium text-gray-500">Reusable parts:</span>
                    {idea.reusableParts.map((part) => (
                      <span
                        key={part}
                        className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px]"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleProceed}
          disabled={loading || !selectedId}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-70"
        >
          {loading ? (
            "Calculating Detailed Feasibility..."
          ) : (
            <>
              Select Idea & Check Feasibility
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
