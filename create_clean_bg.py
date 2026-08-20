from PIL import Image, ImageDraw, ImageFont
import os

# Create a clean high-res raw photo background (e.g., modern sleek electronics store / laptop banner)
w, h = 1080, 1920
img = Image.new('RGB', (w, h), color='#0f172a')
draw = ImageDraw.Draw(img)

# Draw a sleek modern background gradient
for y in range(h):
    r = int(15 + (y / h) * 20)
    g = int(23 + (y / h) * 40)
    b = int(42 + (y / h) * 60)
    draw.line([(0, y), (w, y)], fill=(r, g, b))

# Draw some glowing geometric store lights and banner elements
draw.rounded_rectangle([100, 450, 980, 1350], radius=40, fill=(30, 41, 59), outline=(71, 85, 105), width=4)

# Draw sample graphics
draw.text((w // 2, 700), "BOOT UP INDIA SALE", fill="#38bdf8", anchor="mm")
draw.text((w // 2, 850), "UP TO 50% OFF ON LAPTOPS", fill="#ffffff", anchor="mm")
draw.text((w // 2, 1000), "Reliance Digital Exclusive", fill="#f43f5e", anchor="mm")

raw_bg_path = os.path.join(os.getcwd(), 'assets', 'clean_raw_store_banner.jpg')
img.save(raw_bg_path, quality=95)
print(f"Created clean raw background: {raw_bg_path}")
