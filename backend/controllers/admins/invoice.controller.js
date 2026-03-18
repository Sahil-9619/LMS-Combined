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

    // Fetch invoice with populated data
    const invoice = await Invoice.findById(id).populate("studentId");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // --- CONFIGURATION & STYLING ---
    const BRAND_YELLOW = "#7bcff0"; // Yellow from the image
    const DARK_COLOR = "#1C1C1E"; // Near black for bold elements
    const GRAY_COLOR = "#666666"; // Gray for secondary text
    const LIGHT_BG = "#EAEAEA"; // Light gray for banner
    const CURRENCY = "INR "; // Can be changed as per requirement

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
    // 1. HEADER HERO SECTION
    // ==========================================

    // Draw Top Yellow Box
    doc.rect(40, 40, 270, 95).fill(BRAND_YELLOW);

    // Draw Mock Logo inside Yellow Box (matching the image)
    doc.fillColor(DARK_COLOR).fontSize(7).font("Helvetica-Bold");
    doc.text("10101010", 48, 58);
    doc.text("00100010", 48, 66);
    doc.text("00110000", 48, 74);

    // Magnifying glass icon
    doc.circle(75, 75, 10).lineWidth(3).stroke(DARK_COLOR);
    doc.moveTo(82, 82).lineTo(90, 90).lineWidth(4).stroke(DARK_COLOR);

    // School Name & Tagline
    doc.fillColor(DARK_COLOR).fontSize(20).font("Times-Bold").text("VIGYAN ACADEMY", 100, 55, { letterSpacing: 1 });
    doc.fontSize(8).font("Helvetica-Bold").text("E D U C A T I O N   F O R   E X C E L L E N C E", 102, 85, { letterSpacing: 1.5 });

    // Header Right (Contact Info)
    doc.fillColor(GRAY_COLOR).fontSize(9).font("Helvetica");
    doc.text("+91 98765 43210", 350, 45, { width: 200, align: 'right' });
    doc.text("info@vigyanacademy.com", 350, 60, { width: 200, align: 'right' });
    doc.text("www.vigyanacademy.com", 350, 75, { width: 200, align: 'right' });
    doc.text("Patna, Bihar 800001", 350, 90, { width: 200, align: 'right' });

    // ==========================================
    // 2. INVOICE BANNER
    // ==========================================

    // Dark "INVOICE" Box
    doc.rect(40, 155, 140, 32).fill(DARK_COLOR);
    doc.fillColor('#ffffff').fontSize(16).font("Helvetica").text("INVOICE", 40, 164, { width: 140, align: 'center', letterSpacing: 4 });

    // Light Gray "Invoice No" Box
    doc.rect(180, 155, 370, 32).fill(LIGHT_BG);
    doc.fillColor(DARK_COLOR).fontSize(10).font("Helvetica").text(`Invoice No. ${invoice.invoiceNumber}`, 200, 167);

    // ==========================================
    // 3. INVOICE DETAILS SECTION (3 Columns)
    // ==========================================

    const detailsY = 230;

    // --- Column 1: Bill To ---
    doc.fillColor(DARK_COLOR).fontSize(8).font("Helvetica-Bold").text("INVOICE TO", 40, detailsY);
    doc.fontSize(11).text(`Name - ${invoice.studentName.toUpperCase()}`, 40, detailsY + 15);

    // Student Info layout (replacing address icons with structural details)
    doc.fontSize(9).font("Helvetica").fillColor(DARK_COLOR);
    // Bullet 1: Admission Number
    doc.circle(44, detailsY + 41, 1.5).fill(DARK_COLOR);
    doc.text(`Adm No: ${invoice.studentId?.admissionNumber || 'N/A'}`, 52, detailsY + 38);
    // Bullet 2: Class
    doc.circle(44, detailsY + 56, 1.5).fill(DARK_COLOR);
    doc.text(`Class: ${invoice.className}`, 52, detailsY + 53);
    // Bullet 3: Section
    doc.circle(44, detailsY + 71, 1.5).fill(DARK_COLOR);
    doc.text(`Section: ${invoice.section}`, 52, detailsY + 68);

    // --- Column 2: Dates ---
    doc.fontSize(8).font("Helvetica-Bold").text("INVOICE DATE", 250, detailsY);
    doc.fontSize(9).font("Helvetica").fillColor(GRAY_COLOR).text(new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 250, detailsY + 15);

    doc.fillColor(DARK_COLOR).fontSize(8).font("Helvetica-Bold").text("ISSUED DATE", 250, detailsY + 45);
    doc.fontSize(9).font("Helvetica").fillColor(GRAY_COLOR).text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 250, detailsY + 60);

    // --- Column 3: Amount Due ---
    doc.fillColor(DARK_COLOR).fontSize(8).font("Helvetica-Bold").text("AMOUNT DUE", 420, detailsY);

    // Amount Yellow Highlight Box
    doc.rect(420, detailsY + 15, 130, 35).fill(BRAND_YELLOW);
    doc.fillColor(DARK_COLOR).fontSize(16).font("Helvetica-Bold").text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, 420, detailsY + 25, { width: 130, align: 'center' });

    // ==========================================
    // 4. TABLE SECTION
    // ==========================================

    let tableTop = 350;

    // Top Thick Border
    doc.moveTo(40, tableTop).lineTo(550, tableTop).lineWidth(2).stroke(DARK_COLOR);

    // Headers
    doc.fontSize(9).font("Helvetica-Bold").fillColor(DARK_COLOR);
    doc.text("DESCRIPTION", 40, tableTop + 10);
    doc.text("QTY", 330, tableTop + 10, { width: 30, align: 'center' });
    doc.text("PRICE", 400, tableTop + 10, { width: 60, align: 'right' });
    doc.text("TOTAL", 490, tableTop + 10, { width: 60, align: 'right' });

    // Header Bottom Border
    doc.moveTo(40, tableTop + 25).lineTo(550, tableTop + 25).lineWidth(2).stroke(DARK_COLOR);

    // Main Row
    doc.fontSize(9).font("Helvetica").fillColor(DARK_COLOR);
    doc.text("School Tuition Fee", 40, tableTop + 45);
    doc.fillColor(GRAY_COLOR).fontSize(8).text(`Fee for the month of ${invoice.month}`, 40, tableTop + 58);

    doc.fillColor(DARK_COLOR).fontSize(9);
    doc.text("1", 330, tableTop + 45, { width: 30, align: 'center' });
    doc.text(parseFloat(invoice.amount).toFixed(2), 400, tableTop + 45, { width: 60, align: 'right' });
    doc.text(parseFloat(invoice.amount).toFixed(2), 490, tableTop + 45, { width: 60, align: 'right' });

    // Spacing for table to make it look prominent
    let tableBottom = tableTop + 150;

    // Bottom Thick Border
    doc.moveTo(40, tableBottom).lineTo(550, tableBottom).lineWidth(2).stroke(DARK_COLOR);

    // ==========================================
    // 5. TOTAL
    // ==========================================

    doc.fontSize(9).font("Helvetica-Bold").text("TOTAL", 400, tableBottom + 15, { width: 60, align: 'right' });
    doc.text(`${CURRENCY}${parseFloat(invoice.amount).toFixed(2)}`, 490, tableBottom + 15, { width: 60, align: 'right' });

    // ==========================================
    // 6. FOOTER SECTION
    // ==========================================

    const footerY = 620;

    // Payment Methods
    doc.fontSize(9).font("Helvetica-Bold").text("PAYMENT DETAIL", 40, footerY);
    doc.font("Helvetica").fillColor(GRAY_COLOR).text("Bank Transfer | Credit Card | UPI", 40, footerY + 15);

    // Terms & Conditions
    doc.fillColor(DARK_COLOR).font("Helvetica-Bold").text("TERMS & CONDITION", 40, footerY + 50);
    doc.fillColor(GRAY_COLOR).font("Helvetica").fontSize(8)
      .text("Payment is due in 30 days from date of\nissue. Late fees will apply. Check our\nwebsite or contact administration for details.", 40, footerY + 65, { width: 250, lineGap: 3 });

    // Thank You Note (Right aligned, Serif Font)
    doc.fillColor(DARK_COLOR).fontSize(22).font("Times-Bold").text("THANK YOU!", 300, footerY + 70, { width: 250, align: 'right' });

    // Absolute Bottom Thick Bar
    doc.rect(0, 810, 595, 32).fill(DARK_COLOR);

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