import { useState } from "react";
import { Sparkles, Sparkle } from "lucide-react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import UploadPage from "./components/UploadPage";
import AnalysisPage from "./components/AnalysisPage";
import TransformationPage from "./components/TransformationPage";
import FeasibilityPage from "./components/FeasibilityPage";
import GuidePage from "./components/GuidePage";
import FinalPage from "./components/FinalPage";
import threadBg from "./assets/thread-bg.png";

const SCREENS = {
  HOME: 1,
  UPLOAD: 2,
  ANALYSIS: 3,
  IDEAS: 4,
  FEASIBILITY: 5,
  GUIDE: 6,
  FINAL: 7,
};

const emptyGarment = {
  imageUrl: null,
  garmentType: "",
  material: "",
  condition: "",
  size: "",
  userPreference: "Bags & Accessories",
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.HOME);
  const [garment, setGarment] = useState(emptyGarment);
  const [analyzeResult, setAnalyzeResult] = useState(null);
  const [selectedIdeaResult, setSelectedIdeaResult] = useState(null);

  const resetAll = () => {
    setGarment(emptyGarment);
    setAnalyzeResult(null);
    setSelectedIdeaResult(null);
    setScreen(SCREENS.UPLOAD);
  };

  const goHome = () => {
    setScreen(SCREENS.HOME);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7f8f6]">
      {/* GLOBAL ANIMATED THREAD & SUSTAINABLE FASHION BACKGROUND LAYER (APPLIES TO ALL PAGES) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Soft Emerald Gradient Blobs */}
        <div className="absolute -top-32 -left-32 h-[650px] w-[650px] animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute top-[35%] -right-32 h-[600px] w-[600px] animate-[pulse_15s_ease-in-out_infinite_reverse] rounded-full bg-green-200/35 blur-3xl" />
        <div className="absolute -bottom-20 left-[20%] h-[550px] w-[550px] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-emerald-100/45 blur-3xl" />

        {/* Clean Transparent Thread & Leaf Image Layer (Full Screen Floating Motion across ALL pages) */}
        <div className="pointer-events-none absolute inset-0 opacity-40 animate-[bounce_16s_ease-in-out_infinite]">
          <img
            src={threadBg}
            alt="Floating Threads Background"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Circular Upcycling Shapes (Slow Smooth Rotation) */}
        <div className="absolute -top-12 -right-16 flex h-[550px] w-[550px] items-center justify-center opacity-30">
          <div className="h-full w-full animate-[spin_45s_linear_infinite] rounded-full border border-dashed border-emerald-600/40" />
          <div className="absolute h-[400px] w-[400px] animate-[spin_65s_linear_infinite_reverse] rounded-full border border-green-700/30" />
        </div>

        <div className="absolute top-[60%] -left-20 h-[420px] w-[420px] opacity-25">
          <div className="h-full w-full animate-[spin_50s_linear_infinite] rounded-full border border-dashed border-emerald-500/40" />
        </div>

        {/* Soft Floating Sparkles & Stitch Patterns */}
        <div className="absolute top-28 left-[10%] animate-[bounce_9s_ease-in-out_infinite] text-emerald-700/30">
          <Sparkles size={22} />
        </div>
        <div className="absolute top-[42%] right-[8%] animate-[bounce_11s_ease-in-out_infinite_reverse] text-green-700/25">
          <Sparkle size={18} />
        </div>
        <div className="absolute top-[22%] right-[14%] font-mono text-[10px] font-bold tracking-widest text-emerald-900/25">
          + + + +
        </div>
      </div>

      {/* FOREGROUND APPLICATION LAYOUT (ACTIVE PAGE SCREEN) */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header step={screen} onHome={goHome} />

        {screen === SCREENS.HOME && (
          <HomePage onStart={() => setScreen(SCREENS.UPLOAD)} />
        )}

        {screen === SCREENS.UPLOAD && (
          <UploadPage
            garment={garment}
            setGarment={setGarment}
            onApiSuccess={(data) => setAnalyzeResult(data)}
            onAnalyze={() => setScreen(SCREENS.ANALYSIS)}
          />
        )}

        {screen === SCREENS.ANALYSIS && (
          <AnalysisPage
            garment={garment}
            apiData={analyzeResult}
            onNext={() => setScreen(SCREENS.IDEAS)}
          />
        )}

        {screen === SCREENS.IDEAS && (
          <TransformationPage
            garment={garment}
            analysisData={analyzeResult?.analysisData}
            ideas={analyzeResult?.ideas}
            onIdeaSelected={(data) => {
              setSelectedIdeaResult(data);
              setScreen(SCREENS.FEASIBILITY);
            }}
          />
        )}

        {screen === SCREENS.FEASIBILITY && (
          <FeasibilityPage
            apiData={selectedIdeaResult}
            onNext={() => setScreen(SCREENS.GUIDE)}
          />
        )}

        {screen === SCREENS.GUIDE && (
          <GuidePage
            apiData={selectedIdeaResult}
            onComplete={() => setScreen(SCREENS.FINAL)}
          />
        )}

        {screen === SCREENS.FINAL && (
          <FinalPage
            apiData={selectedIdeaResult}
            onRestart={resetAll}
          />
        )}
      </div>
    </div>
  );
}
