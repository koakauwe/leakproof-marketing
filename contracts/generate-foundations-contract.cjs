// Generates the Foundations PT Services Agreement as a .docx file
// Run: node contracts/generate-foundations-contract.cjs
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageOrientation, TabStopType, TabStopPosition,
} = require('docx');

const NAVY = "264A73";
const BORDER_GRAY = "CCCCCC";
const HEADER_BG = "E8EEF5";

// ----- helpers -----
const para = (text, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 120, line: 300 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: [new TextRun({ text, ...opts.run })],
});

const bold = (text) => new TextRun({ text, bold: true });
const plain = (text) => new TextRun({ text });

const heading1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 240 },
  children: [new TextRun({ text, bold: true, size: 40, color: NAVY })],
});

const heading2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 360, after: 160 },
  children: [new TextRun({ text, bold: true, size: 28, color: NAVY })],
});

const heading3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, bold: true, size: 24, color: NAVY })],
});

const bulletItem = (children) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 40, after: 40, line: 280 },
  children: children.map(c => typeof c === "string" ? plain(c) : c),
});

const numberItem = (children) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  spacing: { before: 60, after: 60, line: 280 },
  alignment: AlignmentType.JUSTIFIED,
  children: children.map(c => typeof c === "string" ? plain(c) : c),
});

const richPara = (children, opts = {}) => new Paragraph({
  spacing: { before: 80, after: 120, line: 300 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  children: children.map(c => typeof c === "string" ? plain(c) : c),
});

// Table cell helper
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: BORDER_GRAY };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const tcell = (text, opts = {}) => new TableCell({
  borders: cellBorders,
  width: { size: opts.width, type: WidthType.DXA },
  shading: opts.header ? { fill: HEADER_BG, type: ShadingType.CLEAR } : undefined,
  margins: { top: 120, bottom: 120, left: 160, right: 160 },
  children: [new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text, bold: !!opts.header, size: 22 })],
  })],
});

// Signature block builder
const sigLine = () => new Paragraph({
  spacing: { before: 360, after: 0 },
  border: { bottom: { color: "000000", size: 6, style: BorderStyle.SINGLE, space: 1 } },
  children: [new TextRun(" ")],
});

const sigField = (label, value = "") => new Paragraph({
  spacing: { before: 120, after: 0 },
  children: [
    new TextRun({ text: label + ": ", bold: true, size: 22 }),
    new TextRun({ text: value, size: 22 }),
    new TextRun({ text: "_______________________________________", size: 22 }),
  ],
});

