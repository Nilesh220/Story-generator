import os
import random
import math
from PIL import Image
from playwright.sync_api import sync_playwright

raw_items = [
    329, 333, 471, 1113, 390,
    337, 168, 261, 965, 420,
    463, 610, 662, 972, 84,
    678, 907, 864, 129, 250,
    167, 141, 546, 397, 1328,
    499, 63, 1016, 357, 237,
    562, 308, 875, 635, 1200,
    170, 226, 1273, 259, 150,
    440, # Below 500
    470, # Below 500
    679,
    1160, # Above 1,000
    686, 413, 407, 503, 398,
    264, 102
]

times_pool = [
    '09:15', '09:42', '10:08', '10:25', '10:54', '11:12', '11:35', '11:50',
    '12:04', '12:27', '12:45', '01:14', '01:38', '02:05', '02:22', '02:49',
    '03:15', '03:40', '04:02', '04:28', '04:55', '05:16', '05:43', '06:10',
    '06:35', '07:02', '07:29', '07:54', '08:18', '08:45', '09:05', '09:32',
    '10:14', '10:48', '11:20', '11:42', '12:15', '01:05', '01:50', '02:35',
    '03:20', '04:10', '05:00', '05:50', '06:40', '07:30', '08:20', '09:10',
    '10:00', '10:30', '11:00'
]

output_dir = os.path.join(os.getcwd(), 'generated_screenshots')
os.makedirs(output_dir, exist_ok=True)

# 3 Reference Crop Styles
crop_styles = [
    {'name': 'below_donut',   'min_ratio': 1.98, 'max_ratio': 2.06},
    {'name': 'below_overview','min_ratio': 1.38, 'max_ratio': 1.45},
    {'name': 'below_legend',  'min_ratio': 2.20, 'max_ratio': 2.28}
]

def generate_batch(poster_image_path='assets/reliance_digital_story.png'):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1600, 'height': 1400},
            device_scale_factor=3
        )
        page = context.new_page()
        page.goto('http://localhost:8080')
        page.wait_for_selector('#iphone-phone-frame')

        random.seed(42)
        results = []

        for i, orig in enumerate(raw_items, 1):
            reduced_views = round(orig * 0.90)

            time_str = times_pool[(i - 1) % len(times_pool)]
            silent = (i % 2 == 1) or (i % 5 == 0)
            battery = random.randint(28, 98)
            signal = 4 if (i % 4 != 0) else 3
            network = 'wifi' if (i % 3 != 0) else random.choice(['5G', 'LTE'])

            if reduced_views < 100:
                interactions = random.randint(0, 3)
                profile_activity = random.randint(0, 2)
                likes = interactions
                replies = random.choice(['0', '1'])
            elif reduced_views < 500:
                interactions = random.randint(2, 9)
                profile_activity = random.randint(0, 4)
                likes = max(0, interactions - random.randint(0, 1))
                replies = str(random.randint(0, 2))
            else:
                interactions = random.randint(5, 24)
                profile_activity = random.randint(1, 8)
                likes = max(1, interactions - random.randint(0, 3))
                replies = str(random.randint(0, 3))

            reached = max(1, round(reduced_views * random.uniform(0.94, 0.985)))
            followers_pct = round(random.uniform(94.5, 99.2), 1)
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
                'posterUrl': poster_image_path,
                'time': time_str,
                'silent': silent,
                'battery': battery,
                'signal': signal,
                'network': network,
                'views': reduced_views,
                'interactions': interactions,
                'profileActivity': profile_activity,
                'reached': reached,
                'followersPct': followers_pct,
                'nonfollowersPct': nonfollowers_pct,
                'likes': likes,
                'replies': replies
            })

            page.wait_for_timeout(60)

            filename = f"screenshot_{i:02d}_views_{reduced_views}.png"
            filepath = os.path.join(output_dir, filename)

            frame_el = page.query_selector('#iphone-phone-frame')
            frame_el.screenshot(path=filepath)

            # Apply random crop
            img = Image.open(filepath)
            w, h = img.size
            style = crop_styles[(i - 1) % 3]
            ratio = random.uniform(style['min_ratio'], style['max_ratio'])
            crop_h = min(h, int(w * ratio))
            cropped_img = img.crop((0, 0, w, crop_h))
            cropped_img.save(filepath, format='PNG', optimize=True)

            results.append({
                'index': i,
                'views': reduced_views,
                'filename': filename
            })

            if i % 10 == 0 or i == len(raw_items):
                print(f"[{i:02d}/{len(raw_items):02d}] Generated Dark & Cropped: {filename} (Views: {reduced_views}, Crop: {style['name']})")

        browser.close()

    print(f"\n Successfully generated all {len(results)} Dark Mode & Cropped screenshots in: {output_dir}")

if __name__ == '__main__':
    generate_batch()
