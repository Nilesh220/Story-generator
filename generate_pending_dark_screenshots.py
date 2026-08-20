import os
import random
import math
from PIL import Image
from playwright.sync_api import sync_playwright

source_dir = os.path.join(os.getcwd(), 'pending_views_story_screenshots')
output_dir = os.path.join(os.getcwd(), 'pending_views_generated_dark')
cropped_dir = os.path.join(os.getcwd(), 'pending_views_generated_dark_cropped')
os.makedirs(output_dir, exist_ok=True)
os.makedirs(cropped_dir, exist_ok=True)

valid_extensions = ('.jpg', '.jpeg', '.png', '.webp')
image_files = sorted([
    f for f in os.listdir(source_dir)
    if f.lower().endswith(valid_extensions) and not f.startswith('.')
])

print(f"Found {len(image_files)} pending story image files in: {source_dir}")

times_pool = [
    '08:45', '09:04', '09:22', '09:41', '10:05', '10:18', '10:35', '10:52',
    '11:10', '11:28', '11:45', '12:02', '12:19', '12:38', '12:55', '01:12',
    '01:29', '01:46', '02:05', '02:24', '02:41', '03:00', '03:18', '03:37',
    '03:54', '04:11', '04:28', '04:47', '05:04', '05:22', '05:40', '05:58',
    '06:15', '06:33', '06:50', '07:08', '07:25', '07:42', '08:00', '08:19',
    '08:36', '08:54', '09:11', '09:29', '09:48', '10:05', '10:22', '10:40',
    '10:58', '11:15', '11:32', '11:50'
]

