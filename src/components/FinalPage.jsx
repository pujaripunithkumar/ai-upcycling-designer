import { useState } from "react";
import {
  AlertCircle,
  Tag,
  Copy,
  Check,
  TrendingUp,
  ExternalLink,
  Store,
  Leaf,
  Globe,
  Award,
  RefreshCw,
  ShoppingBag,
  Share2
} from "lucide-react";
import { calculateResaleEstimate } from "./resaleValuation";

function getEnvironmentalImpact(apiData) {
  const envData = apiData?.environmentalImpactData;
  if (envData) return envData;

  const finalResult = apiData?.finalResult;
  const selectedIdea = apiData?.selectedIdea;
  const garment = apiData?.garment;

  const wasteDiverted = finalResult?.wasteReduced || selectedIdea?.wasteReduced || "0.5 kg";
  const matUtil = selectedIdea?.materialUtilization || finalResult?.materialReused || 75;
  const matReused = finalResult?.materialReused || 80;

  return {
    wasteDiverted,
    materialReusedPercent: matReused,
    materialUtilizationPercent: matUtil,
    circularityScore: Math.min(95, Math.round(matUtil * 0.5 + matReused * 0.4 + 10)),
    lifeExtensionYears: "+2 to 4 Years",
    impactSummary: `By transforming your ${garment?.garmentType || "garment"} into an upcycled creation, you repurposed ${matUtil}% of the fabric and diverted approx. ${wasteDiverted} of textile waste from landfills.`
  };
}

const LISTING_PLATFORMS = [
  {
    name: "Etsy",
    categoryBadge: "Handmade & Upcycled",
    description: "Global marketplace dedicated to handmade, vintage, and artisan upcycled products with a dedicated eco-conscious buyer base.",
    buttonText: "Visit Etsy",
    url: "https://www.etsy.com",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    icon: ShoppingBag
  },
  {
    name: "Instagram & WhatsApp Shop",
    categoryBadge: "Direct Social Selling",
    description: "Ideal for showcasing short DIY transformation reels, building your own sustainable brand, and taking orders directly via DMs.",
    buttonText: "Start Selling on Instagram",
    url: "https://www.instagram.com",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-200",
    icon: Share2
  },
  {
    name: "Facebook Marketplace",
    categoryBadge: "Local Buyers",
    description: "Great for quick local sales within your community without shipping fees, listing fees, or complex seller requirements.",
    buttonText: "Visit FB Marketplace",
    url: "https://www.facebook.com/marketplace",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Store
  },
  {
    name: "Meesho",
    categoryBadge: "Social Commerce",
    description: "Popular social reselling network in India for zero-investment micro-entrepreneurs and handmade lifestyle accessories.",
    buttonText: "Visit Meesho",
    url: "https://www.meesho.com",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Globe
  },
  {
    name: "FreeUp",
    categoryBadge: "Pre-loved & ReWorked",
    description: "India's fast-growing thrift & upcycled fashion community app for selling pre-loved, customized, and reworked garments.",
    buttonText: "Visit FreeUp",
    url: "https://www.freeup.in",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: ShoppingBag
  }
];

