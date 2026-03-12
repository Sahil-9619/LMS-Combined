"use client";

import { useState } from "react";
import { adminServices } from "@/services/admin/admin.service";

const months = [
  "April", "May", "June",
  "July", "August", "September", "October", "November", "December", "January", "February", "March"
];

export default function AdminFeeManagement() {

  const [admissionNo, setAdmissionNo] = useState("");
  const [student, setStudent] = useState(null);
  const [feeStructure, setFeeStructure] = useState({});
  const [summary, setSummary] = useState({});
  const [monthlyFees, setMonthlyFees] = useState({});
  const [payAmount, setPayAmount] = useState("");

  /* ---------------- SEARCH STUDENT ---------------- */

  const handleSearch = async () => {

    try {

      const res = await adminServices.getStudentFeeByAdmission(admissionNo);

      const data = res?.data || res;

      /* Student */
      setStudent(data?.student || {});

      /* Fee Structure */
      setFeeStructure(data?.fee?.feeStructureId || {});

      /* Summary */
      setSummary({
        totalAssignedFee: data?.fee?.totalAssignedFee || 0,
        totalPaid: data?.fee?.totalPaid || 0,
        remainingAmount: data?.fee?.remainingAmount || 0,
        status: data?.fee?.status || "due"
      });

      /* Monthly Fees */
      setMonthlyFees(data?.monthlyFees || {});

    } catch (err) {
      console.log(err);
    }

  };

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

  return (

    <div className="p-10 bg-[#F4FDFE] min-h-screen space-y-12">

      {/* ---------------- Search ---------------- */}

      <section>

        <h2 className="text-xl font-bold text-[#0F6F7C] mb-4">
          Search Student
        </h2>

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Enter Admission Number"
            value={admissionNo}
            onChange={(e) => setAdmissionNo(e.target.value)}
            className="border rounded-lg p-3 w-72"
          />

          <button
            onClick={handleSearch}
            className="bg-[#178F9E] text-white px-6 rounded-lg"
          >
            Search
          </button>

        </div>

      </section>

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

      <label className="text-sm text-gray-500">
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