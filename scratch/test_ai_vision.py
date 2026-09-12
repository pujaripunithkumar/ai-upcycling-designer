import sys
import os
import io
import base64
from PIL import Image

backend_path = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(backend_path))

from services.image_analyzer import analyze_garment_image

# Create a small red test image and convert to base64 data URL
img = Image.new("RGB", (100, 100), color=(220, 40, 40))
buffered = io.BytesIO()
img.save(buffered, format="JPEG")
img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
data_url = f"data:image/jpeg;base64,{img_str}"

print("Testing analyze_garment_image with base64 image input...")
res = analyze_garment_image(
    garment_type="Red T-Shirt",
    material="Cotton",
    condition="Good",
    image_url=data_url
)

print("Analysis result:")
print(res)

assert "Red" in res["color"]
assert "usableMaterial" in res
assert "reusableParts" in res
assert "visibleDamage" in res
print("\n[SUCCESS] Image analysis test passed!")
