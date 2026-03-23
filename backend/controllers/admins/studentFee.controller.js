const StudentFee = require("../../models/studentFee.model");
const Student = require("../../models/student.model");
const FeeStructure = require("../../models/feeStructure.model");
const Class = require("../../models/class.model");
const Invoice = require("../../models/invoice.model");

// ================================
// HELPER: Get or Create Fee Structure
// ================================
const getOrCreateFeeStructure = async (className) => {
  const anyClass = await Class.findOne({ className });

  if (!anyClass) return null;

  let feeStructure = await FeeStructure.findOne({
    className,
    status: "active",
  });

  if (!feeStructure) {
    const feeComponents = [
      { name: "tuition", amount: 5000, type: "monthly" },
      { name: "admission", amount: 1000, type: "one-time" },
      { name: "exam", amount: 1000, type: "one-time" }
    ];

    const totalFee = feeComponents.reduce(
      (sum, f) => sum + (f.type === "monthly" ? f.amount * 12 : f.amount),
      0
    );

    feeStructure = await FeeStructure.create({
      classId: anyClass._id,
      className,
      feeComponents,
      totalFee,
      lateFeePerDay: 50,
      status: "active"
    });
  }

  return feeStructure;
};

// ================================
// ASSIGN FEE TO STUDENT
// ================================
exports.assignFeeToStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await Student.findById(studentId).populate("classId");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const feeStructure = await getOrCreateFeeStructure(student.classId.className);

    const exists = await StudentFee.findOne({
      studentId,
      feeStructureId: feeStructure._id,
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Already assigned" });
    }

    const studentFee = await StudentFee.create({
      studentId,
      feeStructureId: feeStructure._id,
      feeComponents: feeStructure.feeComponents,
      totalAssignedFee: feeStructure.totalFee,
      remainingAmount: feeStructure.totalFee,
      totalPaid: 0,
      status: "due",
      payments: []
    });

    res.json({ success: true, data: studentFee });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// GET FEES BY STUDENT ID
// ================================
exports.getFeesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 1️⃣ Validate student
    const student = await Student.findById(studentId)
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // 2️⃣ Get fee record
    let fee = await StudentFee.findOne({ studentId })
      .populate("feeStructureId")
      .lean();

    // 3️⃣ If not exist → create automatically
    if (!fee) {
      const feeStructure = await FeeStructure.findOne({
        className: student.classId.className,
        status: "active",
      });

      if (!feeStructure) {
        return res.status(404).json({
          success: false,
          message: "Fee structure not found",
        });
      }

      fee = await StudentFee.create({
        studentId: student._id,
        feeStructureId: feeStructure._id,
        feeComponents: feeStructure.feeComponents,
        totalAssignedFee: feeStructure.totalFee,
        remainingAmount: feeStructure.totalFee,
        totalPaid: 0,
        status: "due",
        payments: []
      });

      fee = await StudentFee.findById(fee._id)
        .populate("feeStructureId")
        .lean();
    }

    // 4️⃣ Monthly breakdown (optional but useful)
    const monthlyFees = {};

    if (fee.payments && fee.payments.length > 0) {
      fee.payments.forEach(p => {
        const month = new Date(p.date).toLocaleString("default", {
          month: "long"
        });

        if (!monthlyFees[month]) {
          monthlyFees[month] = 0;
        }

        monthlyFees[month] += p.amount;
      });
    }

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      student,
      fee,
      monthlyFees
    });

  } catch (error) {
    console.error("GetFeesByStudent Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update student specific fee
exports.updateStudentSpecificFee = async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    const { feeComponents = [] } = req.body;

    const student = await Student.findOne({ admissionNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    let studentFee = await StudentFee.findOne({ studentId: student._id });

    if (!studentFee) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found"
      });
    }

    // 🔥 calculate total
    const total = feeComponents.reduce(
      (sum, f) => sum + Number(f.amount || 0),
      0
    );

    studentFee.feeComponents = feeComponents;
    studentFee.totalAssignedFee = total;

    if (studentFee.totalPaid > total) {
      studentFee.totalPaid = total;
    }

    studentFee.remainingAmount = total - studentFee.totalPaid;

    if (studentFee.remainingAmount <= 0) {
      studentFee.status = "paid";
    } else if (studentFee.totalPaid > 0) {
      studentFee.status = "partial";
    } else {
      studentFee.status = "due";
    }

    await studentFee.save();

    res.json({
      success: true,
      message: "Student fee updated successfully",
      data: studentFee
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================================
// GET BY ADMISSION NUMBER
// ================================
exports.getFeeByAdmissionNumber = async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    const student = await Student.findOne({ admissionNumber }).populate("classId");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    let fee = await StudentFee.findOne({ studentId: student._id })
      .populate("feeStructureId")
      .lean();

    if (!fee) {
      const feeStructure = await getOrCreateFeeStructure(student.classId.className);

      fee = await StudentFee.create({
        studentId: student._id,
        feeStructureId: feeStructure._id,
        feeComponents: feeStructure.feeComponents,
        totalAssignedFee: feeStructure.totalFee,
        remainingAmount: feeStructure.totalFee,
        totalPaid: 0,
        status: "due",
        payments: []
      });

      fee = await StudentFee.findById(fee._id).lean();
    }

    res.json({ success: true, student, fee });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// UPDATE PAYMENT (MONTH SYSTEM)
// ================================
exports.updateStudentFee = async (req, res) => {
  try {
    const { admissionNumber, payAmount, month } = req.body;

    const student = await Student.findOne({ admissionNumber });
    const fee = await StudentFee.findOne({ studentId: student._id });

    const payment = Number(payAmount);

    // monthly fee calculate
    const monthlyFees = fee.feeComponents.filter(f => f.type === "monthly");
    const monthlyTotal = monthlyFees.reduce((s, f) => s + f.amount, 0);

    if (payment !== monthlyTotal) {
      return res.status(400).json({
        success: false,
        message: `Pay exact monthly fee: ${monthlyTotal}`
      });
    }

    const date = new Date(`${month} 1, ${new Date().getFullYear()}`);

    fee.payments.push({ amount: payment, date });

    fee.totalPaid += payment;
    fee.remainingAmount = fee.totalAssignedFee - fee.totalPaid;
    fee.status = fee.remainingAmount <= 0 ? "paid" : "partial";

    await fee.save();

    const invoice = await Invoice.create({
      invoiceNumber: `INV-${Date.now()}`,
      studentId: student._id,
      amount: payment,
      month
    });

    res.json({
      success: true,
      data: fee,
      invoiceId: invoice._id
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================================
// ASSIGN FEE TO CLASS
// ================================
exports.assignFeeToClass = async (req, res) => {
  try {
    const { classId } = req.body;

    const students = await Student.find({ classId });
    const classData = await Class.findById(classId);

    const feeStructure = await getOrCreateFeeStructure(classData.className);

    for (const student of students) {
      const exists = await StudentFee.findOne({ studentId: student._id });

      if (!exists) {
        await StudentFee.create({
          studentId: student._id,
          feeStructureId: feeStructure._id,
          feeComponents: feeStructure.feeComponents,
          totalAssignedFee: feeStructure.totalFee,
          remainingAmount: feeStructure.totalFee,
          totalPaid: 0,
          status: "due"
        });
      }
    }

    res.json({ success: true, message: "Assigned to class" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};