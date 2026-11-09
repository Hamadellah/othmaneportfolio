#!/usr/bin/env python3
"""
Generates the static brand/SEO images from the clay reference render:
  public/portrait.jpg          480x480 head cut-out on the site's dark background (static fallback + Person JSON-LD image)
  public/og-image.png          1200x630 social card (Open Graph / Twitter)
  public/apple-touch-icon.png  180x180
  public/icon-192.png, icon-512.png  (web manifest)
Run:  python3 tools/make_assets.py      (needs Pillow)
"""
import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
SRC = Image.open(ROOT / "assets" / "front-view.png").convert("L")

BG = (5, 5, 16)

# --- cut the head out of the white studio background -----------------------
import numpy as np
from scipy import ndimage as ndi

arr = np.asarray(SRC).astype(np.float32)
fg = arr < 236
lab, n = ndi.label(fg)
if n:
    sizes = ndi.sum(fg, lab, range(1, n + 1))
    fg = lab == (1 + int(np.argmax(sizes)))
fg = ndi.binary_fill_holes(fg)
fg = ndi.binary_erosion(fg, iterations=2)  # drop the white anti-aliasing fringe
alpha = ndi.gaussian_filter(fg.astype(np.float32), 1.2)

# head + a short neck only (no collar / suit): box measured on the 1070x1470 render
BOX = (185, 70, 885, 770)
y = np.arange(SRC.height, dtype=np.float32)[:, None]
fade = np.clip((BOX[3] - y) / 120.0, 0, 1)          # dissolve the neck in the last 120 px
alpha = alpha * fade
tone = ImageOps.autocontrast(SRC, cutoff=1)
rgb = np.asarray(ImageOps.colorize(tone, (14, 16, 46), (236, 250, 255))).astype(np.float32)
bg = np.array(BG, dtype=np.float32)
comp = rgb * alpha[..., None] + bg * (1 - alpha[..., None])
HEAD = Image.fromarray(comp.clip(0, 255).astype(np.uint8)).crop(BOX)
HEAD_ALPHA = Image.fromarray((alpha * 255).astype(np.uint8)).crop(BOX)

# ---- portrait.jpg ---------------------------------------------------------
HEAD.resize((480, 480), Image.LANCZOS).save(PUB / "portrait.jpg", quality=88, optimize=True)

def fonts(size, bold=True):
    names = ["DejaVuSans-Bold.ttf", "DejaVuSans.ttf"] if bold else ["DejaVuSans.ttf"]
    for n in names:
        for base in ("/usr/share/fonts/truetype/dejavu/", ""):
            try:
                return ImageFont.truetype(base + n, size)
            except OSError:
                pass
    return ImageFont.load_default()

# ---- icons ---------------------------------------------------------------
def icon(size):
    im = Image.new("RGB", (size, size), BG)
    d = ImageDraw.Draw(im)
    f = fonts(int(size * 0.42))
    text = "OH"
    bbox = d.textbbox((0, 0), text, font=f)
    # gradient text
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).text(((size - (bbox[2] - bbox[0])) / 2 - bbox[0], (size - (bbox[3] - bbox[1])) / 2 - bbox[1]), text, font=f, fill=255)
    grad = Image.new("RGB", (size, size))
    gp = grad.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            gp[x, y] = (int(0 + 184 * t), int(245 - 160 * t), int(255 - 0 * t))
    im.paste(grad, (0, 0), mask)
    return im
icon(180).save(PUB / "apple-touch-icon.png", optimize=True)
icon(192).save(PUB / "icon-192.png", optimize=True)
icon(512).save(PUB / "icon-512.png", optimize=True)

# ---- og-image.png (1200x630) ----------------------------------------------
OW, OH = 1200, 630
og = Image.new("RGB", (OW, OH), BG)
glow = Image.new("RGB", (OW, OH), BG)
gd = ImageDraw.Draw(glow)
gd.ellipse((-200, -250, 520, 470), fill=(0, 70, 90))
gd.ellipse((620, 60, 1320, 760), fill=(70, 30, 110))
glow = glow.filter(ImageFilter.GaussianBlur(120))
og = Image.blend(og, glow, 0.9)

ph = int(OH * 1.02)
portrait = HEAD.resize((ph, ph), Image.LANCZOS)
pmask = HEAD_ALPHA.resize((ph, ph), Image.LANCZOS)
og.paste(portrait, (OW - ph + 30, OH - ph + 40), pmask)

d = ImageDraw.Draw(og)
d.text((72, 190), "Othmane", font=fonts(92), fill=(0, 245, 255))
d.text((72, 292), "Hamadellah", font=fonts(92), fill=(255, 255, 255))
d.text((76, 418), "Full-Stack Web Developer", font=fonts(36, False), fill=(205, 215, 235))
d.text((76, 468), "PHP / Laravel  ·  React  ·  REST APIs  ·  MySQL", font=fonts(26, False), fill=(130, 145, 175))
d.rectangle((76, 160, 76 + 90, 164), fill=(184, 85, 255))
og.save(PUB / "og-image.png", optimize=True)
print("assets written to", PUB)
