"""
나비 캐릭터 프레임 처리 스크립트
1) 그린 스크린 제거 (크로마키)
2) 그린 스필 보정
3) 아웃라인 추가
4) 통합 bbox 리사이즈 → 350x350 캔버스
"""

import os
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from pathlib import Path

# ─── 설정 ────────────────────────────────────────────────
WORK_DIR = Path(r"C:\Users\User\Desktop\작업 폴더\Dont push button\nabi_work")
OUTPUT_BASE = Path(r"C:\Users\User\Desktop\작업 폴더\Dont push button\nabi")
CANVAS_SIZE = (350, 350)

ANIMATIONS = [
    "excited", "excited2",
    "catears",
    "cry",
    "shocked", "shocked2",
    "smug", "smug2",
    "pouty",
]


# ═══════════════════════════════════════════════════════════
# Step 1: 그린 스크린 제거
# ═══════════════════════════════════════════════════════════

def remove_green_bg(img_pil):
    """크로마키 그린 배경 제거"""
    arr = np.array(img_pil.convert('RGB'), dtype=np.float32)
    h, w = arr.shape[:2]
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]

    # 그린 스크린 판정: G가 R,B보다 확실히 높은 픽셀
    green_excess = g - np.maximum(r, b)
    brightness = np.maximum(np.maximum(r, g), b)

    # 배경 판정 조건
    # 1. 그린이 R,B보다 30 이상 높은 밝은 초록
    is_green_bg = (green_excess > 30) & (g > 80)
    # 2. 순수 초록 비율이 높은 것 (연한 초록도 포함)
    green_ratio = np.where(brightness > 10, green_excess / brightness, 0)
    is_green_bg = is_green_bg | ((green_ratio > 0.15) & (g > 100))

    # 전경 마스크
    fg = ~is_green_bg

    # 소규모 고립 전경 제거 (노이즈)
    fg_lab, fg_n = ndimage.label(fg)
    if fg_n > 0:
        fg_sizes = ndimage.sum(fg, fg_lab, range(1, fg_n + 1))
        largest = np.max(fg_sizes)
        for i in range(1, fg_n + 1):
            if fg_sizes[i - 1] < largest * 0.003:
                fg[fg_lab == i] = False

    # 안티앨리어싱
    alpha = fg.astype(np.float32)
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8), mode='L')
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.8))
    alpha_final = np.array(alpha_img).astype(np.float32) / 255

    result = np.zeros((h, w, 4), dtype=np.uint8)
    result[:, :, :3] = arr.astype(np.uint8)
    result[:, :, 3] = (alpha_final * 255).astype(np.uint8)
    return Image.fromarray(result, 'RGBA')


# ═══════════════════════════════════════════════════════════
# Step 2: 그린 스필 제거
# ═══════════════════════════════════════════════════════════

def fix_green_spill(img_rgba):
    """반투명/엣지 픽셀의 초록색 잔여물 제거"""
    arr = np.array(img_rgba).astype(np.float32)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    green_excess = np.maximum(g - np.maximum(r, b), 0)

    # 반투명 픽셀: G를 max(R,B)까지 낮춤
    semi = (a > 5) & (a < 240)
    arr[:, :, 1][semi] = np.clip(g[semi] - green_excess[semi], 0, 255)

    # 초록 비율이 높은 반투명 픽셀은 알파도 줄임
    green_ratio = np.where(g > 10, green_excess / g, 0)
    very_green_semi = semi & (green_ratio > 0.3)
    arr[:, :, 3][very_green_semi] = np.clip(
        a[very_green_semi] * (1.0 - green_ratio[very_green_semi] * 0.8), 0, 255
    )

    # 불투명 엣지 픽셀: 디스필
    has_content = a > 30
    no_content = ~has_content
    edge_opaque = ndimage.binary_dilation(no_content, iterations=4) & (a >= 240)
    arr[:, :, 1][edge_opaque] = np.clip(
        g[edge_opaque] - green_excess[edge_opaque] * 0.9, 0, 255
    )

    # 전체 visible: 극단적 초록 보정
    visible = arr[:, :, 3] > 10
    g_new = arr[:, :, 1]
    green_excess_new = np.maximum(g_new - np.maximum(r, b), 0)
    extreme = visible & (green_excess_new > 20)
    arr[:, :, 1][extreme] = np.clip(
        g_new[extreme] - green_excess_new[extreme] * 0.8, 0, 255
    )

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')


