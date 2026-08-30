from pathlib import Path

from reportlab.graphics.shapes import Drawing, Rect
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "dfw-real-estate-drone-shot-list.pdf"
LOGO = ROOT / "assets" / "brand-logo.png"
HERO = ROOT / "assets" / "media" / "dfw-real-estate-community-overview.jpg"

NAVY = colors.HexColor("#0F172A")
BLUE = colors.HexColor("#2563EB")
SLATE = colors.HexColor("#334155")
MUTED = colors.HexColor("#64748B")
PALE = colors.HexColor("#EFF6FF")
LINE = colors.HexColor("#CBD5E1")
WHITE = colors.white


def checkbox():
    drawing = Drawing(12, 12)
    drawing.add(Rect(1, 1, 9, 9, strokeColor=BLUE, fillColor=WHITE, strokeWidth=1.2))
    return drawing


def checklist(items, styles, text_width=6.45 * inch):
    rows = [[checkbox(), Paragraph(item, styles["Check"])] for item in items]
    table = Table(rows, colWidths=[0.22 * inch, text_width], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    return table


def section(title, items, styles):
    return KeepTogether(
        [
            Paragraph(title, styles["SectionCustom"]),
            Spacer(1, 5),
            checklist(items, styles),
            Spacer(1, 11),
        ]
    )


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.34 * inch, width, 0.34 * inch, stroke=0, fill=1)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(WHITE)
    canvas.drawString(0.55 * inch, height - 0.22 * inch, "APS DRONE  |  DFW REAL ESTATE DRONE SHOT LIST")
    canvas.setFont("Helvetica", 7.5)
    canvas.drawRightString(width - 0.55 * inch, height - 0.22 * inch, f"PAGE {doc.page}")
    canvas.setStrokeColor(LINE)
    canvas.line(0.55 * inch, 0.43 * inch, width - 0.55 * inch, 0.43 * inch)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(0.55 * inch, 0.24 * inch, "apsdrone.com  |  832-938-9570  |  Dallas-Fort Worth, Texas")
    canvas.drawRightString(width - 0.55 * inch, 0.24 * inch, "FAA Part 107 commercial drone services")
    canvas.restoreState()


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Eyebrow", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=BLUE, spaceAfter=7))
    styles.add(ParagraphStyle(name="TitleCustom", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=25, leading=28, textColor=NAVY, alignment=TA_LEFT, spaceAfter=8))
    styles.add(ParagraphStyle(name="Lead", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.4, leading=15, textColor=SLATE, spaceAfter=10))
    styles.add(ParagraphStyle(name="SectionCustom", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=NAVY, spaceBefore=2, spaceAfter=1))
    styles.add(ParagraphStyle(name="Check", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.3, leading=12.5, textColor=SLATE))
    styles.add(ParagraphStyle(name="BoxTitle", parent=styles["Heading3"], fontName="Helvetica-Bold", fontSize=10.5, leading=13, textColor=BLUE, spaceAfter=3))
    styles.add(ParagraphStyle(name="BoxBody", parent=styles["BodyText"], fontName="Helvetica", fontSize=8.8, leading=12, textColor=SLATE))
    styles.add(ParagraphStyle(name="Centered", parent=styles["BodyText"], fontName="Helvetica-Bold", fontSize=10, leading=14, alignment=TA_CENTER, textColor=WHITE))

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.58 * inch,
        title="DFW Real Estate Drone Shot List",
        author="APS Drone",
        subject="Aerial listing photography and vertical reel planning resource for Dallas-Fort Worth real estate professionals",
    )

    story = []
    logo = Image(str(LOGO), width=2.35 * inch, height=0.47 * inch)
    logo.hAlign = "LEFT"
    story.extend(
        [
            logo,
            Spacer(1, 8),
            Paragraph("FREE RESOURCE FOR DFW LISTING TEAMS", styles["Eyebrow"]),
            Paragraph("Real Estate Drone<br/>Shot List", styles["TitleCustom"]),
            Paragraph(
                "Use this checklist to brief aerial listing photography and a vertical property reel without missing the views that explain the home, lot, neighborhood context and marketable exterior features.",
                styles["Lead"],
            ),
        ]
    )

    hero = Image(str(HERO), width=6.9 * inch, height=2.25 * inch)
    hero.hAlign = "CENTER"
    story.extend([hero, Spacer(1, 10)])

    quick = Table(
        [[Paragraph("START WITH THE LISTING STORY", styles["BoxTitle"]), Paragraph("Identify the hero feature, the relationship between the home and lot, nearby context that is genuinely relevant, any view to avoid, the delivery deadline and whether the campaign needs still photos, a vertical reel or both.", styles["BoxBody"])]],
        colWidths=[2.05 * inch, 4.7 * inch],
    )
    quick.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE), ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#BFDBFE")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9)]))
    story.extend([quick, Spacer(1, 12)])

    story.append(section("1. Essential listing angles", [
        "Front three-quarter hero angle showing the entry, facade and property depth",
        "Opposite-side front angle to explain the frontage and driveway relationship",
        "Rear three-quarter view showing the backyard and rear elevation",
        "Straight-down overview when it clarifies the lot, roofline or improvements",
        "Wide context view showing the home within the immediate neighborhood",
        "Lower-detail aerials of pools, outdoor living, acreage, water or other verified features",
    ], styles))
    story.append(section("2. Details to send before the shoot", [
        "Property location, preferred shoot window and listing-live deadline",
        "Top three selling features and any angles the seller does not want emphasized",
        "Gate, access, parking, tenant, pet or on-site contact instructions",
        "Requested photo count and whether MLS-size or web-ready copies are needed",
        "Vertical-reel platform, target duration, branding and delivery requirements",
    ], styles))

    story.append(PageBreak())
    story.append(Paragraph("LISTING MEDIA BRIEF", styles["Eyebrow"]))
    story.append(Paragraph("Context, preparation and delivery", styles["TitleCustom"]))
    story.append(HRFlowable(width="100%", thickness=1, color=LINE, spaceBefore=0, spaceAfter=12))

    left = [
        "Golf course, water, park, trail or greenbelt only when genuinely nearby and relevant",
        "Road access, corner-lot position, cul-de-sac or acreage relationship",
        "Community amenities only with permission and accurate proximity",
        "Avoid exaggerating distance, boundaries, views or neighborhood relationships",
        "Do not imply that a drone image is a survey or establishes a property line",
    ]
    right = [
        "Move vehicles, bins, hoses and temporary clutter when practical",
        "Open blinds and turn on exterior lights if the campaign calls for it",
        "Confirm landscaping, pool and outdoor-living areas are presentation-ready",
        "Tell occupants and neighbors when appropriate; avoid unnecessary people in frame",
        "Allow a weather backup date for wind, rain, poor visibility or unsafe conditions",
    ]
    two_col = Table([[Paragraph("3. Honest location context", styles["SectionCustom"]), Paragraph("4. Property preparation", styles["SectionCustom"])], [checklist(left, styles, 2.95 * inch), checklist(right, styles, 2.95 * inch)]], colWidths=[3.35 * inch, 3.35 * inch], hAlign="LEFT")
    two_col.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (0, -1), 12), ("LEFTPADDING", (1, 0), (1, -1), 12), ("LINEBEFORE", (1, 0), (1, -1), 0.7, LINE)]))
    story.extend([two_col, Spacer(1, 12)])

    story.append(section("5. Vertical reel sequence", [
        "Open with the strongest exterior reveal in the first one to two seconds",
        "Move from wide property context to facade, lot and key exterior features",
        "Use short, stable clips designed for a 9:16 mobile frame",
        "Keep text inside safe areas and confirm whether the agent will add music or branding",
        "End with the property hero view or a clean space for the listing call to action",
    ], styles))
    story.append(section("6. Delivery check", [
        "Edited high-resolution photographs plus requested MLS or web copies",
        "Vertical 9:16 reel and/or horizontal 4K video as scoped",
        "Clear filenames and one organized delivery folder",
        "Final usage, deadline, decision-maker and included revision step confirmed",
    ], styles))

    note = Table([[Paragraph("FLIGHT NOTE", styles["BoxTitle"]), Paragraph("Every flight depends on airspace, property access, weather and site safety. A requested time is confirmed only after those conditions are reviewed. Drone imagery provides visual context and marketing media; it does not establish legal boundaries or replace a survey.", styles["BoxBody"])]], colWidths=[1.2 * inch, 5.55 * inch])
    note.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")), ("BOX", (0, 0), (-1, -1), 0.8, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 9), ("BOTTOMPADDING", (0, 0), (-1, -1), 9)]))
    story.extend([note, Spacer(1, 14)])

    cta = Table([[Paragraph("READY TO PLAN A DFW LISTING?", styles["Centered"])], [Paragraph('<link href="https://apsdrone.com/?utm_source=listing_shot_list_pdf&amp;utm_medium=download&amp;utm_campaign=dfw_real_estate_resource"><font color="#FFFFFF"><b>Request availability at apsdrone.com</b></font></link>', styles["Centered"])], [Paragraph('<font color="#FFFFFF">Call or text 832-938-9570</font>', styles["Centered"])]], colWidths=[6.75 * inch])
    cta.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), NAVY), ("LEFTPADDING", (0, 0), (-1, -1), 14), ("RIGHTPADDING", (0, 0), (-1, -1), 14), ("TOPPADDING", (0, 0), (-1, 0), 11), ("BOTTOMPADDING", (0, 0), (-1, 0), 3), ("TOPPADDING", (0, 1), (-1, -1), 2), ("BOTTOMPADDING", (0, -1), (-1, -1), 11)]))
    story.append(cta)

    doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
