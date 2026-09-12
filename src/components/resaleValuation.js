/**
 * Conservative, realistic resale valuation algorithm for upcycled garments in India (INR ₹).
 */
export function calculateResaleEstimate(apiData) {
  const finalResult = apiData?.finalResult;
  const transformationPlan = apiData?.transformationPlan;
  const selectedIdea = apiData?.selectedIdea;
  const garment = apiData?.garment;
  const analysisData = apiData?.analysisData;

  const toProduct = finalResult?.newProduct || transformationPlan?.toProduct || selectedIdea?.title || "Upcycled Product";
  const material = garment?.material || analysisData?.material || "Fabric";
  const condition = garment?.condition || analysisData?.conditionScore || "Good";
  const difficulty = transformationPlan?.difficulty || selectedIdea?.difficulty || "Easy";
  const estTime = transformationPlan?.estimatedTime || selectedIdea?.estimatedTime || "1.5 Hours";
  const additional = apiData?.feasibilityData?.additionalMaterials || selectedIdea?.additionalMaterials || [];
  const reusableParts = transformationPlan?.reusableParts || selectedIdea?.reusableParts || [];
  const category = selectedIdea?.category || "Bags & Accessories";

  const productLower = toProduct.toLowerCase();
  const catLower = category.toLowerCase();

  // 1. Conservative base price, floor, and cap by category (INR ₹)
  let basePrice = 349;
  let minFloor = 199;
  let maxCap = 599;
  let categoryLabel = "Tote Bags & Utility Containers";

  if (productLower.includes("scrunchie") || productLower.includes("keychain") || productLower.includes("ribbon") || productLower.includes("bow") || productLower.includes("wristband") || (catLower.includes("accessory") && !productLower.includes("bag"))) {
    basePrice = 179;
    minFloor = 99;
    maxCap = 299;
    categoryLabel = "Small Accessories";
  } else if (productLower.includes("pouch") || productLower.includes("organizer") || productLower.includes("bin") || productLower.includes("clutch") || productLower.includes("wallet")) {
    basePrice = 249;
    minFloor = 149;
    maxCap = 399;
    categoryLabel = "Pouches & Desk Organizers";
  } else if (productLower.includes("tote") || productLower.includes("market") || productLower.includes("shopping bag") || productLower.includes("produce bag")) {
    basePrice = 349;
    minFloor = 199;
    maxCap = 599;
    categoryLabel = "Tote & Shopping Bags";
  } else if (productLower.includes("cushion") || productLower.includes("pillow") || productLower.includes("hanger") || productLower.includes("placemat") || catLower.includes("home")) {
    basePrice = 349;
    minFloor = 199;
    maxCap = 799;
    categoryLabel = "Home Decor Items";
  } else if (productLower.includes("apron") || productLower.includes("scarf") || productLower.includes("skirt") || productLower.includes("top") || catLower.includes("clothing")) {
    basePrice = 449;
    minFloor = 299;
    maxCap = 999;
    categoryLabel = "Clothing Transformations";
  } else if (productLower.includes("duffel") || productLower.includes("sleeve") || productLower.includes("laptop") || productLower.includes("jacket") || productLower.includes("coat") || productLower.includes("bike")) {
    basePrice = 699;
    minFloor = 499;
    maxCap = 1499;
    categoryLabel = "Complex / Tech Products";
  }

  // 2. Small material adjustment (no heavy inflation)
  const matLower = material.toLowerCase();
  let matAdjustment = 0;
  if (matLower.includes("leather") || matLower.includes("wool") || matLower.includes("silk")) {
    matAdjustment = 50;
  } else if (matLower.includes("denim") || matLower.includes("canvas")) {
    matAdjustment = 30;
  } else if (matLower.includes("cotton") || matLower.includes("linen")) {
    matAdjustment = 20;
  }

  // 3. Small condition adjustment
  const condLower = condition.toLowerCase();
  let condAdjustment = 0;
  if (condLower.includes("excellent")) condAdjustment = 30;
  else if (condLower.includes("good")) condAdjustment = 15;

  // 4. Small difficulty & labor adjustment (capped)
  let diffAdjustment = 10;
  const diffLower = difficulty.toLowerCase();
  if (diffLower.includes("hard")) diffAdjustment = 40;
  else if (diffLower.includes("medium")) diffAdjustment = 25;

  // 5. Additional hardware cost
  let hardwareAdjustment = 0;
  if (additional.some((m) => /zipper|foam|buckle|ring|strap|snap/i.test(m))) {
    hardwareAdjustment = 30;
  }

  // 6. Quality Finish Assumption (Default: Good / Standard Handmade)
  const qualityMultiplier = 1.0;

  // Raw calculated value
  const rawCalculated = (basePrice + matAdjustment + condAdjustment + diffAdjustment + hardwareAdjustment) * qualityMultiplier;

  // Apply strict category caps & floors
  const suggestedPrice = Math.max(minFloor, Math.min(maxCap, Math.round(rawCalculated)));

  // Realistic price range
  const rangeMin = Math.max(minFloor, Math.round(suggestedPrice * 0.8));
  const rangeMax = Math.min(maxCap, Math.round(suggestedPrice * 1.22));

  const cleanTitle = `Handcrafted Upcycled ${material} ${toProduct}`;
  const originalGarmentName = finalResult?.originalGarment || garment?.garmentType || "Garment";
  const partsSummary = reusableParts.length > 0 ? reusableParts.slice(0, 3).join(", ") : "usable fabric panels";
  const wasteStr = finalResult?.wasteReduced || selectedIdea?.wasteReduced || "0.5 kg";

  const description = `One-of-a-kind sustainable ${toProduct} upcycled from a vintage ${originalGarmentName} (${material}). Features repurposed ${partsSummary}. Handcrafted with care, saving approx. ${wasteStr} of textile waste.`;

  const tagMaterial = material.replace(/[^a-zA-Z]/g, "");
  const tagProduct = toProduct.replace(/[^a-zA-Z]/g, "");
  const tags = `#UpcycledFashion #${tagProduct} #SustainableDesign #Handmade #${tagMaterial}Upcycled #ZeroWaste`;

  const explanation = `Estimate calculated using ${categoryLabel} base valuation (₹${basePrice}), ${material} fabric condition (+₹${matAdjustment + condAdjustment}), and crafting complexity (+₹${diffAdjustment + hardwareAdjustment}).`;

  return {
    suggestedPrice,
    rangeMin,
    rangeMax,
    categoryLabel,
    qualityFinish: "Good (Handmade Standard)",
    explanation,
    listing: {
      title: cleanTitle,
      description,
      category,
      price: `₹${suggestedPrice}`,
      tags
    }
  };
}
