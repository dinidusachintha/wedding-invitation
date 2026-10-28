from PIL import Image
import numpy as np

def main():
    img = Image.open("public/images/floral_header_garland.jpg").convert("RGB")
    w, h = img.size
    arr = np.array(img, dtype=np.float32)

    # Average ivory background color
    bg = arr[650:750, 200:1100, :3].mean(axis=(0,1))
    print("Background color:", bg)

    diff = np.sqrt(np.sum((arr[:, :, :3] - bg) ** 2, axis=2))
    
    # Check max difference in each row from bottom up
    lowest_flower_y = 0
    for y in range(h - 1, 0, -1):
        # A leaf/flower pixel will have diff > 25
        if np.sum(diff[y] > 25.0) > 5:
            lowest_flower_y = y
            break
            
    print("Lowest flower/leaf row:", lowest_flower_y)

    # Crop to just below the lowest leaf (e.g. + 40px)
    crop_bottom = min(h, lowest_flower_y + 40)
    cropped = arr[:crop_bottom, :, :].copy()
    diff_cropped = diff[:crop_bottom, :]

    # Alpha channel:
    # Any pixel with diff <= 12 is transparent
    # Above 28 is opaque
    # Smooth transition in between
    alpha = np.clip((diff_cropped - 10.0) / 18.0, 0.0, 1.0)

    # Also feather the bottom 30px so tips of leaves blend gently
    for y in range(crop_bottom - 30, crop_bottom):
        f = (crop_bottom - y) / 30.0
        alpha[y, :] *= f

    rgba = np.dstack([cropped, alpha * 255.0])
    
    out_img = Image.fromarray(rgba.astype(np.uint8))
    out_img.save("public/images/floral_garland_transparent.png", "PNG")
    print(f"Successfully saved floral_garland_transparent.png with size {w}x{crop_bottom}!")

if __name__ == "__main__":
    main()
