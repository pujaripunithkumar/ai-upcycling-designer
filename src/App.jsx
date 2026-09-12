import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import UploadPage from "./components/UploadPage";
import AnalysisPage from "./components/AnalysisPage";
import TransformationPage from "./components/TransformationPage";
import FeasibilityPage from "./components/FeasibilityPage";
import GuidePage from "./components/GuidePage";
import FinalPage from "./components/FinalPage";

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

  return (
    <div className="min-h-screen bg-[#f7f8f6]">
      <Header step={screen} />

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
  );
}
