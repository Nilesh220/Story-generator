import os
import random
from playwright.sync_api import sync_playwright

source_dir = os.path.join(os.getcwd(), 'pending_views_story_screenshots')
output_dir = os.path.join(os.getcwd(), 'generated_stories')
os.makedirs(output_dir, exist_ok=True)

valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
image_files = sorted([
    f for f in os.listdir(source_dir)
    if f.lower().endswith(valid_extensions) and not f.startswith('.')
])

captions_pool = [
    "Have you spotted DISCO yet? 👀🔥\nYour nearest @reliance_digital is calling!",
    "Massive sale happening at\n@reliance_digital",
    "Check out the latest tech lineup at\n@reliance_digital @vigorspace",
    "Huge discounts & offers live at\n@reliance_digital ✨🛍️",
    "Visit @reliance_digital today for exclusive tech deals! 💻📱"
]

time_elapsed_pool = ['2m', '15m', '45m', '1h', '3h', '5h', '7h', '12h', '18h']

print(f"Generating story post screenshots for {len(image_files)} images...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1600, 'height': 1400}, device_scale_factor=3)
    page = context.new_page()
    page.goto('http://localhost:8080')
    page.wait_for_selector('#btn-mode-story')

    page.click('#btn-mode-story')
    page.wait_for_timeout(200)

    for i, img_filename in enumerate(image_files[:10], 1):
        caption = captions_pool[(i - 1) % len(captions_pool)]
        time_elapsed = time_elapsed_pool[(i - 1) % len(time_elapsed_pool)]
        status_time = f"{random.randint(1,12):02d}:{random.randint(10,59):02d}"
        battery = random.randint(40, 95)
        img_rel_path = f"pending_views_story_screenshots/{img_filename}"

        page.evaluate("""(data) => {
            const hdr = document.querySelector('.app-header');
            if (hdr) hdr.style.display = 'none';

            const bg = document.getElementById('story-bg-canvas');
            if (bg) bg.style.backgroundImage = `url('${data.bgUrl}')`;

            const cap = document.getElementById('story-caption-display');
            if (cap) {
                cap.innerHTML = data.caption.replace(/(@[a-zA-Z0-9_]+)/g, '<u>$1</u>').replace(/\\n/g, '<br>');
            }

            const tEl = document.getElementById('story-time-elapsed-display');
            if (tEl) tEl.textContent = data.timeElapsed;

            const smT = document.getElementById('sm-status-time');
            if (smT) smT.textContent = data.statusTime;

            const batLvl = document.getElementById('sm-status-battery-level');
            if (batLvl) batLvl.style.width = data.battery + '%';

            const batPct = document.getElementById('sm-status-battery-percent');
            if (batPct) batPct.textContent = data.battery;
        }""", {
            'bgUrl': img_rel_path,
            'caption': caption,
            'timeElapsed': time_elapsed,
            'statusTime': status_time,
            'battery': battery
        })

        page.wait_for_timeout(60)

        out_name = f"story_post_{i:02d}_{os.path.splitext(img_filename)[0]}.png"
        out_path = os.path.join(output_dir, out_name)

        frame_el = page.query_selector('#story-maker-phone-frame')
        frame_el.screenshot(path=out_path)
        print(f"[{i:02d}/10] Generated story: {out_name}")

    browser.close()

print(f"\n Sample story posts generated in: {output_dir}")