export default function FinalPage({ apiData, onRestart }) {
  const [copied, setCopied] = useState(false);
  const finalResult = apiData?.finalResult;

  if (!finalResult) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto text-amber-500" size={32} />
          <h2 className="mt-3 text-base font-semibold text-gray-900">
            No Summary Result Available
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Please return to the main screen to start a new transformation.
          </p>
          <button
            onClick={onRestart}
            className="mt-6 rounded-md bg-green-700 px-5 py-2 text-sm font-medium text-white hover:bg-green-800"
          >
            Start Transformation
          </button>
        </div>
      </div>
    );
  }

  const envData = getEnvironmentalImpact(apiData);
  const resaleData = calculateResaleEstimate(apiData);
  const { suggestedPrice, rangeMin, rangeMax, categoryLabel, qualityFinish, explanation, listing } = resaleData;

  const rows = [
    ["Original Garment", finalResult.originalGarment],
    ["New Product", finalResult.newProduct],
    ["Material Reused", `${finalResult.materialReused}%`],
    ["Waste Reduced", finalResult.wasteReduced],
  ];

  const handleCopyListing = () => {
    const copyText = `TITLE: ${listing.title}\nPRICE: ${listing.price}\nCATEGORY: ${listing.category}\n\nDESCRIPTION:\n${listing.description}\n\nTAGS:\n${listing.tags}`;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      {/* Transformation Success Summary Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm md:p-8">
        <p className="text-3xl">🎉</p>
        <h1 className="mt-2 text-xl font-bold text-gray-900">
          Your Old Garment Has a New Life!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is your completed transformation summary and environmental impact.
        </p>

        <dl className="mx-auto mt-6 max-w-md divide-y divide-gray-100 rounded-md border border-gray-200 text-left bg-gray-50/50">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* FEATURE 2 — ENVIRONMENTAL IMPACT CALCULATOR CARD 🌍 */}
      <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-100 text-green-800">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Environmental Impact & Circularity 🌍
              </h2>
              <p className="text-xs text-gray-500">
                Verifiable waste reduction and product life extension metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            <RefreshCw size={13} />
            <span>Circularity Score: {envData.circularityScore} / 100</span>
          </div>
        </div>

        {/* 4 Impact Stat Cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
          <div className="rounded-lg border border-green-100 bg-green-50/40 p-3">
            <span className="text-[10px] font-semibold uppercase text-gray-500 block">Waste Diverted</span>
            <span className="text-lg font-extrabold text-green-800 mt-0.5 block">{envData.wasteDiverted}</span>
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50/40 p-3">
            <span className="text-[10px] font-semibold uppercase text-gray-500 block">Material Reused</span>
            <span className="text-lg font-extrabold text-green-800 mt-0.5 block">{envData.materialReusedPercent}%</span>
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50/40 p-3">
            <span className="text-[10px] font-semibold uppercase text-gray-500 block">Fabric Utilization</span>
            <span className="text-lg font-extrabold text-green-800 mt-0.5 block">{envData.materialUtilizationPercent}%</span>
          </div>

          <div className="rounded-lg border border-green-100 bg-green-50/40 p-3">
            <span className="text-[10px] font-semibold uppercase text-gray-500 block">Life Extension</span>
            <span className="text-lg font-extrabold text-green-800 mt-0.5 block">{envData.lifeExtensionYears}</span>
          </div>
        </div>

        {/* Circularity Progress Bar */}
        <div className="mt-5 rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
            <span>Overall Circularity Rating</span>
            <span className="text-green-700">{envData.circularityScore}% Circular</span>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-green-700 transition-all duration-500"
              style={{ width: `${envData.circularityScore}%` }}
            />
          </div>
        </div>

        {/* Waste Reduction Summary Text */}
        <div className="mt-4 rounded-md border border-green-200 bg-green-50/60 p-4 text-xs text-green-900 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-green-900 mb-1">
            <Leaf size={15} className="text-green-700 shrink-0" />
            <span>Sustainability Summary</span>
          </div>
          <p>{envData.impactSummary}</p>
        </div>
      </div>

      {/* Resale Potential Section */}
      <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-100 text-green-800">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Resale Potential & Valuation
              </h2>
              <p className="text-xs text-gray-500">
                Conservative market valuation for handmade & upcycled creations
              </p>
            </div>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            {categoryLabel}
          </span>
        </div>

        {/* Pricing Estimate Card */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 rounded-lg border border-green-100 bg-green-50/40 p-5">
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 block">
                Estimated Resale Value
              </span>
              <span className="text-xl font-bold text-gray-900">
                ₹{rangeMin} – ₹{rangeMax}
              </span>
            </div>

            <div className="border-t border-green-200/60 pt-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 block">
                Suggested Listing Price
              </span>
              <span className="text-3xl font-extrabold text-green-800">
                ₹{suggestedPrice}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-green-200/60 pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5 space-y-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-1">
                <Award size={14} className="text-green-700 shrink-0" />
                <span>Finish Assumption: <strong className="text-gray-900">{qualityFinish}</strong></span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {explanation}
              </p>
            </div>

            <div className="rounded bg-white/70 p-2 border border-green-200/50">
              <p className="text-[11px] text-gray-500 leading-snug">
                <strong>Disclaimer:</strong> Estimated resale price — actual selling price depends on product quality, demand, location, and marketplace.
              </p>
            </div>
          </div>
        </div>

        {/* Ready to Sell Listing Generator */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-700 shrink-0" />
              <h3 className="text-sm font-semibold text-gray-900">
                Ready-to-Sell Product Listing
              </h3>
            </div>
            <button
              onClick={handleCopyListing}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                copied
                  ? "bg-green-700 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied Listing!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy Listing
                </>
              )}
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-3 text-xs">
            <div>
              <span className="font-semibold text-gray-500 uppercase text-[10px] block">Title</span>
              <p className="font-semibold text-gray-900 text-sm mt-0.5">{listing.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200/60 pt-2">
              <div>
                <span className="font-semibold text-gray-500 uppercase text-[10px] block">Suggested Price</span>
                <p className="font-bold text-green-700 text-sm">{listing.price}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-500 uppercase text-[10px] block">Category</span>
                <p className="font-medium text-gray-800">{listing.category}</p>
              </div>
            </div>

            <div className="border-t border-gray-200/60 pt-2">
              <span className="font-semibold text-gray-500 uppercase text-[10px] block">Description</span>
              <p className="text-gray-700 leading-relaxed mt-1">{listing.description}</p>
            </div>

            <div className="border-t border-gray-200/60 pt-2">
              <span className="font-semibold text-gray-500 uppercase text-[10px] block">Search Tags & Keywords</span>
              <p className="font-medium text-green-800 mt-1">{listing.tags}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Where Can You Sell This? — Listing Platforms Section */}
      <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-100 text-green-800">
            <Store size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Where Can You Sell This?
            </h2>
            <p className="text-xs text-gray-500">
              Recommended online platforms to list and monetize your upcycled creations
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {LISTING_PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-green-500 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-green-800">
                        <Icon size={16} />
                      </div>
                      <h3 className="font-bold text-sm text-gray-900">
                        {platform.name}
                      </h3>
                    </div>
                    <span className={`inline-block rounded border px-2 py-0.5 text-[10px] font-semibold ${platform.badgeColor}`}>
                      {platform.categoryBadge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-1.5 rounded-md border border-green-700 bg-white px-3 py-2 text-xs font-medium text-green-800 transition-colors hover:bg-green-700 hover:text-white"
                >
                  <span>{platform.buttonText}</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Button */}
      <div className="text-center pt-2">
        <button
          onClick={onRestart}
          className="rounded-md bg-green-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-800 shadow-sm"
        >
          Start Another Transformation
        </button>
      </div>
    </div>
  );
}
