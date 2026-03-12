import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import Student from "../models/student.model.js";
import Class from "../models/class.model.js";

const seedUsers = async () => {

  try {

    await mongoose.connect("mongodb://localhost:27017/backend");

    const classes = await Class.find();

    const students = [];

    for (let i = 0; i < 1000; i++) {

      const randomClass = classes[Math.floor(Math.random() * classes.length)];

      students.push({

        admissionNumber: `ADM${1000 + i}`,

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

        dateOfBirth: faker.date.birthdate(),

        classId: randomClass._id

      });

    }

    await Student.insertMany(students, { ordered: false });

    console.log("✅ 100 students inserted");

    mongoose.disconnect();

  } catch (error) {

    console.error("❌ Error inserting data:", error);

  }

};

seedUsers();