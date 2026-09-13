const API_BASE_URL = "https://ai-upcycling-designer.onrender.com";

/**
 * Call FastAPI backend to analyze garment and generate 3-4 upcycling ideas
 * @param {Object} garmentData - { garmentType, material, condition, size, imageUrl, userPreference }
 * @returns {Promise<Object|null>} - AnalyzeGarmentResponse object or null on error
 */
export async function analyzeGarmentAPI(garmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        garmentType: garmentData.garmentType || "Denim Jeans",
        material: garmentData.material || "Denim",
        condition: garmentData.condition || "Good",
        size: garmentData.size || "Large",
        imageUrl: garmentData.imageUrl || null,
        userPreference: garmentData.userPreference || "Bags & Accessories",
      }),
    });

    if (!response.ok) {
      console.error(`Backend returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Failed to reach FastAPI backend at http://localhost:8000. Ensure backend is running.", error);
    return null;
  }
}

/**
 * Call FastAPI backend to process user's selected upcycling idea
 * @param {Object} garmentData - Garment input object
 * @param {Object} analysisData - Garment material analysis object
 * @param {Object} selectedIdea - Selected upcycling idea object
 * @returns {Promise<Object|null>} - SelectIdeaResponse object or null on error
 */
export async function selectIdeaAPI(garmentData, analysisData, selectedIdea) {
  try {
    const response = await fetch(`${API_BASE_URL}/select-idea`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        garment: garmentData,
        analysisData: analysisData,
        selectedIdea: selectedIdea,
      }),
    });

    if (!response.ok) {
      console.error(`Backend returned status ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Failed to reach FastAPI backend at http://localhost:8000. Ensure backend is running.", error);
    return null;
  }
}
