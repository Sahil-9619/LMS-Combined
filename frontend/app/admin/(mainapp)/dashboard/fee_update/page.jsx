"use client";

import { useState } from "react";

export default function StudentFeeManagement(){

  const [admissionNumber,setAdmissionNumber] = useState("");
  const [student,setStudent] = useState(null);
  const [payAmount,setPayAmount] = useState("");

  const handleSearch = async () => {

    const res = await fetch(`/api/fee/student/${admissionNumber}`);
    const data = await res.json();

    setStudent(data);
  };

  const handlePayFee = async () => {

    await fetch(`/api/fee/pay`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        admissionNumber,
        payAmount
      })
    });

    alert("Payment updated");

    handleSearch();
  };

  return(

    <div className="p-8 bg-[#F4FDFE] min-h-screen">

      <h1 className="text-2xl font-bold text-[#0F6F7C] mb-8">
        Student Fee Management
      </h1>

      {/* Search */}

      <div className="flex gap-4 mb-8">

        <input
        type="text"
        placeholder="Enter Admission Number"
        value={admissionNumber}
        onChange={(e)=>setAdmissionNumber(e.target.value)}
        className="border p-3 rounded-lg w-72"
        />

        <button
        onClick={handleSearch}
        className="bg-[#178F9E] text-white px-6 rounded-lg"
        >
          Search
        </button>

      </div>


      {student && (

        <div className="bg-white p-6 rounded-xl shadow-md border border-[#178F9E]/20">

          <h2 className="text-xl font-bold mb-6">
            {student.firstName} {student.lastName}
          </h2>

          <div className="grid md:grid-cols-4 gap-6 mb-6">

            <div>
              <p className="text-gray-500">Total Fee</p>
              <p className="font-bold">₹{student.totalAssignedFee}</p>
            </div>

            <div>
              <p className="text-gray-500">Paid</p>
              <p className="text-green-600 font-bold">
                ₹{student.totalPaid}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Remaining</p>
              <p className="text-red-600 font-bold">
                ₹{student.remainingAmount}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm
                ${
                  student.status==="paid"
                  ? "bg-green-100 text-green-700"
                  : student.status==="partial"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
                }
              `}>
                {student.status}
              </span>
            </div>

          </div>


          {/* Pay Fee */}

          <div className="flex gap-4">

            <input
            type="number"
            placeholder="Enter amount"
            value={payAmount}
            onChange={(e)=>setPayAmount(e.target.value)}
            className="border p-3 rounded-lg"
            />

            <button
            onClick={handlePayFee}
            className="bg-[#0F6F7C] text-white px-6 rounded-lg"
            >
              Update Payment
            </button>

          </div>

        </div>

      )}

    </div>

  );
}