const Invoice = require("../../models/invoice.model");
const PDFDocument = require("pdfkit");

//  GET ALL INVOICES
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("studentId", "admissionNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });

  } catch (error) {
    console.error("Get Invoice Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  DOWNLOAD INVOICE PDF

/*exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch invoice with populated data
    const invoice = await Invoice.findById(id).populate("studentId");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // --- CONFIGURATION & STYLING ---
    const PRIMARY_COLOR = "#00a8b5"; // Cyan/Teal from the image
    const DARK_COLOR = "#222222"; // Near black for primary text
    const GRAY_COLOR = "#777777"; // Gray for secondary text
    const LIGHT_GRAY = "#dddddd"; // For subtle dividers
    const CURRENCY = "INR "; // Changed from $ to INR for context, easily adjustable

    // Initialize Document
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // Set Response Headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=INV-${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // ==========================================
    // 1. TOP RIGHT GRADIENT BACKGROUND (THE "WAVE")
    // ==========================================
    doc.save();
    // Create a smooth light-to-dark cyan linear gradient
    const grad = doc.linearGradient(350, 35, 575, 300);
    grad.stop(0, '#173331').stop(1, '#00838f'); 

    // Draw the fluid bezier curve top right background
    doc.moveTo(300, 0)
       .bezierCurveTo(400, 100, 450, 230, 595, 205)
       .lineTo(595, 0)
       .fill(grad);
    doc.restore();

    // ==========================================
    // 2. HEADER LEFT (QR CODE & CONTACT INFO)
    // ==========================================
    const leftColX = 40;
    const rightColX = 220;

    // Mock QR Code Box
    doc.rect(leftColX, 40, 50, 50).lineWidth(1).stroke(PRIMARY_COLOR);
    doc.rect(leftColX + 5, 45, 12, 12).fill(PRIMARY_COLOR);
    doc.rect(leftColX + 33, 45, 12, 12).fill(PRIMARY_COLOR);
    doc.rect(leftColX + 5, 73, 12, 12).fill(PRIMARY_COLOR);
    doc.rect(leftColX + 22, 58, 6, 6).fill(DARK_COLOR);
    doc.rect(leftColX + 32, 68, 14, 14).fill(DARK_COLOR);

    // Contact Details
    doc.fillColor(DARK_COLOR).fontSize(9).font("Helvetica-Bold");
    doc.text("Tel:", 110, 42).font("Helvetica").text("123-456-7890", 135, 42);
    doc.font("Helvetica-Bold").text("Mail:", 110, 54).font("Helvetica").text("info@vigyanacademy.com", 135, 54);
    doc.font("Helvetica-Bold").text("Web:", 110, 66).font("Helvetica").text("www.vigyanacademy.com", 135, 66);

    doc.fillColor(GRAY_COLOR).text("Your Street Address Here\nPatna, Bihar, 800001", 110, 85);

    // ==========================================
    // 3. HEADER RIGHT (SCHOOL NAME ON THE WAVE)
    // ==========================================
    doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold").text("VIGYAN ACADEMY", 350, 50, { width: 220, align: "right" });
    doc.fontSize(10).font("Helvetica").text("EDUCATION FOR EXCELLENCE", 300, 78, { width: 250, align: "right", letterSpacing: 1 });

    // ==========================================
    // 4. INVOICE TITLE & DATE
    // ==========================================
    doc.fillColor(GRAY_COLOR).fontSize(10).font("Helvetica");
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, leftColX, 165);

    doc.fillColor(DARK_COLOR).fontSize(26).font("Helvetica-Bold");
    doc.text("INVOICE", rightColX, 155, { letterSpacing: 1 });

    // ==========================================
    // 5. TWO-COLUMN LAYOUT
    // ==========================================
    
    // ------ LEFT COLUMN (METADATA) ------
    let leftY = 220;

    // Invoice No
    doc.fillColor(DARK_COLOR).fontSize(10).font("Helvetica-Bold").text(`INVOICE NO # ${invoice.invoiceNumber}`, leftColX, leftY);
    doc.moveTo(leftColX, leftY + 15).lineTo(180, leftY + 15).lineWidth(2).stroke(PRIMARY_COLOR);
    
    leftY += 35;
    // TO
    doc.fillColor(GRAY_COLOR).fontSize(9).font("Helvetica-Bold").text("TO", leftColX, leftY);
    doc.fillColor(PRIMARY_COLOR).fontSize(11).text(`Name - ${invoice.studentName.toUpperCase()}`, leftColX, leftY + 12);
    
    leftY += 45;
    // CLASS
    doc.fillColor(DARK_COLOR).fontSize(9).font("Helvetica-Bold").text("CLASS", leftColX, leftY);
    doc.fillColor(GRAY_COLOR).font("Helvetica").text(invoice.className, leftColX, leftY + 12);
    
    leftY += 45;
    // SECTION
    doc.fillColor(DARK_COLOR).fontSize(9).font("Helvetica-Bold").text("SECTION", leftColX, leftY);
    doc.fillColor(GRAY_COLOR).font("Helvetica").text(invoice.section, leftColX, leftY + 12);

    leftY += 45;
    // ADMISSION NUMBER
    doc.fillColor(DARK_COLOR).fontSize(9).font("Helvetica-Bold").text("ADMISSION NUMBER", leftColX, leftY);
    doc.fillColor(GRAY_COLOR).font("Helvetica").text(invoice.studentId?.admissionNumber || 'N/A', leftColX, leftY + 12);


    // ------ RIGHT COLUMN (TABLE) ------
    let rightY = 220;

    // Table Headers
    doc.fillColor(DARK_COLOR).fontSize(10).font("Helvetica-Bold");
    doc.text("ITEM DESCRIPTIONS", rightColX, rightY);
    doc.text("MONTH", 400, rightY);
    doc.text("PRICE", 480, rightY, { width: 70, align: "right" });
    
    // Thick header underline
    doc.moveTo(rightColX, rightY + 15).lineTo(550, rightY + 15).lineWidth(2).stroke(PRIMARY_COLOR);
    
    rightY += 30;

    // Table Row
    doc.fillColor(DARK_COLOR).font("Helvetica-Bold").fontSize(10).text("SCHOOL TUITION FEE", rightColX, rightY);
    doc.fillColor(GRAY_COLOR).font("Helvetica").fontSize(8).text("Standard monthly tuition fee for the current academic session.", rightColX, rightY + 12, { width: 160 });
    
    doc.fillColor(DARK_COLOR).font("Helvetica").fontSize(10).text(invoice.month, 400, rightY + 6);
    doc.text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, 480, rightY + 6, { width: 70, align: "right" });
    
    rightY += 40;
    // Thin row divider
    doc.moveTo(rightColX, rightY).lineTo(550, rightY).lineWidth(1).stroke(LIGHT_GRAY);

    rightY += 30;
    // Thick table end line
    doc.moveTo(rightColX, rightY).lineTo(550, rightY).lineWidth(2).stroke(PRIMARY_COLOR);

    // ==========================================
    // 6. TOTALS & SUMMARY
    // ==========================================
    rightY += 20;
    doc.fillColor(GRAY_COLOR).font("Helvetica").fontSize(9);
    doc.text("Sub-Total", 350, rightY);
    doc.fillColor(DARK_COLOR).text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, 480, rightY, { width: 70, align: "right" });
    
    rightY += 15;
    doc.fillColor(GRAY_COLOR);
    doc.text("Tax, Vat (0%)", 350, rightY);
    doc.fillColor(DARK_COLOR).text(`${CURRENCY}0.00`, 480, rightY, { width: 70, align: "right" });
    
    rightY += 15;
    doc.fillColor(GRAY_COLOR);
    doc.text("Discount (0%)", 350, rightY);
    doc.fillColor(DARK_COLOR).text(`${CURRENCY}0.00`, 480, rightY, { width: 70, align: "right" });
    
    rightY += 20;
    // Solid Teal Background for Grand Total
    doc.rect(380, rightY, 170, 25).fill(PRIMARY_COLOR);
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(12).text("Total", 395, rightY + 7);
    doc.text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, 480, rightY + 7, { width: 60, align: "right" });

    // ==========================================
    // 7. FOOTER & SIGNATURE
    // ==========================================
    let footerY = 560;

    // Payment Methods (Left)
    doc.fillColor(DARK_COLOR).fontSize(10).font("Helvetica-Bold").text("Payment Method:", leftColX, footerY);
    doc.fillColor(GRAY_COLOR).fontSize(8).font("Helvetica")
       .text("Bank Transfer : payments@vigyanacademy.com", leftColX, footerY + 15)
       .text("Card Payment We Accept : Visa, Mastercard", leftColX, footerY + 25);
       
    footerY += 50;
    // Terms & Conditions (Left)
    doc.fillColor(DARK_COLOR).fontSize(10).font("Helvetica-Bold").text("Terms & Conditions:", leftColX, footerY);
    doc.fillColor(GRAY_COLOR).fontSize(8).font("Helvetica")
       .text("Please make the payment by the designated due date. Late payments may incur an additional fee. This is a computer-generated invoice and requires no physical signature.", leftColX, footerY + 15, { width: 250, align: "justify" });

    // Signature Area (Right)
    const sigY = 640;
    // Using Times-Italic for a handwritten feel since PDFKit doesn't have custom fonts by default
    doc.fillColor(DARK_COLOR).fontSize(22).font("Times-Italic").text("Authorized Admin", 380, sigY, { align: "center", width: 170 });
    doc.moveTo(380, sigY + 25).lineTo(550, sigY + 25).lineWidth(1).stroke(LIGHT_GRAY);
    doc.fontSize(10).font("Helvetica-Bold").text("Vigyan Academy Admin", 380, sigY + 30, { align: "center", width: 170 });
    doc.fillColor(GRAY_COLOR).fontSize(8).font("Helvetica").text("Finance Department", 380, sigY + 42, { align: "center", width: 170 });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("Download Invoice Error:", error);

    // Ensure we don't try to send JSON if headers were already sent
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "An error occurred while generating the invoice document.",
        error: error.message
      });
    }
  }
};
*/

exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate("studentId");

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    // ─── COLORS ───────────────────────────────────────────────
    const TEAL        = "#0B7A87";   // primary brand
    const TEAL_LIGHT  = "#E6F4F6";   // light teal bg
    const DARK        = "#1A1A2E";   // near-black
    const GRAY        = "#6B7280";   // muted text
    const BORDER      = "#CBD5E1";   // table borders
    const WHITE       = "#FFFFFF";
    const ACCENT      = "#F0FAFB";   // row alternating

    const CURRENCY    = "INR ";

    const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=INV-${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);
    doc.on("error", (err) => console.error("PDF stream error:", err));

    const PW = 595.28;   // A4 width
    const PH = 841.89;   // A4 height
    const M  = 40;       // margin

    // ═══════════════════════════════════════════════
    // 1.  HEADER  – solid dark bar
    // ═══════════════════════════════════════════════
    doc.rect(0, 0, PW, 110).fill(DARK);

    // decorative teal accent strip on right
    doc.rect(PW - 8, 0, 8, 110).fill(TEAL);

    // School name
    doc.fillColor(WHITE)
       .font("Helvetica-Bold")
       .fontSize(22)
       .text("VIGYAN ACADEMY", M, 30, { width: 320 });

    doc.fillColor(TEAL)
       .font("Helvetica")
       .fontSize(9)
       .text("E D U C A T I O N   F O R   E X C E L L E N C E", M, 58, { width: 320, characterSpacing: 1 });

    // Contact block (right side of header)
    doc.fillColor("#94A3B8")
       .font("Helvetica")
       .fontSize(8)
       .text("+91 98765 43210", 360, 28, { width: 195, align: "right" })
       .text("info@vigyanacademy.com", 360, 42, { width: 195, align: "right" })
       .text("www.vigyanacademy.com", 360, 56, { width: 195, align: "right" })
       .text("Patna, Bihar — 800001", 360, 70, { width: 195, align: "right" });

    // Thin separator line under header
    doc.moveTo(0, 110).lineTo(PW, 110).lineWidth(3).stroke(TEAL);

    // ═══════════════════════════════════════════════
    // 2.  INVOICE TITLE TAG
    // ═══════════════════════════════════════════════
    let y = 130;

    // "INVOICE" label pill
    doc.rect(M, y, 110, 26).fill(TEAL);
    doc.fillColor(WHITE)
       .font("Helvetica-Bold")
       .fontSize(12)
       .text("INVOICE", M, y + 7, { width: 110, align: "center" });

    // Invoice number
    doc.fillColor(DARK)
       .font("Helvetica-Bold")
       .fontSize(11)
       .text(`# ${invoice.invoiceNumber}`, M + 120, y + 7);

    // Date (right-aligned)
    const dateStr = new Date(invoice.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric"
    });
    doc.fillColor(GRAY)
       .font("Helvetica")
       .fontSize(9)
       .text(`Date: ${dateStr}`, 350, y + 8, { width: 205, align: "right" });

    y += 50;

    // ═══════════════════════════════════════════════
    // 3.  TWO-COLUMN INFO SECTION
    // ═══════════════════════════════════════════════
    // Left card  – Student details
    doc.rect(M, y, 240, 115).fill(TEAL_LIGHT);
    doc.rect(M, y, 4, 115).fill(TEAL);   // accent left bar

    doc.fillColor(TEAL)
       .font("Helvetica-Bold")
       .fontSize(8)
       .text("BILLED TO", M + 14, y + 12);

    doc.fillColor(DARK)
       .font("Helvetica-Bold")
       .fontSize(12)
       .text((invoice.studentName || "Student").toUpperCase(), M + 14, y + 26, { width: 218 });

    const infoRows = [
      ["Admission No.", invoice.studentId?.admissionNumber || "N/A"],
      ["Class",         invoice.className || "N/A"],
      ["Section",       invoice.section   || "N/A"],
    ];

    let infoY = y + 52;
    infoRows.forEach(([label, value]) => {
      doc.fillColor(GRAY).font("Helvetica").fontSize(8).text(label + ":", M + 14, infoY);
      doc.fillColor(DARK).font("Helvetica-Bold").fontSize(8).text(value, M + 90, infoY);
      infoY += 16;
    });

    // Right card – Amount due
    const rightCardX = PW - M - 200;
    doc.rect(rightCardX, y, 200, 115).fill(DARK);
    doc.rect(rightCardX, y, 4, 115).fill(TEAL);

    doc.fillColor(TEAL)
       .font("Helvetica-Bold")
       .fontSize(8)
       .text("AMOUNT DUE", rightCardX + 14, y + 12);

    doc.fillColor(WHITE)
       .font("Helvetica-Bold")
       .fontSize(28)
       .text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, rightCardX + 14, y + 32, { width: 182, align: "center" });

    doc.fillColor("#94A3B8")
       .font("Helvetica")
       .fontSize(8)
       .text(`Month: ${invoice.month}`, rightCardX + 14, y + 76, { width: 182, align: "center" })
       .text(`Status: PAID`, rightCardX + 14, y + 90, { width: 182, align: "center" });

    y += 135;

    // ═══════════════════════════════════════════════
    // 4.  ITEMS TABLE
    // ═══════════════════════════════════════════════
    const colDesc  = M;
    const colMonth = 350;
    const colQty   = 430;
    const colAmt   = 490;
    const tableW   = PW - M - M;   // 515

    // Table header row
    doc.rect(M, y, tableW, 24).fill(DARK);
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(8);
    doc.text("DESCRIPTION",  colDesc  + 6, y + 8);
    doc.text("MONTH",        colMonth + 6, y + 8);
    doc.text("QTY",          colQty   + 6, y + 8, { width: 40, align: "center" });
    doc.text("AMOUNT",       colAmt,        y + 8, { width: 65, align: "right" });

    y += 24;

    // Single item row
    doc.rect(M, y, tableW, 44).fill(ACCENT);
    doc.rect(M, y, tableW, 44).lineWidth(0.5).stroke(BORDER);

    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(9)
       .text("School Tuition Fee", colDesc + 6, y + 10);
    doc.fillColor(GRAY).font("Helvetica").fontSize(7.5)
       .text("Monthly academic fee for current session", colDesc + 6, y + 24);

    doc.fillColor(DARK).font("Helvetica").fontSize(9)
       .text(invoice.month, colMonth + 6, y + 17)
       .text("1",           colQty   + 6, y + 17, { width: 40, align: "center" })
       .text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, colAmt, y + 17, { width: 65, align: "right" });

    y += 44;

    // Subtotal / Total rows
    const totalRows = [
      ["Sub-Total", parseFloat(invoice.amount).toFixed(2)],
      ["Tax / VAT (0%)", "0.00"],
      ["Discount",       "0.00"],
    ];

    totalRows.forEach(([label, val]) => {
      doc.rect(colMonth, y, tableW - (colMonth - M), 20).fill(WHITE);
      doc.rect(colMonth, y, tableW - (colMonth - M), 20).lineWidth(0.5).stroke(BORDER);

      doc.fillColor(GRAY).font("Helvetica").fontSize(8).text(label, colMonth + 8, y + 6);
      doc.fillColor(DARK).font("Helvetica").fontSize(8)
         .text(`${CURRENCY}${val}`, colAmt, y + 6, { width: 65, align: "right" });
      y += 20;
    });

    // Grand total highlighted row
    doc.rect(colMonth, y, tableW - (colMonth - M), 28).fill(TEAL);
    doc.fillColor(WHITE)
       .font("Helvetica-Bold")
       .fontSize(10)
       .text("TOTAL", colMonth + 8, y + 9)
       .text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, colAmt, y + 9, { width: 65, align: "right" });

    y += 42;

    // ═══════════════════════════════════════════════
    // 5.  NOTES  &  PAYMENT INFO
    // ═══════════════════════════════════════════════
    doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(9).text("PAYMENT DETAILS", M, y);
    y += 14;
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
       .text("Accepted Methods: Cash · Bank Transfer · UPI · NEFT", M, y, { width: 300 });

    y += 26;
    doc.fillColor(TEAL).font("Helvetica-Bold").fontSize(9).text("TERMS & CONDITIONS", M, y);
    y += 14;
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
       .text(
         "1. Fee once paid is non-refundable.\n" +
         "2. Late fee of ₹50/day will be charged after the due date.\n" +
         "3. This is a system-generated invoice and is valid without a physical signature.",
         M, y, { width: 340, lineGap: 3 }
       );

    // ═══════════════════════════════════════════════
    // 6.  SIGNATURE AREA
    // ═══════════════════════════════════════════════
    const sigX = PW - M - 160;
    const sigY = y + 10;

    doc.moveTo(sigX, sigY + 45).lineTo(sigX + 160, sigY + 45).lineWidth(1).stroke(BORDER);
    doc.fillColor(DARK).font("Helvetica-Bold").fontSize(9)
       .text("Authorized Signatory", sigX, sigY + 50, { width: 160, align: "center" });
    doc.fillColor(GRAY).font("Helvetica").fontSize(8)
       .text("Finance Department — Vigyan Academy", sigX, sigY + 63, { width: 160, align: "center" });

    // ═══════════════════════════════════════════════
    // 7.  FOOTER  BAR
    // ═══════════════════════════════════════════════
    doc.rect(0, PH - 36, PW, 36).fill(DARK);
    doc.rect(0, PH - 39, PW, 3).fill(TEAL);

    doc.fillColor("#94A3B8")
       .font("Helvetica")
       .fontSize(8)
       .text(
         "Vigyan Academy  ·  Patna, Bihar 800001  ·  info@vigyanacademy.com  ·  www.vigyanacademy.com",
         0, PH - 22, { width: PW, align: "center" }
       );

    doc.end();

  } catch (error) {
    console.error("Download Invoice Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Invoice generation failed.", error: error.message });
    }
  }
};

