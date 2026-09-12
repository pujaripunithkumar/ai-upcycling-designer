import os
import io
import json
import base64
import logging
from typing import Dict, Any, Optional
from PIL import Image
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

logger = logging.getLogger("reloop.image_analyzer")

def extract_dominant_color(image: Image.Image) -> str:
    """Analyze image pixels to return a human-readable dominant color name."""
    try:
        img = image.convert("RGB").resize((60, 60))
        pixels = list(img.getdata())
        
        # Filter out near black and near white pixels if possible
        filtered = [p for p in pixels if sum(p) > 60 and sum(p) < 700]
        if not filtered:
            filtered = pixels

        avg_r = sum(p[0] for p in filtered) // len(filtered)
        avg_g = sum(p[1] for p in filtered) // len(filtered)
        avg_b = sum(p[2] for p in filtered) // len(filtered)

        # Color classification heuristics based on RGB values
        if avg_b > avg_r + 20 and avg_b > avg_g:
            return "Blue"
        elif avg_r > 180 and avg_g > 180 and avg_b > 180:
            return "White / Off-White"
        elif avg_r < 60 and avg_g < 60 and avg_b < 60:
            return "Black"
        elif avg_r > avg_g + 30 and avg_r > avg_b + 30:
            return "Red / Crimson"
        elif avg_g > avg_r + 20 and avg_g > avg_b + 20:
            return "Green"
        elif avg_r > 150 and avg_g > 150 and avg_b < 100:
            return "Yellow / Ochre"
        elif avg_r > 100 and avg_g > 80 and avg_b < 80:
            return "Brown / Earth Tone"
        elif abs(avg_r - avg_g) < 20 and abs(avg_g - avg_b) < 20:
            return "Grey"
        elif avg_r > 160 and avg_g > 120 and avg_b > 120:
            return "Beige / Khaki"
        else:
            return "Blue"
    except Exception:
        return "Blue"

def decode_image_url(image_url: str) -> Optional[Image.Image]:
    """Decode base64 data URL into PIL Image."""
    if not image_url or "," not in image_url:
        return None
    try:
        header, base64_str = image_url.split(",", 1)
        image_data = base64.b64decode(base64_str)
        return Image.open(io.BytesIO(image_data))
    except Exception as e:
        logger.warning(f"Failed to decode image URL: {e}")
        return None

def analyze_garment_with_ai(image: Image.Image, user_garment_type: str, user_material: str, user_condition: str) -> Optional[Dict[str, Any]]:
    """
    Analyze garment image using Google Gemini Vision API (google-genai SDK).
    Returns structured dict or None if API key missing, API call fails, or JSON is invalid.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.strip() == "" or api_key == "your_gemini_api_key_here":
        logger.info("GEMINI_API_KEY not configured. Using rule-based fallback analyzer.")
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
Analyze this garment image for an AI upcycling application.
User details hint: Garment Type="{user_garment_type}", Material="{user_material}", Condition="{user_condition}".

Inspect the image thoroughly and extract structured information.
Respond with pure JSON using this exact schema:
{{
  "garmentType": "Detected garment type (e.g. Denim Jeans, Button-Down Shirt, Cotton T-Shirt, Leather Jacket)",
  "color": "Primary color name (e.g. Blue, Black, White, Red, Grey, Olive Green)",
  "material": "Likely material composition (e.g. Denim, 100% Cotton, Wool, Polyester Blend, Leather)",
  "conditionScore": "Overall condition (must be one of: Excellent, Good, Fair, Worn)",
  "usableMaterial": integer percentage of fabric reusable for upcycling (0 to 100),
  "reusableParts": ["list", "of", "reusable", "parts"],
  "visibleDamage": ["list", "of", "visible", "damage", "or", "wear", "items"]
}}
"""

        # Use gemini-3.6-flash or gemini-1.5-flash for vision analysis
        model_names = ["gemini-3.6-flash", "gemini-1.5-flash"]
        response = None

        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        )

        for m_name in model_names:
            try:
                response = client.models.generate_content(
                    model=m_name,
                    contents=[image, prompt],
                    config=config
                )
                if response and response.text:
                    break
            except Exception as m_err:
                logger.info(f"Model {m_name} failed: {m_err}. Trying next model...")

        if not response.text:
            return None

        result = json.loads(response.text)

        # Validate JSON output fields
        required_keys = ["color", "conditionScore", "usableMaterial", "reusableParts", "visibleDamage"]
        if not all(k in result for k in required_keys):
            logger.warning("AI Vision response missing required JSON fields. Falling back to rule-based analyzer.")
            return None

        return {
            "garmentType": str(result.get("garmentType") or user_garment_type or "Garment"),
            "color": str(result.get("color") or "Blue"),
            "material": str(result.get("material") or user_material or "Fabric"),
            "conditionScore": str(result.get("conditionScore") or user_condition or "Good").capitalize(),
            "usableMaterial": max(0, min(100, int(result.get("usableMaterial", 80)))),
            "reusableParts": [str(p) for p in result.get("reusableParts", []) if p],
            "visibleDamage": [str(d) for d in result.get("visibleDamage", []) if d]
        }

    except Exception as e:
        logger.warning(f"AI Vision API call failed: {e}. Falling back to rule-based analyzer.")
        return None

