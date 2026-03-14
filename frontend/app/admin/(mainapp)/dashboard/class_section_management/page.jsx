"use client";

import { useEffect, useState } from "react";
import { adminServices } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export default function Page() {

const [classes,setClasses] = useState([]);
const [sections,setSections] = useState([]);

const [newClass,setNewClass] = useState("");
const [sectionName,setSectionName] = useState("");
const [selectedClass,setSelectedClass] = useState("");

const [deleteType,setDeleteType] = useState(null);
const [deleteId,setDeleteId] = useState(null);

const [loading,setLoading] = useState(false);



/* ---------------- FETCH ALL DATA ---------------- */

const fetchAllData = async () => {

try{

const res = await adminServices.getAllClasses();
const data = res?.data || [];

/* unique classes */
const unique = [
...new Map(data.map(item => [item.className,item])).values()
];

setClasses(unique);

/* refresh section list if class selected */

if(selectedClass){

const selected = unique.find(c => c._id === selectedClass);

const sectionsList = data.filter(
c => c.className === selected?.className
);

setSections(sectionsList);

}

}catch(err){

toast.error("Failed to load data");

}

};



useEffect(()=>{
fetchAllData();
},[]);



useEffect(()=>{

if(!selectedClass){
setSections([]);
return;
}

fetchAllData();

},[selectedClass]);



/* ---------------- CREATE CLASS ---------------- */

const createClass = async () => {

const value = newClass.trim();

if(!value){

toast.error("Enter class name");
return;

}

if(classes.some(c => c.className === value)){

toast.error("Class already exists");
return;

}

try{

setLoading(true);

await adminServices.createClass({

className:value,
section:"A",
academicYear:new Date().getFullYear()

});

toast.success("Class created");

setNewClass("");

await fetchAllData();

}catch(err){

toast.error(err?.response?.data?.message || "Failed to create class");

}
finally{

setLoading(false);

}

};



/* ---------------- DELETE CLASS (ALL SECTIONS) ---------------- */

const deleteClass = async (classId) => {

try{

const selected = classes.find(c => c._id === classId);

const res = await adminServices.getAllClasses();
const all = res?.data || [];

const classDocs = all.filter(
c => c.className === selected.className
);

/* delete all sections of that class */

await Promise.all(
classDocs.map(doc =>
adminServices.deleteClass(doc._id)
)
);

toast.success("Class deleted");

setSelectedClass("");
setSections([]);

await fetchAllData();

}catch(err){

toast.error("Failed to delete class");

}

};



/* ---------------- CREATE SECTION ---------------- */

const createSection = async () => {

let value = sectionName.trim().toUpperCase();   // CAPITAL

if(!selectedClass){

toast.error("Select class first");
return;

}

if(!value){

toast.error("Enter section name");
return;

}

const selected = classes.find(c => c._id === selectedClass);

/* prevent duplicate */

if(sections.some(sec => sec.section === value)){

toast.error("Section already exists");
return;

}

try{

setLoading(true);

await adminServices.createClass({

className:selected.className,
section:value,
academicYear:new Date().getFullYear()

});

toast.success("Section created");

setSectionName("");

await fetchAllData();

}catch(err){

toast.error(err?.response?.data?.message || "Failed to create section");

}
finally{

setLoading(false);

}

};



/* ---------------- DELETE SECTION ---------------- */

const deleteSection = async (id) => {

try{

await adminServices.deleteClass(id);

toast.success("Section deleted");

/* instant UI update */

setSections(prev =>
prev.filter(sec => sec._id !== id)
);

await fetchAllData();

}catch(err){

toast.error("Failed to delete section");

}

};



/* ---------------- SORT CLASSES ---------------- */

const sortedClasses = [...classes].sort((a,b)=>
a.className.localeCompare(b.className,undefined,{numeric:true})
);



/* ---------------- DELETE CONFIRM ---------------- */

const confirmDelete = async () => {

if(deleteType === "class"){
await deleteClass(deleteId);
}

if(deleteType === "section"){
await deleteSection(deleteId);
}

setDeleteType(null);
setDeleteId(null);

};



return(

<div className="min-h-screen bg-[#F8FAFC] p-10">

<h1 className="text-3xl font-semibold text-slate-800 mb-10">
Class & Section Management
</h1>



{/* CREATE CLASS */}

<div className="bg-white border rounded-lg p-6 mb-10">

<h2 className="font-semibold mb-4 text-slate-700">
Create Class
</h2>

<div className="flex gap-3">

<input
type="text"
value={newClass}
onChange={(e)=>setNewClass(e.target.value)}
placeholder="Example: 1,2,3"
className="border rounded-md px-3 py-2 w-[250px]"
/>

<button
onClick={createClass}
disabled={loading}
className="flex items-center gap-2 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-800"
>
<Plus size={16}/>
Create
</button>

</div>

</div>



{/* CLASS LIST */}

<div className="bg-white border rounded-lg p-6 mb-10">

<h2 className="font-semibold mb-4 text-slate-700">
Existing Classes
</h2>

{sortedClasses.length===0 &&(
<p className="text-gray-500">No classes available</p>
)}

<div className="space-y-2">

{sortedClasses.map(cls=>(
<div
key={cls._id}
className="flex justify-between items-center border rounded-md px-4 py-2"
>

<span className="font-medium">
Class {cls.className}
</span>

<button
onClick={()=>{

setDeleteType("class");
setDeleteId(cls._id);

}}
className="text-red-500 hover:text-red-700"
>

<Trash2 size={16}/>

</button>

</div>
))}

</div>

</div>



{/* SECTION MANAGEMENT */}

<div className="bg-white border rounded-lg p-6">

<h2 className="font-semibold mb-4 text-slate-700">
Manage Sections
</h2>

<div className="flex gap-3 mb-6">

<select
value={selectedClass}
onChange={(e)=>setSelectedClass(e.target.value)}
className="border rounded-md px-3 py-2"
>

<option value="">
Select Class
</option>

{sortedClasses.map(cls=>(
<option key={cls._id} value={cls._id}>
Class {cls.className}
</option>
))}

</select>


<input
type="text"
value={sectionName}
onChange={(e)=>setSectionName(e.target.value.toUpperCase())}
placeholder="Section (A,B,C)"
className="border rounded-md px-3 py-2 w-[180px]"
/>

<button
onClick={createSection}
disabled={loading || !selectedClass}
className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900"
>

<Plus size={16}/>
Add Section

</button>

</div>



{/* SECTION LIST */}

{selectedClass && sections.length===0 &&(
<p className="text-gray-500">
No sections available
</p>
)}

<div className="space-y-2">

{sections.map(sec=>(
<div
key={sec._id}
className="flex justify-between items-center border rounded-md px-4 py-2"
>

<span className="font-medium">
Section {sec.section}
</span>

<button
onClick={()=>{

setDeleteType("section");
setDeleteId(sec._id);

}}
className="text-red-500 hover:text-red-700"
>

<Trash2 size={16}/>

</button>

</div>
))}

</div>

</div>



{/* DELETE POPUP */}

{deleteType &&(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-lg shadow-lg p-6 w-[350px] text-center">

<h3 className="text-lg font-semibold mb-3">
Confirm Delete
</h3>

<p className="text-gray-500 mb-6">
Are you sure you want to delete this {deleteType}?
</p>

<div className="flex justify-center gap-4">

<button
onClick={()=>setDeleteType(null)}
className="px-4 py-2 border rounded-md hover:bg-gray-100"
>
Cancel
</button>

<button
onClick={confirmDelete}
className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
>
Delete
</button>

</div>

</div>

</div>

)}

</div>

);

}