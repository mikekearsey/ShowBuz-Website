#!/usr/bin/env python3
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = (
    Path(__file__).resolve().parents[1]
    / "ShowBuz-first-public-release-checklist.pdf"
)

INK = HexColor("#1a1a1a")
MUTED = HexColor("#555555")
RULE = HexColor("#dddddd")
ACCENT = HexColor("#c45a00")
HEAD = HexColor("#080706")
ROW_BG = HexColor("#f6f1e8")
CELL = HexColor("#faf8f4")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        "CoverKicker",
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=ACCENT,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        "CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=HEAD,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        "CoverLead",
        fontName="Helvetica",
        fontSize=11,
        leading=16,
        textColor=INK,
        spaceAfter=4,
        alignment=TA_JUSTIFY,
    )
)
styles.add(
    ParagraphStyle(
        "H1",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        textColor=HEAD,
        spaceBefore=16,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=10,
        leading=14.5,
        textColor=INK,
        spaceAfter=8,
        alignment=TA_JUSTIFY,
    )
)
styles.add(
    ParagraphStyle(
        "ItemTitle",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=HEAD,
        spaceBefore=8,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        "ItemBullet",
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=INK,
        leftIndent=12,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        "TableHead",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=HEAD,
    )
)
styles.add(
    ParagraphStyle(
        "TableCell",
        fontName="Helvetica",
        fontSize=9,
        leading=12.5,
        textColor=INK,
    )
)
styles.add(
    ParagraphStyle(
        "Footer",
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        "OrderItem",
        fontName="Helvetica",
        fontSize=10,
        leading=14.5,
        textColor=INK,
        leftIndent=4,
        spaceAfter=4,
    )
)


