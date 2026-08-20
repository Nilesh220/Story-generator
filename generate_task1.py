import os
import random
import math
from PIL import Image
from playwright.sync_api import sync_playwright

views_list = [291, 1485, 1671, 112, 68, 167, 98, 767]

times_pool = ['10:14', '11:42', '01:15', '02:48', '04:22', '06:05', '08:31', '10:04']

output_dir = os.path.join(os.getcwd(), 'task 1')
os.makedirs(output_dir, exist_ok=True)

poster_path = 'assets/bootup_india_poster.jpg'

# 3 Reference Crop Styles for natural Instagram story views
crop_styles = [
    {'name': 'below_donut',   'min_ratio': 1.98, 'max_ratio': 2.06},
    {'name': 'below_overview','min_ratio': 1.38, 'max_ratio': 1.45},
    {'name': 'below_legend',  'min_ratio': 2.20, 'max_ratio': 2.28}
]

print(f"Generating {len(views_list)} story views screenshots in folder 'task 1'...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1600, 'height': 1400},
        device_scale_factor=3
    )
    page = context.new_page()
    page.goto('http://localhost:8080')
    page.wait_for_selector('#iphone-phone-frame')

    random.seed(101)

    for i, v in enumerate(views_list, 1):
        time_str = times_pool[(i - 1) % len(times_pool)]
        silent = (i % 2 == 1)
        battery = random.randint(35, 95)
        signal = 4 if (i % 3 != 0) else 3
        network = 'wifi' if (i % 2 != 0) else '5G'

        if v < 100:
            interactions = random.randint(0, 3)
            profile_activity = random.randint(0, 2)
            likes = interactions
            replies = random.choice(['0', '1'])
        elif v < 500:
            interactions = random.randint(3, 11)
            profile_activity = random.randint(1, 4)
            likes = max(0, interactions - random.randint(0, 2))
            replies = str(random.randint(0, 2))
        else:
            interactions = random.randint(12, 38)
            profile_activity = random.randint(2, 9)
            likes = max(2, interactions - random.randint(1, 5))
            replies = str(random.randint(0, 4))

        reached = max(1, round(v * random.uniform(0.935, 0.982)))
        followers_pct = round(random.uniform(95.2, 98.8), 1)
        nonfollowers_pct = round(100.0 - followers_pct, 1)

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
                card.style.backgroundImage = `url('${data.posterUrl}')`;
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
            'posterUrl': poster_path,
            'time': time_str,
            'silent': silent,
            'battery': battery,
            'signal': signal,
            'network': network,
            'views': v,
            'interactions': interactions,
            'profileActivity': profile_activity,
            'reached': reached,
            'followersPct': followers_pct,
            'nonfollowersPct': nonfollowers_pct,
            'likes': likes,
            'replies': replies
        })

        page.wait_for_timeout(60)

        filename = f"task1_{i:02d}_views_{v}.png"
        filepath = os.path.join(output_dir, filename)

        frame_el = page.query_selector('#iphone-phone-frame')
        frame_el.screenshot(path=filepath)

        # Apply different crops
        img = Image.open(filepath)
        w, h = img.size
        style = crop_styles[(i - 1) % 3]
        ratio = random.uniform(style['min_ratio'], style['max_ratio'])
        crop_h = min(h, int(w * ratio))
        cropped_img = img.crop((0, 0, w, crop_h))
        cropped_img.save(filepath, format='PNG', optimize=True)

        print(f"[{i}/{len(views_list)}] Generated: {filename} (Crop: {style['name']})")

    browser.close()

print(f"\n All {len(views_list)} screenshots successfully saved to: {output_dir}")
