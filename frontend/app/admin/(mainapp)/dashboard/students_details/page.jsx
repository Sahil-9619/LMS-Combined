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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { ArrowBigRight, LucideDelete, SquareArrowOutUpRight, Trash } from "lucide-react";
import Link from "next/link";
export default function ClassWiseStudents() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightId, setHighlightId] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
const [isSearching, setIsSearching] = useState(false);

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
    setCurrentPage(1);   // ✅ add this


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


      setStudents((prev) => {
        const updated = prev.filter((student) => student._id !== id);

        if ((currentPage - 1) * rowsPerPage >= updated.length) {
          setCurrentPage((p) => Math.max(p - 1, 1));
        }

        return updated;
      });

      toast.success("Student deleted", {
        position: "bottom-center",
        style: {
          background: "#178F9E",
          color: "#fff",
        },
      });

    } catch (err) {
      console.log(err);
      toast.error("Failed to delete student.", {
        position: "top-center",
      });
    }

  };



  const totalPages = Math.ceil(students.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentStudents = students.slice(startIndex, endIndex);

  const getVisiblePages = () => {
    const maxVisible = 6;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, 6];
    }

    if (currentPage >= totalPages - 2) {
      return Array.from(
        { length: 6 },
        (_, i) => totalPages - 5 + i
      );
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
      currentPage + 3,
    ];
  };

  const visiblePages = getVisiblePages();


  //for search bar
const handleSearch = () => {

  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    toast.error("Enter admission number, name or email");
    return;
  }

  const results = students.filter((s) => {

    const admission = (s.admissionNumber || "").toLowerCase();
    const first = (s.firstName || "").toLowerCase();
    const last = (s.lastName || "").toLowerCase();
    const email = (s.email || "").toLowerCase();

    return (
      admission.includes(term) ||
      first.includes(term) ||
      last.includes(term) ||
      `${first} ${last}`.includes(term) ||
      email.includes(term)
    );
  });

  if (results.length === 0) {
    toast.error("Student not found");
    return;
  }

  setFilteredStudents(results);
  setIsSearching(true);

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

<div className="flex gap-3 mb-4">

  <input
    type="text"
    placeholder="Search by Admission No, Name, Email"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border px-4 py-2 rounded-md w-72"
  />

  <button
    onClick={handleSearch}
    className="bg-[#178F9E] text-white px-5 py-2 rounded-md"
  >
    Search
  </button>

  {isSearching && (
    <button
      onClick={() => {
        setIsSearching(false);
        setFilteredStudents([]);
        setSearchTerm("");
      }}
      className="bg-gray-500 text-white px-5 py-2 rounded-md"
    >
      Clear
    </button>
  )}

</div>
{isSearching && (
  <p className="mb-3 text-sm text-gray-600">
    {filteredStudents.length} record(s) found
  </p>
)}

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

              (isSearching ? filteredStudents : currentStudents).map((student, index) => (
                <tr
                  key={student._id}
                  className={`
${highlightId === student._id
                      ? "bg-yellow-200"
                      : index % 2 === 0
                        ? "bg-white"
                        : "bg-[#F4FDFE]"
                    }
hover:bg-[#ECFAFC] transition
`}>

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
                  <td className="p-3 border border-[#D9F1F4] flex items-center cursor-pointer">
                    <Link href={`/admin/dashboard/student_fee?admission=${student.admissionNumber}`}>
                      <SquareArrowOutUpRight size={25} />
                    </Link>
                    <AlertDialog>

                      <AlertDialogTrigger asChild>

                        <button className=" text-red-500 px-1 ml-2 py-1 rounded text-xs hover:bg-red-600 hover:text-white transition">
                          <Trash size={25} />
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
      {!isSearching && (
      <div className="flex justify-between items-center mt-6">

        {/* Rows per page */}
        <div className="flex items-center gap-2 text-sm">

          <span>Rows per page:</span>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >

            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>

          </select>

        </div>

        {/* Pagination */}
        <Pagination>

          <PaginationContent>

            {/* Previous */}
            <PaginationItem>

              <PaginationPrevious
                className={`cursor-pointer select-none ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
              />

            </PaginationItem>

            {/* Page Numbers */}
            {visiblePages.map((page) => (

              <PaginationItem key={page}>

                <PaginationLink
                  className="cursor-pointer select-none"

                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >

                  {page}

                </PaginationLink>

              </PaginationItem>

            ))}
            {totalPages > 6 && currentPage < totalPages - 3 && (
              <PaginationItem>
                <span className="px-3 text-gray-500">...</span>
              </PaginationItem>
            )}
            {totalPages > 6 && !visiblePages.includes(totalPages) && (
              <PaginationItem>
                <PaginationLink
                  className="cursor-pointer select-none"

                  isActive={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Next */}
            <PaginationItem>

              <PaginationNext
                className={`cursor-pointer select-none ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, totalPages)
                  )
                }
              />

            </PaginationItem>

          </PaginationContent>

        </Pagination>

      </div>
      )}
    </div>



  );

}