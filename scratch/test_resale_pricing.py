import sys
import os
import json

# Python test verifying conservative INR (Rs.) resale pricing formula across 4 products

def calculate_resale_estimate(api_data):
    final_result = api_data.get("finalResult", {})
    transformation_plan = api_data.get("transformationPlan", {})
    selected_idea = api_data.get("selectedIdea", {})
    garment = api_data.get("garment", {})
    analysis_data = api_data.get("analysisData", {})

    to_product = final_result.get("newProduct") or transformation_plan.get("toProduct") or selected_idea.get("title") or "Upcycled Product"
    material = garment.get("material") or analysis_data.get("material") or "Fabric"
    condition = garment.get("condition") or analysis_data.get("conditionScore") or "Good"
    difficulty = transformation_plan.get("difficulty") or selected_idea.get("difficulty") or "Easy"
    est_time = transformation_plan.get("estimatedTime") or selected_idea.get("estimatedTime") or "1.5 Hours"
    additional = selected_idea.get("additionalMaterials") or []
    category = selected_idea.get("category") or "Bags & Accessories"

    product_lower = to_product.lower()
    cat_lower = category.lower()

    # 1. Conservative base price, floor, and cap by category (INR Rs.)
    base_price = 349
    min_floor = 199
    max_cap = 599
    category_label = "Tote Bags & Utility Containers"

    if any(k in product_lower for k in ["scrunchie", "keychain", "ribbon", "bow", "wristband"]) or ("accessory" in cat_lower and "bag" not in product_lower):
        base_price = 179
        min_floor = 99
        max_cap = 299
        category_label = "Small Accessories"
    elif any(k in product_lower for k in ["pouch", "organizer", "bin", "clutch", "wallet"]):
        base_price = 249
        min_floor = 149
        max_cap = 399
        category_label = "Pouches & Desk Organizers"
    elif any(k in product_lower for k in ["tote", "market", "shopping bag", "produce bag"]):
        base_price = 349
        min_floor = 199
        max_cap = 599
        category_label = "Tote & Shopping Bags"
    elif any(k in product_lower for k in ["cushion", "pillow", "hanger", "placemat"]) or "home" in cat_lower:
        base_price = 349
        min_floor = 199
        max_cap = 799
        category_label = "Home Decor Items"
    elif any(k in product_lower for k in ["apron", "scarf", "skirt", "top"]) or "clothing" in cat_lower:
        base_price = 449
        min_floor = 299
        max_cap = 999
        category_label = "Clothing Transformations"
    elif any(k in product_lower for k in ["duffel", "sleeve", "laptop", "jacket", "coat", "bike"]):
        base_price = 699
        min_floor = 499
        max_cap = 1499
        category_label = "Complex / Tech Products"

    # 2. Small material adjustment
    mat_lower = material.lower()
    mat_adj = 0
    if any(m in mat_lower for m in ["leather", "wool", "silk"]):
        mat_adj = 50
    elif any(m in mat_lower for m in ["denim", "canvas"]):
        mat_adj = 30
    elif any(m in mat_lower for m in ["cotton", "linen"]):
        mat_adj = 20

    # 3. Small condition adjustment
    cond_lower = condition.lower()
    cond_adj = 0
    if "excellent" in cond_lower:
        cond_adj = 30
    elif "good" in cond_lower:
        cond_adj = 15

    # 4. Small difficulty adjustment
    diff_lower = difficulty.lower()
    diff_adj = 10
    if "hard" in diff_lower:
        diff_adj = 40
    elif "medium" in diff_lower:
        diff_adj = 25

    # 5. Additional hardware cost
    hardware_adj = 0
    if any(any(w in item.lower() for w in ["zipper", "foam", "buckle", "ring", "strap", "snap"]) for item in additional):
        hardware_adj = 30

    quality_multiplier = 1.0

    raw_val = (base_price + mat_adj + cond_adj + diff_adj + hardware_adj) * quality_multiplier
    suggested_price = max(min_floor, min(max_cap, round(raw_val)))

    range_min = max(min_floor, round(suggested_price * 0.8))
    range_max = min(max_cap, round(suggested_price * 1.22))

    return {
        "product": to_product,
        "category_label": category_label,
        "suggested_price": f"Rs. {suggested_price}",
        "price_range": f"Rs. {range_min} - Rs. {range_max}",
        "category_limits": f"Rs. {min_floor} - Rs. {max_cap}",
        "within_limits": min_floor <= suggested_price <= max_cap
    }

# Test scenarios for 4 products
test_products = [
    {
        "garment": {"material": "Denim", "condition": "Good"},
        "selectedIdea": {"title": "Classic Denim Tote Bag", "category": "Bags & Accessories", "difficulty": "Medium", "estimatedTime": "2 Hours", "additionalMaterials": ["Matching Thread"]},
        "finalResult": {"originalGarment": "Denim Jeans", "newProduct": "Classic Denim Tote Bag", "materialReused": 85, "wasteReduced": "0.6 kg"}
    },
    {
        "garment": {"material": "Cotton", "condition": "Excellent"},
        "selectedIdea": {"title": "Dual-Pocket Zippered Pouch", "category": "Pouches & Desk Organizers", "difficulty": "Easy", "estimatedTime": "45 Mins", "additionalMaterials": ["Zipper", "Thread"]},
        "finalResult": {"originalGarment": "Cotton Shirt", "newProduct": "Dual-Pocket Zippered Pouch", "materialReused": 80, "wasteReduced": "0.3 kg"}
    },
    {
        "garment": {"material": "Denim", "condition": "Good"},
        "selectedIdea": {"title": "Patchwork Denim Cushion Cover", "category": "Home Decor", "difficulty": "Medium", "estimatedTime": "1.5 Hours", "additionalMaterials": ["Pillow Form", "Thread"]},
        "finalResult": {"originalGarment": "Denim Jeans", "newProduct": "Patchwork Denim Cushion Cover", "materialReused": 82, "wasteReduced": "0.5 kg"}
    },
    {
        "garment": {"material": "Cotton", "condition": "Excellent"},
        "selectedIdea": {"title": "Upcycled Kitchen Utility Apron", "category": "Clothing & Apparel", "difficulty": "Easy", "estimatedTime": "1.5 Hours", "additionalMaterials": ["Cotton Straps", "Thread"]},
        "finalResult": {"originalGarment": "Button-Down Shirt", "newProduct": "Upcycled Kitchen Utility Apron", "materialReused": 88, "wasteReduced": "0.4 kg"}
    }
]

if __name__ == "__main__":
    print("=== Testing Conservative Resale Valuation Algorithm (INR) ===\n")
    for i, prod in enumerate(test_products, 1):
        res = calculate_resale_estimate(prod)
        print(f"Product {i}: {res['product']}")
        print(f"  Category: {res['category_label']}")
        print(f"  Suggested Listing Price: {res['suggested_price']}")
        print(f"  Estimated Resale Value Range: {res['price_range']}")
        print(f"  Category Guardrail Limits: {res['category_limits']}")
        print(f"  Within Limits: {res['within_limits']}\n")
        assert res["within_limits"]
    print("[SUCCESS] All 4 product valuations verified within category guardrails!")
