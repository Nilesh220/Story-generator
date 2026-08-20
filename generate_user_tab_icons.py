import os
import numpy as np
from PIL import Image

fnames = {
    'trash': 'media_1787230147661.png',
    'viewers': 'media_1787230147673.png',
    'boost': 'media_1787230147694.png'
}

base = r'C:\Users\LENOVO\.gemini\antigravity-ide\brain\186c8fc8-a580-43d5-a64c-b06b006a6ff7\.user_uploaded'
out_dir = r'c:\Users\LENOVO\OneDrive\Desktop\New folder\assets'

for name, fname in fnames.items():
    p = os.path.join(base, fname)
    im = Image.open(p).convert('RGBA')
    arr = np.array(im)
    
    # Calculate brightness
    gray = (0.299 * arr[:,:,0] + 0.587 * arr[:,:,1] + 0.114 * arr[:,:,2]).astype(np.float32)
    # Normalize alpha based on brightness
    alpha = np.clip((gray - 30) / (255 - 30) * 255, 0, 255).astype(np.uint8)
    
    # 1. White version (for dark mode)
    white_arr = np.zeros_like(arr)
    white_arr[:,:,0] = 255
    white_arr[:,:,1] = 255
    white_arr[:,:,2] = 255
    white_arr[:,:,3] = alpha
    white_im = Image.fromarray(white_arr)
    bbox_w = white_im.getbbox()
    if bbox_w:
        white_cropped = white_im.crop(bbox_w)
        white_cropped.save(os.path.join(out_dir, f'user_icon_{name}_white.png'))
        print(f'Saved user_icon_{name}_white.png {white_cropped.size}')
        
    # 2. Black / Charcoal #262626 version (for light mode)
    black_arr = np.zeros_like(arr)
    black_arr[:,:,0] = 38
    black_arr[:,:,1] = 38
    black_arr[:,:,2] = 38
    black_arr[:,:,3] = alpha
    black_im = Image.fromarray(black_arr)
    bbox_b = black_im.getbbox()
    if bbox_b:
        black_cropped = black_im.crop(bbox_b)
        black_cropped.save(os.path.join(out_dir, f'user_icon_{name}_black.png'))
        print(f'Saved user_icon_{name}_black.png {black_cropped.size}')
