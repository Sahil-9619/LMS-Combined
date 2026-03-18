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
exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id).populate("studentId");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // ================= HEADER =================
    doc.fontSize(18).text("ABC SCHOOL", { align: "left" });
    doc.fontSize(10).text("Patna, Bihar");

    doc.moveDown();

    doc.fontSize(20).text("INVOICE", { align: "right" });

    doc.moveDown();

    // ================= INFO =================
    doc.fontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 350);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 350);

    doc.moveDown(2);

    // ================= BILL TO =================
    doc.fontSize(12).text("BILL TO:", { underline: true });

    doc.moveDown(0.5);

    doc.fontSize(10);
    doc.text(invoice.studentName);
    doc.text(`Class: ${invoice.className}`);
    doc.text(`Section: ${invoice.section}`);

    doc.moveDown(2);

    // ================= TABLE =================
    const tableTop = doc.y;

    doc
      .fontSize(10)
      .text("Description", 50, tableTop)
      .text("Month", 300, tableTop)
      .text("Amount", 450, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    const rowY = tableTop + 25;

    doc
      .text("School Fee", 50, rowY)
      .text(invoice.month, 300, rowY)
      .text(`₹ ${invoice.amount}`, 450, rowY);

    doc.moveDown(3);

    // ================= TOTAL =================
    doc.fontSize(12).text(`Total: ₹ ${invoice.amount}`, {
      align: "right",
    });

    doc.moveDown(3);

    doc.fontSize(10).text("Thank you!", { align: "center" });

    doc.end();

  } catch (error) {
    console.error("Download Invoice Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};