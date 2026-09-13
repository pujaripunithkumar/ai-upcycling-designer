import {
  Upload,
  Sparkles,
  Lightbulb,
  CheckSquare,
  Scissors,
  ArrowRight,
  ArrowDown,
  Bot,
  Coins,
  Recycle,
  Shirt,
  ShoppingBag,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Garment",
    desc: "Upload an old clothing item.",
    isAiStep: false,
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Analyzes It",
    desc: "AI detects material, condition, damage, and reusable parts.",
    isAiStep: true,
  },
  {
    step: "03",
    icon: Lightbulb,
    title: "Get Personalized Ideas",
    desc: "Receive multiple creative upcycling ideas.",
    isAiStep: false,
  },
  {
    step: "04",
    icon: CheckSquare,
    title: "Choose Your Idea",
    desc: "Select the product you want to create.",
    isAiStep: false,
  },
  {
    step: "05",
    icon: Scissors,
    title: "Create & Reuse",
    desc: "Follow the guide and give the garment a new life.",
    isAiStep: false,
  },
];

const features = [
  {
    icon: Bot,
    title: "AI-Powered Analysis",
    description:
      "Analyze your garment's condition, material, damage, and reusable parts using AI.",
  },
  {
    icon: Lightbulb,
    title: "Smart Product Ideas",
    description:
      "Get multiple personalized ideas based on your garment and what you want to create.",
  },
  {
    icon: TrendingUp,
    title: "Create, Impact & Resell",
    description:
      "Discover waste reduction, environmental impact, estimated resale value, and selling opportunities.",
  },
];

