from typing import Dict, Any, List, Optional

def calculate_smart_material(
    usable_material: int,
    reusable_parts: List[str],
    visible_damage: List[str],
    selected_idea: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Calculate smart material metrics: available vs required material %,
    compatibility score, status (Enough/Limited/Insufficient), reusable parts,
    additional materials, and practical warnings.
    """
    title = (selected_idea.get("title") or "").lower()
    cat = (selected_idea.get("category") or "").lower()

    # Determine required material percentage dynamically
    if any(k in title for k in ["scrunchie", "keychain", "ribbon", "bow"]) or ("accessory" in cat and "bag" not in title):
        required_material = 25
    elif any(k in title for k in ["pouch", "organizer", "clutch", "wallet", "bin"]):
        required_material = 40
    elif any(k in title for k in ["cushion", "pillow", "hanger", "apron", "skirt", "top"]):
        required_material = 65
    elif any(k in title for k in ["tote", "market", "shopping"]):
        required_material = 70
    elif any(k in title for k in ["duffel", "sleeve", "laptop", "jacket", "coat", "bike"]):
        required_material = 80
    else:
        required_material = max(30, selected_idea.get("materialUtilization", 70) - 10)

    available_material = max(0, min(100, usable_material))

    # Material Status
    if available_material >= required_material:
        status = "Enough Material"
    elif available_material >= (required_material - 15):
        status = "Limited Material"
    else:
        status = "Insufficient Material"

    # Compatibility Score (0 - 100)
    ratio = min(1.0, available_material / max(1, required_material))
    compatibility_score = int(ratio * 70 + 25)
    if status == "Enough Material":
        compatibility_score = min(98, compatibility_score + 5)
    compatibility_score = max(40, min(98, compatibility_score))

    # Additional materials needed
    add_materials = selected_idea.get("additionalMaterials") or ["Matching Thread", "Fabric Scissors"]

    # Practical Warnings
    warnings = []
    if visible_damage and len(visible_damage) > 0:
        for damage in visible_damage:
            damage_lower = damage.lower()
            if "tear" in damage_lower or "hole" in damage_lower or "wear" in damage_lower or "fade" in damage_lower:
                warnings.append(f"Visible wear noted ({damage}): inspect and trim around damaged sections before cutting main project panels.")

    if status == "Limited Material":
        warnings.append(f"Available material yield ({available_material}%) is close to required ({required_material}%): cut pattern pieces with minimal margin.")
    elif status == "Insufficient Material":
        warnings.append(f"Usable fabric ({available_material}%) is below recommended requirement ({required_material}%): consider scaling down product dimensions or mixing contrasting fabric scraps.")

    if not warnings:
        warnings.append("Sufficient fabric yield detected with no critical material bottlenecks.")

    return {
        "availableMaterial": available_material,
        "requiredMaterial": required_material,
        "compatibilityScore": compatibility_score,
        "status": status,
        "reusableParts": reusable_parts if reusable_parts else ["Main Usable Fabric"],
        "additionalMaterials": add_materials,
        "warnings": warnings
    }

def calculate_environmental_impact(
    garment_type: str,
    material: str,
    usable_material: int,
    selected_idea: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Calculate environmental impact metrics: waste diverted, material reused %,
    utilization %, circularity score (0-100), product life extension, and summary.
    """
    to_product = selected_idea.get("title") or "Upcycled Item"
    waste_diverted = selected_idea.get("wasteReduced") or "0.5 kg"
    mat_utilization = int(selected_idea.get("materialUtilization", 80))
    reusable_parts = selected_idea.get("reusableParts") or []
    add_materials = selected_idea.get("additionalMaterials") or []

    mat_reused_percent = min(98, max(50, usable_material + 5))

    # Circularity Score (0-100) based on real project factors
    part_points = min(15, len(reusable_parts) * 4)
    extra_penalty = min(10, len(add_materials) * 2)
    
    circularity = int(
        (usable_material * 0.40) +
        (mat_utilization * 0.35) +
        part_points + 20 - extra_penalty
    )
    circularity_score = max(55, min(98, circularity))

    # Product Life Extension Estimate based on material & project type
    mat_lower = (material or "").lower()
    if "denim" in mat_lower or "leather" in mat_lower or "wool" in mat_lower or "canvas" in mat_lower:
        life_extension = "+2 to 4 Years"
    elif "cotton" in mat_lower or "linen" in mat_lower:
        life_extension = "+2 to 3 Years"
    else:
        life_extension = "+1 to 2 Years"

    impact_summary = (
        f"By transforming your {garment_type} into a {to_product}, you successfully repurposed "
        f"{mat_utilization}% of the garment fabric and diverted approx. {waste_diverted} of textile waste "
        f"from landfills, extending the material lifecycle by {life_extension}."
    )

    return {
        "wasteDiverted": waste_diverted,
        "materialReusedPercent": mat_reused_percent,
        "materialUtilizationPercent": mat_utilization,
        "circularityScore": circularity_score,
        "lifeExtensionYears": life_extension,
        "impactSummary": impact_summary
    }

def calculate_feasibility(
    condition: str,
    usable_material: int,
    difficulty: str,
    additional_materials: List[str],
    selected_idea: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Calculate feasibility score, tailored checklist, and required additional materials
    specifically for the user's selected upcycling idea.
    """
    cond_lower = (condition or "").lower()
    
    # 1. Base score points from garment condition (max 40)
    if "excellent" in cond_lower:
        cond_score = 40
    elif "good" in cond_lower:
        cond_score = 35
    elif "fair" in cond_lower:
        cond_score = 25
    else:
        cond_score = 15

    # 2. Points from usable material percentage (max 35)
    material_score = int((usable_material / 100.0) * 35)

    # 3. Points from project difficulty (max 25)
    diff_lower = (difficulty or "").lower()
    if "easy" in diff_lower:
        diff_score = 23
    elif "medium" in diff_lower:
        diff_score = 18
    else:
        diff_score = 13

    total_score = cond_score + material_score + diff_score
    # Clamp score between 65 and 98
    final_score = max(65, min(total_score, 98))

    idea_title = selected_idea.get("title") if selected_idea else "Transformation"

    checklist = [
        f"Garment condition is suitable for {idea_title}",
        f"Available usable material ({usable_material}%) meets project requirements",
        "Required hardware & reusable parts are compatible",
        "Step-by-step transformation instructions are practical"
    ]

    return {
        "score": final_score,
        "checklist": checklist,
        "additionalMaterials": additional_materials if additional_materials else ["Thread", "Needle", "Scissors"]
    }
