#!/usr/bin/env python3
"""
Local two-view reconstruction of the clay bust (front + 90-degree side view).

This is NOT a neural image-to-3D model. It is a classic shape-from-silhouette
workflow that stays faithful to the two reference images:

  1. Both views are warped to a shared vertical scale using facial landmarks
     (hair top, eyes, mouth, chin, bust base), so row y means the same thing
     in the front and the side picture.
  2. For every row, the front silhouette gives the width and the side
     silhouette gives the depth (nose tip, lips, chin, back of the hair, ...).
  3. Each row's cross-section is a superellipse fitted in that width x depth
     box; the stack of rows is meshed with marching cubes and exported as GLB.
  4. The two clay photographs are saved as "tone" textures. The web app
     projects them back onto the particles, which carries the real facial
     detail and hair curls that a silhouette hull cannot contain.

Usage:  python3 tools/reconstruct.py
Needs:  numpy scipy opencv-python scikit-image trimesh
"""
import json
import pathlib

import cv2
import numpy as np
import trimesh
from scipy import ndimage as ndi
from skimage import measure

ROOT = pathlib.Path(__file__).resolve().parent.parent
FRONT = ROOT / "assets" / "front-view.png"
SIDE = ROOT / "assets" / "side-view.png"
OUT_GLB = ROOT / "public" / "models" / "my-portrait.glb"
OUT_META = ROOT / "src" / "data" / "portrait-meta.json"
OUT_FRONT_TONE = ROOT / "public" / "textures" / "front-tone.jpg"
OUT_SIDE_TONE = ROOT / "public" / "textures" / "side-tone.jpg"

N = 1280            # canonical rows: hair top -> bust base
WORLD_H = 2.0       # bust height in world units
THRESH = 240        # background is ~253, clay is darker
EXPONENT_FRONT = 2.5  # superellipse exponent on the face side (squarer = flatter face)
EXPONENT_BACK = 2.3
VOXELS_Y = 230         # voxel rows if the whole bust were meshed (sets the grid step)
HEAD_ONLY = True       # export only the head + a short neck (no shoulders / clothing)
NECK_BELOW_CHIN = 0.07 # world units of neck kept below the chin

# Landmark rows (source pixels) measured on the two reference images:
#            top  eyes mouth chin bottom
FRONT_KNOTS = [92, 402, 575, 693, 1377]
SIDE_KNOTS = [29, 350, 525, 645, 1281]
# Where the same landmarks sit in the canonical image: the average fraction
# of the two views, so neither picture is distorted more than necessary.
frac_f = (np.array(FRONT_KNOTS) - FRONT_KNOTS[0]) / (FRONT_KNOTS[-1] - FRONT_KNOTS[0])
frac_s = (np.array(SIDE_KNOTS) - SIDE_KNOTS[0]) / (SIDE_KNOTS[-1] - SIDE_KNOTS[0])
CANON_ROWS = ((frac_f + frac_s) / 2.0) * (N - 1)

# Reference points for the world origin: ear canal column / ear row on the side view.
SIDE_EAR_COL = 655
SIDE_EAR_ROW = 430


