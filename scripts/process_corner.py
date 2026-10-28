from PIL import Image
import numpy as np
import shutil

src_path = r"C:\Users\user\.gemini\antigravity-ide\brain\28629e8b-9888-49b8-a71e-34b316bffa90\green_gold_corner_1793117545205.jpg"
img = Image.open(src_path).convert("RGB")
arr = np.array(img, dtype=np.float32)

# Sample white background color in the lower left (x=100, y=800)
bg = arr[750:950, 100:300, :3].mean(axis=(0,1))
print("Corner bg color:", bg)

diff = np.sqrt(np.sum((arr[:, :, :3] - bg) ** 2, axis=2))
alpha = np.clip((diff - 6.0) / 20.0, 0.0, 1.0)

rgba = np.dstack([arr, alpha * 255.0])
out_img = Image.fromarray(rgba.astype(np.uint8))
out_img.save("public/images/green_gold_corner.png", "PNG")
print("Saved public/images/green_gold_corner.png successfully!")