// ----- document -----
const doc = new Document({
  creator: "Leakproof Marketing",
  title: "Services Agreement — Foundations Physical Therapy",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }, // 11pt body
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 40, bold: true, font: "Calibri", color: NAVY },
        paragraph: { spacing: { before: 0, after: 240 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: NAVY },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: NAVY },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [

      // TITLE
      heading1("SERVICES AGREEMENT"),

      // PARTIES
      richPara([
        plain("This Services Agreement (“Agreement”) is entered into on "),
        bold("[DATE]"),
        plain(" by and between:"),
      ]),
      richPara([
        bold("Leakproof Marketing"),
        plain(" (“Leakproof”), located at [Address], represented by Koa Kauwe; and"),
      ]),
      richPara([
        bold("Foundations Physical Therapy, PLLC"),
        plain(" (“Client”), located at 145 Palisade Street, Suite 322, Dobbs Ferry, NY 10522, represented by Dr. Ronit Sukenick."),
      ]),
      para("Together, the “Parties.”"),

      // SECTION 1
      heading2("1. Services"),

      heading3("1.1 Initial Site Build — Modernization Migration (One-Time Project)"),
      para("Leakproof will rebuild foundations-pt.com on a modern static framework (Astro hosted on Cloudflare Pages), delivering the following:"),

      richPara([bold("13 new pages built:")]),
      bulletItem(["Homepage"]),
      bulletItem(["About / Our Team (combined practice + provider bios as sections)"]),
      bulletItem(["Contact"]),
      bulletItem(["What-to-Expect"]),
      bulletItem(["Insurance Information"]),
      bulletItem(["Frequently Asked Questions"]),
      bulletItem(["Privacy Policy"]),
      bulletItem(["Terms of Service"]),
      bulletItem(["Services overview hub"]),
      bulletItem(["Women’s Pelvic Health (patient-type service page)"]),
      bulletItem(["Men’s Pelvic Health (patient-type service page)"]),
      bulletItem(["Orthopedic Health (patient-type service page)"]),
      bulletItem(["Conditions hub (linked list of conditions treated)"]),

      richPara([bold("Migration:"), plain(" All 18 existing blog posts moved with metadata and schema preserved.")]),

      richPara([bold("Technical foundation:")]),
      bulletItem(["301 redirects from all existing URLs to preserve search rankings"]),
      bulletItem(["Sitewide structured data (LocalBusiness, FAQPage, Article, Person schemas)"]),
      bulletItem(["Internal linking architecture and breadcrumb navigation"]),
      bulletItem(["Core Web Vitals optimization (target: Mobile PageSpeed 90+)"]),
      bulletItem(["Cloudflare hosting and deployment setup"]),
      bulletItem(["Google Analytics 4 and Search Console setup or transfer"]),
      bulletItem(["DNS cutover with staging review and rollback plan"]),

      richPara([bold("Fee:"), plain(" $1,500, due in full at signing.")]),
      richPara([bold("Timeline:"), plain(" 4–6 weeks from signed agreement and payment to live launch.")]),

      richPara([bold("Optional Upgrades & Add-Ons:"), plain(" Additional pages beyond the 13 included — such as dedicated condition pages, city landing pages, the Westchester Women’s Health Network directory, Patient Stories page, or individual provider bio pages — may be added during or after the initial build as separate, scoped engagements (typically $300–$500 per piece). See Section 1.4 (Opportunity-Based Engagements).")]),

      heading3("1.2 Monthly SEO Retainer"),
      para("Beginning the calendar month after site launch, Leakproof will provide the following services each month:"),

      numberItem([bold("Performance monitoring & monthly report"), plain(" — Google Analytics lead tracking, Search Console indexing checks (with focus on new service and condition pages), ranking trajectory, query analysis, and a written summary with strategic recommendations.")]),
      numberItem([bold("One blog post per month"), plain(" — researched, drafted, and published. Sourced from the monthly interview.")]),
      numberItem([bold("One monthly interview (15–30 minutes)"), plain(" — with Client or a designated team member to source authentic content for the blog post, bio refreshes, and review spotlights.")]),
      numberItem([bold("Therapist bio refreshes"), plain(" — bios kept current with achievements, certifications, and training milestones.")]),
      numberItem([bold("Patient review spotlights"), plain(" — integration of featured Google reviews into the site by therapist name, with no Protected Health Information disclosed.")]),
      numberItem([bold("Four Google Business Profile native posts per month"), plain(" — weekly cadence, with photos and links.")]),
      numberItem([bold("GBP optimization"), plain(" — service list updates, photo refreshes, attribute accuracy, hours, and category alignment.")]),
      numberItem([bold("Cross-platform NAP and branding consistency"), plain(" — Google Business Profile, Healthgrades, Yelp, and other directories kept aligned on name, address, phone, and core service descriptions.")]),
      numberItem([bold("Site maintenance"), plain(" — small content updates, fixes, and additions within reasonable scope.")]),

      richPara([bold("Fee:"), plain(" $500 per month, billed monthly in advance.")]),

      heading3("1.3 Optional Google Ads Management"),
      para("At Client’s request, Leakproof will manage Google Ads campaigns including campaign setup, ad copy, keyword research, negative keyword maintenance, bid management, conversion tracking, and monthly reporting. Client determines and controls Client’s own ad budget directly with Google, separate from this management fee."),
      richPara([bold("Fee:"), plain(" $500 per month, billed monthly in advance when active. Client may add or remove this service at any time.")]),

      heading3("1.4 Opportunity-Based Engagements"),
      para("Beyond the Monthly SEO Retainer, Leakproof may identify growth opportunities (such as guest posts, podcast appearances, partnership backlinks, additional condition pages, or special campaigns) as they arise. Each opportunity will be scoped and priced separately. Client may accept or decline each one. Client is encouraged but not obligated to reserve a monthly opportunity budget."),

      // SECTION 2
      heading2("2. Service Period and Cancellation"),

      heading3("2.1 No Minimum Term"),
      para("Services are billed and delivered on a monthly basis. There is no minimum commitment under this Agreement."),

      heading3("2.2 Scope Stability"),
      para("The scope of monthly services described in Section 1.2 will remain unchanged for six (6) months from the start of services. After six months, both Parties may reassess scope and pricing together in good faith."),

      heading3("2.3 Cancellation"),
      para("Client may cancel any service at any time by written notice to Leakproof (email to a designated address shall suffice). Service will continue through the end of the currently paid month and will then end."),

      heading3("2.4 No Refunds"),
      para("All payments under this Agreement are non-refundable in all circumstances, including:"),
      bulletItem(["The Initial Site Build fee, regardless of cancellation timing"]),
      bulletItem(["Any monthly retainer or Google Ads management payment, regardless of cancellation timing or partial-month usage"]),

      heading3("2.5 Asset Handover on Cancellation"),
      para("Upon cancellation, Leakproof will deliver all owned assets (codebase, GitHub repository, Cloudflare project, content, and account credentials Leakproof maintains on Client’s behalf) to Client within fourteen (14) days of the effective cancellation date."),

      // SECTION 3
      heading2("3. Fees and Payment"),

      // Fee table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 1800, 3960],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              tcell("Service", { width: 3600, header: true }),
              tcell("Fee", { width: 1800, header: true }),
              tcell("Billing", { width: 3960, header: true }),
            ],
          }),
          new TableRow({
            children: [
              tcell("Initial Site Build", { width: 3600 }),
              tcell("$1,500", { width: 1800 }),
              tcell("Due in full at signing", { width: 3960 }),
            ],
          }),
          new TableRow({
            children: [
              tcell("Monthly SEO Retainer", { width: 3600 }),
              tcell("$500/mo", { width: 1800 }),
              tcell("Monthly in advance, beginning month after launch", { width: 3960 }),
            ],
          }),
          new TableRow({
            children: [
              tcell("Google Ads Management (optional)", { width: 3600 }),
              tcell("$500/mo", { width: 1800 }),
              tcell("Monthly in advance when active", { width: 3960 }),
            ],
          }),
        ],
      }),

      para(""),
      para("Payment is due within seven (7) days of invoice. Invoices are issued on the first day of each month. Late payments may accrue interest at 1.5% per month."),

      // SECTION 4
      heading2("4. Client Responsibilities"),
      para("To allow Leakproof to deliver effectively, Client agrees to:"),
      bulletItem(["Provide access to existing accounts (WordPress admin, domain registrar, Google Analytics 4, Search Console, Google Business Profile manager access) within five (5) business days of request"]),
      bulletItem(["Participate in one monthly interview of 15–30 minutes for content sourcing"]),
      bulletItem(["Respond to content approval requests within five (5) business days; otherwise content shall be deemed approved as drafted"]),
      bulletItem(["Inform Leakproof of any changes to clinical staff, services, or business operations that affect website content"]),

      // SECTION 5
      heading2("5. Ownership"),
      para("All deliverables — codebase, content, designs, and assets — are owned by Client upon payment. Leakproof retains the right to reference completed work in portfolio, marketing, and case studies, without disclosing confidential business or patient details."),

      // SECTION 6
      heading2("6. Confidentiality"),
      para("Both Parties agree to keep confidential any non-public information shared during the engagement, including business operations, financial information, and patient information."),

      // SECTION 7
      heading2("7. HIPAA and Patient Data"),
      para("Website forms operated under this Agreement will not solicit Protected Health Information (“PHI”) as defined under the Health Insurance Portability and Accountability Act of 1996. If patient submissions or other communications inadvertently contain PHI, both Parties agree to handle such information in compliance with HIPAA. If Client’s needs evolve to require Leakproof to handle PHI directly, the Parties will execute a separate Business Associate Agreement (BAA) before such work begins."),

      // SECTION 8
      heading2("8. Limitation of Liability"),
      para("Leakproof’s total liability for any claim arising under this Agreement is limited to the fees actually paid by Client to Leakproof in the three (3) months preceding the claim. Leakproof shall not be liable for any indirect, consequential, incidental, special, or punitive damages, including lost profits or lost business, arising under or related to this Agreement."),

      // SECTION 9
      heading2("9. General Terms"),
      bulletItem(["This Agreement shall be governed by and construed in accordance with the laws of the State of New York."]),
      bulletItem(["Any modifications to this Agreement must be in writing and signed by both Parties."]),
      bulletItem(["This Agreement constitutes the entire agreement between the Parties on these matters and supersedes any prior agreements or understandings."]),
      bulletItem(["If any provision of this Agreement is held unenforceable, the remaining provisions shall remain in full force and effect."]),
      bulletItem(["This Agreement may be executed in counterparts and via electronic signature."]),

      // SIGNATURES
      heading2("Signatures"),
      para("By signing below, both Parties acknowledge that they have read, understood, and agreed to the terms of this Agreement."),

      richPara([bold("Leakproof Marketing")]),
      sigField("Signature"),
      sigField("Name", "Koa Kauwe"),
      sigField("Title", "Owner"),
      sigField("Date"),

      para(""),

      richPara([bold("Foundations Physical Therapy, PLLC")]),
      sigField("Signature"),
      sigField("Name", "Dr. Ronit Sukenick"),
      sigField("Title", "Owner"),
      sigField("Date"),

    ],
  }],
});

const outPath = path.join(__dirname, "foundations-pt-services-agreement-2026-04.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Wrote:", outPath);
});
