from functools import lru_cache
from html.parser import HTMLParser
from xml.sax.saxutils import escape
from fontTools.ttLib import TTFont as FontToolsTTFont
from django.conf import settings
from django.contrib.staticfiles import finders
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Flowable, Paragraph, SimpleDocTemplate, Spacer
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg
import html, io, os, re

MAIN_COLOR = "#015f69"
SECONDARY_COLOR = "#009f92"
FONT_DEFAULTS = {
    "regular": "Helvetica",
    "bold": "Helvetica-Bold",
    "italic": "Helvetica-Oblique",
    "bold_italic": "Helvetica-BoldOblique",
}
MISSING_TEXT = "NOT SET"


@lru_cache(maxsize=1)
def configure_fonts() -> dict[str, str]:
    """Registra y retorna las fuentes Unicode si están disponibles."""
    project_fonts = os.path.join(
        settings.BASE_DIR,
        "static",
        "fonts",
    )

    noto_fonts = project_fonts + "/noto"
    dejavu_fonts = project_fonts + "/dejavu"

    regular = os.path.join(noto_fonts, "NotoSans-Regular.ttf")
    bold = os.path.join(noto_fonts, "NotoSans-Bold.ttf")
    italic = os.path.join(noto_fonts, "NotoSans-Italic.ttf")
    bold_italic = os.path.join(noto_fonts, "NotoSans-BoldItalic.ttf")
    light_italic = os.path.join(noto_fonts, "NotoSans-LightItalic.ttf")

    dejavu_regular = os.path.join(dejavu_fonts, "DejaVuSans.ttf")

    if not all(os.path.isfile(p) for p in (regular, bold, italic, bold_italic)):
        print("USING DEFAULT FONTS")
        return FONT_DEFAULTS

    try:
        pdfmetrics.registerFont(TTFont("NotoSans", regular))
        pdfmetrics.registerFont(TTFont("NotoSans-Bold", bold))
        pdfmetrics.registerFont(TTFont("NotoSans-Italic", italic))
        pdfmetrics.registerFont(TTFont("NotoSans-BoldItalic", bold_italic))
        pdfmetrics.registerFont(TTFont("NotoSans-LightItalic", light_italic))

        pdfmetrics.registerFont(TTFont("DejaVuSans", dejavu_regular))

        pdfmetrics.registerFontFamily(
            "NotoSans",
            normal="NotoSans",
            bold="NotoSans-Bold",
            italic="NotoSans-Italic",
            boldItalic="NotoSans-BoldItalic",
        )

        font_chars = {
            "regular": get_font_chars(regular),
            "bold": get_font_chars(bold),
            "italic": get_font_chars(italic),
            "bold_italic": get_font_chars(bold_italic),
            "dejavu": get_font_chars(dejavu_regular),
        }

        return {
            "regular": "NotoSans",
            "bold": "NotoSans-Bold",
            "italic": "NotoSans-Italic",
            "bold_italic": "NotoSans-BoldItalic",
            "light_italic": "NotoSans-LightItalic",
            "chars": font_chars,
        }

    except Exception:
        print("USING DEFAULT FONTS")
        return FONT_DEFAULTS


def get_font_chars(path: str) -> set[int]:
    font = FontToolsTTFont(path)
    return set(font.getBestCmap().keys())


def apply_font_fallback(text: str, primary_chars: set[int], fallback_chars: set[int]) -> str:
    result = []
    fallback_buffer = []

    def flush_fallback():
        if fallback_buffer:
            result.append(f'<font face="DejaVuSans">' f'{"".join(fallback_buffer)}' f"</font>")
            fallback_buffer.clear()

    for char in text:
        if char == "<":
            flush_fallback()
            result.append(char)

        elif char == ">":
            result.append(char)

        elif ord(char) in primary_chars:
            flush_fallback()
            result.append(escape(char))

        elif ord(char) in fallback_chars:
            fallback_buffer.append(escape(char))

        else:
            flush_fallback()
            result.append(escape(char))

    flush_fallback()

    return "".join(result)


SUPERSCRIPT_MAP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱ", "0123456789+-=()ni")
SUBSCRIPT_MAP = str.maketrans("₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢᵣᵤᵥⱼ", "0123456789+-=()aeoxhklmnpstiruvj")

_SUPER_RE = re.compile(f"[{''.join(re.escape(chr(k)) for k in SUPERSCRIPT_MAP)}]+")
_SUB_RE = re.compile(f"[{''.join(re.escape(chr(k)) for k in SUBSCRIPT_MAP)}]+")


