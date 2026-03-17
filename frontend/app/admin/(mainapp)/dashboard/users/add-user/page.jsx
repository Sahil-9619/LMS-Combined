"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminServices } from "@/services/admin/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const AddUsers = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    roleName: "user",

    // Admin / Instructor
    name: "",
    email: "",
    password: "",
    phone: "",

    // Student Fields
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    phone: "",
    parentPhone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    category: "",
    course: "",
    section: "",
    photo: null,
  });

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [allClasses, setAllClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {

    const fetchClasses = async () => {

      try {

        const res = await adminServices.getAllClasses();
        const data = res?.data || [];

        setAllClasses(data);

      } catch (err) {
        console.log(err);
      }

    };

    fetchClasses();

  }, []);

  /* HANDLE CHANGE */
  const onChange = (e) => {

    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm(prev => ({ ...prev, photo: files[0] }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));

    /* when class changes load sections */

    if (name === "course") {

     const filtered = allClasses.filter(
  c => c.className === value
);

// remove duplicates + sort sections
const uniqueSections = [
  ...new Map(filtered.map(sec => [sec.section, sec])).values()
].sort((a, b) => a.section.localeCompare(b.section));

setSections(uniqueSections);

    }

  };
  /* HANDLE SUBMIT */
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    setSuccess("");
    try {
      if (form.roleName === "user") {
        if (!form.course) {
          setError("Please select class");
          setSubmitting(false); return;
        }
        const formData = new FormData(); Object.keys(form).forEach((key) => {
          if (form[key]) {
            formData.append(key, form[key]);
          }
        });
        const res = await adminServices.createStudent(formData);
        setSuccess(res?.data?.message || "Student created successfully");
      } else {
        const payload = { name: form.name.trim(), email: form.email.trim(), password: form.password, phone: form.phone.trim(), roleName: form.roleName, };
        const res = await adminServices.createUser(payload);
        setSuccess(res?.data?.message || "User created successfully");
      }
      setShowSuccessDialog(true);
    }
    catch (err) { setError(err?.response?.data?.message || "Something went wrong"); }
    finally { setSubmitting(false); }
  };