# ═══════════════════════════════════════════════════════════
# Step 3: 아웃라인 + 눈 구멍 수정
# ═══════════════════════════════════════════════════════════

def fix_eye_holes(frame, max_hole_size=200):
    arr = np.array(frame)
    alpha = arr[:, :, 3]
    binary = alpha > 128
    filled = ndimage.binary_fill_holes(binary)
    holes = filled & ~binary
    if not np.any(holes):
        return frame
    labeled, n = ndimage.label(holes)
    for i in range(1, n + 1):
        mask = labeled == i
        size = int(np.sum(mask))
        if size <= max_hole_size:
            arr[:, :, 3][mask] = 255
            ring = ndimage.binary_dilation(mask, iterations=3) & binary
            if np.any(ring):
                for c in range(3):
                    arr[:, :, c][mask] = int(np.mean(arr[:, :, c][ring]))
    return Image.fromarray(arr, 'RGBA')


def add_outline(sprite):
    alpha = sprite.split()[3]
    smooth = alpha.filter(ImageFilter.GaussianBlur(radius=2.5))
    smooth = smooth.point(lambda x: 255 if x > 60 else 0)
    smooth_arr = np.array(smooth) > 128
    smooth_arr = ndimage.binary_closing(smooth_arr, iterations=3)
    smooth_arr = ndimage.binary_opening(smooth_arr, iterations=1)
    smooth2 = Image.fromarray((smooth_arr * 255).astype(np.uint8), mode='L')
    smooth2 = smooth2.filter(ImageFilter.GaussianBlur(radius=1.5))
    alpha_clean = smooth2.point(lambda x: 255 if x > 128 else 0)

    dilated = alpha_clean
    for _ in range(2):
        dilated = dilated.filter(ImageFilter.MaxFilter(3))
    dilated = dilated.filter(ImageFilter.GaussianBlur(radius=0.7))
    dilated = dilated.point(lambda x: 255 if x > 140 else 0)

    dilated_aa = dilated.filter(ImageFilter.GaussianBlur(radius=1.0))
    alpha_clean_arr = np.array(alpha_clean)
    dilated_aa_arr = np.array(dilated_aa)
    dilated_aa_arr[alpha_clean_arr > 128] = 255

    fade_img = alpha.filter(ImageFilter.GaussianBlur(radius=3.0))
    for _ in range(3):
        fade_img = fade_img.filter(ImageFilter.MaxFilter(3))
    fade_extended = np.array(fade_img).astype(np.float32) / 255.0
    outline_alpha_final = dilated_aa_arr.astype(np.float32) * fade_extended
    outline_alpha = Image.fromarray(
        np.clip(outline_alpha_final, 0, 255).astype(np.uint8), mode='L'
    )

    outline_layer = Image.new('RGBA', sprite.size, (30, 20, 25, 255))
    outline_layer.putalpha(outline_alpha)
    return Image.alpha_composite(outline_layer, sprite)


def get_alpha_bbox(img):
    arr = np.array(img)
    a = arr[:, :, 3]
    rows = np.any(a > 0, axis=1)
    cols = np.any(a > 0, axis=0)
    if not rows.any() or not cols.any():
        return None
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    return [int(cmin), int(rmin), int(cmax) + 1, int(rmax) + 1]