def convert_unicode_scripts(text: str) -> str:
    """Convierte caracteres super/subíndice de Unicode a etiquetas HTML/ReportLab."""
    text = _SUPER_RE.sub(lambda m: f"<super>{m.group().translate(SUPERSCRIPT_MAP)}</super>", text)
    return _SUB_RE.sub(lambda m: f"<sub>{m.group().translate(SUBSCRIPT_MAP)}</sub>", text)


INLINE_TAGS = {
    "b": ("<b>", "</b>"),
    "strong": ("<b>", "</b>"),
    "i": ("<i>", "</i>"),
    "em": ("<i>", "</i>"),
    "cite": ("<i>", "</i>"),
    "var": ("<i>", "</i>"),
    "u": ("<u>", "</u>"),
    "ins": ("<u>", "</u>"),
    "s": ("<strike>", "</strike>"),
    "del": ("<strike>", "</strike>"),
    "strike": ("<strike>", "</strike>"),
    "sup": ("<super>", "</super>"),
    "sub": ("<sub>", "</sub>"),
    "code": ('<font face="Courier">', "</font>"),
    "kbd": ('<font face="Courier">', "</font>"),
    "samp": ('<font face="Courier">', "</font>"),
    "tt": ('<font face="Courier">', "</font>"),
}
BLOCK_TAGS = {
    "p",
    "div",
    "section",
    "article",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "li",
    "tr",
    "pre",
}
IGNORED_CONTENT_TAGS = {"script", "style", "head", "title"}


class HTMLToReportLab(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)

        self.font_chars = configure_fonts()["chars"]
        self.current_font = "regular"

        self.blocks = []
        self._buffer = []
        self._pending_bullet = None
        self._list_stack = []
        self._skip_depth = 0

    def _flush(self, bullet=None):
        raw = "".join(self._buffer)
        self._buffer.clear()
        text = re.sub(r"[ \t\r\n]+", " ", raw).strip()
        text = re.sub(r"^(?:\s*<br\s*/>\s*)+", "", text)
        text = re.sub(r"(?:\s*<br\s*/>\s*)+$", "", text)
        if text:
            self.blocks.append({"text": text, "bullet": bullet or self._pending_bullet})
        self._pending_bullet = None

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag in IGNORED_CONTENT_TAGS:
            self._skip_depth += 1
            return
        if self._skip_depth:
            return

        if tag == "br":
            self._buffer.append("<br/>")
        elif tag in ("ul", "ol"):
            self._flush()
            self._list_stack.append({"type": tag, "counter": 0})
        elif tag == "li":
            self._flush()
            if self._list_stack and self._list_stack[-1]["type"] == "ol":
                self._list_stack[-1]["counter"] += 1
                self._pending_bullet = f"{self._list_stack[-1]['counter']}."
            else:
                self._pending_bullet = "\u2022"
        elif tag in BLOCK_TAGS:
            self._flush()
        elif tag in INLINE_TAGS:
            self._buffer.append(INLINE_TAGS[tag][0])

    def handle_startendtag(self, tag, attrs):
        if tag.lower() == "br" and not self._skip_depth:
            self._buffer.append("<br/>")

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in IGNORED_CONTENT_TAGS:
            self._skip_depth = max(0, self._skip_depth - 1)
            return
        if self._skip_depth:
            return

        if tag in ("ul", "ol"):
            self._flush()
            if self._list_stack:
                self._list_stack.pop()
        elif tag in BLOCK_TAGS:
            self._flush()
        elif tag in INLINE_TAGS:
            self._buffer.append(INLINE_TAGS[tag][1])

    def handle_data(self, data):
        if not self._skip_depth:
            data = convert_unicode_scripts(data)

            self._buffer.append(
                apply_font_fallback(
                    data,
                    self.font_chars[self.current_font],
                    self.font_chars["dejavu"],
                )
            )

    def close(self):
        super().close()
        self._flush()
        return self.blocks


def html_to_blocks(raw_html: str) -> list[dict]:
    if not raw_html:
        return []
    parser = HTMLToReportLab()
    parser.feed(html.unescape(str(raw_html)))
    return parser.close()


def html_to_inline(raw_html: str, separator: str = " ") -> str:
    blocks = html_to_blocks(raw_html)
    return separator.join(block["text"] for block in blocks)


def safe_paragraph(markup: str, style: ParagraphStyle, bullet_text: str | None = None) -> Paragraph:
    try:
        return Paragraph(markup, style, bulletText=bullet_text)
    except Exception:
        plain = escape(re.sub(r"<[^>]+>", "", markup))
        return Paragraph(plain, style, bulletText=bullet_text)


