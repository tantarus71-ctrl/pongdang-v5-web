from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "fish" / "beodeulchi" / "cartoon_v1"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 900, 520


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def mirror(img):
    return img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)


def draw_fin(draw, points, fill, outline=None, width=3):
    draw.polygon(points, fill=fill)
    if outline:
        draw.line(points + [points[0]], fill=outline, width=width, joint="curve")


def draw_side(tail=0, blink=False, angle="side", direction="right", scale=1.0):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    d = ImageDraw.Draw(img)

    cx, cy = 430, 255
    body_w = int((430 if angle == "side" else 365) * scale)
    body_h = int((118 if angle == "side" else 132) * scale)
    head_r = int((72 if angle == "side" else 82) * scale)
    tail_swing = [-28, 0, 28][tail % 3]
    tail_base_x = cx + body_w // 2 - 32
    tail_tip_x = tail_base_x + int((130 if angle == "side" else 100) * scale)

    sd.ellipse((cx - body_w // 2 + 18, cy + 48, cx + body_w // 2 + 30, cy + 92), fill=(0, 0, 0, 38))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    img.alpha_composite(shadow)

    # Tail and fins stay a little transparent for a soft 2.5D feel.
    tail = [
        (tail_base_x, cy - 30),
        (tail_tip_x, cy - 78 + tail_swing),
        (tail_tip_x - 10, cy),
        (tail_tip_x, cy + 78 + tail_swing),
        (tail_base_x, cy + 30),
    ]
    draw_fin(d, tail, rgba("#f28d5a", 150), rgba("#b96e42", 120), 4)

    dorsal = [
        (cx - 60, cy - body_h // 2 + 10),
        (cx + 25, cy - body_h // 2 - 80 - tail_swing * 0.12),
        (cx + 115, cy - body_h // 2 + 16),
    ]
    draw_fin(d, dorsal, rgba("#f1c271", 120), rgba("#ad8647", 95), 3)

    pectoral = [
        (cx - 120, cy + 24),
        (cx - 40, cy + 106 + tail_swing * 0.15),
        (cx + 8, cy + 40),
    ]
    draw_fin(d, pectoral, rgba("#f4cf88", 126), rgba("#a77c44", 88), 3)

    pelvic = [
        (cx + 40, cy + 44),
        (cx + 104, cy + 118 - tail_swing * 0.12),
        (cx + 150, cy + 42),
    ]
    draw_fin(d, pelvic, rgba("#efbd72", 105), rgba("#a77c44", 72), 3)

    # Body volume.
    body_box = (cx - body_w // 2, cy - body_h // 2, cx + body_w // 2, cy + body_h // 2)
    d.ellipse(body_box, fill=rgba("#d9be83"), outline=rgba("#816c42", 160), width=5)
    d.ellipse((body_box[0] + 8, body_box[1] + 12, body_box[2] - 12, cy + 18), fill=rgba("#f2ddb0", 180))
    d.ellipse((body_box[0] + 18, cy - 8, body_box[2] - 20, body_box[3] - 10), fill=rgba("#f9f2dc", 120))

    # Soft center stripe, about 50-60% strength.
    stripe_y = cy - 4
    d.rounded_rectangle((cx - body_w // 2 + 38, stripe_y - 9, cx + body_w // 2 - 52, stripe_y + 9), radius=10, fill=rgba("#5c5b4d", 132))
    d.rounded_rectangle((cx - body_w // 2 + 52, stripe_y - 4, cx + body_w // 2 - 70, stripe_y + 4), radius=5, fill=rgba("#282f2d", 80))

    # Simple scale marks, kept subtle so the fish reads clearly at small sizes.
    for i in range(13):
        x = cx - body_w // 2 + 92 + i * (body_w - 190) / 12
        d.arc((x - 16, cy - 42, x + 18, cy + 45), -62, 62, fill=rgba("#8a7a58", 48), width=2)

    # Head, mouth, and friendly enlarged eye.
    head_x = cx - body_w // 2 + 62
    d.ellipse((head_x - head_r, cy - head_r * 0.78, head_x + head_r * 1.05, cy + head_r * 0.82), fill=rgba("#d6b275"), outline=rgba("#77643f", 150), width=5)
    d.ellipse((head_x - head_r + 14, cy - head_r * 0.58, head_x + head_r * 0.74, cy + 6), fill=rgba("#f3dfb8", 122))
    d.arc((head_x - head_r + 8, cy + 10, head_x + 14, cy + 48), 210, 334, fill=rgba("#6d5739", 150), width=4)
    d.arc((head_x - head_r - 12, cy - 6, head_x + 2, cy + 38), 260, 348, fill=rgba("#8d7248", 130), width=3)

    eye_x = head_x + 20
    eye_y = cy - 32
    if blink:
        d.arc((eye_x - 19, eye_y - 6, eye_x + 20, eye_y + 8), 0, 180, fill=rgba("#3b2d23"), width=6)
    else:
        d.ellipse((eye_x - 24, eye_y - 24, eye_x + 24, eye_y + 24), fill=rgba("#fff8e8"), outline=rgba("#5a3e2b"), width=4)
        d.ellipse((eye_x - 11, eye_y - 12, eye_x + 13, eye_y + 13), fill=rgba("#1f2525"))
        d.ellipse((eye_x - 5, eye_y - 7, eye_x + 4, eye_y + 2), fill=rgba("#ffffff", 230))

    # Rim light and very thin soft outline.
    d.arc((body_box[0] + 10, body_box[1] + 4, body_box[2] - 8, body_box[3] - 2), 196, 342, fill=rgba("#ffffff", 92), width=5)
    d.line([(head_x - 42, cy + 58), (cx - 22, cy + body_h // 2 - 2), (tail_base_x, cy + 28)], fill=rgba("#7f6a47", 80), width=3)

    if angle != "side":
        # Fake body-width change for 45-degree sprites.
        img = img.resize((int(W * 0.92), H), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.alpha_composite(img, ((W - img.width) // 2, 0))
        img = canvas

    if direction == "left":
        img = mirror(img)
    return img


def save(name, img):
    img.save(OUT / name, optimize=True)


for frame in range(3):
    save(f"swim_right_{frame + 1}.png", draw_side(frame, False, "side", "right"))
    save(f"swim_left_{frame + 1}.png", draw_side(frame, False, "side", "left"))
    save(f"front_right_{frame + 1}.png", draw_side(frame, False, "front", "right", 0.98))
    save(f"front_left_{frame + 1}.png", draw_side(frame, False, "front", "left", 0.98))

save("blink_open.png", draw_side(1, False, "side", "right"))
save("blink_closed.png", draw_side(1, True, "side", "right"))

fin1 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fin2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
for target, lift in ((fin1, 0), (fin2, 18)):
    d = ImageDraw.Draw(target)
    draw_fin(d, [(350, 278), (430, 388 - lift), (488, 304)], rgba("#f4cf88", 126), rgba("#a77c44", 88), 3)
    draw_fin(d, [(490, 294), (558, 392 + lift), (612, 302)], rgba("#efbd72", 105), rgba("#a77c44", 72), 3)
save("fin_layer_1.png", fin1)
save("fin_layer_2.png", fin2)

card = Image.new("RGBA", (1200, 780), (0, 0, 0, 0))
card_bg = Image.new("RGBA", (1200, 780), (0, 0, 0, 0))
cd = ImageDraw.Draw(card_bg)
cd.rounded_rectangle((80, 80, 1120, 700), radius=54, fill=rgba("#eafaff", 238), outline=rgba("#94dceb", 220), width=8)
cd.ellipse((760, 20, 1230, 420), fill=rgba("#beeef4", 76))
card.alpha_composite(card_bg)
fish_card = draw_side(1, False, "side", "right").resize((880, 508), Image.Resampling.LANCZOS)
card.alpha_composite(fish_card, (160, 120))
save("card.png", card)

popup = Image.new("RGBA", (1400, 900), (0, 0, 0, 0))
pd = ImageDraw.Draw(popup)
pd.ellipse((120, 120, 1280, 790), fill=rgba("#d7f7ff", 54))
fish_popup = draw_side(1, False, "front", "right", 1.08).resize((1180, 682), Image.Resampling.LANCZOS)
popup.alpha_composite(fish_popup, (120, 110))
save("popup.png", popup)

print(f"generated {len(list(OUT.glob('*.png')))} png files in {OUT}")
