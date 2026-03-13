import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";
import FeeStructure from "../models/feeStructure.model.js";
import StudentFee from "../models/studentFee.model.js";

const seedUsers = async () => {

  try {

    await mongoose.connect("mongodb://localhost:27017/backend");

    // Get starting admission number from command line argument
    const startNumber = parseInt(process.argv[2]) || 5000;
    const endNumber = startNumber + 1000;

    console.log(`🎯 Seeding students from ADM${startNumber} to ADM${endNumber - 1}`);

    const classes = await Class.find();

    console.log(`📚 Found ${classes.length} classes`);

    if (classes.length === 0) {
      console.error("❌ No classes found. Create classes first!");
      mongoose.disconnect();
      return;
    }

    // Delete students in this batch range only
    const deleted = await Student.deleteMany({ 
      admissionNumber: { 
        $gte: `ADM${startNumber}`,
        $lt: `ADM${endNumber}`
      }
    });
    console.log(`🗑️  Deleted ${deleted.deletedCount} old students in range ADM${startNumber}-ADM${endNumber - 1}`);

    const students = [];

    for (let i = 0; i < 1000; i++) {

      const randomClass = classes[Math.floor(Math.random() * classes.length)];

      if (!randomClass || !randomClass._id || !randomClass.section) {
        console.error(`⚠️  Invalid class at index ${i}:`, randomClass);
        continue;
      }

      students.push({

        admissionNumber: `ADM${startNumber + i}`,
        classId: randomClass._id,
        section: randomClass.section,
        className: randomClass.className,

        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),

        fatherName: faker.person.fullName(),
        motherName: faker.person.fullName(),

        email: faker.internet.email().toLowerCase() + i,

        phone: faker.phone.number("9#########"),
        parentPhone: faker.phone.number("9#########"),

        address: faker.location.streetAddress(),

        category: "general",

        gender: faker.helpers.arrayElement(["male","female"]),

        dateOfBirth: faker.date.birthdate()

      });

    }

    console.log(`📝 Prepared ${students.length} student records`);

    let insertedStudents = [];
    try {
      insertedStudents = await Student.insertMany(students, { ordered: false });
      console.log(`✅ ${insertedStudents.length} students inserted successfully`);
    } catch (insertError) {
      console.error("⚠️  Insert error:", insertError.message);
      console.log("Trying with partial insert...");
      // If there's a duplicate error, try to get inserted ones
      if (insertError.insertedDocs && insertError.insertedDocs.length > 0) {
        insertedStudents = insertError.insertedDocs;
        console.log(`✅ ${insertedStudents.length} students inserted despite errors`);
      } else {
        throw insertError;
      }
    }

    if (insertedStudents.length === 0) {
      console.error("❌ No students were inserted. Check your data.");
      console.error("Aborting StudentFee creation since no students exist!");
      mongoose.disconnect();
      return;
    }

    console.log(`📊 Will now create fees for ${insertedStudents.length} students...`);

    // ========================
    // CREATE FEES FOR EACH STUDENT
    // ========================
    const feeStructures = await FeeStructure.find({ status: "active" });

    console.log(`💰 Found ${feeStructures.length} fee structures`);

    if (feeStructures.length === 0) {
      console.error("❌ No active fee structures found. Create fee structures first!");
      mongoose.disconnect();
      return;
    }

    const classNameToFeeStructure = {};
    
    // Map className to FeeStructure
    for (const fees of feeStructures) {
      classNameToFeeStructure[fees.className] = fees;
    }

    let feesCreated = 0;
    let feesFailed = 0;

    for (const student of insertedStudents) {
      try {
        const classData = await Class.findById(student.classId);
        const feeStructure = classNameToFeeStructure[classData.className];

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
          feesCreated++;
        } else {
          console.warn(`⚠️  No fee structure for class: ${classData.className}`);
          feesFailed++;
        }
      } catch (error) {
        console.error(`Failed to create fee for student ${student._id}:`, error.message);
        feesFailed++;
      }
    }

    console.log(`✅ ${feesCreated} student fees created`);
    if (feesFailed > 0) {
      console.log(`⚠️  ${feesFailed} fees failed to create`);
    }

    mongoose.disconnect();

  } catch (error) {

    console.error("❌ Error seeding data:", error.message);
    mongoose.disconnect();

  }

};

seedUsers();