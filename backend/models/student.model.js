const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

   

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: Date,
    bloodGroup: String,
    category: {
      type: String,
      enum: ["general", "obc", "sc", "st"],
    },

    phone: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    address: String,

    parentName: String,
    parentPhone: String,

    profileImage: String,

    

    academicYear: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes
studentSchema.index({ classId: 1 });
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ classId: 1, rollNumber: 1 }, { unique: true });

// Virtual full name
studentSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName || ""}`;
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);