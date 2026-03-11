"use client";

import { useState } from "react";
import { adminServices } from "@/services/admin/admin.service";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function AdminFeeManagement(){


const [admissionNo,setAdmissionNo] = useState("");
const [student,setStudent] = useState(null);
const [feeStructure,setFeeStructure] = useState({});
const [summary,setSummary] = useState({});
const [monthlyFees,setMonthlyFees] = useState({});
const [payAmount,setPayAmount] = useState("");


const handleSearch = async ()=>{

try{

const res = await adminServices.getStudentFeeByAdmission(admissionNo);

const data = res?.data || res;

setStudent(data.student || {});
setFeeStructure(data.feeStructure || {});
setSummary({
totalAssignedFee:data.totalAssignedFee,
totalPaid:data.totalPaid,
remainingAmount:data.remainingAmount,
status:data.status
});

setMonthlyFees(data.monthlyFees || {});

}catch(err){
console.log(err);
}

};

/* ---------------- Update Fee Structure ---------------- */

const handleChange = (field,value)=>{

setFeeStructure({
...feeStructure,
[field]:value
});

};

/* ---------------- Handle Payment ---------------- */

const handlePayment = async ()=>{

try{

const payload = {
admissionNumber:admissionNo,
payAmount
};

await adminServices.updateStudentFee(payload);

handleSearch();

setPayAmount("");

}catch(err){
console.log(err);
}

};

return(

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
onChange={(e)=>setAdmissionNo(e.target.value)}
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

<Input label="Student Name" value={student.name}/>
<Input label="Admission No" value={student.admissionNumber}/>
<Input label="Class" value={student.className}/>
<Input label="Section" value={student.section}/>

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
onChange={(v)=>handleChange("tuitionFee",v)}
/>

<EditableInput label="Admission Fee"
value={feeStructure.admissionFee || 0}
onChange={(v)=>handleChange("admissionFee",v)}
/>

<EditableInput label="Exam Fee"
value={feeStructure.examFee || 0}
onChange={(v)=>handleChange("examFee",v)}
/>

<EditableInput label="Hostel Fee"
value={feeStructure.hostelFee || 0}
onChange={(v)=>handleChange("hostelFee",v)}
/>

<EditableInput label="Transport Fee"
value={feeStructure.transportFee || 0}
onChange={(v)=>handleChange("transportFee",v)}
/>

<EditableInput label="Late Fee / Day"
value={feeStructure.lateFeePerDay || 0}
onChange={(v)=>handleChange("lateFeePerDay",v)}
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
${summary.status==="paid"
? "text-green-600"
: summary.status==="partial"
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

<h2 className="text-xl font-bold text-[#0F6F7C] mb-6">
Update Payment
</h2>

<div className="flex gap-4">

<input
type="number"
placeholder="Enter Payment Amount"
value={payAmount}
onChange={(e)=>setPayAmount(e.target.value)}
className="border rounded-lg p-3 w-72"
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
Monthly Fee Status
</h2>

<div className="grid grid-cols-6 gap-4">

{months.map(month=>{

const status = monthlyFees[month]?.status;

return(

<div
key={month}
className={`p-4 text-center rounded-lg border font-semibold
${status==="paid"
? "bg-green-100 text-green-700 border-green-300"
: status==="partial"
? "bg-yellow-100 text-yellow-700 border-yellow-300"
: "bg-red-100 text-red-700 border-red-300"}
`}
>

<p className="text-sm">{month}</p>
<p className="text-xs capitalize">{status || "due"}</p>

</div>

)

})}

</div>

</section>

</>

)}

</div>

)

}

/* ---------------- Components ---------------- */

function Input({label,value}){

return(

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

function EditableInput({label,value,onChange}){

return(

<div>

<label className="text-sm text-gray-500">
{label}
</label>

<input
type="number"
value={value}
onChange={(e)=>onChange(Number(e.target.value))}
className="border rounded-lg p-3 w-full"
/>

</div>

)

}

function Summary({label,value,color}){

return(

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