def bullet(text: str) -> ListItem:
    return ListItem(Paragraph(text, styles["ItemBullet"]), leftIndent=12, bulletColor=INK)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.4)
    canvas.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "ShowBuz  ·  First public release  ·  Internal")
    canvas.drawRightString(A4[0] - 18 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


doc = SimpleDocTemplate(
    str(OUT),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=16 * mm,
    bottomMargin=20 * mm,
    title="ShowBuz — steps before a first public release",
    author="Mike Kearsey Limited",
    subject="Pre-release checklist for the ShowBuz app and landing site",
)

story = []
story.append(Paragraph("INTERNAL CHECKLIST", styles["CoverKicker"]))
story.append(Paragraph("ShowBuz: steps before a first public release", styles["CoverTitle"]))
story.append(
    Paragraph(
        "Ship the iPhone app and this site as one product. The site currently "
        "advertises a download it cannot complete, and a few legal and auth paths "
        "are unproven. Do not do a public push until the items below are either "
        "fixed or explicitly accepted as known limits.",
        styles["CoverLead"],
    )
)
story.append(Spacer(1, 4 * mm))

story.append(Paragraph("Do not launch until these work", styles["H1"]))

story.append(Paragraph("1. A real App Store listing, and honest store buttons", styles["ItemTitle"]))
story.append(
    Paragraph(
        "The App Store and Google Play buttons both go to #download on this page, "
        "not a store. There is also a live contradiction: the site offers Google Play, "
        "while the FAQ says the app is iPhone-only and Android deps answer on WhatsApp. "
        "For v1, point App Store at the live listing and drop or relabel Play unless "
        "that build actually exists.",
        styles["Body"],
    )
)

story.append(Paragraph("2. Email confirm and password reset on a real iPhone", styles["ItemTitle"]))
story.append(
    Paragraph(
        "/email-confirmed and /reset-password hand tokens into depbookv3://auth/callback. "
        "Test the full mail → Safari → Open ShowBuz path with the app installed and "
        "not installed. Custom URL schemes fail silently if the app is missing; Apple "
        "will also expect this to work for App Review.",
        styles["Body"],
    )
)

story.append(Paragraph("3. GDPR opt-out for deps with no account", styles["ItemTitle"]))
story.append(
    Paragraph(
        "Privacy promises a form plus STOP / “opt out” on WhatsApp and SMS. The form "
        "currently posts straight at Supabase and skips the Next API that attaches the "
        "anon key, so it may 401 or fail CORS in production. Prove, with a real number "
        "or email:",
        styles["Body"],
    )
)
story.append(
    ListFlowable(
        [
            bullet("The form removes the dep from address books"),
            bullet("STOP on WhatsApp and SMS actually stops messages"),
            bullet("A chair cannot keep messaging that person through the app"),
        ],
        bulletType="bullet",
        leftIndent=18,
        spaceAfter=8,
    )
)
story.append(
    Paragraph(
        "That is a launch-blocker, not a polish item.",
        styles["Body"],
    )
)

story.append(Paragraph("4. Legal entity and App Store privacy answers match", styles["ItemTitle"]))
story.append(
    Paragraph(
        "The footer is Mike Kearsey Limited. Privacy says the controller is ShowBuz. "
        "Terms say the app is provided by ShowBuz. Apple, the ICO, and a first user "
        "will treat those as the same question. Pick one legal name and use it on the "
        "site, in the App Store listing, and in the privacy nutrition labels.",
        styles["Body"],
    )
)

story.append(Paragraph("5. The Guide is not shippable as-is", styles["ItemTitle"]))
story.append(
    Paragraph(
        "It is still uncommitted on main, Settings is undocumented, “email the week” "
        "was pulled because the taps were unknown, and chairs already caught a wrong "
        "path (add show is Settings, not Diary). Either finish it from real screens, "
        "or do not link it from the homepage until it is.",
        styles["Body"],
    )
)

story.append(Paragraph("Bulletproof in the app (not the landing-page repo)", styles["H1"]))
story.append(
    Paragraph(
        "Run these with two real chairs and a dep who does not install the app:",
        styles["Body"],
    )
)
story.append(
    ListFlowable(
        [
            bullet("Add show in Settings → published dates appear in Diary"),
            bullet("Ask a dep from the night → WhatsApp, SMS or email actually arrives"),
            bullet("Dep taps Available / Unavailable only on WhatsApp → both diaries update"),
            bullet("Auto Book walks the list until the night is filled"),
            bullet("Auto reconfirm at 9:00am on show day, one tap for both shows"),
            bullet("Deps tab is the chair’s list, and a dual-role user (chair + dep) uses one login"),
            bullet("Wrong or outdated schedule data: confirm the terms disclaimer matches what the app actually does"),
            bullet("Push, calendar, and Travel Assist: optional, permission-gated, and off if refused"),
        ],
        bulletType="bullet",
        leftIndent=18,
        spaceAfter=8,
    )
)
story.append(
    Paragraph(
        "If any of those fail in the wild, the homepage copy is false.",
        styles["Body"],
    )
)

story.append(Paragraph("This site still needs hardening", styles["H1"]))

risk_header = [
    Paragraph("Risk", styles["TableHead"]),
    Paragraph("Why it matters", styles["TableHead"]),
]
rows = [
    risk_header,
    [
        Paragraph("Hydration error from the homepage scroll script in layout.tsx", styles["TableCell"]),
        Paragraph("Dev overlay already fired; can bite SEO and first paint", styles["TableCell"]),
    ],
    [
        Paragraph("No robots.txt, sitemap, or Open Graph image", styles["TableCell"]),
        Paragraph("Shared links look unfinished", styles["TableCell"]),
    ],
    [
        Paragraph("No tests or CI", styles["TableCell"]),
        Paragraph("Auth redirects and the opt-out route can regress unnoticed", styles["TableCell"]),
    ],
    [
        Paragraph("Uncommitted Guide / Header / Hero work on main", styles["TableCell"]),
        Paragraph("Easy to deploy the wrong tree", styles["TableCell"]),
    ],
    [
        Paragraph("Copy: “The show’s already in your diary”", styles["TableCell"]),
        Paragraph("Chairs must add the show in Settings first", styles["TableCell"]),
    ],
]

table = Table(rows, colWidths=[78 * mm, 96 * mm], repeatRows=1)
table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), ROW_BG),
            ("BACKGROUND", (0, 1), (-1, -1), CELL),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ("GRID", (0, 0), (-1, -1), 0.4, RULE),
        ]
    )
)
story.append(table)
story.append(Spacer(1, 3 * mm))
story.append(
    Paragraph(
        "Also do a production check of /privacy, /terms, /guide, /email-confirmed "
        "and /reset-password on a phone, not only desktop.",
        styles["Body"],
    )
)

story.append(Paragraph("Suggested order this week", styles["H1"]))
order = [
    "1. App Store listing live; Play button gone or honest.",
    "2. Confirm + reset password on device, app installed and not.",
    "3. Opt-out form + STOP, end to end.",
    "4. Legal name aligned everywhere.",
    "5. Two-chair / one-WhatsApp-only-dep rehearsal of the booking loop.",
    "6. Either finish the Guide from screenshots of Settings, or unlink it.",
    "7. Then announce — soft launch to a handful of chairs before any public push.",
]
for line in order:
    story.append(Paragraph(line, styles["OrderItem"]))

story.append(Spacer(1, 4 * mm))
story.append(
    Paragraph(
        "Treat a small invited group as the first release, not a press or social blast, "
        "until WhatsApp replies and opt-out have survived a real week of shows.",
        styles["Body"],
    )
)

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
