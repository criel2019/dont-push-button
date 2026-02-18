"""
Generate WebP sprite sheets for Nabi character animations.

24 frames each (sampled every 6th from 145),
160x256 frame size, 6x4 grid = 960x1024 sprite sheet.
Unified bounding box across all emotions for consistent positioning.
"""

from pathlib import Path
from PIL import Image
import sys

BASE = Path(__file__).parent / "nabi"
OUT = BASE / "sprites"

# Emotion name -> source folder
EMOTIONS = {
    # 기존
    "idle":      "smug2",
    "excited":   "excited",
    "pouty":     "pouty",
    "shocked":   "shocked",
    "smug":      "smug",
    "cry":       "cry",
    "catears":   "catears",
    # 기존 미생성 변형
    "excited2":  "excited2",
    "shocked2":  "shocked2",
    "smug2":     "smug2",
    # 신규
    "yandere":   "yandere",
    "teasing":   "teasing",
    "teasing2":  "teasing2",
    "shy":       "shy",
    "shy2":      "shy2",
    "shy3":      "shy3",
    "bored":     "bored",
    "shush":     "shush",
    "peace":     "peace",
    "happy":     "happy",
    "confident": "confident",
    "worried":   "worried",
    "angry":     "angry",
}

TOTAL_FRAMES = 145
SAMPLE_COUNT = 24
SAMPLE_STEP = TOTAL_FRAMES // SAMPLE_COUNT  # 6

FRAME_W = 160
FRAME_H = 256
COLS = 6
ROWS = 4
SHEET_W = FRAME_W * COLS   # 960
SHEET_H = FRAME_H * ROWS   # 1024
WEBP_QUALITY = 80


def get_sample_indices():
    """Return 0-based frame indices to sample (every 6th frame)."""
    return [i * SAMPLE_STEP for i in range(SAMPLE_COUNT)]


def find_unified_bbox():
    """Find the tightest bounding box that contains all non-transparent pixels
    across ALL frames of ALL emotions."""
    global_bbox = None  # (min_x, min_y, max_x, max_y)
    sample_indices = get_sample_indices()

    for emo, folder in EMOTIONS.items():
        src = BASE / folder
        for idx in sample_indices:
            fname = src / f"frame_{idx+1:04d}.png"
            if not fname.exists():
                print(f"  WARNING: {fname} not found, skipping")
                continue
            img = Image.open(fname)
            bbox = img.getbbox()
            if bbox is None:
                continue
            if global_bbox is None:
                global_bbox = bbox
            else:
                global_bbox = (
                    min(global_bbox[0], bbox[0]),
                    min(global_bbox[1], bbox[1]),
                    max(global_bbox[2], bbox[2]),
                    max(global_bbox[3], bbox[3]),
                )

    print(f"Unified bbox: {global_bbox}")
    return global_bbox


def crop_and_fit(img, bbox):
    """Crop image to unified bbox, then resize to fit within FRAME_W x FRAME_H
    maintaining aspect ratio, centered on transparent background."""
    cropped = img.crop(bbox)
    cw, ch = cropped.size

    # Scale to fit within FRAME_W x FRAME_H
    scale = min(FRAME_W / cw, FRAME_H / ch)
    new_w = int(cw * scale)
    new_h = int(ch * scale)
    resized = cropped.resize((new_w, new_h), Image.LANCZOS)

    # Center on transparent canvas
    canvas = Image.new("RGBA", (FRAME_W, FRAME_H), (0, 0, 0, 0))
    ox = (FRAME_W - new_w) // 2
    oy = (FRAME_H - new_h) // 2
    canvas.paste(resized, (ox, oy))
    return canvas


def generate_sprite_sheet(emotion, folder, bbox):
    """Generate a single sprite sheet for one emotion."""
    src = BASE / folder
    sample_indices = get_sample_indices()

    sheet = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 0, 0, 0))

    for i, idx in enumerate(sample_indices):
        fname = src / f"frame_{idx+1:04d}.png"
        if not fname.exists():
            print(f"  WARNING: {fname} not found")
            continue

        img = Image.open(fname)
        frame = crop_and_fit(img, bbox)

        col = i % COLS
        row = i // COLS
        sheet.paste(frame, (col * FRAME_W, row * FRAME_H))

    out_path = OUT / f"{emotion}.webp"
    sheet.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)
    size_kb = out_path.stat().st_size / 1024
    print(f"  {emotion}.webp: {size_kb:.1f} KB")
    return out_path


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    print("Finding unified bounding box...")
    bbox = find_unified_bbox()
    if bbox is None:
        print("ERROR: No non-transparent pixels found!")
        sys.exit(1)

    print(f"\nGenerating sprite sheets ({SAMPLE_COUNT} frames, {FRAME_W}x{FRAME_H}, {COLS}x{ROWS} grid)...")
    total_size = 0
    for emotion, folder in EMOTIONS.items():
        path = generate_sprite_sheet(emotion, folder, bbox)
        total_size += path.stat().st_size

    print(f"\nTotal: {total_size/1024:.1f} KB ({total_size/1024/1024:.2f} MB)")
    print("Done!")


if __name__ == "__main__":
    main()
