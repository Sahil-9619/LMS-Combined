"use client";

import { useEffect, useState } from "react";
import { adminServices } from "@/services/admin/admin.service";
import { Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";


const months = [ "January", "February", "March", 
  "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];


export default function AdminFeeManagement() {

  const router = useRouter();

  const [admissionNo, setAdmissionNo] = useState("");
  const [student, setStudent] = useState(null);
  const [feeStructure, setFeeStructure] = useState({});
  const [summary, setSummary] = useState({});
  const [monthlyFees, setMonthlyFees] = useState({});
  const [payAmount, setPayAmount] = useState("");
  const searchParams = useSearchParams();
  const admissionParam = searchParams.get("admission");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [classStudents, setClassStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [currentPage,setCurrentPage] = useState(1)
const [rowsPerPage,setRowsPerPage] = useState(10)

  useEffect(() => {
    if (!admissionNo) {
      setStudent(null);
      setFeeStructure({});
      setSummary({});
      setMonthlyFees({});
    }
  }, [admissionNo]);


  useEffect(() => {

    if (admissionParam) {

      setAdmissionNo(admissionParam);

      handleSearch(admissionParam);

    }
  }, [admissionParam]);


  useEffect(() => {
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
    fetchClasses();
  }, []);
  /* ---------------- SEARCH STUDENT ---------------- */

  const handleSearch = async (admission) => {
setStudent(null);
setFeeStructure({});
setSummary({});
setMonthlyFees({});
    try {
if (!admission && !admissionNo) {
toast.error("Enter admission number",{
position:"top-center"
});
return;
}
      // Case 1 → admission search (existing logic)
      if (admission || admissionNo?.trim()) {

        const res = await adminServices.getStudentFeeByAdmission(admission || admissionNo);

    const data = res?.data || res;

if (!data || !data.student) {

toast.error("Student not found")

  setStudent(null);
  setFeeStructure({});
  setSummary({});
  setMonthlyFees({});
  setAdmissionNo("");
router.replace("/admin/dashboard/student_fee");
  return;
}

setStudent(data.student);
setFeeStructure(data.fee || {});
setSummary(data.fee || {});
setMonthlyFees(data.monthlyFees || {});

        return;
      }

      // Case 2 → class search
      if (selectedClass) {

        const res = await adminServices.getstudentsByClass(selectedClass);

        const studentsData = res?.data || [];

        const sortedStudents = studentsData.sort(
          (a, b) =>
            Number(a.admissionNumber.replace("ADM", "")) -
            Number(b.admissionNumber.replace("ADM", ""))
        );

        setClassStudents(sortedStudents);

        return;
      }

    } catch (err) {

  toast.error("Student not found", {
    position: "top-center",
  });

  setStudent(null);
  setFeeStructure({});
  setSummary({});
  setMonthlyFees({});
  setAdmissionNo("");
  router.replace("/admin/dashboard/student_fee");

}}

  /* ---------------- UPDATE FEE STRUCTURE ---------------- */

  const handleChange = (field, value) => {

    setFeeStructure({
      ...feeStructure,
      [field]: value
    });

  };

  /* ---------------- HANDLE PAYMENT ---------------- */

  const handlePayment = async () => {

    try {

      const payload = {
        admissionNumber: admissionNo,
        payAmount: Number(payAmount)
      };

      await adminServices.updateStudentFee(payload);

      handleSearch();

      setPayAmount("");

    } catch (err) {

      console.log(err);

    }

  };
  const handleFeeStructureUpdate = async () => {

    try {

      await adminServices.updateStudentFeeStructure(
        admissionNo,
        feeStructure
      );

      handleSearch();

    } catch (err) {

      console.log(err);

    }

  };

  const monthlyFee = summary.totalAssignedFee
    ? summary.totalAssignedFee / 12
    : 0;

  const getMonthStatus = (index) => {

    const paidAmount = summary.totalPaid || 0;

    const fullyPaidMonths = Math.floor(paidAmount / monthlyFee);

    const partialAmount = paidAmount % monthlyFee;

    if (index < fullyPaidMonths) return "full";

    if (index === fullyPaidMonths && partialAmount > 0) return "partial";

    return "none";

  };

  const totalPages = Math.ceil(classStudents.length / rowsPerPage)

const startIndex = (currentPage - 1) * rowsPerPage
const endIndex = startIndex + rowsPerPage

const currentStudents = classStudents.slice(startIndex,endIndex)

const getVisiblePages = () => {

const maxVisible = 6

if(totalPages <= maxVisible){
return Array.from({length: totalPages},(_,i)=> i+1)
}

if(currentPage <=3){
return [1,2,3,4,5,6]
}

if(currentPage >= totalPages-2){
return Array.from({length:6},(_,i)=> totalPages-5+i)
}

return [
currentPage-2,
currentPage-1,
currentPage,
currentPage+1,
currentPage+2,
currentPage+3
]

}

const visiblePages = getVisiblePages()

  return (

    <div className="p-10 bg-[#F4FDFE] min-h-screen space-y-12">

      {/* ---------------- Search ---------------- */}

<section>

<h2 className="text-2xl font-semibold text-gray-800 mb-6">
Fee Management Search
</h2>

<div className="flex flex-wrap gap-4 items-end">

<select
value={selectedClass}
onChange={async (e)=>{
  const classId = e.target.value
  setSelectedClass(classId)
  setCurrentPage(1)

  if(!classId){
    setClassStudents([])
    return
  }

  try{

    const res = await adminServices.getstudentsByClass(classId)

    const studentsData = res?.data || []

    const sortedStudents = studentsData.sort(
      (a,b)=>
        Number(a.admissionNumber.replace("ADM","")) -
        Number(b.admissionNumber.replace("ADM",""))
    )

    setClassStudents(sortedStudents)

  }catch(err){
    console.log(err)
  }

}}
className="border border-gray-300 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#178F9E]"
>
<option value="">Select Class</option>

{classes.map((cls)=>(
<option key={cls._id} value={cls._id}>
Class {cls.className}
</option>
))}

</select>


<select
value={selectedMonth}
onChange={(e)=>setSelectedMonth(e.target.value)}
className="border border-gray-300 px-4 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#178F9E]"
>
<option value="">Select Month</option>

{months.map((m)=>(
<option key={m} value={m}>{m}</option>
))}

</select>


<input
type="text"
placeholder="Admission No (ADM1001)"
value={admissionNo}
onChange={(e)=>{
  const value = e.target.value;
  setAdmissionNo(value);

  if(!value){
    router.replace("/admin/dashboard/student_fee");
  }
}}
className="border border-gray-300 px-4 py-2 rounded-md text-sm w-72"
/>


<button
onClick={() => handleSearch()}
className="bg-[#178F9E] text-white px-6 py-2 rounded-md hover:bg-[#0F6F7C]"
>
Search
</button>

</div>

</section>
      {selectedClass && classStudents.length > 0 && !admissionNo && (

        <section>

          <h2 className="text-xl font-semibold text-gray-800 mb-6">
           Student Fee Status - Class {classes.find(c=>c._id === selectedClass)?.className}
           </h2>
          

          <div className="overflow-x-auto">

            <table className="w-full border border-[#D9F1F4] text-sm">

<thead className="bg-[#E8F9FB] text-[#0F6F7C]">

                <tr>
                  <th className="p-3 border text-left">Admission No</th>
                  <th className="p-3 border text-left">Student Name</th>
                  <th className="p-3 border text-left">Father Name</th>
                  <th className="p-3 border text-left">Email</th>
                  <th className="p-3 border text-left">Phone</th>
                  <th className="p-3 border text-left">Total Fee</th>
                  <th className="p-3 border text-left">
                    {selectedMonth ? `${selectedMonth} Status` : "Status"}
                  </th>
                </tr>

              </thead>

              <tbody>

              {currentStudents.map((s,index)=>{

const remaining=(s.totalAssignedFee||0)-(s.totalPaid||0)

return(
                  <tr
key={s._id}
className={`

${index%2===0 ? "bg-white":"bg-[#F4FDFE]"}
hover:bg-[#ECFAFC] transition

`}
>


                    <td className="p-3 border border-[#D9F1F4]">
{s.admissionNumber}
</td>


<td className="p-3 border border-[#D9F1F4]">
{s.firstName} {s.lastName}
</td>
<td className="p-3 border border-[#D9F1F4]">
{s.fatherName || "N/A"}
</td>



<td className="p-3 border border-[#D9F1F4]">
{s.email || "N/A"}
</td>


<td className="p-3 border border-[#D9F1F4]">
{s.phone || "N/A"}
</td>


<td className="p-3 border border-[#D9F1F4] font-semibold">
₹{s.totalAssignedFee || 0}
</td>

<td className="p-3 border border-[#D9F1F4]">

{remaining === 0 ? (

<span className="text-green-600 font-semibold flex items-center gap-1">
✓ Paid
</span>

) : (

<div className="flex flex-col">

<span className="text-black font-semibold">
₹{s.totalAssignedFee}
</span>

<span className="text-red-600 font-semibold text-xs">
₹{remaining} Remaining
</span>

</div>

)}

</td>


<td className="p-3 border border-[#D9F1F4]">

<Link href={`/admin/dashboard/student_fee?admission=${s.admissionNumber}`}>

<SquareArrowOutUpRight
size={22}
className="cursor-pointer text-[#178F9E]"
/>

</Link>

</td>

</tr>

)

})}

</tbody>

</table>
<div className="flex justify-between items-center mt-6">

<div className="flex items-center gap-2 text-sm">

<span>Rows per page:</span>

<select
value={rowsPerPage}
onChange={(e)=>{
setRowsPerPage(Number(e.target.value))
setCurrentPage(1)
}}
className="border rounded px-2 py-1"
>

<option value={10}>10</option>
<option value={25}>25</option>
<option value={50}>50</option>
<option value={100}>100</option>

</select>

</div>

<Pagination>

<PaginationContent>

<PaginationItem>

<PaginationPrevious
className={`cursor-pointer select-none ${currentPage===1?"pointer-events-none opacity-50":""}`}
onClick={()=>setCurrentPage(prev=>Math.max(prev-1,1))}
/>

</PaginationItem>

{visiblePages.map((page)=>(
<PaginationItem key={page}>

<PaginationLink
className="cursor-pointer select-none"
isActive={currentPage===page}
onClick={()=>setCurrentPage(page)}
>

{page}

</PaginationLink>

</PaginationItem>
))}

<PaginationItem>

<PaginationNext
className={`cursor-pointer select-none ${currentPage===totalPages?"pointer-events-none opacity-50":""}`}
onClick={()=>setCurrentPage(prev=>Math.min(prev+1,totalPages))}
/>

</PaginationItem>

</PaginationContent>

</Pagination>

</div>

</div>

</section>

)}

      {/* Show sections only if student loaded */}

      {student && (

        <>

          {/* ---------------- Student Details ---------------- */}

          <section>

            <h2 className="text-xl font-bold text-[#0F6F7C] mb-6">
              Student Information
            </h2>

            <div className="grid grid-cols-4 gap-6">

              <Input label="Student Name" value={student.fullName} />
              <Input label="Admission No" value={student.admissionNumber} />
              <Input label="Class" value={student.classId?.className} />
              <Input label="Section" value={student.classId?.section} />

            </div>

          </section>


          {/* ---------------- Fee Structure ---------------- */}

          <section>

            <h2 className="text-xl font-bold text-[#0F6F7C] mb-6">
              Fee Structure
            </h2>


            <div className="grid grid-cols-3 gap-6">

              <EditableInput label="Tuition Fee"
                value={feeStructure.tuitionFee || 0}
                onChange={(v) => handleChange("tuitionFee", v)}
              />

              <EditableInput label="Admission Fee"
                value={feeStructure.admissionFee || 0}
                onChange={(v) => handleChange("admissionFee", v)}
              />

              <EditableInput label="Exam Fee"
                value={feeStructure.examFee || 0}
                onChange={(v) => handleChange("examFee", v)}
              />

              <EditableInput label="Hostel Fee"
                value={feeStructure.hostelFee || 0}
                onChange={(v) => handleChange("hostelFee", v)}
              />

              <EditableInput label="Transport Fee"
                value={feeStructure.transportFee || 0}
                onChange={(v) => handleChange("transportFee", v)}
              />

              <EditableInput label="Late Fee / Day"
                value={feeStructure.lateFeePerDay || 0}
                onChange={(v) => handleChange("lateFeePerDay", v)}
              />

            </div>
            <button
              onClick={handleFeeStructureUpdate}
              className="bg-[#178F9E] text-white px-4 py-2 rounded-lg mt-6"
            >
              Save Changes
            </button>
          </section>


          {/* ---------------- Fee Summary ---------------- */}

          <section>

            <h2 className="text-xl font-bold text-[#0F6F7C] mb-6">
              Fee Summary
            </h2>

            <div className="grid grid-cols-4 gap-6">

              <Summary label="Total Assigned Fee"
                value={summary.totalAssignedFee}
                color="text-[#0F6F7C]"
              />

              <Summary label="Total Paid"
                value={summary.totalPaid}
                color="text-green-600"
              />

              <Summary label="Remaining"
                value={summary.remainingAmount}
                color="text-red-600"
              />

              <div>

                <label className="text-sm text-gray-500">
                  Status
                </label>

                <p className={`font-bold capitalize
${summary.status === "paid"
                    ? "text-green-600"
                    : summary.status === "partial"
                      ? "text-yellow-600"
                      : "text-red-600"}
`}>
                  {summary.status}
                </p>

              </div>

            </div>

          </section>


          {/* ---------------- Payment Section ---------------- */}

          <section>

            <h2 className="text-xl font-bold  mb-6">
              Update Payment
            </h2>

            <div className="flex gap-4">

              <input
                type="number"
                placeholder="Enter Payment Amount"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="border rounded-lg p-3 w-72 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              <button
                onClick={handlePayment}
                className="bg-[#178F9E] text-white px-6 rounded-lg"
              >
                Update Payment
              </button>

            </div>

          </section>


          {/* ---------------- Monthly Fee Status ---------------- */}

          <section>

            <h2 className="text-xl font-bold text-[#0F6F7C] mb-6">
              Monthly Fee Status (Session: April - March)
            </h2>

            <div className="grid grid-cols-4 gap-6 max-w-4xl">

              {months.map((month, index) => {

                const status = getMonthStatus(index);

                return (

                  <div
                    key={month}
                    className={`h-24 rounded-xl border flex flex-col items-center justify-center text-center font-semibold shadow-sm transition hover:scale-105
          
          ${status === "full"
                        ? "bg-green-400 text-white"
                        : status === "partial"
                          ? "bg-yellow-400 text-black"
                          : "bg-red-400 text-white"
                      }
          `}
                  >

                    <p className="text-lg">{month.slice(0, 3)}</p>

                    <p className="text-xs opacity-90">
                      ₹{Math.round(monthlyFee)}
                    </p>

                  </div>

                );

              })}

            </div>

          </section>
        </>

      )}


    </div>

  )

}

/* ---------------- Components ---------------- */

function Input({ label, value }) {

  return (

    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      <input
        value={value || ""}
        readOnly
        className="border rounded-lg p-3 w-full"
      />

    </div>

  )

}

function EditableInput({ label, value, onChange }) {

  return (

    <div>

      <label className="text-sm text-gray-500 flex gap-1">
        <Pencil size={15} />
        {label}
      </label>


      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border border-gray-300 focus:border-[#178F9E] focus:ring-1 focus:ring-[#178F9E] p-3 rounded-md appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

    </div>

  )

}

function Summary({ label, value, color }) {

  return (

    <div>

      <label className="text-sm text-gray-500">
        {label}
      </label>

      <p className={`font-bold ${color}`}>
        ₹{value || 0}
      </p>


    </div>
    

  )

}