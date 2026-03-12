"use client";

import React, { useEffect, useState } from "react";
import { adminServices } from "@/services/admin/admin.service";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ClassWiseStudents() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------- FETCH CLASSES -------- */

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {

      const res = await adminServices.getAllClasses();

      const classData = res?.data || [];

      const sortedClasses = classData.sort(
        (a, b) => Number(a.className) - Number(b.className)
      );

      setClasses(sortedClasses);

    } catch (err) {
      console.log(err);
    }
  };

  /* -------- FETCH STUDENTS -------- */

  const handleClassChange = async (e) => {

    const classId = e.target.value;

    setSelectedClass(classId);

    if (!classId) {
      setStudents([]);
      return;
    }

    try {

      setLoading(true);

      const res = await adminServices.getstudentsByClass(classId);

      setStudents(res?.data || []);

    } catch (err) {
      console.log(err);
      setStudents([]);
    } finally {
      setLoading(false);
    }

  };

  /* -------- DELETE STUDENT -------- */

  const handleDeleteStudent = async (id) => {




    try {

      await adminServices.deleteStudent(id);


      setStudents((prev) => prev.filter((student) => student._id !== id));

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div className="p-10  min-h-screen">

      {/* PAGE HEADER */}

      <div className="mb-8 flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Class Wise Students
          </h1>

          <p className="text-sm text-gray-500">
            Manage and view students by class
          </p>

        </div>

        {/* CLASS FILTER */}

        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="border border-gray-300 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#178F9E]"
        >

          <option value="">Select Class</option>

          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              Class {cls.className}
            </option>
          ))}

        </select>

      </div>


      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full border border-[#D9F1F4] text-sm">

          <thead className="bg-[#E8F9FB] text-[#0F6F7C]">

            <tr >

              <th className="p-3 border text-left">Admission No</th>
              <th className="p-3 border text-left">Student Name</th>
              <th className="p-3 border text-left">Father Name</th>
              <th className="p-3 border text-left">Email</th>
              <th className="p-3 border text-left">Phone</th>
              <th className="p-3 border text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  Loading students...
                </td>
              </tr>

            ) : students.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No students found
                </td>
              </tr>

            ) : (

              students.map((student, index) => (

                <tr
                  key={student._id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-[#F4FDFE]"} hover:bg-[#ECFAFC] transition`}
                >

                  <td className="p-3 border border-[#D9F1F4]">
                    {student.admissionNumber}
                  </td>

                  <td className="p-3 border border-[#D9F1F4]">
                    {student.firstName} {student.lastName}
                  </td>

                  <td className="p-3 border border-[#D9F1F4] ">
                    {student.fatherName || "N/A"}
                  </td>

                  <td className="p-3 border border-[#D9F1F4]">
                    {student.email || "N/A"}
                  </td>

                  <td className="p-3 border border-[#D9F1F4]">
                    {student.phone || "N/A"}
                  </td>
                  <td className="p-3 border">
                    <AlertDialog>

                      <AlertDialogTrigger asChild>

                        <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                          Delete
                        </button>

                      </AlertDialogTrigger>

                      <AlertDialogContent>

                        <AlertDialogHeader>

                          <AlertDialogTitle>
                            Delete Student
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            Are you sure you want to delete this student? This action cannot be undone.
                          </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter>

                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleDeleteStudent(student._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>

                        </AlertDialogFooter>

                      </AlertDialogContent>

                    </AlertDialog>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}