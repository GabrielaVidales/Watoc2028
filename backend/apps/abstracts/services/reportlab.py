import html, io, os, re
from functools import lru_cache
from html.parser import HTMLParser
from xml.sax.saxutils import escape

from django.conf import settings
from django.contrib.staticfiles import finders

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer

# ----------------------------------------------------------------------
# Configuración de Fuentes
# ----------------------------------------------------------------------

FONT_DEFAULTS = {
    "regular": "Helvetica",
    "bold": "Helvetica-Bold",
    "italic": "Helvetica-Oblique",
    "bold_italic": "Helvetica-BoldOblique",
}


@lru_cache(maxsize=1)
def configure_fonts() -> dict[str, str]:
    """Registra y retorna las fuentes Unicode si están disponibles."""
    project_fonts = os.path.join(settings.BASE_DIR, "static", "fonts")

    candidates = [
        (
            "DejaVuSans",
            os.path.join(project_fonts, "DejaVuSans.ttf"),
            os.path.join(project_fonts, "DejaVuSans-Bold.ttf"),
            os.path.join(project_fonts, "DejaVuSans-Oblique.ttf"),
            os.path.join(project_fonts, "DejaVuSans-BoldOblique.ttf"),
        ),
        (
            "DejaVuSans",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Oblique.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-BoldOblique.ttf",
        ),
    ]

    for family, regular, bold, italic, bold_italic in candidates:
        paths = (regular, bold, italic, bold_italic)
        if not all(os.path.exists(p) for p in paths):
            continue
        try:
            pdfmetrics.registerFont(TTFont(family, regular))
            pdfmetrics.registerFont(TTFont(f"{family}-Bold", bold))
            pdfmetrics.registerFont(TTFont(f"{family}-Italic", italic))
            pdfmetrics.registerFont(TTFont(f"{family}-BoldItalic", bold_italic))
            pdfmetrics.registerFontFamily(
                family,
                normal=family,
                bold=f"{family}-Bold",
                italic=f"{family}-Italic",
                boldItalic=f"{family}-BoldItalic",
            )
            return {
                "regular": family,
                "bold": f"{family}-Bold",
                "italic": f"{family}-Italic",
                "bold_italic": f"{family}-BoldItalic",
            }
        except Exception:
            continue

    return FONT_DEFAULTS


# ----------------------------------------------------------------------
# Mapeo Unicode y Parser HTML
# ----------------------------------------------------------------------

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

BLOCK_TAGS = {"p", "div", "section", "article", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "li", "tr", "pre"}
IGNORED_CONTENT_TAGS = {"script", "style", "head", "title"}


