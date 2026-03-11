"use client";

import { useState, useEffect } from "react";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function FeeStatusPage() {

  const [selectedYear,setSelectedYear] = useState(2026);

  const [feeSummary,setFeeSummary] = useState({
    name:"",
    studentId:"",
    feeStructureId:"",
    totalAssignedFee:0,
    totalPaid:0,
    remainingAmount:0,
    status:"due"
  });

  const [feeData,setFeeData] = useState({});

  // Example API fetch
  useEffect(()=>{

    async function fetchFeeData(){

      // Replace with your API
      const res = await fetch("/api/student-fee");

      const data = await res.json();

      setFeeSummary({
        studentId:data.studentId,
        name:data.name,
        feeStructureId:data.feeStructureId,
        totalAssignedFee:data.totalAssignedFee,
        totalPaid:data.totalPaid,
        remainingAmount:data.remainingAmount,
        status:data.status
      });

      setFeeData(data.monthlyFees || {});
    }

    fetchFeeData();

  },[]);


  return (
    <div className="p-8 bg-[#F4FDFE] min-h-screen">

      {/* Header */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-[#178F9E]/20">
        <h1 className="text-2xl font-bold text-[#0F6F7C]">
          Student Fee Status
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 text-sm">

          <div>
            <p className="text-gray-500">Student Name </p>
            <p className="font-semibold">{feeSummary.name}</p>
          </div>
  
          <div>
            <p className="text-gray-500">Admission ID</p>
            <p className="font-semibold">{feeSummary.studentId}</p>
          </div>

          <div>
            <p className="text-gray-500">Total Assigned Fee</p>
            <p className="font-semibold text-[#0F6F7C]">
              ₹{feeSummary.totalAssignedFee}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Total Paid</p>
            <p className="font-semibold text-green-600">
              ₹{feeSummary.totalPaid}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Remaining Amount</p>
            <p className="font-semibold text-red-500">
              ₹{feeSummary.remainingAmount}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>

            <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
            ${
              feeSummary.status === "paid"
              ? "bg-green-100 text-green-700"
              : feeSummary.status === "partial"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}
            >
              {feeSummary.status}
            </span>

          </div>

        </div>
      </div>


      {/* Year Selector */}

      <div className="flex gap-4 mb-8">
        {[2024,2025,2026].map((year)=>(
          <button
          key={year}
          onClick={()=>setSelectedYear(year)}
          className={`px-6 py-2 rounded-full font-medium transition
          ${selectedYear===year
          ? "bg-[#178F9E] text-white"
          : "bg-white border border-[#178F9E]/40 text-[#0F6F7C]"}`}
          >
            {year}
          </button>
        ))}
      </div>


      {/* Month Grid */}

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

        {months.map((month)=>{

          const status = feeData[month];

          return(
            <div
            key={month}
            className={`p-6 rounded-2xl shadow-md border
            ${status?.paid
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"}`}
            >

              <h3 className="font-bold text-lg mb-2">
                {month}
              </h3>

              {status?.paid ? (
                <>
                <p className="text-green-700 font-semibold">
                  Paid
                </p>
                <p className="text-sm text-gray-600">
                  Paid on {status.date}
                </p>
                </>
              ) : (
                <p className="text-red-600 font-semibold">
                  Pending
                </p>
              )}

            </div>
          )

        })}

      </div>

    </div>
  );
}