import os
import random
from PIL import Image

source_dir = os.path.join(os.getcwd(), 'pending_views_generated_dark')
cropped_dir = os.path.join(os.getcwd(), 'pending_views_generated_dark_cropped')
os.makedirs(cropped_dir, exist_ok=True)

image_files = sorted([
    f for f in os.listdir(source_dir)
    if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.startswith('.')
])

print(f"Found {len(image_files)} images to crop.")

random.seed(999) # Deterministic natural variation

# 3 Crop Ratios based on user's 3 reference screenshots:
# 1. Medium Crop (below donut circle): ratio ~ 2.00 - 2.06
# 2. Short Crop (below overview / top of donut): ratio ~ 1.38 - 1.45
# 3. Tall Crop (below legend / accounts reached): ratio ~ 2.22 - 2.28
crop_styles = [
    {'name': 'below_donut',   'min_ratio': 1.98, 'max_ratio': 2.06},
    {'name': 'below_overview','min_ratio': 1.38, 'max_ratio': 1.45},
    {'name': 'below_legend',  'min_ratio': 2.20, 'max_ratio': 2.28}
]

for i, filename in enumerate(image_files, 1):
    src_path = os.path.join(source_dir, filename)
    img = Image.open(src_path)
    w, h = img.size

    # Pick one of the 3 styles randomly with equal distribution
    style = crop_styles[i % 3] # balanced distribution across the 3 styles
    ratio = random.uniform(style['min_ratio'], style['max_ratio'])
    crop_h = min(h, int(w * ratio))

    # Crop from top (0, 0) to (w, crop_h)
    cropped_img = img.crop((0, 0, w, crop_h))

    # Save to cropped folder and overwrite in pending_views_generated_dark
    dst_path = os.path.join(cropped_dir, filename)
    cropped_img.save(dst_path, format='PNG', optimize=True)
    cropped_img.save(src_path, format='PNG', optimize=True)

    if i % 20 == 0 or i == len(image_files):
        print(f"[{i:03d}/{len(image_files):03d}] Cropped: {filename} -> Style: {style['name']} (Size: {w}x{crop_h}, Ratio: {round(crop_h/w, 2)})")

print(f"\n Finished cropping all {len(image_files)} screenshots!")