export default function HomePage({ onStart }) {
  return (
    <div className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-8 md:py-12">
      {/* HERO SECTION */}
      <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Column: Text & CTA */}
          <div className="space-y-6 text-left lg:col-span-7">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200/80 bg-green-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-green-800 shadow-2xs">
              <Recycle className="h-3.5 w-3.5 text-green-600" />
              <span>♻ AI-POWERED UPCYCLING</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold leading-[1.18] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Turn Old Clothes Into{" "}
              <span className="text-green-700">Something New</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Upload your old garment and let RELOOP AI analyze its condition,
              discover reusable materials, and generate creative upcycling
              ideas.
            </p>

            {/* CTA Button */}
            <div className="pt-1">
              <button
                onClick={onStart}
                className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-green-700 px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-800 hover:shadow-xl active:scale-[0.99]"
              >
                <span>✨ Start Upcycling</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* 3 Trust / Benefit Indicators */}
            <div className="grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 text-xs text-gray-600 sm:grid-cols-3">
              <div className="flex items-center gap-2 font-medium">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Bot size={13} />
                </span>
                <span>🤖 AI-Powered Analysis</span>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Recycle size={13} />
                </span>
                <span>♻ Reduce Textile Waste</span>
              </div>

              <div className="flex items-center gap-2 font-medium">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Lightbulb size={13} />
                </span>
                <span>💡 Personalized Ideas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Experience (Pure CSS/Cards/Icons) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              {/* Outer Visual Container Card */}
              <div className="relative rounded-2xl border border-green-100 bg-gradient-to-br from-green-50/70 via-emerald-50/30 to-white p-5 shadow-xl shadow-green-900/5 sm:p-6">
                {/* Visual Pipeline Header */}
                <div className="relative mb-4 flex items-center justify-between border-b border-green-100/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-wider text-green-900 uppercase">
                      UPCYCLING PIPELINE
                    </span>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-semibold text-green-800">
                    Live AI Scan
                  </span>
                </div>

                {/* Layered Floating Transformation Cards */}
                <div className="relative space-y-3">
                  {/* 1. OLD GARMENT CARD */}
                  <div className="relative flex items-center gap-3.5 rounded-xl border border-gray-200/90 bg-white p-3.5 shadow-xs transition-all duration-200 hover:border-gray-300 hover:shadow-md">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-amber-200/60 bg-amber-50 text-amber-700">
                      <Shirt size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                          Input
                        </span>
                        <span className="inline-flex items-center rounded-md bg-amber-100/80 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                          Worn Denim • 100% Cotton
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        Old Garment
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span>Condition: Used / Worn Out</span>
                      </div>
                    </div>
                  </div>

                  {/* Connector 1 */}
                  <div className="relative z-10 -my-1 flex justify-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-200 bg-green-100 text-green-700 shadow-2xs">
                      <ArrowDown size={12} />
                    </div>
                  </div>

                  {/* 2. AI ANALYSIS CARD */}
                  <div className="relative flex items-center gap-3.5 rounded-xl border border-green-300 bg-gradient-to-r from-green-50 via-white to-green-50/50 p-3.5 shadow-md">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-green-700 text-white shadow-xs">
                      <Sparkles size={20} className="animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-green-700 uppercase">
                          Processing
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-green-700 px-2 py-0.5 text-[10px] font-medium text-white shadow-2xs">
                          <Cpu size={10} />
                          Scanning Fabric 98%
                        </span>
                      </div>
                      <p className="text-sm font-bold text-green-950">
                        AI Analysis
                      </p>
                      {/* Scanning progress bar */}
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-green-200/80">
                        <div className="h-full w-[98%] rounded-full bg-green-700 transition-all duration-500" />
                      </div>
                    </div>
                  </div>

                  {/* Connector 2 */}
                  <div className="relative z-10 -my-1 flex justify-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-200 bg-green-100 text-green-700 shadow-2xs">
                      <ArrowDown size={12} />
                    </div>
                  </div>

                  {/* 3. UPCYCLED PRODUCT CARD */}
                  <div className="relative flex items-center gap-3.5 rounded-xl border border-emerald-600/30 bg-emerald-900 p-3.5 text-white shadow-lg">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-700 bg-emerald-800 text-emerald-200 shadow-xs">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase">
                          Output
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-700 bg-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                          <CheckCircle2 size={10} className="text-emerald-400" />
                          High Feasibility
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">
                        New Product
                      </p>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>Upcycled Tote Bag & Pouch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 shadow-sm">
        {/* Section Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
            <Sparkles className="h-3.5 w-3.5 text-green-600" />
            <span>TRANSFORMATION JOURNEY</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            How RELOOP Works
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-gray-600 sm:text-base">
            From an old garment to a useful new product in just a few simple steps.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative">
          {/* Connecting Background Line (Desktop horizontal line) */}
          <div className="absolute top-[28px] right-[6%] left-[6%] z-0 hidden h-0.5 bg-gradient-to-r from-gray-200 via-green-400 to-emerald-600 lg:block" />

          {/* Connecting Vertical Line for Mobile/Tablet */}
          <div className="absolute top-6 bottom-6 left-[27px] z-0 w-0.5 bg-gradient-to-b from-gray-200 via-green-400 to-emerald-600 lg:hidden" />

          <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-4">
            {steps.map(({ step, icon: Icon, title, desc, isAiStep }) => (
              <div
                key={title}
                className="group relative flex flex-row items-start gap-4 lg:flex-col lg:gap-3"
              >
                {/* Node Icon Circle */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 ${
                      isAiStep
                        ? "bg-gradient-to-br from-green-600 to-emerald-800 text-white shadow-lg shadow-green-900/20 ring-4 ring-green-100 scale-105"
                        : "bg-white text-green-700 border-2 border-green-200 group-hover:border-green-600 group-hover:bg-green-50 shadow-xs"
                    }`}
                  >
                    <Icon size={22} className={isAiStep ? "animate-pulse" : ""} />
                  </div>

                  {/* Step Number Tag */}
                  <span
                    className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold shadow-2xs ${
                      isAiStep
                        ? "bg-emerald-400 text-emerald-950 font-extrabold"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {/* Step Card Content */}
                <div
                  className={`flex-1 rounded-2xl p-4 text-left transition-all duration-200 border ${
                    isAiStep
                      ? "bg-gradient-to-br from-green-50 via-emerald-50/60 to-white border-green-300 shadow-md shadow-green-900/5 ring-1 ring-green-400/30"
                      : "bg-[#fafbfa] border-gray-100 group-hover:border-green-200 group-hover:bg-white group-hover:shadow-sm"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3
                      className={`text-sm font-bold ${
                        isAiStep
                          ? "text-green-950"
                          : "text-gray-900 group-hover:text-green-800"
                      }`}
                    >
                      {title}
                    </h3>
                    {isAiStep && (
                      <span className="rounded-md bg-green-700 px-1.5 py-0.5 text-[9px] font-bold text-white tracking-wider uppercase">
                        AI Core
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES SECTION */}
      <section className="space-y-6">
        {/* Section Header */}
        <div className="text-center md:text-left">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-green-200/60 bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
            <Zap className="h-3.5 w-3.5 text-green-600" />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Why Choose RELOOP?
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-gray-600 sm:text-base">
            Everything you need to transform unused clothes into useful and sustainable products.
          </p>
        </div>

        {/* 3 Distinct Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* CARD 1: AI Garment Analysis */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/90 bg-gradient-to-b from-white via-[#fafdfa] to-green-50/30 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-green-300 hover:shadow-xl">
            {/* Decorative BG Accent */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-green-100/40 blur-2xl pointer-events-none group-hover:bg-green-200/50 transition-colors" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-green-200/80 bg-green-50 text-green-700 shadow-xs group-hover:bg-green-700 group-hover:text-white transition-colors">
                  <Bot size={24} />
                </div>
                <span className="rounded-md bg-green-100/80 px-2 py-0.5 text-[10px] font-bold text-green-800">
                  Vision AI
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-green-800 transition-colors">
                AI-Powered Analysis
              </h3>

              <p className="text-xs leading-relaxed text-gray-600">
                Analyze your garment's condition, material, damage, and reusable parts using AI.
              </p>
            </div>

            {/* Mini Visual Indicators */}
            <div className="relative z-10 mt-6 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-[11px] text-gray-600 bg-white/80 rounded-lg p-2 border border-gray-100">
                <span className="font-medium">Fabric Detection</span>
                <span className="font-bold text-green-700">Cotton / Denim</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-600 bg-white/80 rounded-lg p-2 border border-gray-100">
                <span className="font-medium">Reusable Materials</span>
                <span className="font-bold text-green-700">94% Potential</span>
              </div>
            </div>
          </div>

          {/* CARD 2: Smart Product Ideas (Prominent Card) */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-green-300 bg-gradient-to-br from-green-50/90 via-emerald-50/40 to-white p-6 text-left shadow-md ring-1 ring-green-400/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-green-400 hover:shadow-2xl">
            {/* Decorative Highlight Glow */}
            <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-700 text-white shadow-md">
                  <Lightbulb size={24} className="animate-pulse" />
                </div>
                <span className="rounded-md bg-green-700 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Smart Engine
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-green-950">
                Smart Product Ideas
              </h3>

              <p className="text-xs leading-relaxed text-gray-700">
                Get multiple personalized ideas based on your garment and what you want to create.
              </p>
            </div>

            {/* Floating Mini Idea Tags */}
            <div className="relative z-10 mt-6 border-t border-green-200/60 pt-4">
              <p className="mb-2 text-[10px] font-bold text-green-800 uppercase tracking-wider">
                Suggested Upcycles:
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-lg bg-white/90 border border-green-200 px-2.5 py-1 text-[11px] font-semibold text-green-900 shadow-2xs">
                  🎒 Tote Bag
                </span>
                <span className="rounded-lg bg-white/90 border border-green-200 px-2.5 py-1 text-[11px] font-semibold text-green-900 shadow-2xs">
                  🧢 Bucket Hat
                </span>
                <span className="rounded-lg bg-white/90 border border-green-200 px-2.5 py-1 text-[11px] font-semibold text-green-900 shadow-2xs">
                  💻 Laptop Sleeve
                </span>
              </div>
            </div>
          </div>

          {/* CARD 3: Create, Impact & Resell */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/90 bg-gradient-to-b from-white via-[#fafcfb] to-emerald-50/30 p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl">
            {/* Decorative BG Accent */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none group-hover:bg-emerald-200/50 transition-colors" />

            <div className="relative z-10">
              <div className="mb-5 flex items-center justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50 text-emerald-700 shadow-xs group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <TrendingUp size={24} />
                </div>
                <span className="rounded-md bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Valuation & Eco
                </span>
              </div>

              <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                Create, Impact & Resell
              </h3>

              <p className="text-xs leading-relaxed text-gray-600">
                Discover waste reduction, environmental impact, estimated resale value, and selling opportunities.
              </p>
            </div>

            {/* Mini Impact & Resale Indicators */}
            <div className="relative z-10 mt-6 space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-[11px] text-gray-600 bg-white/80 rounded-lg p-2 border border-gray-100">
                <span className="font-medium flex items-center gap-1">
                  <Recycle size={12} className="text-emerald-600" />
                  CO₂ Saved
                </span>
                <span className="font-bold text-emerald-700">~1.4 kg CO₂</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-600 bg-white/80 rounded-lg p-2 border border-gray-100">
                <span className="font-medium flex items-center gap-1">
                  <Coins size={12} className="text-emerald-600" />
                  Est. Resale Value
                </span>
                <span className="font-bold text-emerald-700">$25.00 – $45.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}