def blocks_to_flowables(raw_html: str, style: ParagraphStyle, bullet_style: ParagraphStyle | None = None, space_after: int = 6, enumerated=False, bullet_text="") -> list:
    flowables = []

    for index, block in enumerate(html_to_blocks(raw_html), start=1):
        bullet = f"{index}." if enumerated else block["bullet"]
        st = bullet_style if (block["bullet"] and bullet_style) else style

        flowables.append(safe_paragraph(block["text"], st, bullet))
        flowables.append(Spacer(1, space_after))

    if flowables:
        flowables.pop()
    return flowables


def missing_paragraph(style: ParagraphStyle) -> Paragraph:
    red = ParagraphStyle(f"{style.name}Missing", parent=style, textColor=colors.HexColor("#cc0000"))
    return Paragraph(f"<b>{MISSING_TEXT}</b>", red)


LOGO_FILENAME = "img/watoc2028.png"
LOGO_HEIGHT = 1.4 * cm
LOGO_ALIGN = "left"
LOGO_TOP = 1.8 * cm
HEADER_RULE = True
LOGO_ONLY_ON_FIRST_PAGE = False


@lru_cache(maxsize=1)
def get_logo_path() -> str | None:
    path = finders.find(LOGO_FILENAME)
    if path and os.path.exists(path):
        return path

    roots = [getattr(settings, "STATIC_ROOT", None), os.path.join(settings.BASE_DIR, "static")]
    for root in filter(None, roots):
        candidate = os.path.join(root, LOGO_FILENAME)
        if os.path.exists(candidate):
            return candidate

    return None


TEXT_INDENT = 20
BULLET_INDENT = 20


def get_styles() -> dict[str, ParagraphStyle]:
    fonts = configure_fonts()
    base = getSampleStyleSheet()["Normal"]
    return {
        "title": ParagraphStyle("AbstractTitle", parent=base, fontName=fonts["bold"], fontSize=16, leading=22, charSpace=-0.2, alignment=TA_CENTER, spaceAfter=0, spaceBefore=5, leftIndent=TEXT_INDENT, rightIndent=TEXT_INDENT),
        "authors": ParagraphStyle("AbstractAuthors", parent=base, fontName=fonts["bold"], fontSize=10, leading=12, alignment=TA_CENTER, spaceAfter=9, spaceBefore=3, leftIndent=TEXT_INDENT, rightIndent=TEXT_INDENT),
        "affiliations": ParagraphStyle("AbstractAffiliations", parent=base, fontName=fonts["light_italic"], fontSize=8, leading=11, alignment=TA_CENTER, spaceAfter=3, spaceBefore=3, leftIndent=TEXT_INDENT, rightIndent=TEXT_INDENT, textColor=colors.HexColor("#444444")),
        "heading": ParagraphStyle("AbstractHeading", parent=base, fontName=fonts["bold"], fontSize=16, leading=26, spaceBefore=10, spaceAfter=0, textColor=colors.HexColor(MAIN_COLOR)),
        # textos de header
        "header_title": ParagraphStyle("AbstractHeaderTitle", parent=base, fontName=fonts["bold"], fontSize=11, leading=12, spaceAfter=4, charSpace=-0.2, alignment=TA_RIGHT, textColor=colors.HexColor(SECONDARY_COLOR)),
        "header_subtitle": ParagraphStyle("AbstractHeaderSubitle", parent=base, fontName=fonts["regular"], fontSize=11, leading=12, spaceAfter=4, charSpace=-0.2, alignment=TA_RIGHT),
        # texto
        "body": ParagraphStyle("AbstractBody", parent=base, fontName=fonts["regular"], fontSize=10, leading=15, alignment=TA_JUSTIFY, leftIndent=TEXT_INDENT, rightIndent=TEXT_INDENT, spaceMaxExpand=0.2),
        "reference": ParagraphStyle("AbstractReference", parent=base, fontName=fonts["regular"], fontSize=9, leading=13, alignment=TA_JUSTIFY, leftIndent=TEXT_INDENT, rightIndent=TEXT_INDENT),
        # bullets
        "body_bullet": ParagraphStyle("AbstractBodyBullet", parent=base, fontName=fonts["regular"], fontSize=10, leading=15, alignment=TA_JUSTIFY, leftIndent=14, bulletIndent=2),
        "reference_bullet": ParagraphStyle("AbstractReferenceBullet", parent=base, fontName=fonts["regular"], fontSize=9, leading=13, alignment=TA_JUSTIFY, leftIndent=TEXT_INDENT + 16, rightIndent=TEXT_INDENT, bulletIndent=BULLET_INDENT),
    }