def canonicalize(gray, knots, ear_row=None, ear_col=None):
    """Warp rows piecewise-linearly onto the canonical scale and rescale columns
    by the same average factor, so one canonical pixel is the same size in X, Y, Z."""
    h, w = gray.shape
    k = (knots[-1] - knots[0]) / (N - 1)  # source px per canonical px (average)
    wc = int(round(w / k))
    ys = np.arange(N, dtype=np.float32)
    src_rows = np.interp(ys, CANON_ROWS, knots).astype(np.float32)
    xs = (np.arange(wc, dtype=np.float32) * k)
    map_x = np.tile(xs[None, :], (N, 1))
    map_y = np.tile(src_rows[:, None], (1, wc))
    out = cv2.remap(gray, map_x, map_y, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    extra = {}
    if ear_row is not None:
        extra["ear_row"] = float(np.interp(ear_row, knots, CANON_ROWS))
    if ear_col is not None:
        extra["ear_col"] = ear_col / k
    return out, extra


def silhouette(gray):
    m = gray < THRESH
    m = ndi.binary_opening(m, iterations=1)
    lab, n = ndi.label(m)
    sizes = ndi.sum(m, lab, range(1, n + 1))
    m = lab == (1 + int(np.argmax(sizes)))
    return ndi.binary_fill_holes(m)


def row_extents(mask, sigma=3.0):
    """Leftmost/rightmost foreground column per row, lightly smoothed so hair
    wisps do not make the hull jittery."""
    n, w = mask.shape
    lo = np.zeros(n)
    hi = np.zeros(n)
    for r in range(n):
        cols = np.flatnonzero(mask[r])
        if cols.size:
            lo[r], hi[r] = cols[0], cols[-1] + 1
        else:
            lo[r] = hi[r] = np.nan
    idx = np.arange(n)
    ok = ~np.isnan(lo)
    lo = np.interp(idx, idx[ok], lo[ok])
    hi = np.interp(idx, idx[ok], hi[ok])
    lo = ndi.median_filter(lo, size=9, mode="nearest")
    hi = ndi.median_filter(hi, size=9, mode="nearest")
    return ndi.gaussian_filter1d(lo, sigma, mode="nearest"), ndi.gaussian_filter1d(hi, sigma, mode="nearest")


def fill_background(gray, mask):
    """Replace background pixels with the nearest clay pixel so projecting a
    particle that lands on the silhouette edge never samples white."""
    wide = ndi.binary_dilation(mask, iterations=2)
    _, (iy, ix) = ndi.distance_transform_edt(~wide, return_indices=True)
    return gray[iy, ix]


def main():
    f_raw = cv2.imread(str(FRONT), cv2.IMREAD_GRAYSCALE)
    s_raw = cv2.imread(str(SIDE), cv2.IMREAD_GRAYSCALE)
    f, _ = canonicalize(f_raw, FRONT_KNOTS)
    s, ex = canonicalize(s_raw, SIDE_KNOTS, SIDE_EAR_ROW, SIDE_EAR_COL)

    fm, sm = silhouette(f), silhouette(s)
    f_lo, f_hi = row_extents(fm)
    s_lo, s_hi = row_extents(sm)

    # ---- world frame ------------------------------------------------------
    px = WORLD_H / (N - 1)                      # world units per canonical pixel
    ear_row = ex["ear_row"]
    ear_col = ex["ear_col"]
    x_center_px = (f_lo[: int(N * 0.55)].min() + f_hi[: int(N * 0.55)].max()) / 2.0  # head/bust axis

    def world_y(row):  return (ear_row - row) * px
    def world_x(col):  return (col - x_center_px) * px
    def world_z(col):  return (ear_col - col) * px   # +z = towards the face / camera

    # ---- voxel field ------------------------------------------------------
    chin_row = CANON_ROWS[3]
    last_row = min(N - 1, chin_row + NECK_BELOW_CHIN / px) if HEAD_ONLY else N - 1
    n_rows = int(round(VOXELS_Y * (last_row - 7) / (N - 1 - 7)))
    rows = np.linspace(7, last_row, n_rows)  # skip the sliver of rows at the very top
    cx = (f_lo + f_hi) / 2.0
    ax = (f_hi - f_lo) / 2.0
    cz = (s_lo + s_hi) / 2.0
    bz = (s_hi - s_lo) / 2.0

    x_min, x_max = world_x(f_lo.min()) - 0.05, world_x(f_hi.max()) + 0.05
    z_min, z_max = world_z(s_hi.max()) - 0.05, world_z(s_lo.min()) + 0.05
    step = (WORLD_H) / (VOXELS_Y - 1)
    xs = np.arange(x_min, x_max, step)
    zs = np.arange(z_min, z_max, step)
    field = np.full((len(xs), n_rows, len(zs)), -1.0, dtype=np.float32)

    X = xs[:, None]
    Z = zs[None, :]
    for j, r in enumerate(rows):
        ri = int(round(r))
        a = max(ax[ri] * px, 1e-3)
        b = max(bz[ri] * px, 1e-3)
        u = (X - world_x(cx[ri])) / a
        v = (Z - world_z(cz[ri])) / b          # v > 0 -> towards the face
        n = np.where(v > 0, EXPONENT_FRONT, EXPONENT_BACK)
        d = (np.abs(u) ** n + np.abs(v) ** n) ** (1.0 / n)
        field[:, j, :] = (1.0 - d).astype(np.float32)

    # row index 0 is the top of the head -> flip so +y is up in the array
    field = field[:, ::-1, :]
    ys = np.array([world_y(r) for r in rows])[::-1]
    field = ndi.gaussian_filter(field, sigma=(0.8, 1.2, 0.8))
    # close the base: pad one empty slice below so marching cubes caps the bust
    field = np.pad(field, ((1, 1), (1, 1), (1, 1)), constant_values=-1.0)

    dy = (ys[-1] - ys[0]) / (n_rows - 1)
    verts, faces, normals, _ = measure.marching_cubes(field, level=0.0, spacing=(step, dy, step))
    verts[:, 0] += x_min - step
    verts[:, 1] += ys[0] - dy
    verts[:, 2] += z_min - step
    # marching_cubes returns normals pointing towards decreasing field -> outward
    normals = -normals if np.mean(np.einsum("ij,ij->i", verts - verts.mean(0), normals)) < 0 else normals

    mesh = trimesh.Trimesh(vertices=verts, faces=faces, vertex_normals=normals, process=False)
    mesh.visual = trimesh.visual.ColorVisuals(mesh=mesh, vertex_colors=np.tile([200, 200, 200, 255], (len(verts), 1)))
    OUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    mesh.export(OUT_GLB)

    # ---- tone textures + mapping metadata ---------------------------------
    f_tone = fill_background(f, fm)
    s_tone = fill_background(s, sm)
    y_top, y_bot = world_y(0), world_y(N - 1)
    y_cut = world_y(last_row)
    y_chin = world_y(chin_row)

    fx0, fx1 = int(np.floor(f_lo.min())) - 4, int(np.ceil(f_hi.max())) + 4
    sx0, sx1 = int(np.floor(s_lo.min())) - 4, int(np.ceil(s_hi.max())) + 4
    f_img = f_tone[:, fx0:fx1]
    s_img = s_tone[:, sx0:sx1]
    # Downscale for the web, keep enough detail for the curls.
    def save(img, path, max_w=900):
        h, w = img.shape
        if w > max_w:
            img = cv2.resize(img, (max_w, int(h * max_w / w)), interpolation=cv2.INTER_AREA)
        path.parent.mkdir(parents=True, exist_ok=True)
        cv2.imwrite(str(path), img, [cv2.IMWRITE_JPEG_QUALITY, 90])
    save(f_img, OUT_FRONT_TONE)
    save(s_img, OUT_SIDE_TONE)

    meta = {
        "yTop": float(y_top), "yBottom": float(y_bot),
        # head-only export: the mesh ends at yCut; particles fade out from yFade to yCut
        "yCut": float(y_cut), "yChin": float(y_chin),
        "headOnly": bool(HEAD_ONLY),
        "front": {"xMin": float(world_x(fx0)), "xMax": float(world_x(fx1))},
        # side image: column increases towards the BACK of the head, so z decreases
        "side": {"zNear": float(world_z(sx0)), "zFar": float(world_z(sx1))},
        "bounds": {
            "x": [float(xs[0]), float(xs[-1])],
            "y": [float(min(ys[0], ys[-1])), float(max(ys[0], ys[-1]))],
            "z": [float(zs[0]), float(zs[-1])],
        },
        "vertices": int(len(verts)), "triangles": int(len(faces)),
    }
    OUT_META.parent.mkdir(parents=True, exist_ok=True)
    OUT_META.write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta, indent=2))
    print("GLB:", OUT_GLB, f"{OUT_GLB.stat().st_size/1e6:.2f} MB")

    # debug previews (not shipped)
    dbg = ROOT / "tools" / "_debug"
    dbg.mkdir(exist_ok=True)
    cv2.imwrite(str(dbg / "front_canon.png"), f)
    cv2.imwrite(str(dbg / "side_canon.png"), s)
    cv2.imwrite(str(dbg / "front_mask.png"), (fm * 255).astype(np.uint8))
    cv2.imwrite(str(dbg / "side_mask.png"), (sm * 255).astype(np.uint8))


if __name__ == "__main__":
    main()
