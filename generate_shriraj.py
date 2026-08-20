import os
import random
import math
from PIL import Image
from playwright.sync_api import sync_playwright

item = {
    'id': '08_284_shriraj_patil',
    'name': 'shriraj_patil',
    'views': 284,
    'poster': 'task 2/story_posters/08_shriraj_patil_poster.jpg',
    'time': '04:12',
    'silent': True,
    'battery': 73,
    'signal': 4,
    'network': 'wifi'
}

output_dir = os.path.join(os.getcwd(), 'task 2')

# Natural Crop Style (below donut)
crop_style = {'name': 'below_donut', 'ratio': 2.03}

print(f"Generating story views screenshot for {item['id']} in folder 'task 2'...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1600, 'height': 1400},
        device_scale_factor=3
    )
    page = context.new_page()
    page.goto('http://localhost:8080')
    page.wait_for_selector('#iphone-phone-frame')

    v = item['views']
    interactions = 8
    profile_activity = 3
    likes = 7
    replies = '1'
    reached = 274
    followers_pct = 97.9
    nonfollowers_pct = 2.1

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

        // Story Thumbnail Image
        const card = document.getElementById('mockup-story-card');
        if (card) {
            card.style.backgroundImage = `url('${data.poster}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
        }

        // Views Pill on Story Card
        const pillViews = document.getElementById('mockup-story-views-pill');
        if (pillViews) pillViews.style.display = 'flex';
        const pillCount = document.getElementById('mockup-story-views-count');
        if (pillCount) pillCount.textContent = data.views.toLocaleString();

        // Tabs row Viewers count
        const viewersTabCount = document.getElementById('mockup-tab-viewers-count');
        if (viewersTabCount) viewersTabCount.textContent = data.views.toLocaleString();

        const tabViewers = document.getElementById('mockup-tab-viewers');
        const tabStats = document.getElementById('mockup-tab-stats');
        if (tabStats) tabStats.classList.add('active');
        if (tabViewers) tabViewers.classList.remove('active');

        // Switch User Icons to White (Dark Theme)
        const viewersIcon = document.getElementById('icon-tab-viewers');
        const boostIcon = document.getElementById('icon-tab-boost');
        const trashIcon = document.getElementById('icon-tab-trash');
        if (viewersIcon) viewersIcon.src = 'assets/user_icon_viewers_white.png';
        if (boostIcon) boostIcon.src = 'assets/user_icon_boost_white.png';
        if (trashIcon) trashIcon.src = 'assets/user_icon_trash_white.png';

        // Metrics Helper
        const setT = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setT('stat-val-views', data.views.toLocaleString());
        setT('stat-val-interactions', data.interactions.toLocaleString());
        setT('stat-val-profile', data.profileActivity.toLocaleString());
        setT('stat-val-reached', data.reached.toLocaleString());
        setT('stat-val-interactions-total', data.interactions.toLocaleString());
        setT('stat-val-likes', data.likes.toLocaleString());
        setT('stat-val-replies', data.replies);

        // Donut Center Value & Legend
        setT('stat-donut-center-val', data.views.toLocaleString());
        setT('stat-donut-followers-pct', data.followersPct + '%');
        setT('stat-donut-nonfollowers-pct', data.nonfollowersPct + '%');

        // Donut Arc calculation (r=78, C=2*PI*78=490.09)
        const cFol = document.getElementById('donut-circle-followers');
        const cNon = document.getElementById('donut-circle-nonfollowers');
        if (cFol && cNon) {
            const r = 78;
            const C = 2 * Math.PI * r;
            const gap = 10;
            const fLen = (data.followersPct / 100) * C;
            const nfLen = (data.nonfollowersPct / 100) * C;
            cFol.setAttribute('stroke-dasharray', `${Math.max(0, fLen - gap)} ${C}`);
            cFol.setAttribute('stroke-dashoffset', '0');
            cNon.setAttribute('stroke-dasharray', `${Math.max(0, nfLen - gap)} ${C}`);
            cNon.setAttribute('stroke-dashoffset', `${-(fLen)}`);
        }
    }""", {
        'views': v,
        'poster': item['poster'],
        'time': item['time'],
        'silent': item['silent'],
        'battery': item['battery'],
        'signal': item['signal'],
        'network': item['network'],
        'interactions': interactions,
        'profileActivity': profile_activity,
        'likes': likes,
        'replies': replies,
        'reached': reached,
        'followersPct': followers_pct,
        'nonfollowersPct': nonfollowers_pct
    })

    page.wait_for_timeout(100)

    # 1. Full Screenshot
    full_name = f"{item['id']}_views_full.png"
    full_path = os.path.join(output_dir, full_name)
    frame_el = page.query_selector('#iphone-phone-frame')
    frame_el.screenshot(path=full_path)
    print(f"Generated full: {full_name}")

    # 2. Natural Cropped Screenshot (below donut)
    full_img = Image.open(full_path)
    w, h = full_img.size
    crop_h = min(h, int(w * crop_style['ratio']))
    cropped_img = full_img.crop((0, 0, w, crop_h))

    cropped_name = f"{item['id']}_views.png"
    cropped_path = os.path.join(output_dir, cropped_name)
    cropped_img.save(cropped_path, format='PNG', optimize=True)
    print(f"       -> Saved natural crop ({w}x{crop_h}): {cropped_name}")

    browser.close()

print(f"\n Shriraj Patil generated successfully in '{output_dir}'!")
