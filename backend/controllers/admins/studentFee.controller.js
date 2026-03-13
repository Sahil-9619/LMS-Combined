const StudentFee = require("../../models/studentFee.model");
const Student = require("../../models/student.model");
const FeeStructure = require("../../models/feeStructure.model");
const Class = require("../../models/class.model");

// ================================
// HELPER: Get or Create Fee Structure by Class Name
// ================================
const getOrCreateFeeStructure = async (className) => {
  // First, find any class with this className
  const anyClass = await Class.findOne({ className });
  
  if (!anyClass) {
    return null;
  }

  // Look for existing FeeStructure for this className
  let feeStructure = await FeeStructure.findOne({
    className: className,
    status: "active",
  });

  // If doesn't exist, create it with a valid classId
  if (!feeStructure) {
    feeStructure = await FeeStructure.create({
      classId: anyClass._id,
      className: className,
      tuitionFee: 5000,
      admissionFee: 1000,
      examFee: 1000,
      hostelFee: 0,
      transportFee: 0,
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

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const student = await Student.findById(studentId).populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const feeStructure = await FeeStructure.findOne({
      className: student.classId.className,
      status: "active",
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found for this class",
      });
    }

    const alreadyAssigned = await StudentFee.findOne({
      studentId: student._id,
      feeStructureId: feeStructure._id,
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Fee already assigned to this student",
      });
    }

    const studentFee = await StudentFee.create({

      studentId: student._id,
      feeStructureId: feeStructure._id,

      tuitionFee: feeStructure.tuitionFee,
      admissionFee: feeStructure.admissionFee,
      examFee: feeStructure.examFee,
      hostelFee: feeStructure.hostelFee,
      transportFee: feeStructure.transportFee,

      totalAssignedFee: feeStructure.totalFee,
      remainingAmount: feeStructure.totalFee,
      totalPaid: 0,

    });

    return res.status(201).json({
      success: true,
      message: "Fee assigned successfully",
      data: studentFee,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// ================================
// GET FEES BY ADMISSION NUMBER
// ================================
exports.getFeeByAdmissionNumber = async (req, res) => {

  try {

    const { admissionNumber } = req.params;

    const student = await Student.findOne({ admissionNumber })
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success:false,
        message:"Student not found"
      });
    }

    let fee = await StudentFee.findOne({ studentId: student._id })
      .populate("studentId")
      .populate("feeStructureId")
      .lean();

    if (!fee) {
      // Auto-create fee record from class fee structure
      let feeStructure = await FeeStructure.findOne({
        className: student.classId.className,
        status: "active",
      });

      // If no fee structure exists, create a default one
      if (!feeStructure) {
        feeStructure = await getOrCreateFeeStructure(student.classId.className);
      }

      if (feeStructure) {
        fee = await StudentFee.create({
          studentId: student._id,
          feeStructureId: feeStructure._id,
          tuitionFee: feeStructure.tuitionFee,
          admissionFee: feeStructure.admissionFee,
          examFee: feeStructure.examFee,
          hostelFee: feeStructure.hostelFee,
          transportFee: feeStructure.transportFee,
          totalAssignedFee: feeStructure.totalFee,
          remainingAmount: feeStructure.totalFee,
          totalPaid: 0,
          status: "due",
        });

        // Populate the newly created record
        fee = await StudentFee.findById(fee._id)
          .populate("studentId")
          .populate("feeStructureId")
          .lean();
      }
    }

    if (!fee) {
      return res.status(200).json({
        success:true,
        message:"Unable to create fee structure and record for this class",
        student,
        fee: null
      });
    }

    // fallback from FeeStructure
    fee.tuitionFee = fee.tuitionFee ?? fee.feeStructureId?.tuitionFee ?? 0;
    fee.admissionFee = fee.admissionFee ?? fee.feeStructureId?.admissionFee ?? 0;
    fee.examFee = fee.examFee ?? fee.feeStructureId?.examFee ?? 0;
    fee.hostelFee = fee.hostelFee ?? fee.feeStructureId?.hostelFee ?? 0;
    fee.transportFee = fee.transportFee ?? fee.feeStructureId?.transportFee ?? 0;
    fee.lateFeePerDay = fee.lateFeePerDay ?? fee.feeStructureId?.lateFeePerDay ?? 0;

    res.json({
      success:true,
      student,
      fee
    });

  } catch(error){

    res.status(500).json({
      success:false,
      message:error.message
    });

  }

};
// ================================
// UPDATE PAYMENT
// ================================
exports.updateStudentFee = async (req, res) => {

  try {

    const { admissionNumber, payAmount } = req.body;

    const student = await Student.findOne({ admissionNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const studentFee = await StudentFee.findOne({ studentId: student._id });

    const payment = Number(payAmount);

    studentFee.totalPaid += payment;

    studentFee.remainingAmount =
      studentFee.totalAssignedFee - studentFee.totalPaid;

    if (studentFee.remainingAmount <= 0) {

      studentFee.status = "paid";
      studentFee.remainingAmount = 0;

    } else {

      studentFee.status = "partial";

    }

    await studentFee.save();

    res.json({
      success: true,
      message: "Payment updated successfully",
      data: studentFee
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.getFeesByStudent = async (req, res) => {
  try {

    const { studentId } = req.params;

    const fees = await StudentFee.find({ studentId })
      .populate("studentId")
      .populate("feeStructureId");

    res.status(200).json({
      success: true,
      data: fees
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};



// ================================
// ADMIN UPDATE STUDENT FEE
// ================================
exports.updateStudentSpecificFee = async (req, res) => {
  try {

    const { admissionNumber } = req.params;

    const {
      tuitionFee = 0,
      admissionFee = 0,
      examFee = 0,
      hostelFee = 0,
      transportFee = 0,
      lateFeePerDay = 0
    } = req.body;

    const student = await Student.findOne({ admissionNumber });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    let studentFee = await StudentFee.findOne({ studentId: student._id });

    if (!studentFee) {
      // Auto-create fee record from class fee structure
      let feeStructure = await FeeStructure.findOne({
        className: student.classId.className,
        status: "active",
      });

      // If no fee structure exists, create a default one
      if (!feeStructure) {
        feeStructure = await getOrCreateFeeStructure(student.classId.className);
      }

      if (!feeStructure) {
        return res.status(404).json({
          success: false,
          message: "Fee structure not found for this class"
        });
      }

      studentFee = await StudentFee.create({
        studentId: student._id,
        feeStructureId: feeStructure._id,
        tuitionFee: feeStructure.tuitionFee,
        admissionFee: feeStructure.admissionFee,
        examFee: feeStructure.examFee,
        hostelFee: feeStructure.hostelFee,
        transportFee: feeStructure.transportFee,
        totalAssignedFee: feeStructure.totalFee,
        remainingAmount: feeStructure.totalFee,
        totalPaid: 0,
        status: "due",
      });
    }

    // update individual fields
    studentFee.tuitionFee = tuitionFee;
    studentFee.admissionFee = admissionFee;
    studentFee.examFee = examFee;
    studentFee.hostelFee = hostelFee;
    studentFee.transportFee = transportFee;
    studentFee.lateFeePerDay = lateFeePerDay;

    // calculate new total
    const newTotal =
      Number(tuitionFee) +
      Number(admissionFee) +
      Number(examFee) +
      Number(hostelFee) +
      Number(transportFee) +
      Number(lateFeePerDay);

    studentFee.totalAssignedFee = newTotal;

    // recalc remaining
    studentFee.remainingAmount = newTotal - studentFee.totalPaid;

    // update status
    if (studentFee.remainingAmount <= 0) {
      studentFee.status = "paid";
      studentFee.remainingAmount = 0;
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
// ASSIGN FEE TO WHOLE CLASS
// ================================
exports.assignFeeToClass = async (req, res) => {
  try {

    const { classId } = req.body;

    const students = await Student.find({ classId });

    const classData = await Class.findById(classId);
    let feeStructure = await FeeStructure.findOne({
      className: classData.className,
      status: "active"
    });

    // If no fee structure exists, create a default one
    if (!feeStructure) {
        feeStructure = await getOrCreateFeeStructure(classData.className);
    }

    if (!feeStructure) {
      return res.status(404).json({
        success:false,
        message:"Fee structure not found and cannot be created"
      });
    }

    for (const student of students) {

      const exists = await StudentFee.findOne({
        studentId: student._id
      });

      if (!exists) {

        await StudentFee.create({

          studentId: student._id,
          feeStructureId: feeStructure._id,

          tuitionFee: feeStructure.tuitionFee,
          admissionFee: feeStructure.admissionFee,
          examFee: feeStructure.examFee,
          hostelFee: feeStructure.hostelFee,
          transportFee: feeStructure.transportFee,

          totalAssignedFee: feeStructure.totalFee,
          remainingAmount: feeStructure.totalFee,
          totalPaid: 0,
          status: "due"

        });

      }

    }

    res.json({
      success:true,
      message:"Fee assigned to all students of class"
    });

  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};

// ================================
// CREATE MISSING FEES FOR ALL STUDENTS
// ================================
exports.createMissingFees = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: false }).populate("classId");
    
    let created = 0;
    let failed = 0;
    const classesWithStructures = {};

    for (const student of students) {
      try {
        const existingFee = await StudentFee.findOne({
          studentId: student._id,
        });

        if (!existingFee && student.classId) {
          let feeStructure = classesWithStructures[student.classId.className];
          
          // Get or create fee structure for this class
          if (!feeStructure) {
            feeStructure = await FeeStructure.findOne({
              className: student.classId.className,
              status: "active"
            });

            if (!feeStructure) {
              // Create default fee structure for this class
              feeStructure = await getOrCreateFeeStructure(student.classId.className);
            }
            classesWithStructures[student.classId.className] = feeStructure;    
          }

          if (feeStructure) {
            await StudentFee.create({
              studentId: student._id,
              feeStructureId: feeStructure._id,
              tuitionFee: feeStructure.tuitionFee,
              admissionFee: feeStructure.admissionFee,
              examFee: feeStructure.examFee,
              hostelFee: feeStructure.hostelFee,
              transportFee: feeStructure.transportFee,
              totalAssignedFee: feeStructure.totalFee,
              remainingAmount: feeStructure.totalFee,
              totalPaid: 0,
              status: "due"
            });
            created++;
          }
        }
      } catch (err) {
        console.error(`Failed to create fee for student ${student._id}:`, err.message);
        failed++;
      }
    }

    res.json({
      success: true,
      message: `Fee records created for ${created} students. ${failed} failed.`,
      data: {
        created,
        failed,
        total: students.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================================
// CLEANUP & CONSOLIDATE FEE STRUCTURES
// ================================
exports.cleanupAndConsolidateFeeStructures = async (req, res) => {
  try {
    // Get all fee structures
    const allFeeStructures = await FeeStructure.find();
    
    const consolidationMap = {}; // className => primary FeeStructure
    const toDelete = [];
    
    // Group by class name (e.g., "10" from "10-A", "10-B", "10")
    for (const feeStructure of allFeeStructures) {
      const classNumber = feeStructure.className.split('-')[0]; // Extract "10" from "10-A"
      
      if (!consolidationMap[classNumber]) {
        // First occurrence - becomes primary
        consolidationMap[classNumber] = feeStructure;
      } else {
        const existing = consolidationMap[classNumber];
        
        // If current has valid fees and existing has nulls, swap
        if ((feeStructure.tuitionFee || feeStructure.admissionFee || feeStructure.examFee) &&
            (!existing.tuitionFee && !existing.admissionFee && !existing.examFee)) {
          // Current has fees, existing doesn't - use current as primary
          toDelete.push(existing._id);
          consolidationMap[classNumber] = feeStructure;
        } else {
          // Keep existing, delete current
          toDelete.push(feeStructure._id);
        }
      }
    }
    
    // Update all StudentFees that reference deleted FeeStructures
    for (const deleteFeeId of toDelete) {
      const oldFeeStructure = await FeeStructure.findById(deleteFeeId);
      const classNumber = oldFeeStructure.className.split('-')[0];
      const primaryFeeStructure = consolidationMap[classNumber];
      
      // Update all StudentFees using the old fee structure
      await StudentFee.updateMany(
        { feeStructureId: deleteFeeId },
        { feeStructureId: primaryFeeStructure._id }
      );
    }
    
    // Delete duplicate fee structures
    if (toDelete.length > 0) {
      await FeeStructure.deleteMany({ _id: { $in: toDelete } });
    }
    
    // Update remaining fee structures to have clean className (e.g., "10" instead of "10-A")
    // And ensure they reference any class with that name (not a specific section)
    for (const [classNumber, feeStructure] of Object.entries(consolidationMap)) {
      const anyClass = await Class.findOne({ className: classNumber });
      await FeeStructure.findByIdAndUpdate(feeStructure._id, {
        className: classNumber,
        classId: anyClass ? anyClass._id : feeStructure.classId
      });
    }
    
    res.json({
      success: true,
      message: `Consolidated fee structures. Deleted ${toDelete.length} duplicates. All sections now share class-level fee structure.`,
      data: {
        deleted: toDelete.length,
        consolidated: Object.keys(consolidationMap).length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};