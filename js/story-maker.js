// ==========================================================================
// INSTAGRAM STORY MAKER - CLIENT LOGIC (iOS Pixel-Perfect)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initStoryMaker();
});

function initStoryMaker() {
  // Mode Switcher Elements
  const btnModeViews = document.getElementById('btn-mode-views');
  const btnModeStory = document.getElementById('btn-mode-story');
  const viewModeContainer = document.getElementById('workspace-views-generator');
  const storyModeContainer = document.getElementById('workspace-story-maker');
  const presetsViewsBanner = document.getElementById('presets-views-banner');
  const presetsStoryBanner = document.getElementById('presets-story-banner');

  if (btnModeViews && btnModeStory) {
    btnModeViews.addEventListener('click', () => {
      btnModeViews.classList.add('active');
      btnModeStory.classList.remove('active');
      if (viewModeContainer) viewModeContainer.classList.add('active-mode');
      if (storyModeContainer) storyModeContainer.classList.remove('active-mode');
      if (presetsViewsBanner) presetsViewsBanner.style.display = 'block';
      if (presetsStoryBanner) presetsStoryBanner.style.display = 'none';
    });

    btnModeStory.addEventListener('click', () => {
      btnModeStory.classList.add('active');
      btnModeViews.classList.remove('active');
      if (storyModeContainer) storyModeContainer.classList.add('active-mode');
      if (viewModeContainer) viewModeContainer.classList.remove('active-mode');
      if (presetsStoryBanner) presetsStoryBanner.style.display = 'block';
      if (presetsViewsBanner) presetsViewsBanner.style.display = 'none';
    });
  }

  // Story Elements
  const storyBgImg = document.getElementById('story-bg-img');
  const storyCaption = document.getElementById('story-caption-display');
  const storyFloatingTag = document.getElementById('story-floating-tag-display');
  const storyTimeElapsed = document.getElementById('story-time-elapsed-display');
  const storyAudioTicker = document.getElementById('story-audio-ticker-display');
  const storyAudioTitle = document.getElementById('story-audio-title-display');
  const storySaySomething = document.getElementById('story-say-something-container');
  const storyReactions = document.getElementById('story-reactions-display');

  // iOS Status Bar
  const smTime = document.getElementById('sm-status-time');
  const smBatteryLevel = document.getElementById('sm-status-battery-level');

  // Controls
  const inputCaption = document.getElementById('sm-input-caption');
  const togglePillBackdrop = document.getElementById('sm-toggle-pill-backdrop');
  const inputFloatingTag = document.getElementById('sm-input-floating-tag');
  const inputTimeElapsed = document.getElementById('sm-input-time-elapsed');
  const inputCaptionY = document.getElementById('sm-input-caption-y');
  const valCaptionY = document.getElementById('sm-val-caption-y');
  const toggleMusic = document.getElementById('sm-toggle-music');
  const inputMusicTitle = document.getElementById('sm-input-music-title');
  const toggleReactions = document.getElementById('sm-toggle-reactions');
  const toggleSaySomething = document.getElementById('sm-toggle-say-something');
  const inputBgUpload = document.getElementById('sm-input-bg-upload');

  // Status Controls
  const inputSmTime = document.getElementById('sm-input-time');
  const inputSmBattery = document.getElementById('sm-input-battery');

  // Safe Zone Buttons
  const btnSafeTop = document.getElementById('btn-safe-top');
  const btnSafeUpper = document.getElementById('btn-safe-upper');
  const btnSafeCenter = document.getElementById('btn-safe-center');

  if (btnSafeTop) {
    btnSafeTop.addEventListener('click', () => {
      if (inputCaptionY) {
        inputCaptionY.value = 120;
        updateStoryCanvas();
      }
    });
  }
  if (btnSafeUpper) {
    btnSafeUpper.addEventListener('click', () => {
      if (inputCaptionY) {
        inputCaptionY.value = 200;
        updateStoryCanvas();
      }
    });
  }
  if (btnSafeCenter) {
    btnSafeCenter.addEventListener('click', () => {
      if (inputCaptionY) {
        inputCaptionY.value = 320;
        updateStoryCanvas();
      }
    });
  }

  // Quick Sample Photo Buttons
  const btnSampleDisco = document.getElementById('btn-sample-disco');
  const btnSampleStore = document.getElementById('btn-sample-store');
  const btnSampleWalkin1 = document.getElementById('btn-sample-walkin1');

  if (btnSampleDisco && storyBgImg) {
    btnSampleDisco.addEventListener('click', () => {
      storyBgImg.src = 'assets/sample_story_disco.jpg';
    });
  }
  if (btnSampleStore && storyBgImg) {
    btnSampleStore.addEventListener('click', () => {
      storyBgImg.src = 'assets/sample_story_store.jpg';
    });
  }
  if (btnSampleWalkin1 && storyBgImg) {
    btnSampleWalkin1.addEventListener('click', () => {
      storyBgImg.src = 'scratch/trimmed_walkin_stories/001_Creators__sakshi_kalamnurikar__9359387935.jpg';
    });
  }

  // Avatar & Author Elements
  const authorAvatarImg = document.getElementById('sm-author-avatar-img');
  const avatarPreviewThumb = document.getElementById('sm-avatar-preview-thumb');
  const avatarPlusBadge = document.getElementById('sm-avatar-plus-badge');
  const authorNameDisplay = document.getElementById('sm-author-name-display');

  const inputAvatarUpload = document.getElementById('sm-input-avatar-upload');
  const inputAuthorName = document.getElementById('sm-input-author-name');
  const selectPlusBadge = document.getElementById('sm-select-plus-badge');

  const btnAvatarReliance = document.getElementById('btn-avatar-reliance');
  const btnAvatarVigor = document.getElementById('btn-avatar-vigor');
  const btnAvatarUser = document.getElementById('btn-avatar-user');

  // Avatar Upload Listener
  if (inputAvatarUpload) {
    inputAvatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (authorAvatarImg) authorAvatarImg.src = evt.target.result;
          if (avatarPreviewThumb) avatarPreviewThumb.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Quick Avatar Buttons
  if (btnAvatarReliance) {
    btnAvatarReliance.addEventListener('click', () => {
      const src = 'assets/reliance_digital_story.png';
      if (authorAvatarImg) authorAvatarImg.src = src;
      if (avatarPreviewThumb) avatarPreviewThumb.src = src;
      if (inputAuthorName) {
        inputAuthorName.value = 'reliance_digital';
        updateStoryCanvas();
      }
    });
  }
  if (btnAvatarVigor) {
    btnAvatarVigor.addEventListener('click', () => {
      const src = 'assets/verified.png';
      if (authorAvatarImg) authorAvatarImg.src = src;
      if (avatarPreviewThumb) avatarPreviewThumb.src = src;
      if (inputAuthorName) {
        inputAuthorName.value = 'vigorspace';
        updateStoryCanvas();
      }
    });
  }
  if (btnAvatarUser) {
    btnAvatarUser.addEventListener('click', () => {
      const src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><circle cx='40' cy='40' r='40' fill='%232a2f45'/><circle cx='40' cy='30' r='14' fill='%2394a3b8'/><path d='M16 68c0-13.255 10.745-24 24-24s24 10.745 24 24' fill='%2394a3b8'/></svg>";
      if (authorAvatarImg) authorAvatarImg.src = src;
      if (avatarPreviewThumb) avatarPreviewThumb.src = src;
      if (inputAuthorName) {
        inputAuthorName.value = 'Your story';
        updateStoryCanvas();
      }
    });
  }

  // Helper to format @mentions with <u> underline
  function formatMentions(text) {
    if (!text) return '';
    return text.replace(/(@[a-zA-Z0-9_]+)/g, '<u>$1</u>');
  }

  // Update Story Canvas
  function updateStoryCanvas() {
    if (authorNameDisplay && inputAuthorName) {
      authorNameDisplay.textContent = inputAuthorName.value || 'Your story';
    }
    if (avatarPlusBadge && selectPlusBadge) {
      avatarPlusBadge.style.display = selectPlusBadge.value === 'show' ? 'flex' : 'none';
    }
    if (storyCaption && inputCaption) {
      storyCaption.innerHTML = formatMentions(inputCaption.value).replace(/\n/g, '<br>');
    }
    if (storyCaption && togglePillBackdrop) {
      if (togglePillBackdrop.checked) {
        storyCaption.classList.add('pill-backdrop');
      } else {
        storyCaption.classList.remove('pill-backdrop');
      }
    }
    if (storyCaption && inputCaptionY) {
      storyCaption.style.top = inputCaptionY.value + 'px';
      if (valCaptionY) valCaptionY.textContent = inputCaptionY.value + 'px';
    }
    if (storyFloatingTag && inputFloatingTag) {
      if (inputFloatingTag.value.trim()) {
        storyFloatingTag.style.display = 'block';
        storyFloatingTag.innerHTML = formatMentions(inputFloatingTag.value);
      } else {
        storyFloatingTag.style.display = 'none';
      }
    }
    if (storyTimeElapsed && inputTimeElapsed) {
      storyTimeElapsed.textContent = inputTimeElapsed.value;
    }
    if (storyAudioTicker && toggleMusic) {
      storyAudioTicker.style.display = toggleMusic.checked ? 'flex' : 'none';
      if (storyAudioTitle && inputMusicTitle) {
        storyAudioTitle.textContent = inputMusicTitle.value;
      }
    }
    if (storyReactions && toggleReactions) {
      storyReactions.style.display = toggleReactions.checked ? 'flex' : 'none';
    }
    if (storySaySomething && toggleSaySomething) {
      storySaySomething.style.display = toggleSaySomething.checked ? 'block' : 'none';
    }

    // iOS Status Bar
    if (smTime && inputSmTime) smTime.textContent = inputSmTime.value;
    if (smBatteryLevel && inputSmBattery) smBatteryLevel.style.width = inputSmBattery.value + '%';
  }

  // Event Listeners
  if (inputAuthorName) inputAuthorName.addEventListener('input', updateStoryCanvas);
  if (selectPlusBadge) selectPlusBadge.addEventListener('change', updateStoryCanvas);
  if (inputCaption) inputCaption.addEventListener('input', updateStoryCanvas);
  if (togglePillBackdrop) togglePillBackdrop.addEventListener('change', updateStoryCanvas);
  if (inputFloatingTag) inputFloatingTag.addEventListener('input', updateStoryCanvas);
  if (inputTimeElapsed) inputTimeElapsed.addEventListener('input', updateStoryCanvas);
  if (inputCaptionY) inputCaptionY.addEventListener('input', updateStoryCanvas);
  if (toggleMusic) toggleMusic.addEventListener('change', updateStoryCanvas);
  if (inputMusicTitle) inputMusicTitle.addEventListener('input', updateStoryCanvas);
  if (toggleReactions) toggleReactions.addEventListener('change', updateStoryCanvas);
  if (toggleSaySomething) toggleSaySomething.addEventListener('change', updateStoryCanvas);

  if (inputSmTime) inputSmTime.addEventListener('input', updateStoryCanvas);
  if (inputSmBattery) inputSmBattery.addEventListener('input', updateStoryCanvas);

  // Background Image Upload
  if (inputBgUpload && storyBgImg) {
    inputBgUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          storyBgImg.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Story Presets
  const storyPresets = {
    disco: {
      caption: "Have you spotted DISCO yet? 👀🔥\nYour nearest @reliance_digital is calling!",
      tag: "@vigorspace",
      timeElapsed: "12h",
      music: true,
      musicTitle: "The Desperados · Let's Have Some Fun Alt",
      bgUrl: "assets/sample_story_disco.jpg",
      statusTime: "11:04",
      battery: 73,
      captionY: 130,
      pillBackdrop: false
    },
    sale: {
      caption: "Massive sale happening at\n@reliance_digital",
      tag: "",
      timeElapsed: "7h",
      music: false,
      musicTitle: "",
      bgUrl: "assets/sample_story_store.jpg",
      statusTime: "11:04",
      battery: 73,
      captionY: 120,
      pillBackdrop: false
    },
    walkin: {
      caption: "Check out the latest tech lineup at\n@reliance_digital @vigorspace",
      tag: "@vigorlaunchpad",
      timeElapsed: "3h",
      music: true,
      musicTitle: "Trending Audio · Original Sound",
      bgUrl: "scratch/trimmed_walkin_stories/001_Creators__sakshi_kalamnurikar__9359387935.jpg",
      statusTime: "02:54",
      battery: 85,
      captionY: 140,
      pillBackdrop: true
    }
  };

  document.querySelectorAll('[data-story-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-story-preset]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.storyPreset;
      const p = storyPresets[presetKey];
      if (p) {
        if (inputCaption) inputCaption.value = p.caption;
        if (inputFloatingTag) inputFloatingTag.value = p.tag;
        if (inputTimeElapsed) inputTimeElapsed.value = p.timeElapsed;
        if (toggleMusic) toggleMusic.checked = p.music;
        if (inputMusicTitle) inputMusicTitle.value = p.musicTitle;
        if (storyBgImg && p.bgUrl) storyBgImg.src = p.bgUrl;
        if (inputSmTime) inputSmTime.value = p.statusTime;
        if (inputSmBattery) inputSmBattery.value = p.battery;
        if (inputCaptionY) inputCaptionY.value = p.captionY || 130;
        if (togglePillBackdrop) togglePillBackdrop.checked = !!p.pillBackdrop;
        updateStoryCanvas();
      }
    });
  });

  // Download Story Screenshot
  const btnDownloadStory = document.getElementById('btn-download-story-png');
  const storyFrame = document.getElementById('story-maker-phone-frame');

  if (btnDownloadStory && storyFrame) {
    btnDownloadStory.addEventListener('click', async () => {
      btnDownloadStory.textContent = '⏳ Rendering...';
      btnDownloadStory.disabled = true;
      try {
        if (window.html2canvas) {
          const canvas = await html2canvas(storyFrame, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null
          });
          const link = document.createElement('a');
          link.download = `instagram_story_${Date.now()}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      } catch (err) {
        console.error("Story capture error:", err);
      } finally {
        btnDownloadStory.textContent = '📥 Download Story Screenshot (HD)';
        btnDownloadStory.disabled = false;
      }
    });
  }

  // Initial call
  updateStoryCanvas();
}