# ═══════════════════════════════════════════════════════════
# 메인
# ═══════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("나비 캐릭터 프레임 처리")
    print(f"작업 폴더: {WORK_DIR}")
    print(f"출력 폴더: {OUTPUT_BASE}")
    print(f"캔버스: {CANVAS_SIZE[0]}x{CANVAS_SIZE[1]}")
    print("=" * 60)

    # ─── Phase 1: 그린 스크린 제거 + 그린 스필 보정 ───
    print("\n[Phase 1] 그린 스크린 제거 + 스필 보정")
    print("-" * 60)

    for anim_name in ANIMATIONS:
        src_dir = WORK_DIR / anim_name
        out_dir = WORK_DIR / f"{anim_name}_processed"

        if not src_dir.is_dir():
            print(f"  [{anim_name}] SKIP - 폴더 없음")
            continue

        frames = sorted(src_dir.glob('frame_*.png'))
        if not frames:
            print(f"  [{anim_name}] SKIP - 프레임 없음")
            continue

        out_dir.mkdir(parents=True, exist_ok=True)
        print(f"  [{anim_name}] {len(frames)} frames...", end=" ", flush=True)

        for fp in frames:
            img = Image.open(str(fp))
            # 그린 스크린 제거
            img = remove_green_bg(img)
            # 그린 스필 제거
            img = fix_green_spill(img)
            img.save(str(out_dir / fp.name), 'PNG')

        print("OK")

    # ─── Phase 2: 아웃라인 + 통합 bbox 리사이즈 ───
    print(f"\n{'─' * 60}")
    print("[Phase 2] 아웃라인 + 통합 bbox 리사이즈")
    print("─" * 60)

    OUTPUT_BASE.mkdir(parents=True, exist_ok=True)

    # Pass 1: 아웃라인 + bbox 수집
    anim_bboxes = {}
    processed_anims = []

    for anim_name in ANIMATIONS:
        processed_dir = WORK_DIR / f"{anim_name}_processed"
        outlined_dir = WORK_DIR / f"{anim_name}_outlined"

        frames = sorted(processed_dir.glob('frame_*.png'))
        if not frames:
            continue

        outlined_dir.mkdir(parents=True, exist_ok=True)
        processed_anims.append(anim_name)

        print(f"\n  [{anim_name}] 아웃라인 ({len(frames)} frames)...", end=" ", flush=True)
        local_bbox = None

        for fp in frames:
            img = Image.open(str(fp)).convert('RGBA')
            img = fix_eye_holes(img)
            result = add_outline(img)
            result.save(str(outlined_dir / fp.name), 'PNG')

            bbox = get_alpha_bbox(result)
            if bbox is not None:
                if local_bbox is None:
                    local_bbox = list(bbox)
                else:
                    local_bbox[0] = min(local_bbox[0], bbox[0])
                    local_bbox[1] = min(local_bbox[1], bbox[1])
                    local_bbox[2] = max(local_bbox[2], bbox[2])
                    local_bbox[3] = max(local_bbox[3], bbox[3])

        if local_bbox is not None:
            anim_bboxes[anim_name] = local_bbox
            bw = local_bbox[2] - local_bbox[0]
            bh = local_bbox[3] - local_bbox[1]
            print(f"bbox: {bw}x{bh}")

    # 통합 bbox
    unified_bbox = None
    for bbox in anim_bboxes.values():
        if unified_bbox is None:
            unified_bbox = list(bbox)
        else:
            unified_bbox[0] = min(unified_bbox[0], bbox[0])
            unified_bbox[1] = min(unified_bbox[1], bbox[1])
            unified_bbox[2] = max(unified_bbox[2], bbox[2])
            unified_bbox[3] = max(unified_bbox[3], bbox[3])

    if unified_bbox is None:
        print("처리할 프레임 없음!")
        return

    uw = unified_bbox[2] - unified_bbox[0]
    uh = unified_bbox[3] - unified_bbox[1]
    print(f"\n  통합 bbox: {unified_bbox} ({uw}x{uh})")

    # Pass 2: 리사이즈 + 저장
    tw, th = CANVAS_SIZE
    scale = min(tw / uw, th / uh)
    new_w = int(uw * scale)
    new_h = int(uh * scale)
    ox = (tw - new_w) // 2
    oy = (th - new_h) // 2
    print(f"  scale: {scale:.4f}, size: {new_w}x{new_h}, offset: ({ox},{oy})")

    total = 0
    for anim_name in processed_anims:
        outlined_dir = WORK_DIR / f"{anim_name}_outlined"
        out_dir = OUTPUT_BASE / anim_name
        out_dir.mkdir(parents=True, exist_ok=True)

        frames = sorted(outlined_dir.glob('frame_*.png'))
        for i, fp in enumerate(frames):
            img = Image.open(str(fp)).convert('RGBA')
            cropped = img.crop(unified_bbox)
            resized = cropped.resize((new_w, new_h), Image.LANCZOS)
            canvas = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
            canvas.paste(resized, (ox, oy))
            canvas.save(str(out_dir / f"frame_{i + 1:04d}.png"), "PNG")

        print(f"  [{anim_name}] -> {len(frames)} frames")
        total += len(frames)

    print(f"\n{'=' * 60}")
    print(f"총 {total} frames 완료")
    print(f"출력 경로: {OUTPUT_BASE}")
    print("=" * 60)


if __name__ == "__main__":
    main()
