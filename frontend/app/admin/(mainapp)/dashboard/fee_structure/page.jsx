"use client";

import { adminServices } from "@/services/admin/admin.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Pencil, Save, Search } from "lucide-react";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";




export default function ClassFeeManagement() {

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");

  const [feeId, setFeeId] = useState("");
  const [tuitionFee, setTuitionFee] = useState();
  const [admissionFee, setAdmissionFee] = useState();
  const [examFee, setExamFee] = useState();
  const [hostelFee, setHostelFee] = useState();
  const [transportFee, setTransportFee] = useState();
  const [lateFeePerDay, setLateFeePerDay] = useState();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchClasses();
    const clearMessage = () => setMsg("");

    window.addEventListener("click", clearMessage);

    return () => window.removeEventListener("click", clearMessage);
  }, [])

  const fetchClasses = async () => {
    try {

      const res = await adminServices.getAllClasses();
      const data = res?.data || [];

      // remove duplicate classes (A,B sections)
      const uniqueClasses = [
        ...new Map(data.map(item => [item.className, item])).values()
      ];

      setClasses(uniqueClasses);

    } catch (err) {
      console.log(err);
    }
  };

  /* FETCH CURRENT FEE */

  const fetchCurrentFee = async () => {
    if (!classId) {
      setError("Please select a class");
      return;
    };
    setError("");

    try {
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

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  /* UPDATE FEE */

  const updateFee = async () => {
    if (!classId) {
      setError("Please select a class");
      return;
    }
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
      toast.success("Fee saved successfully!", {
        position: "bottom-center",
        style: {
          background: "#178F9E",
          color: "#fff",
        },
      });
      setEditing(false);

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong",
        {
          position: "top-center",
        }
      );
    }
  };

  const submitChange = (e) => {
    const id = e.target.value;
    setClassId(id);
    setError("");
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
<div className="p-8 space-y-10 max-w-5xl">

  {/* HEADER */}

  <div className="flex items-center justify-between border-b pb-4">

    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        Class Fee Management
      </h1>

      <p className="text-sm text-muted-foreground">
        Configure and manage fee structure for each class
      </p>
    </div>

    <Badge variant="secondary">
      Admin Panel
    </Badge>

  </div>


  {/* CLASS SELECT SECTION */}

  <div className="space-y-4">

    <div className="grid md:grid-cols-3 gap-4 items-end">

      <div className="md:col-span-2 space-y-2">

        <label className="text-sm font-medium">
          Select Class
        </label>

<Select
value={classId}
onValueChange={(value)=>{
setClassId(value)
setError("")
setTuitionFee("")
setAdmissionFee("")
setExamFee("")
setHostelFee("")
setTransportFee("")
setLateFeePerDay("")
setEditing(false)
}}
>

<SelectTrigger className="w-full">
<SelectValue placeholder="Select Class" />
</SelectTrigger>

<SelectContent>

{classes
.sort((a,b)=>Number(a.className)-Number(b.className))
.map((cls)=>(
<SelectItem key={cls._id} value={cls._id}>
Class {cls.className}
</SelectItem>
))}

</SelectContent>

</Select>

      </div>
<Button
onClick={fetchCurrentFee}
className="w-full flex items-center gap-2"
>

<Search size={16} />

Fetch Fee

</Button>

    </div>

    {error && (
      <p className="text-sm text-red-500">
        {error}
      </p>
    )}

  </div>

  <Separator />


  {/* FEE GRID */}

  <div className="space-y-4">

    <h3 className="text-sm font-semibold text-muted-foreground">
      Fee Structure
    </h3>

    <div className="grid md:grid-cols-3 gap-6">

      <InputField label="Tuition Fee" value={tuitionFee} setValue={setTuitionFee} disabled={!editing}/>
      <InputField label="Admission Fee" value={admissionFee} setValue={setAdmissionFee} disabled={!editing}/>
      <InputField label="Exam Fee" value={examFee} setValue={setExamFee} disabled={!editing}/>
      <InputField label="Hostel Fee" value={hostelFee} setValue={setHostelFee} disabled={!editing}/>
      <InputField label="Transport Fee" value={transportFee} setValue={setTransportFee} disabled={!editing}/>
      <InputField label="Late Fee / Day" value={lateFeePerDay} setValue={setLateFeePerDay} disabled={!editing}/>

    </div>

  </div>


  <Separator />


  {/* TOTAL FEE */}

  <div className="flex items-center justify-between bg-muted/40 rounded-lg p-6">

    <div className="space-y-1">

      <p className="text-sm text-muted-foreground">
        Total Fee
      </p>

      <p className="text-2xl font-semibold">
        ₹{Number(tuitionFee)+Number(admissionFee)+Number(examFee)+Number(hostelFee)+Number(transportFee)}
      </p>

    </div>

    <Badge variant="outline">
      Auto Calculated
    </Badge>

  </div>


  {/* ACTION BUTTONS */}

<div className="flex gap-4">

{!editing && (

<Button
variant="secondary"
className="flex-1 flex items-center justify-center gap-2"
onClick={()=>setEditing(true)}
>

<Pencil size={16} />

Edit Fee Structure

</Button>

)}

{editing && (

<Button
className="flex-1 flex items-center justify-center gap-2"
onClick={updateFee}
>

<Save size={16} />

Save Changes

</Button>

)}

</div>

</div>
)
}

/* INPUT COMPONENT */

function InputField({ label, value, setValue, disabled }) {

return (

<div className="space-y-2">

<label className="text-sm font-medium">
{label}
</label>

<div className="relative">

<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
₹
</span>

<input
type="number"
value={value}
disabled={disabled}
placeholder="Enter amount"
onChange={(e)=>setValue(e.target.value)}
className="w-full pl-7 border rounded-md p-2 bg-background disabled:bg-muted"
/>

</div>

</div>

)

}