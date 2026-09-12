import os
import json
import logging
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("reloop.upcycling_engine")

def generate_ideas_with_ai(
    garment_type: str,
    material: str,
    condition: str,
    size: str,
    usable_material: int,
    reusable_parts: List[str],
    user_preference: Optional[str] = None
) -> Optional[List[Dict[str, Any]]]:
    """
    Generate 3-4 personalized upcycling idea summaries using Gemini AI.
    Returns structured list of ideas or None if API unavailable/fails.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or api_key == "your_gemini_api_key_here":
        logger.info("GEMINI_API_KEY not configured. Using rule-based fallback upcycling engine.")
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are an expert sustainable fashion designer and upcycling specialist for RELOOP.
Generate 3 to 4 distinct, highly personalized upcycling idea summaries for this garment.

Garment Details:
- Garment Type: {garment_type}
- Material: {material}
- Condition: {condition}
- Size: {size}
- Usable Material Percentage: {usable_material}%
- Reusable Parts: {", ".join(reusable_parts) if reusable_parts else "General fabric panels"}
- User Preference / Goal: {user_preference or "No specific preference"}

Respond ONLY with pure JSON containing an array of 3 or 4 idea objects under the key "ideas":
{{
  "ideas": [
    {{
      "id": "idea_1",
      "title": "Name of upcycled item (e.g. Denim Tote Bag)",
      "description": "2-sentence description of the transformation and aesthetic appeal",
      "difficulty": "Easy" | "Medium" | "Hard",
      "estimatedTime": "e.g. 1.5 Hours",
      "materialUtilization": integer percentage (0 to 100),
      "reusableParts": ["list", "of", "reusable", "parts", "used"],
      "additionalMaterials": ["list", "of", "extra", "supplies"],
      "wasteReduced": "e.g. 0.5 kg",
      "category": "e.g. Bags & Accessories | Home Decor | Clothing | Utility"
    }}
  ]
}}
"""

        model_names = ["gemini-3.6-flash", "gemini-1.5-flash"]
        response = None
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.4,
        )

        for m_name in model_names:
            try:
                response = client.models.generate_content(
                    model=m_name,
                    contents=prompt,
                    config=config
                )
                if response and response.text:
                    break
            except Exception as m_err:
                logger.info(f"Model {m_name} failed in upcycling engine: {m_err}. Trying next...")

        if not response or not response.text:
            return None

        result = json.loads(response.text)
        ideas_list = result.get("ideas") if isinstance(result, dict) else result
        if not isinstance(ideas_list, list) or len(ideas_list) < 2:
            return None

        formatted_ideas = []
        for idx, idea in enumerate(ideas_list[:4]):
            formatted_ideas.append({
                "id": str(idea.get("id") or f"idea_{idx + 1}"),
                "title": str(idea.get("title") or f"Upcycled Project {idx + 1}"),
                "description": str(idea.get("description") or "Creative upcycling transformation idea."),
                "difficulty": str(idea.get("difficulty") or "Easy").capitalize(),
                "estimatedTime": str(idea.get("estimatedTime") or "1.5 Hours"),
                "materialUtilization": max(10, min(100, int(idea.get("materialUtilization", usable_material)))),
                "reusableParts": [str(p) for p in idea.get("reusableParts", reusable_parts[:3])],
                "additionalMaterials": [str(m) for m in idea.get("additionalMaterials", ["Thread", "Scissors"])],
                "wasteReduced": str(idea.get("wasteReduced") or "0.5 kg"),
                "category": str(idea.get("category") or "Bags & Accessories")
            })

        return formatted_ideas

    except Exception as e:
        logger.warning(f"AI upcycling idea generation failed: {e}. Falling back to rule-based engine.")
        return None

