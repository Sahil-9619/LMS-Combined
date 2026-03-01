"use client";

import React, { useState } from "react";
import { adminServices } from "@/services/admin/admin.service";

export default function ClassWiseStudents() {
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);

  const handleClassChange = async (e) => {
    const className = e.target.value;
    setSelectedClass(className);

    if (!className) {
      setStudents([]);
      return;
    }

    try {
      // 1️⃣ Get all classes
      const classRes = await adminServices.getAllClasses();

      // 🔥 Correct array access
      const classes = classRes.data || [];

      // 2️⃣ Find class by className
      const selectedClassObj = classes.find(
        (cls) => cls.className === className
      );

      if (!selectedClassObj) {
        setStudents([]);
        return;
      }

      // 3️⃣ Fetch students using classId
      const studentRes = await adminServices.getstudentsByClass(
        selectedClassObj._id
      );

      setStudents(studentRes.data || []);
    } catch (error) {
      console.error("Error:", error);
      setStudents([]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Class Wise Students</h1>

      {/* Static Dropdown */}
      <div className="mb-6">
        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="border p-2 rounded w-64"
        >
          <option value="">Select Class</option>
          <option value="6">Class 6</option>
          <option value="7">Class 7</option>
          <option value="8">Class 8</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
        </select>
      </div>

      {/* Students Table */}
      {students.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Admission No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Mobile no.</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="border p-2">
                    {student.admissionNumber}
                  </td>
                  <td className="border p-2">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="border p-2">
                    {student.email}
                  </td>
                   <td className="border p-2">
                    {student.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedClass && students.length === 0 && (
        <p className="text-gray-500">No students found</p>
      )}
    </div>
  );
}