class HTMLToReportLab(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
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
            self._buffer.append(convert_unicode_scripts(escape(data)))

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


def blocks_to_flowables(raw_html: str, style: ParagraphStyle, bullet_style: ParagraphStyle | None = None, space_after: int = 6) -> list:
    flowables = []
    for block in html_to_blocks(raw_html):
        st = bullet_style if (block["bullet"] and bullet_style) else style
        flowables.append(safe_paragraph(block["text"], st, block["bullet"]))
        flowables.append(Spacer(1, space_after))

    if flowables:
        flowables.pop()
    return flowables


# ----------------------------------------------------------------------
# Configuración Estilos y Layout PDF
# ----------------------------------------------------------------------

MISSING_TEXT = "NOT SET"


def missing_paragraph(style: ParagraphStyle) -> Paragraph:
    red = ParagraphStyle(f"{style.name}Missing", parent=style, textColor=colors.HexColor("#cc0000"))
    return Paragraph(f"<b>{MISSING_TEXT}</b>", red)


LOGO_FILENAME = "img/WatocPNGLogo.png"
LOGO_HEIGHT = 1.3 * cm
LOGO_ALIGN = "left"
LOGO_TOP = 1.1 * cm
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


def get_styles() -> dict[str, ParagraphStyle]:
    fonts = configure_fonts()
    base = getSampleStyleSheet()["Normal"]

    return {
        "title": ParagraphStyle("AbstractTitle", parent=base, fontName=fonts["bold"], fontSize=14, leading=18, alignment=TA_CENTER, spaceAfter=10),
        "authors": ParagraphStyle("AbstractAuthors", parent=base, fontName=fonts["regular"], fontSize=10.5, leading=14, alignment=TA_CENTER, spaceAfter=4),
        "affiliations": ParagraphStyle("AbstractAffiliations", parent=base, fontName=fonts["italic"], fontSize=8.5, leading=11, alignment=TA_CENTER, textColor=colors.HexColor("#444444")),
        "heading": ParagraphStyle("AbstractHeading", parent=base, fontName=fonts["bold"], fontSize=11, leading=14, spaceBefore=12, spaceAfter=6, textColor=colors.HexColor("#1a1a1a")),
        "body": ParagraphStyle("AbstractBody", parent=base, fontName=fonts["regular"], fontSize=10, leading=14.5, alignment=TA_JUSTIFY),
        "body_bullet": ParagraphStyle("AbstractBodyBullet", parent=base, fontName=fonts["regular"], fontSize=10, leading=14.5, alignment=TA_JUSTIFY, leftIndent=14, bulletIndent=2),
        "reference": ParagraphStyle("AbstractReference", parent=base, fontName=fonts["regular"], fontSize=10, leading=12, alignment=TA_JUSTIFY),
        "reference_bullet": ParagraphStyle("AbstractReferenceBullet", parent=base, fontName=fonts["regular"], fontSize=8.5, leading=12, alignment=TA_JUSTIFY, leftIndent=14, bulletIndent=2),
    }


def draw_page_decorations(canvas, doc):
    logo_path = get_logo_path()
    page_width, page_height = doc.pagesize

    canvas.saveState()

    fonts = configure_fonts()
    header_x = page_width - doc.rightMargin
    header_y = page_height - LOGO_TOP - (LOGO_HEIGHT / 2)

    canvas.setFont(fonts["regular"], 9)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawRightString(header_x, header_y, "Abstract Submission")

    header_y = header_y - 9
    canvas.drawRightString(header_x, header_y, "Document Preview")

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
                canvas.setStrokeColor(colors.HexColor("#cccccc"))
                canvas.setLineWidth(0.6)
                canvas.line(doc.leftMargin, rule_y, page_width - doc.rightMargin, rule_y)
        except Exception:
            pass

    # Footer
    canvas.setFont(fonts["regular"], 8)
    canvas.setFillColor(colors.HexColor("#666666"))
    canvas.drawCentredString(page_width / 2.0, 1.2 * cm, f"{doc.page}")

    canvas.restoreState()


# ----------------------------------------------------------------------
# Construcción del PDF y Tarea Celery
# ----------------------------------------------------------------------


def build_abstract_pdf(context: dict) -> bytes:
    styles = get_styles()
    story = []

    # Título
    title_text = html_to_inline(context.get("title_html") or "")
    if title_text.strip():
        story.append(safe_paragraph(title_text, styles["title"]))
    else:
        story.append(missing_paragraph(styles["title"]))

    # Autores
    authors_list = context.get("authors_list") or []
    if authors_list:
        parts = []
        for author in authors_list:
            name = escape(author["full_name"])
            if author["aff_index"]:
                name += f'<super>{author["aff_index"]}</super>'
            parts.append(name)
        story.append(safe_paragraph(", ".join(parts), styles["authors"]))
    else:
        story.append(missing_paragraph(styles["authors"]))

    # Afiliaciones
    for affiliation in context.get("affiliations_list") or []:
        story.append(
            safe_paragraph(
                f'<super>{affiliation["index"]}</super> {escape(affiliation["text"])}',
                styles["affiliations"],
            )
        )

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.6, color=colors.HexColor("#cccccc")))
    story.append(Spacer(1, 6))

    # Cuerpo
    body = blocks_to_flowables(context.get("text_html") or "", styles["body"], styles["body_bullet"])
    story.extend(body or [missing_paragraph(styles["body"])])

    # Referencias
    references = blocks_to_flowables(context.get("references_html") or "", styles["reference"], styles["reference_bullet"], space_after=4) or [missing_paragraph(styles["reference"])]
    story.append(KeepTogether([Paragraph("References", styles["heading"]), references[0]]))
    story.extend(references[1:])

    top_margin = (LOGO_TOP + LOGO_HEIGHT + 0.9 * cm) if get_logo_path() else 2.0 * cm

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
        onFirstPage=draw_page_decorations,
        onLaterPages=draw_page_decorations if not LOGO_ONLY_ON_FIRST_PAGE else None,
    )

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