crop_styles = [
    {'name': 'below_donut',   'min_ratio': 1.98, 'max_ratio': 2.06},
    {'name': 'below_overview','min_ratio': 1.38, 'max_ratio': 1.45},
    {'name': 'below_legend',  'min_ratio': 2.20, 'max_ratio': 2.28}
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1600, 'height': 1400},
        device_scale_factor=3
    )
    page = context.new_page()
    page.goto('http://localhost:8080')
    page.wait_for_selector('#iphone-phone-frame')

    random.seed(2026)

    for i, img_filename in enumerate(image_files, 1):
        views = random.randint(200, 700)
        time_str = times_pool[(i - 1) % len(times_pool)]
        silent = (i % 2 == 1) or (i % 5 == 0)
        battery = random.randint(25, 98)
        show_battery_num = False
        signal = 4 if (i % 4 != 0) else 3
        network = 'wifi' if (i % 3 != 0) else random.choice(['5G', 'LTE'])

        if views < 350:
            interactions = random.randint(2, 6)
            profile_activity = random.randint(0, 3)
            likes = max(1, interactions - random.randint(0, 1))
            replies = random.choice(['0', '1'])
        elif views < 550:
            interactions = random.randint(4, 11)
            profile_activity = random.randint(1, 5)
            likes = max(2, interactions - random.randint(0, 2))
            replies = str(random.randint(0, 2))
        else:
            interactions = random.randint(7, 16)
            profile_activity = random.randint(1, 7)
            likes = max(3, interactions - random.randint(0, 3))
            replies = str(random.randint(0, 3))

        reached = max(1, round(views * random.uniform(0.945, 0.985)))
        followers_pct = round(random.uniform(94.8, 99.1), 1)
        nonfollowers_pct = round(100.0 - followers_pct, 1)

        img_rel_url = f"pending_views_story_screenshots/{img_filename}"

        page.evaluate("""(data) => {
            const hdr = document.querySelector('.app-header');
            if (hdr) hdr.style.display = 'none';

            const frame = document.getElementById('iphone-phone-frame');
            if (frame) frame.classList.add('theme-dark');

            const timeEl = document.getElementById('mockup-time');
            if (timeEl) timeEl.textContent = data.time;

            const silentEl = document.getElementById('mockup-silent-bell');
            if (silentEl) silentEl.style.display = data.silent ? 'inline-flex' : 'none';

            const batNum = document.getElementById('mockup-battery-percent');
            if (batNum) {
                batNum.textContent = data.battery;
                batNum.style.display = 'none';
            }
            const batLevel = document.getElementById('mockup-battery-level');
            if (batLevel) batLevel.style.width = data.battery + '%';

            const wifiIcon = document.getElementById('mockup-wifi-icon');
            const netText = document.getElementById('mockup-network-text');
            if (data.network === 'wifi') {
                if (wifiIcon) wifiIcon.style.display = 'inline-block';
                if (netText) netText.style.display = 'none';
            } else {
                if (wifiIcon) wifiIcon.style.display = 'none';
                if (netText) {
                    netText.textContent = data.network;
                    netText.style.display = 'inline-block';
                }
            }

            const signalBars = document.querySelectorAll('#mockup-signal-bars .signal-bar');
            signalBars.forEach((bar, idx) => {
                bar.style.opacity = (idx < data.signal) ? '1' : '0.3';
            });

            const card = document.getElementById('mockup-story-card');
            if (card) {
                card.style.backgroundImage = `url('${data.imgUrl}')`;
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center top';
            }
            const storyCount = document.getElementById('mockup-story-views-count');
            if (storyCount) storyCount.textContent = data.views;

            const tabCount = document.getElementById('mockup-tab-viewers-count');
            if (tabCount) tabCount.textContent = data.views;

            const vViews = document.getElementById('stat-val-views');
            if (vViews) vViews.textContent = Number(data.views).toLocaleString('en-US');

            const vInteractions = document.getElementById('stat-val-interactions');
            if (vInteractions) vInteractions.textContent = data.interactions;

            const vProfile = document.getElementById('stat-val-profile');
            if (vProfile) vProfile.textContent = data.profileActivity;

            const donutVal = document.getElementById('stat-donut-center-val');
            if (donutVal) donutVal.textContent = Number(data.views).toLocaleString('en-US');

            const fPct = document.getElementById('stat-donut-followers-pct');
            if (fPct) fPct.textContent = data.followersPct + '%';

            const nfPct = document.getElementById('stat-donut-nonfollowers-pct');
            if (nfPct) nfPct.textContent = data.nonfollowersPct + '%';

            const cFollowers = document.getElementById('donut-circle-followers');
            const cNonFollowers = document.getElementById('donut-circle-nonfollowers');
            const C = 2 * Math.PI * 78;
            if (cFollowers && cNonFollowers) {
                const fLen = (data.followersPct / 100) * C;
                const nfLen = (data.nonfollowersPct / 100) * C;
                cFollowers.setAttribute('stroke-dasharray', `${fLen} ${C}`);
                cFollowers.setAttribute('stroke-dashoffset', '0');
                cNonFollowers.setAttribute('stroke-dasharray', `${nfLen} ${C}`);
                cNonFollowers.setAttribute('stroke-dashoffset', `-${fLen}`);
            }

            const stReached = document.getElementById('stat-val-reached');
            if (stReached) stReached.textContent = Number(data.reached).toLocaleString('en-US');

            const stIntTotal = document.getElementById('stat-val-interactions-total');
            if (stIntTotal) stIntTotal.textContent = data.interactions;

            const stLikes = document.getElementById('stat-val-likes');
            if (stLikes) stLikes.textContent = data.likes;

            const stReplies = document.getElementById('stat-val-replies');
            if (stReplies) stReplies.textContent = data.replies;

            const stShares = document.getElementById('stat-val-shares');
            if (stShares) stShares.textContent = '--';
        }""", {
            'imgUrl': img_rel_url,
            'time': time_str,
            'silent': silent,
            'battery': battery,
            'signal': signal,
            'network': network,
            'views': views,
            'interactions': interactions,
            'profileActivity': profile_activity,
            'reached': reached,
            'followersPct': followers_pct,
            'nonfollowersPct': nonfollowers_pct,
            'likes': likes,
            'replies': replies
        })

        page.wait_for_timeout(60)

        base_name = os.path.splitext(img_filename)[0]
        out_filename = f"{base_name}__views_{views}.png"
        out_filepath = os.path.join(output_dir, out_filename)
        crop_filepath = os.path.join(cropped_dir, out_filename)

        frame_el = page.query_selector('#iphone-phone-frame')
        frame_el.screenshot(path=out_filepath)

        # Apply random crop matching 3 reference styles
        img = Image.open(out_filepath)
        w, h = img.size
        style = crop_styles[(i - 1) % 3]
        ratio = random.uniform(style['min_ratio'], style['max_ratio'])
        crop_h = min(h, int(w * ratio))
        cropped_img = img.crop((0, 0, w, crop_h))
        cropped_img.save(crop_filepath, format='PNG', optimize=True)
        cropped_img.save(out_filepath, format='PNG', optimize=True)

        if i % 20 == 0 or i == len(image_files):
            print(f"[{i:03d}/{len(image_files):03d}] Regenerated: {out_filename} -> Crop: {style['name']}")

    browser.close()

print(f"\n Finished regenerating all {len(image_files)} screenshots with updated icons & spacing!")