return (
<div className="min-h-screen px-10 py-10">

<div className="max-w-4xl mx-auto space-y-8">

{/* HEADER */}

<div className="border-b pb-5">
<h1 className="text-2xl font-semibold tracking-tight">
Create User
</h1>
<p className="text-sm text-muted-foreground">
Add students, instructors or administrators
</p>
</div>


<form onSubmit={onSubmit} className="space-y-8">

{error && (
<p className="text-sm text-red-600">{error}</p>
)}

{success && (
<p className="text-sm text-green-600">{success}</p>
)}


{/* ROLE */}

<div className="space-y-2 max-w-[260px]">

<label className="text-sm font-medium">
Role
</label>

<Select
value={form.roleName}
onValueChange={(value)=>
setForm(prev=>({...prev,roleName:value}))
}
>

<SelectTrigger className="border-0 border-b-2 border-cyan-500 rounded-none px-0 focus:ring-0">
<SelectValue placeholder="Select Role"/>
</SelectTrigger>

<SelectContent>
<SelectItem value="user">Student</SelectItem>
<SelectItem value="instructor">Instructor</SelectItem>
<SelectItem value="admin">Admin</SelectItem>
</SelectContent>

</Select>

</div>



{/* STUDENT FORM */}

{form.roleName==="user" ? (

<div className="space-y-8">


{/* BASIC INFORMATION */}

<div>

<div className="flex items-center mb-4">
<h3 className="text-sm font-semibold text-[#178F9E]">
Basic Information
</h3>
<div className="h-px bg-border flex-1 ml-4 bg-cyan-500"></div>
</div>

<div className="grid md:grid-cols-2 gap-6">

<Input
name="firstName"
placeholder="First Name"
onChange={onChange}
required
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
name="lastName"
placeholder="Last Name"
onChange={onChange}
required
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
name="fatherName"
placeholder="Father Name"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
name="motherName"
placeholder="Mother Name"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

</div>

</div>



{/* CONTACT */}

<div>

<div className="flex items-center mb-4">
<h3 className="text-sm font-semibold text-[#178F9E]">
Contact Details
</h3>
<div className="h-px bg-border flex-1 ml-4"></div>
</div>

<div className="grid md:grid-cols-2 gap-6">

<Input
name="phone"
placeholder="Student Phone"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
name="parentPhone"
placeholder="Parent Phone"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
type="email"
name="email"
placeholder="Email"
onChange={onChange}
className="md:col-span-2 border-0 border-b border-border rounded-none px-0"
/>

</div>

</div>



{/* PERSONAL */}

<div>

<div className="flex items-center mb-4">
<h3 className="text-sm font-semibold text-[#178F9E]">
Personal Details
</h3>
<div className="h-px bg-border flex-1 ml-4 bg-cyan-500"></div>
</div>

<div className="grid md:grid-cols-3 gap-6">

<Input
type="date"
name="dateOfBirth"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

<Select
value={form.gender}
onValueChange={(value)=>
setForm(prev=>({...prev,gender:value}))
}
>

<SelectTrigger className="border-0 border-b-2 border-cyan-500 rounded-none px-0 focus:ring-0">
<SelectValue placeholder="Gender"/>
</SelectTrigger>

<SelectContent>
<SelectItem value="male">Male</SelectItem>
<SelectItem value="female">Female</SelectItem>
<SelectItem value="other">Other</SelectItem>
</SelectContent>

</Select>

<Select
value={form.category}
onValueChange={(value)=>
setForm(prev=>({...prev,category:value}))
}
>

<SelectTrigger className="border-0 border-b-2 border-cyan-500 rounded-none px-0 focus:ring-0">
<SelectValue placeholder="Category"/>
</SelectTrigger>

<SelectContent>
<SelectItem value="general">General</SelectItem>
<SelectItem value="obc">OBC</SelectItem>
<SelectItem value="sc">SC</SelectItem>
<SelectItem value="st">ST</SelectItem>
</SelectContent>

</Select>

</div>

</div>



{/* ACADEMIC */}

<div>

<div className="flex items-center mb-4">
<h3 className="text-sm font-semibold text-[#178F9E]">
Academic Details
</h3>
<div className="h-px bg-border flex-1 ml-4 bg-cyan-500"></div>
</div>

<div className="grid md:grid-cols-2 gap-6">

<Select
value={form.course}
onValueChange={(value)=>{

setForm(prev=>({...prev,course:value}))

const filtered = allClasses.filter(c=>c.className===value)

const uniqueSections = [
...new Map(filtered.map(sec=>[sec.section,sec])).values()
].sort((a,b)=>a.section.localeCompare(b.section))

setSections(uniqueSections)

}}
>

<SelectTrigger className="border-0 border-b-2 border-cyan-500 rounded-none px-0 focus:ring-0">
<SelectValue placeholder="Select Class"/>
</SelectTrigger>

<SelectContent>

{[...new Map(allClasses.map(c=>[c.className,c])).values()]
.sort((a,b)=>Number(a.className)-Number(b.className))
.map(cls=>(
<SelectItem key={cls.className} value={cls.className}>
Class {cls.className}
</SelectItem>
))}

</SelectContent>

</Select>


<Select
value={form.section}
onValueChange={(value)=>{
setForm(prev=>({...prev,section:value}))
}}
>
<SelectTrigger className="border-0 border-b-2 border-cyan-500 rounded-none px-0 focus:ring-0">
<SelectValue placeholder="Select Section"/>
</SelectTrigger>

<SelectContent>

{sections.map(sec=>(
<SelectItem key={sec._id} value={sec.section}>
Section {sec.section}
</SelectItem>
))}

</SelectContent>

</Select>

</div>

</div>



{/* ADDRESS */}

<Input
name="address"
placeholder="Address"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>



{/* PHOTO */}

<Input
type="file"
name="photo"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

</div>

) : (

<div className="grid md:grid-cols-2 gap-6">

<Input
name="name"
placeholder="Full Name"
onChange={onChange}
required
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
type="email"
name="email"
placeholder="Email"
onChange={onChange}
required
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
type="password"
name="password"
placeholder="Password"
onChange={onChange}
required
className="border-0 border-b border-border rounded-none px-0"
/>

<Input
name="phone"
placeholder="Phone"
onChange={onChange}
className="border-0 border-b border-border rounded-none px-0"
/>

</div>

)}



{/* SUBMIT */}

<div className="pt-6 flex justify-end">

<Button
type="submit"
className="bg-[#178F9E] hover:bg-[#0F6F7C] px-6"
disabled={submitting}
>

{submitting ? "Creating..." : "Create User"}

</Button>

</div>


</form>



{/* SUCCESS MODAL */}

<AlertDialog open={showSuccessDialog}>

<AlertDialogContent>

<AlertDialogHeader>

<AlertDialogTitle>Success</AlertDialogTitle>

<AlertDialogDescription>
{success || "User created successfully"}
</AlertDialogDescription>

</AlertDialogHeader>

<AlertDialogFooter>

<AlertDialogAction
className="bg-[#178F9E] hover:bg-[#0F6F7C]"
onClick={()=>{
setShowSuccessDialog(false)
router.push("/admin/dashboard/users")
}}
>
OK
</AlertDialogAction>

</AlertDialogFooter>

</AlertDialogContent>

</AlertDialog>

</div>
</div>
);
};

export default AddUsers;