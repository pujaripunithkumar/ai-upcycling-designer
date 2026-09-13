import { useState } from "react";
import { ImagePlus, AlertCircle } from "lucide-react";
import { analyzeGarmentAPI } from "../services/api";

export default function UploadPage({ garment, setGarment, onAnalyze, onApiSuccess }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const update = (field) => (e) =>
    setGarment((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setGarment((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!garment.garmentType) next.garmentType = "Garment type is required.";
    if (!garment.material) next.material = "Material is required.";
    if (!garment.condition) next.condition = "Condition is required.";
    if (!garment.size) next.size = "Size is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAnalyze = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    try {
      const res = await analyzeGarmentAPI(garment);
      if (res && res.analysisData) {
        if (onApiSuccess) onApiSuccess(res);
        onAnalyze();
      } else {
        setApiError("Unable to analyze garment. Please ensure the backend server is running at https://ai-upcycling-designer.onrender.com.");
      }
    } catch (e) {
      console.error("API analysis error:", e);
      setApiError("Failed to connect to backend server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-green-600 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Upload Garment & Preferences
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Provide a photo, garment details, and your upcycling style preference.
        </p>

        {apiError && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Garment Image
            </label>
            <label className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-green-50/40 text-gray-500 hover:border-green-500">
              {garment.imageUrl ? (
                <img
                  src={garment.imageUrl}
                  alt="Garment preview"
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <>
                  <ImagePlus size={22} className="mb-2 text-green-700" />
                  <span className="text-xs">Click to upload an image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Garment Type
              </label>
              <input
                type="text"
                placeholder="e.g. Denim Jeans"
                value={garment.garmentType}
                onChange={update("garmentType")}
                className={inputClass("garmentType")}
              />
              {errors.garmentType && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.garmentType}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Material
              </label>
              <input
                type="text"
                placeholder="e.g. Denim"
                value={garment.material}
                onChange={update("material")}
                className={inputClass("material")}
              />
              {errors.material && (
                <p className="mt-1 text-xs text-red-500">{errors.material}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Condition
              </label>
              <select
                value={garment.condition}
                onChange={update("condition")}
                className={inputClass("condition")}
              >
                <option value="">Select condition</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Worn">Worn</option>
              </select>
              {errors.condition && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.condition}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Size
              </label>
              <select
                value={garment.size}
                onChange={update("size")}
                className={inputClass("size")}
              >
                <option value="">Select size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
              {errors.size && (
                <p className="mt-1 text-xs text-red-500">{errors.size}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Upcycling Preference / Goal
              </label>
              <select
                value={garment.userPreference || "Bags & Accessories"}
                onChange={update("userPreference")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600"
              >
                <option value="Bags & Accessories">Bags & Accessories</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Clothing & Apparel">Clothing & Apparel</option>
                <option value="Utility & Organizers">Utility & Organizers</option>
                <option value="Pet Accessories">Pet Accessories</option>
                <option value="No Preference / Surprise Me">No Preference / Surprise Me</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-6 w-full rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-70"
        >
          {loading ? "Analyzing Garment with AI..." : "Analyze Garment & Generate Ideas"}
        </button>
      </div>
    </div>
  );
}