def draw_page_decorations(canvas, doc, context: dict):
    logo_path = get_logo_path()
    page_width, page_height = doc.pagesize

    canvas.saveState()

    fonts = configure_fonts()
    styles = get_styles()

    header_x = page_width - doc.rightMargin
    header_y = page_height - LOGO_TOP - (LOGO_HEIGHT / 2)

    abstract_id = str(context["id"])
    header_title_text = f"ID #{abstract_id.zfill(6)}"

    header_title = safe_paragraph("Abstract Submission", styles["header_title"])
    header_subtitle = safe_paragraph(header_title_text, styles["header_subtitle"])

    title_w, title_h = header_title.wrap(page_width / 2, 100)
    subtitle_w, subtitle_h = header_subtitle.wrap(page_width / 2, 100)

    header_title.drawOn(
        canvas,
        header_x - title_w,
        header_y,
    )

    header_subtitle.drawOn(
        canvas,
        header_x - subtitle_w,
        header_y - title_h - 1,
    )

    # Header
    if logo_path:
        try:
            reader = ImageReader(logo_path)
            img_width, img_height = reader.getSize()
            width = LOGO_HEIGHT * (img_width / float(img_height))

            if LOGO_ALIGN == "center":
                x = (page_width - width) / 2.0
            elif LOGO_ALIGN == "right":
                x = page_width - doc.rightMargin - width
            else:
                x = doc.leftMargin

            y = page_height - LOGO_TOP - LOGO_HEIGHT
            canvas.drawImage(reader, x, y, width=width, height=LOGO_HEIGHT, mask="auto", preserveAspectRatio=True, anchor="sw")

            if HEADER_RULE:
                rule_y = y - 0.35 * cm
                canvas.setStrokeColor(colors.HexColor(MAIN_COLOR))
                canvas.setLineWidth(0.6)
                canvas.line(doc.leftMargin, rule_y, page_width - doc.rightMargin, rule_y)
        except Exception:
            pass

    # Footer
    canvas.setFont(fonts["regular"], 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawCentredString(page_width / 2.0, 1.2 * cm, f"{doc.page}")

    canvas.restoreState()


class TitleDivider(Flowable):
    def __init__(self, line_color="#cccccc", line_width=0.6, rect_color="#015f69", rect_width=40, rect_height=6, height=12, margin_x=0):
        super().__init__()

        self.line_color = colors.HexColor(line_color)
        self.line_width = line_width

        self.rect_color = colors.HexColor(rect_color)
        self.rect_width = rect_width
        self.rect_height = rect_height

        self.height = height
        self.margin_x = margin_x

    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        return availWidth, self.height

    def draw(self):
        canvas = self.canv

        center_x = self.width / 2
        center_y = self.height / 2

        # Líneas
        canvas.setStrokeColor(self.line_color)
        canvas.setLineWidth(self.line_width)

        rect_left = center_x - self.rect_width / 2

        canvas.line(
            self.margin_x,
            center_y,
            self.width - self.margin_x,
            center_y,
        )

        # Rectángulo
        canvas.setFillColor(self.rect_color)
        canvas.setStrokeColor(self.rect_color)

        canvas.rect(
            rect_left,
            center_y - self.rect_height / 2,
            self.rect_width,
            self.rect_height,
            fill=1,
            stroke=0,
        )


class TitleWithIcon(Flowable):
    def __init__(self, title: Paragraph, icon_path: str, icon_size=18, gap=8, circle_radius=14, circle_color="#015f69"):
        super().__init__()

        self.title = title
        self.icon_path = icon_path
        self.icon_size = icon_size
        self.gap = gap
        self.circle_radius = circle_radius
        self.circle_color = colors.HexColor(circle_color)

    def wrap(self, availWidth, availHeight):
        title_width, title_height = self.title.wrap(
            availWidth - self.icon_size - self.gap,
            availHeight,
        )

        self.title_width = title_width
        self.title_height = title_height

        self.width = availWidth
        self.height = max(
            title_height,
            self.circle_radius * 2,
        )

        return self.width, self.height

    def draw(self):
        canvas = self.canv

        center_y = self.height / 2
        circle_x = self.circle_radius

        canvas.saveState()
        canvas.setFillColor(self.circle_color)
        canvas.circle(
            circle_x,
            center_y,
            self.circle_radius,
            fill=1,
            stroke=0,
        )

        # Imagen dentro del círculo
        if self.icon_path.endswith(".png") or self.icon_path.endswith(".jpg"):
            reader = ImageReader(self.icon_path)
            img_width, img_height = reader.getSize()

            scale = min(
                self.icon_size / img_width,
                self.icon_size / img_height,
            )

            width = img_width * scale
            height = img_height * scale

            canvas.drawImage(
                reader,
                circle_x - width / 2,
                center_y - height / 2,
                width=width,
                height=height,
                mask="auto",
            )
        elif self.icon_path.endswith(".svg"):
            icon = svg2rlg(self.icon_path)

            scale = min(
                self.icon_size / icon.width,
                self.icon_size / icon.height,
            )

            icon.width *= scale
            icon.height *= scale
            icon.scale(scale, scale)

            renderPDF.draw(
                icon,
                canvas,
                circle_x - icon.width / 2,
                center_y - icon.height / 2,
            )

        # Título
        self.title.drawOn(
            canvas,
            self.circle_radius * 2 + self.gap,
            center_y - self.title_height / 2,
        )

        canvas.restoreState()


def build_abstract_pdf(context: dict) -> bytes:
    styles = get_styles()
    story = []

    # Título
    title_text = html_to_inline(context.get("title_html") or "")
    if title_text.strip():
        story.append(safe_paragraph(title_text, styles["title"]))
    else:
        story.append(missing_paragraph(styles["title"]))

    story.append(
        TitleDivider(
            line_color=MAIN_COLOR,
            line_width=1,
            rect_color=MAIN_COLOR,
            rect_width=30,
            rect_height=6,
            margin_x=80,
        )
    )

    # Autores
    authors_list = context.get("authors_list") or []
    if authors_list:
        parts = []
        for author in authors_list:
            name = escape(author["full_name"])

            if author["is_corresponding_author"]:
                image_path = os.path.join(
                    settings.BASE_DIR,
                    "static",
                    "img",
                    "mail.png",
                )
                name += f' <img src="{image_path}" width="9" height="9" valign="middle"/> '
                
            if author["aff_index"]:
                name += f'<super>{author["aff_index"]}</super>'

            parts.append(name)
        story.append(safe_paragraph(", ".join(parts), styles["authors"]))
    else:
        story.append(missing_paragraph(styles["authors"]))

    affiliation_list: list = context.get("affiliations_list") or []
    if affiliation_list:
        affiliation_text = "; ".join(f'<super>{affiliation["index"]}</super>{escape(affiliation["text"])}' for affiliation in affiliation_list) + "."

        story.append(
            safe_paragraph(
                affiliation_text,
                styles["affiliations"],
            )
        )

    story.append(Spacer(1, 5))

    title = safe_paragraph("ABSTRACT", styles["heading"])

    story.append(
        TitleWithIcon(
            title=title,
            circle_color=MAIN_COLOR,
            circle_radius=20,
            icon_size=26,
            icon_path=os.path.join(
                settings.BASE_DIR,
                "static",
                "img",
                "screen-chem.svg",
            ),
            gap=10,
        )
    )

    story.append(Spacer(1, 5))

    # Cuerpo
    body = blocks_to_flowables(context.get("text_html") or "", styles["body"], styles["body_bullet"])
    story.extend(body or [missing_paragraph(styles["body"])])

    story.append(Spacer(1, 15))

    # Referencias
    references = blocks_to_flowables(
        context.get("references_html") or "",
        styles["reference_bullet"],
        enumerated=True,
        space_after=4,
    ) or [missing_paragraph(styles["reference"])]

    story.append(
        TitleWithIcon(
            title=Paragraph("REFERENCES", styles["heading"]),
            circle_color=MAIN_COLOR,
            circle_radius=20,
            icon_size=26,
            icon_path=os.path.join(
                settings.BASE_DIR,
                "static",
                "img",
                "book-open.png",
            ),
            gap=10,
        )
    )
    story.append(Spacer(1, 5))

    story.extend(references)

    top_margin = (LOGO_TOP + LOGO_HEIGHT + 0.5 * cm) if get_logo_path() else 2.0 * cm

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=LETTER,
        leftMargin=2.2 * cm,
        rightMargin=2.2 * cm,
        topMargin=top_margin,
        bottomMargin=2.0 * cm,
        title=context["file_title"],
        author=", ".join(a["full_name"] for a in authors_list),
    )

    doc.build(
        story,
        onFirstPage=lambda c, d: draw_page_decorations(c, d, context),
        onLaterPages=lambda c, d: draw_page_decorations(c, d, context) if not LOGO_ONLY_ON_FIRST_PAGE else None,
    )

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