def analyze_garment_rule_based(garment_type: str, material: str, condition: str, image_url: str = None) -> Dict[str, Any]:
    """Rule-based heuristic fallback analyzer."""
    garment_lower = (garment_type or "").lower()
    mat_lower = (material or "").lower()
    cond_lower = (condition or "").lower()

    detected_color = "Blue"
    if image_url:
        img = decode_image_url(image_url)
        if img:
            detected_color = extract_dominant_color(img)
    elif "denim" in mat_lower or "jean" in garment_lower:
        detected_color = "Blue"
    elif "black" in garment_lower:
        detected_color = "Black"
    elif "white" in garment_lower:
        detected_color = "White"

    if "excellent" in cond_lower:
        usable_material = 92
        damage_list = ["No visible tears", "Fabric integrity is fully intact"]
    elif "good" in cond_lower:
        usable_material = 82
        damage_list = ["Minor surface wear near seams", "Slight color fading"]
    elif "fair" in cond_lower:
        usable_material = 70
        damage_list = ["Visible fading in high-friction areas", "Minor fraying at hem edge"]
    else:
        usable_material = 55
        damage_list = ["Significant fabric thinning", "Small hole/tear near pocket/knee area"]

    if "jean" in garment_lower or "pant" in garment_lower or "denim" in mat_lower:
        reusable_parts = ["Denim Fabric", "Back Pockets", "Waistband", "Buttons & Zipper", "Belt Loops"]
    elif "shirt" in garment_lower or "button" in garment_lower:
        reusable_parts = ["Front & Back Panels", "Collar & Cuffs", "Buttons & Placket", "Pocket Section"]
    elif "t-shirt" in garment_lower or "tee" in garment_lower or "top" in garment_lower:
        reusable_parts = ["Main Body Fabric", "Sleeve Cutouts", "Hemline Ribbing"]
    elif "jacket" in garment_lower or "coat" in garment_lower:
        reusable_parts = ["Outer Shell Fabric", "Lining Layer", "Heavy Zipper/Buttons", "Pockets"]
    elif "dress" in garment_lower or "skirt" in garment_lower:
        reusable_parts = ["Main Skirt Panels", "Hem Fabric", "Elastic Waistband", "Decorative Trims"]
    else:
        reusable_parts = ["Main Usable Fabric", "Functional Hardware/Seams", "Edge Trims"]

    return {
        "garmentType": garment_type or "Garment",
        "color": detected_color,
        "material": material or "Fabric",
        "conditionScore": condition.capitalize() if condition else "Good",
        "usableMaterial": usable_material,
        "reusableParts": reusable_parts,
        "visibleDamage": damage_list,
    }

def analyze_garment_image(garment_type: str, material: str, condition: str, image_url: str = None) -> Dict[str, Any]:
    """
    Main garment image analyzer entry point.
    First attempts Gemini AI Vision analysis if image and API key are available.
    Gracefully falls back to rule-based heuristic analyzer.
    """
    if image_url:
        img = decode_image_url(image_url)
        if img:
            ai_result = analyze_garment_with_ai(
                image=img,
                user_garment_type=garment_type,
                user_material=material,
                user_condition=condition
            )
            if ai_result:
                return ai_result

    # Fallback to rule-based analysis
    return analyze_garment_rule_based(
        garment_type=garment_type,
        material=material,
        condition=condition,
        image_url=image_url
    )
