"use client";

import { adminServices } from "@/services/admin/admin.service";
import { useEffect, useState } from "react";

export default function ClassFeeManagement() {
  
  const [msg,setMsg] = useState("");
  const [classes,setClasses] = useState([]);
  const [classId,setClassId] = useState("");

  const [feeId,setFeeId] = useState("");
  const [tuitionFee,setTuitionFee] = useState(0); 
  const [admissionFee,setAdmissionFee] = useState(0);
  const [examFee,setExamFee] = useState(0);
  const [hostelFee,setHostelFee] = useState(0);
  const [transportFee,setTransportFee] = useState(0);
  const [lateFeePerDay,setLateFeePerDay] = useState(0);

  const [loading,setLoading] = useState(false);
  const [editing,setEditing] = useState(false);

  useEffect(()=>{
    fetchClasses();
    const clearMessage = () => setMsg("");

  window.addEventListener("click", clearMessage);

  return () => window.removeEventListener("click", clearMessage);
  },[])

  const fetchClasses = async()=>{
    try{
      const res = await adminServices.getAllClasses();
      const classData = res?.data || res || [];
      setClasses(classData);
    }catch(err){
      console.log(err);
    }
  }

  /* FETCH CURRENT FEE */

  const fetchCurrentFee = async ()=>{
    if(!classId) return;

    try{
      setLoading(true);

      const res = await adminServices.getClassFeeByClass(classId);

      const data = res?.data || res;

      // ✅ SET VALUES FROM DB
      setTuitionFee(data.tuitionFee || 0);
      setAdmissionFee(data.admissionFee || 0);
      setExamFee(data.examFee || 0);
      setHostelFee(data.hostelFee || 0);
      setTransportFee(data.transportFee || 0);
      setLateFeePerDay(data.lateFeePerDay || 0);

      setEditing(false);

    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }
  }

  /* UPDATE FEE */

const updateFee = async () => {
  try {

    const payload = {
      classId,
      tuitionFee,
      admissionFee,
      examFee,
      hostelFee,
      transportFee,
      lateFeePerDay
    };

    try {
      // Try updating first
      await adminServices.updateClassFee(classId, payload);

    } catch (err) {

      // If not found then create
      if (err?.response?.data?.message === "Fee structure not found") {

        await adminServices.createFeeStructure(payload);

      } else {
        throw err;
      }

    }
    setMsg("Fee saved successfully!");
    setEditing(false);

  } catch (err) {
    console.log(err);
  }
};

const submitChange= (e) =>{
    const id = e.target.value;
  setClassId(id);

  // reset fields when class changes
  setTuitionFee("");
  setAdmissionFee("");
  setExamFee("");
  setHostelFee("");
  setTransportFee("");
  setLateFeePerDay("");
  setEditing(false);
}

  return (

    <div className="p-8 bg-[#F4FDFE] min-h-screen">

      <h1 className="text-2xl font-bold text-[#0F6F7C] mb-8">
        Class Fee Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-[#178F9E]/20 max-w-xl">

        {/* CLASS SELECT */}

        <label className="block text-sm mb-2 font-semibold">
          Select Class
        </label>

        <select
          value={classId}
          onChange={submitChange}
          className="w-full border rounded-lg p-3 mb-4"
        >
          <option value="">Select Class</option>

          {classes
          .sort((a,b)=>Number(a.className) - Number(b.className))       
          .map((cls)=>(
            <option key={cls._id} value={cls._id}>
              Class {cls.className}
            </option>
          ))}

        </select>

        <button
          onClick={fetchCurrentFee}
          className="bg-[#178F9E] text-white px-4 py-2 rounded-lg mb-6"
        >
          Fetch Current Fee
        </button>

        {/* FEE FIELDS */}

        <div className="grid grid-cols-2 gap-4">

          <Input label="Tuition Fee" value={tuitionFee} setValue={setTuitionFee} disabled={!editing}/>
          <Input label="Admission Fee" value={admissionFee} setValue={setAdmissionFee} disabled={!editing}/>
          <Input label="Exam Fee" value={examFee} setValue={setExamFee} disabled={!editing}/>
          <Input label="Hostel Fee" value={hostelFee} setValue={setHostelFee} disabled={!editing}/>
          <Input label="Transport Fee" value={transportFee} setValue={setTransportFee} disabled={!editing}/>
          <Input label="Late Fee / Day" value={lateFeePerDay} setValue={setLateFeePerDay} disabled={!editing}/>

        </div>

        {/* TOTAL FEE */}

        <div className="mt-6 bg-[#F4FDFE] p-3 rounded-lg border">

          <p className="text-gray-500 text-sm">
            Total Fee
          </p>

          <p className="text-lg font-bold">
            ₹{Number(tuitionFee)+Number(admissionFee)+Number(examFee)+Number(hostelFee)+Number(transportFee)}
          </p>

        </div>

        {/* BUTTONS */}

        <div className="flex gap-3 mt-6">

          {!editing && (
            <button
              onClick={()=>setEditing(true)}
              className="flex-1 bg-yellow-500 text-white py-3 rounded-lg"
            >
              Edit
            </button>
          )}

          {editing && (
            <button
              onClick={updateFee}
              className="flex-1 bg-[#0F6F7C] text-white py-3 rounded-lg"
            >
              Update Fee
            </button>
          )}
        
        </div>
        {msg && (
          <p id="msg" className="text-green-600 text-center mt-4 font-semibold">
            {msg}
          </p>
        )}
      </div>

    </div>
  );
}

/* INPUT COMPONENT */

function Input({label,value,setValue,disabled}){

  return(
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label}
      </label>

      <input
        type="number"
        value={value}
        disabled={disabled}
        onChange={(e)=>setValue(e.target.value)}
        className="w-full border p-3 rounded-lg appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
  )
}