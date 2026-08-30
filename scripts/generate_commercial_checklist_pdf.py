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
OUTPUT = ROOT / "output" / "pdf" / "dfw-commercial-drone-project-checklist.pdf"
LOGO = ROOT / "assets" / "brand-logo.png"
HERO = ROOT / "marketing-kit" / "google-business-media-2026-08-30" / "dfw-dallas-commercial.jpg"

NAVY = colors.HexColor("#0F172A")
BLUE = colors.HexColor("#2563EB")
CYAN = colors.HexColor("#06B6D4")
SLATE = colors.HexColor("#334155")
MUTED = colors.HexColor("#64748B")
PALE = colors.HexColor("#EFF6FF")
LINE = colors.HexColor("#CBD5E1")
WHITE = colors.white


def checkbox():
    drawing = Drawing(12, 12)
    drawing.add(Rect(1, 1, 9, 9, strokeColor=BLUE, fillColor=WHITE, strokeWidth=1.2))
    return drawing


def checklist(items, styles, text_width=6.48 * inch):
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
            Spacer(1, 12),
        ]
    )


def draw_page(canvas, doc):
    canvas.saveState()
    width, height = LETTER
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 0.34 * inch, width, 0.34 * inch, stroke=0, fill=1)
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(WHITE)
    canvas.drawString(0.55 * inch, height - 0.22 * inch, "APS DRONE  |  DFW COMMERCIAL DRONE PROJECT CHECKLIST")
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
    styles.add(
        ParagraphStyle(
            name="Eyebrow",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=BLUE,
            spaceAfter=7,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TitleCustom",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=25,
            leading=28,
            textColor=NAVY,
            alignment=TA_LEFT,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Lead",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.4,
            leading=15,
            textColor=SLATE,
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionCustom",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=16,
            textColor=NAVY,
            spaceBefore=2,
            spaceAfter=1,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Check",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9.3,
            leading=12.5,
            textColor=SLATE,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11.2,
            textColor=MUTED,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BoxTitle",
            parent=styles["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            textColor=BLUE,
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BoxBody",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8.8,
            leading=12,
            textColor=SLATE,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Centered",
            parent=styles["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=14,
            alignment=TA_CENTER,
            textColor=WHITE,
        )
    )

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.58 * inch,
        title="DFW Commercial Drone Project Checklist",
        author="APS Drone",
        subject="Commercial drone photography and video planning checklist for Dallas-Fort Worth projects",
    )

    story = []
    logo = Image(str(LOGO), width=2.35 * inch, height=0.47 * inch)
    logo.hAlign = "LEFT"
    story.extend(
        [
            logo,
            Spacer(1, 8),
            Paragraph("FREE PLANNING RESOURCE", styles["Eyebrow"]),
            Paragraph("DFW Commercial Drone<br/>Project Checklist", styles["TitleCustom"]),
            Paragraph(
                "Use this checklist before requesting aerial photography, 4K video, construction progress documentation, roof or exterior capture, or a vertical property reel for a Dallas-Fort Worth commercial site.",
                styles["Lead"],
            ),
        ]
    )

    hero = Image(str(HERO), width=6.9 * inch, height=2.25 * inch)
    hero.hAlign = "CENTER"
    story.extend([hero, Spacer(1, 10)])

    quick = Table(
        [[Paragraph("THE STRONGEST BRIEF ANSWERS SEVEN QUESTIONS", styles["BoxTitle"]), Paragraph("Where is the site? What is the business purpose? Which views matter? Who controls access? What safety restrictions apply? When is the preferred flight window? What files are due, and when?", styles["BoxBody"])]],
        colWidths=[2.2 * inch, 4.55 * inch],
    )
    quick.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#BFDBFE")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.extend([quick, Spacer(1, 12)])

    story.append(
        section(
            "1. Project purpose and intended use",
            [
                "Property marketing, leasing, sale, proposal or investor presentation",
                "Construction baseline, recurring progress or milestone documentation",
                "Roof, facade, parking, access or exterior visual documentation",
                "Website, organic social, paid advertising or internal stakeholder use",
                "Horizontal 4K video, vertical social reel, still photography or a mixed package",
            ],
            styles,
        )
    )
    story.append(
        section(
            "2. Information to send with the quote request",
            [
                "Project address or site coordinates",
                "Preferred shoot date, backup date and delivery deadline",
                "On-site contact name and approved access window",
                "Must-have views, marked site plan or reference images",
                "Required photo count, video orientation, duration and file formats",
                "Certificate of insurance, vendor onboarding or property-permission requirements",
            ],
            styles,
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("COMMERCIAL DRONE PROJECT BRIEF", styles["Eyebrow"]))
    story.append(Paragraph("Capture, safety and delivery checklist", styles["TitleCustom"]))
    story.append(HRFlowable(width="100%", thickness=1, color=LINE, spaceBefore=0, spaceAfter=12))

    left = [
        "Wide property context, nearby roads and surrounding development",
        "Building identity, entrances, signage, frontage and hero angles",
        "Roof context, HVAC areas, drainage paths or exterior elevations",
        "Parking, loading, service access and vehicle circulation",
        "Repeatable viewpoints for future progress visits",
        "Ground or FPV capture when specifically scoped and site-safe",
    ]
    right = [
        "Operating hours and approved takeoff or landing area",
        "Active construction, vehicle movements, cranes or temporary hazards",
        "People, tenants, neighboring property or sensitive areas to avoid",
        "Security rules, PPE and escort requirements",
        "Airspace, weather and site-safety review completed before confirmation",
        "Backup date understood if conditions are not fly-safe",
    ]
    two_col = Table(
        [
            [Paragraph("3. Shot-list priorities", styles["SectionCustom"]), Paragraph("4. Access and safety", styles["SectionCustom"])],
            [checklist(left, styles, 2.95 * inch), checklist(right, styles, 2.95 * inch)],
        ],
        colWidths=[3.35 * inch, 3.35 * inch],
        hAlign="LEFT",
    )
    two_col.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, -1), 12),
                ("LEFTPADDING", (1, 0), (1, -1), 12),
                ("LINEBEFORE", (1, 0), (1, -1), 0.7, LINE),
            ]
        )
    )
    story.extend([two_col, Spacer(1, 12)])

    story.append(
        section(
            "5. Delivery and approval",
            [
                "High-resolution originals and web-ready copies are identified",
                "4K horizontal, vertical 9:16 or both orientations are confirmed",
                "File naming, folder structure and delivery contact are agreed",
                "Usage is identified: listing, website, social, advertising or internal documentation",
                "Decision-maker and any included revision step are named before production",
                "Final scope, price and expected turnaround are confirmed in writing",
            ],
            styles,
        )
    )

    note = Table(
        [[Paragraph("PLANNING NOTE", styles["BoxTitle"]), Paragraph("A requested date is not a guaranteed flight date until airspace, weather, access and site safety are confirmed. APS Drone supplies organized visual capture and media; roof or thermal imagery does not replace interpretation by a qualified inspector, engineer or other professional.", styles["BoxBody"])]],
        colWidths=[1.4 * inch, 5.35 * inch],
    )
    note.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.extend([note, Spacer(1, 14)])

    cta = Table(
        [[Paragraph("READY TO PLAN A DFW PROJECT?", styles["Centered"])], [Paragraph('<link href="https://apsdrone.com/?utm_source=checklist_pdf&amp;utm_medium=download&amp;utm_campaign=dfw_commercial_checklist"><font color="#FFFFFF"><b>Request availability at apsdrone.com</b></font></link>', styles["Centered"])], [Paragraph('<font color="#FFFFFF">Call or text 832-938-9570</font>', styles["Centered"]) ]],
        colWidths=[6.75 * inch],
    )
    cta.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NAVY),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, 0), 11),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 3),
                ("TOPPADDING", (0, 1), (-1, -1), 2),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 11),
            ]
        )
    )
    story.append(cta)

    doc.build(story, onFirstPage=draw_page, onLaterPages=draw_page)
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf()