def generate_ideas_rule_based(
    garment_type: str,
    material: str,
    condition: str,
    size: str,
    usable_material: int,
    reusable_parts: List[str],
    user_preference: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Rule-based engine returning 3-4 personalized upcycling idea summaries."""
    garment_lower = (garment_type or "").lower()
    mat_lower = (material or "").lower()
    pref_lower = (user_preference or "").lower()

    ideas = []

    # 1. Denim / Jeans
    if "jean" in garment_lower or "pant" in garment_lower or "denim" in mat_lower:
        ideas = [
            {
                "id": "idea_1",
                "title": "Classic Denim Tote Bag",
                "description": "A durable daily tote bag utilizing back pockets as convenient external storage slots.",
                "difficulty": "Easy",
                "estimatedTime": "2 Hours",
                "materialUtilization": min(usable_material + 5, 90),
                "reusableParts": [p for p in reusable_parts if p in ["Denim Fabric", "Back Pockets", "Waistband"]] or ["Denim Fabric", "Back Pockets"],
                "additionalMaterials": ["Matching Thread", "Fabric Scissors", "Optional Zipper"],
                "wasteReduced": "0.6 kg",
                "category": "Bags & Accessories"
            },
            {
                "id": "idea_2",
                "title": "Patchwork Denim Cushion Cover",
                "description": "A stylish textured throw pillow cover crafted by stitching contrasting denim panels together.",
                "difficulty": "Medium",
                "estimatedTime": "1.5 Hours",
                "materialUtilization": min(usable_material + 2, 85),
                "reusableParts": [p for p in reusable_parts if p in ["Denim Fabric", "Belt Loops", "Waistband"]] or ["Denim Fabric", "Waistband"],
                "additionalMaterials": ["Thread", "16x16 Pillow Insert", "Zipper / Buttons"],
                "wasteReduced": "0.5 kg",
                "category": "Home Decor"
            },
            {
                "id": "idea_3",
                "title": "Denim Hanging Wall Organizer",
                "description": "A rustic multi-pocket wall organizer crafted from jean pockets and waistbands for desk supplies.",
                "difficulty": "Easy",
                "estimatedTime": "1 Hour",
                "materialUtilization": min(usable_material, 78),
                "reusableParts": [p for p in reusable_parts if "Pocket" in p or "Waistband" in p] or ["Back Pockets", "Waistband"],
                "additionalMaterials": ["Wooden Dowel", "Hanging Cord", "Heavy Thread"],
                "wasteReduced": "0.4 kg",
                "category": "Utility & Home"
            },
            {
                "id": "idea_4",
                "title": "Denim Apron & Utility Pouch",
                "description": "A sturdy work apron with integrated tool pockets cut from the leg panels and waistband.",
                "difficulty": "Medium",
                "estimatedTime": "2.5 Hours",
                "materialUtilization": min(usable_material + 8, 92),
                "reusableParts": ["Denim Fabric", "Back Pockets", "Waistband", "Belt Loops"],
                "additionalMaterials": ["Cotton Straps", "Heavy Duty Thread"],
                "wasteReduced": "0.7 kg",
                "category": "Clothing & Apparel"
            }
        ]

    # 2. Shirts / Button-downs
    elif "shirt" in garment_lower or "button" in garment_lower:
        ideas = [
            {
                "id": "idea_1",
                "title": "Upcycled Kitchen Apron",
                "description": "A utility kitchen apron using the front panels, button placket, and collar fabric for waist straps.",
                "difficulty": "Easy",
                "estimatedTime": "1.5 Hours",
                "materialUtilization": min(usable_material + 3, 88),
                "reusableParts": ["Front & Back Panels", "Buttons & Placket", "Collar Section"],
                "additionalMaterials": ["Matching Thread", "Fabric Scissors", "Measuring Tape"],
                "wasteReduced": "0.4 kg",
                "category": "Utility & Home"
            },
            {
                "id": "idea_2",
                "title": "Button-Down Throw Pillow",
                "description": "A chic decorative cushion cover retaining the functional button placket for easy cushion removal.",
                "difficulty": "Easy",
                "estimatedTime": "1 Hour",
                "materialUtilization": min(usable_material, 80),
                "reusableParts": ["Front Panels", "Buttons & Placket"],
                "additionalMaterials": ["Thread", "Pillow Form"],
                "wasteReduced": "0.3 kg",
                "category": "Home Decor"
            },
            {
                "id": "idea_3",
                "title": "Structured Fabric Storage Bin",
                "description": "A collapsible desktop organizing cube created by reinforcing shirt panels with interfacing.",
                "difficulty": "Medium",
                "estimatedTime": "2 Hours",
                "materialUtilization": min(usable_material + 2, 85),
                "reusableParts": ["Back Panel", "Front Panels"],
                "additionalMaterials": ["Fusible Interfacing", "Heavy Thread"],
                "wasteReduced": "0.35 kg",
                "category": "Home Decor"
            },
            {
                "id": "idea_4",
                "title": "Matching Scrunchie & Drawstring Pouch Set",
                "description": "Zero-waste accessory set crafted from sleeve offcuts and collar trims.",
                "difficulty": "Easy",
                "estimatedTime": "45 Mins",
                "materialUtilization": min(usable_material + 10, 95),
                "reusableParts": ["Sleeve Cutouts", "Collar & Cuffs"],
                "additionalMaterials": ["Elastic Bands", "Drawstring Cord", "Thread"],
                "wasteReduced": "0.25 kg",
                "category": "Bags & Accessories"
            }
        ]

    # 3. T-Shirts / Sweaters
    elif "t-shirt" in garment_lower or "tee" in garment_lower or "sweater" in garment_lower or "top" in garment_lower:
        ideas = [
            {
                "id": "idea_1",
                "title": "No-Sew Market Produce Bag",
                "description": "An eco-friendly expandable market tote made with simple slit cuts and bottom seam stitching.",
                "difficulty": "Easy",
                "estimatedTime": "45 Mins",
                "materialUtilization": min(usable_material + 8, 95),
                "reusableParts": ["Main Body Fabric", "Sleeve Cutouts", "Hemline Ribbing"],
                "additionalMaterials": ["Cotton Thread", "Scissors"],
                "wasteReduced": "0.3 kg",
                "category": "Bags & Accessories"
            },
            {
                "id": "idea_2",
                "title": "T-Shirt Yarn Plant Hanger",
                "description": "Handcrafted macramé indoor hanging planter woven from continuous t-shirt fabric strips.",
                "difficulty": "Easy",
                "estimatedTime": "1 Hour",
                "materialUtilization": min(usable_material + 5, 90),
                "reusableParts": ["Main Body Fabric", "Sleeves"],
                "additionalMaterials": ["Wooden Ring", "Plant Pot"],
                "wasteReduced": "0.3 kg",
                "category": "Home Decor"
            },
            {
                "id": "idea_3",
                "title": "Cozy Upcycled Pet Bed Pillow",
                "description": "Soft pet cushion created by filling body panels with fabric scraps and polyfill.",
                "difficulty": "Easy",
                "estimatedTime": "1.5 Hours",
                "materialUtilization": min(usable_material, 85),
                "reusableParts": ["Main Body Fabric"],
                "additionalMaterials": ["Polyfill / Soft Stuffing", "Thread"],
                "wasteReduced": "0.4 kg",
                "category": "Pet Accessories"
            },
            {
                "id": "idea_4",
                "title": "Soft Knit Infinity Scarf",
                "description": "A comfortable lightweight neck loop sewn seamlessly from sliced body fabric rings.",
                "difficulty": "Easy",
                "estimatedTime": "30 Mins",
                "materialUtilization": min(usable_material + 2, 88),
                "reusableParts": ["Main Body Fabric", "Hemline Ribbing"],
                "additionalMaterials": ["Matching Stretch Thread"],
                "wasteReduced": "0.25 kg",
                "category": "Clothing & Apparel"
            }
        ]

    # 4. Jackets / Outerwear
    elif "jacket" in garment_lower or "coat" in garment_lower:
        ideas = [
            {
                "id": "idea_1",
                "title": "Padded Laptop Tech Sleeve",
                "description": "A protective insulated tech sleeve leveraging sturdy jacket outer fabric and zipper hardware.",
                "difficulty": "Medium",
                "estimatedTime": "2.5 Hours",
                "materialUtilization": min(usable_material, 80),
                "reusableParts": ["Outer Shell Fabric", "Lining Layer", "Heavy Zipper"],
                "additionalMaterials": ["Padded Foam Insert", "Heavy Duty Thread", "Zipper"],
                "wasteReduced": "0.7 kg",
                "category": "Bags & Accessories"
            },
            {
                "id": "idea_2",
                "title": "Insulated Travel Lunch Bag",
                "description": "A structured thermal pouch featuring outer pocket sections for eating utensils.",
                "difficulty": "Medium",
                "estimatedTime": "2 Hours",
                "materialUtilization": min(usable_material + 4, 84),
                "reusableParts": ["Outer Shell Fabric", "Heavy Zipper/Buttons", "Pockets"],
                "additionalMaterials": ["Thermal Foil Lining", "Thread", "Velcro"],
                "wasteReduced": "0.6 kg",
                "category": "Utility & Home"
            },
            {
                "id": "idea_3",
                "title": "Weather-Resistant Bike Frame Bag",
                "description": "A compact triangular frame pouch for cycling tools utilizing heavy-duty jacket zip panels.",
                "difficulty": "Hard",
                "estimatedTime": "3 Hours",
                "materialUtilization": min(usable_material - 5, 75),
                "reusableParts": ["Outer Shell Fabric", "Heavy Zipper", "Pockets"],
                "additionalMaterials": ["Velcro Straps", "Binding Tape"],
                "wasteReduced": "0.5 kg",
                "category": "Utility & Home"
            },
            {
                "id": "idea_4",
                "title": "Upcycled Outdoor Seat Cushion",
                "description": "Water-resistant patio or camping cushion filled with scrap fabric padding.",
                "difficulty": "Easy",
                "estimatedTime": "1.5 Hours",
                "materialUtilization": min(usable_material + 5, 85),
                "reusableParts": ["Outer Shell Fabric", "Lining Layer"],
                "additionalMaterials": ["Foam Padding", "Heavy Thread"],
                "wasteReduced": "0.65 kg",
                "category": "Home Decor"
            }
        ]

    # 5. Default General Garment Ideas
    else:
        ideas = [
            {
                "id": "idea_1",
                "title": "Upcycled Fabric Storage Bucket",
                "description": "A collapsible structured fabric container crafted from garment panels to organize home spaces.",
                "difficulty": "Easy",
                "estimatedTime": "1.5 Hours",
                "materialUtilization": min(usable_material + 2, 85),
                "reusableParts": reusable_parts[:3] if reusable_parts else ["Main Usable Fabric", "Trim Details"],
                "additionalMaterials": ["Heavy Thread", "Stiff Interfacing", "Fabric Scissors"],
                "wasteReduced": "0.5 kg",
                "category": "Home Decor"
            },
            {
                "id": "idea_2",
                "title": "Multi-Purpose Crossbody Pouch",
                "description": "A handy small shoulder pouch featuring repurposed hem details and button fasteners.",
                "difficulty": "Medium",
                "estimatedTime": "2 Hours",
                "materialUtilization": min(usable_material, 80),
                "reusableParts": reusable_parts[:2] if reusable_parts else ["Main Usable Fabric"],
                "additionalMaterials": ["Strap Cord", "Zipper / Snap Button"],
                "wasteReduced": "0.4 kg",
                "category": "Bags & Accessories"
            },
            {
                "id": "idea_3",
                "title": "Patchwork Placemat Set",
                "description": "A set of dining table placemats built by joining clean fabric geometric cutouts.",
                "difficulty": "Easy",
                "estimatedTime": "1 Hour",
                "materialUtilization": min(usable_material + 6, 88),
                "reusableParts": reusable_parts[:2] if reusable_parts else ["Main Usable Fabric"],
                "additionalMaterials": ["Cotton Thread", "Backing Fabric"],
                "wasteReduced": "0.45 kg",
                "category": "Home Decor"
            },
            {
                "id": "idea_4",
                "title": "Eco Fabric Book & Tablet Sleeve",
                "description": "A soft protective sleeve with elastic band closure for notebooks and tablets.",
                "difficulty": "Easy",
                "estimatedTime": "1 Hour",
                "materialUtilization": min(usable_material, 78),
                "reusableParts": reusable_parts[:3] if reusable_parts else ["Main Usable Fabric"],
                "additionalMaterials": ["Elastic Loop", "Button"],
                "wasteReduced": "0.35 kg",
                "category": "Utility & Home"
            }
        ]

    # Prioritize or sort if user preference matches a category or title keyword
    if pref_lower:
        def preference_rank(idea):
            cat = idea["category"].lower()
            title = idea["title"].lower()
            desc = idea["description"].lower()
            if any(term in cat or term in title or term in desc for term in pref_lower.split()):
                return 0
            return 1
        ideas.sort(key=preference_rank)

    return ideas[:4]

def generate_upcycling_ideas(
    garment_type: str,
    material: str,
    condition: str,
    size: str,
    usable_material: int,
    reusable_parts: List[str],
    user_preference: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Main entry point for generating 3-4 personalized upcycling idea summaries.
    First tries Gemini AI generation, then falls back to rule-based generation.
    """
    ai_ideas = generate_ideas_with_ai(
        garment_type=garment_type,
        material=material,
        condition=condition,
        size=size,
        usable_material=usable_material,
        reusable_parts=reusable_parts,
        user_preference=user_preference
    )
    if ai_ideas and len(ai_ideas) >= 3:
        return ai_ideas

    return generate_ideas_rule_based(
        garment_type=garment_type,
        material=material,
        condition=condition,
        size=size,
        usable_material=usable_material,
        reusable_parts=reusable_parts,
        user_preference=user_preference
    )

def generate_selected_idea_details(
    garment_type: str,
    selected_idea: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generate detailed transformation plan, guide steps, and final result data
    specifically for the user's selected idea.
    """
    title = selected_idea.get("title") or "Upcycled Item"
    desc = selected_idea.get("description") or "Custom upcycling transformation."
    difficulty = selected_idea.get("difficulty") or "Easy"
    est_time = selected_idea.get("estimatedTime") or "1.5 Hours"
    mat_utilization = int(selected_idea.get("materialUtilization", 80))
    reusable = selected_idea.get("reusableParts", ["Main Usable Fabric"])
    add_materials = selected_idea.get("additionalMaterials", ["Thread", "Needle"])
    waste_reduced = selected_idea.get("wasteReduced", "0.5 kg")

    # Generate custom 5-6 step guide tailored to the selected idea title
    title_lower = title.lower()
    if "tote" in title_lower or "bag" in title_lower:
        guide_steps = [
            f"Deconstruct {garment_type} panels along the main seams and lay pieces flat.",
            "Cut out main front and back body panels according to tote dimensions.",
            "Prepare handles and pocket sections using waistband or remaining fabric strips.",
            "Pin and stitch side and bottom seams with reinforced double stitching.",
            "Attach fabric handles firmly to the top rim.",
            "Press with an iron and finish all raw edges for your clean completed tote bag."
        ]
    elif "apron" in title_lower:
        guide_steps = [
            f"Lay {garment_type} flat and seam-rip sleeves and back fabric section.",
            "Trim main panel into a standard apron bib and waist shape.",
            "Cut neck strap and long waist ties from remaining fabric scraps.",
            "Hem raw edges around bib and bottom with a double-fold hem.",
            "Stitch waist ties and neck strap securely at stress points.",
            "Press all seams flat for a clean utility apron."
        ]
    elif "cushion" in title_lower or "pillow" in title_lower or "bed" in title_lower:
        guide_steps = [
            f"Measure pillow insert dimensions and add 1 inch seam allowance.",
            f"Cut front and back fabric squares from usable {garment_type} panels.",
            "Align right sides together and pin zipper or envelope overlap flap.",
            "Sew around three sides, reinforcing corners.",
            "Insert pillow cushion or stuffing into the open side.",
            "Stitch opening closed or zip up for final completion."
        ]
    elif "sleeve" in title_lower or "organizer" in title_lower or "bin" in title_lower or "pouch" in title_lower:
        guide_steps = [
            f"Measure item dimensions against available {garment_type} fabric sections.",
            "Cut outer panels and lining layers to exact size.",
            "Interface fabric with stiffener for structural support if needed.",
            "Stitch side seams and attach zippers or closure buttons.",
            "Turn right side out and inspect seams for durability."
        ]
    else:
        guide_steps = [
            f"Deconstruct {garment_type} panels along existing seams.",
            "Cut fabric sections into required project shapes.",
            "Prep edges and pin fabric pieces together.",
            "Stitch main seams using durable thread.",
            "Attach final hardware, straps, or decorative trims.",
            "Inspect finished upcycled creation and press seams."
        ]

    transformation_plan = {
        "fromProduct": garment_type or "Original Garment",
        "toProduct": title,
        "description": desc,
        "difficulty": difficulty,
        "estimatedTime": est_time,
        "materialUtilization": mat_utilization,
        "reusableParts": reusable
    }

    final_result = {
        "originalGarment": garment_type or "Original Garment",
        "newProduct": title,
        "materialReused": mat_utilization,
        "wasteReduced": waste_reduced
    }

    return {
        "transformationPlan": transformation_plan,
        "guideSteps": guide_steps,
        "additionalMaterials": add_materials,
        "finalResult": final_result
    }
