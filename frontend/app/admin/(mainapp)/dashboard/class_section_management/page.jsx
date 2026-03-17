"use client";

import { useEffect, useState } from "react";
import { adminServices } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogFooter,
} from "@/components/ui/dialog";

export default function Page() {

const [classes,setClasses] = useState([])
const [sections,setSections] = useState([])

const [newClass,setNewClass] = useState("")
const [sectionName,setSectionName] = useState("")
const [selectedClass,setSelectedClass] = useState("")

const [deleteType,setDeleteType] = useState(null)
const [deleteId,setDeleteId] = useState(null)

const [loading,setLoading] = useState(false)



/* FETCH DATA */

const fetchAllData = async()=>{

try{

const res = await adminServices.getAllClasses()
const data = res?.data || []

const unique = [...new Map(data.map(i=>[i.className,i])).values()]

setClasses(unique)

if(selectedClass){

const selected = unique.find(c=>c._id===selectedClass)

const sectionsList = data
.filter(c=>c.className===selected?.className)
.sort((a,b)=>a.section.localeCompare(b.section))

setSections(sectionsList)

}

}catch{

toast.error("Failed to load data")

}

}

useEffect(()=>{ fetchAllData() },[])

useEffect(()=>{

if(!selectedClass){
setSections([])
return
}

fetchAllData()

},[selectedClass])



/* CREATE CLASS */

const createClass = async()=>{

const value = newClass.trim()

if(!value){
toast.error("Enter class name")
return
}

if(classes.some(c=>c.className===value)){
toast.error("Class already exists")
return
}

try{

setLoading(true)

await adminServices.createClass({
className:value,
section:"A",
academicYear:new Date().getFullYear()
})

toast.success("Class created")

setNewClass("")
await fetchAllData()

}catch{

toast.error("Failed to create class")

}finally{

setLoading(false)

}

}



/* DELETE CLASS */

const deleteClass = async(id)=>{

try{

const selected = classes.find(c=>c._id===id)

const res = await adminServices.getAllClasses()
const all = res?.data || []

const docs = all.filter(c=>c.className===selected.className)

await Promise.all(
docs.map(d=>adminServices.deleteClass(d._id))
)

toast.success("Class deleted")

setSelectedClass("")
setSections([])

await fetchAllData()

}catch{

toast.error("Failed to delete class")

}

}



/* CREATE SECTION */

const createSection = async()=>{

let value = sectionName.trim().toUpperCase()

if(!selectedClass){
toast.error("Select class first")
return
}

if(!value){
toast.error("Enter section name")
return
}

const selected = classes.find(c=>c._id===selectedClass)

if(sections.some(sec=>sec.section===value)){
toast.error("Section already exists")
return
}

try{

setLoading(true)

await adminServices.createClass({
className:selected.className,
section:value,
academicYear:new Date().getFullYear()
})

toast.success("Section created")

setSectionName("")
await fetchAllData()

}catch{

toast.error("Failed to create section")

}finally{

setLoading(false)

}

}



/* DELETE SECTION */

const deleteSection = async(id)=>{

try{

await adminServices.deleteClass(id)

toast.success("Section deleted")

setSections(prev=>prev.filter(s=>s._id!==id))

await fetchAllData()

}catch{

toast.error("Failed to delete section")

}

}



const sortedClasses = [...classes].sort((a,b)=>
a.className.localeCompare(b.className,undefined,{numeric:true})
)



const confirmDelete = async()=>{

if(deleteType==="class") await deleteClass(deleteId)
if(deleteType==="section") await deleteSection(deleteId)

setDeleteType(null)
setDeleteId(null)

}



/* UI */

return(

<div className="min-h-screen bg-muted/30 p-10">

<div className="max-w-6xl mx-auto space-y-8">


{/* HEADER */}

<div className="flex items-center justify-between border-b pb-4">

<div>

<h1 className="text-2xl font-semibold tracking-tight">
Class & Section Management
</h1>

<p className="text-sm text-muted-foreground">
Manage classes and sections for your school
</p>

</div>


<div className="flex items-center gap-2">

<Input
placeholder="New class..."
value={newClass}
onChange={(e)=>setNewClass(e.target.value)}
className="w-[220px]"
/>

<Button
onClick={createClass}
disabled={loading}
className="flex gap-2"
>

<Plus size={16}/>
Create

</Button>

</div>

</div>



{/* WORKSPACE */}

<div className="grid grid-cols-[260px_1fr] gap-10">


{/* LEFT SIDE CLASSES */}

<div className="space-y-3">

<h2 className="text-sm font-medium text-muted-foreground">
Classes
</h2>

<div className="border rounded-lg overflow-hidden bg-background">

{sortedClasses.map(cls=>(

<div
key={cls._id}
onClick={()=>setSelectedClass(cls._id)}
className={`flex items-center justify-between px-3 py-2 cursor-pointer transition
${selectedClass===cls._id
? "bg-accent"
: "hover:bg-muted"}
`}
>

<span className="text-sm font-medium">
Class {cls.className}
</span>

<Button
variant="ghost"
size="icon"
onClick={(e)=>{
e.stopPropagation()
setDeleteType("class")
setDeleteId(cls._id)
}}
>

<Trash2 size={14}/>

</Button>

</div>

))}

</div>

</div>



{/* RIGHT SIDE SECTIONS */}

<div className="space-y-6">


{/* SECTION TOOLBAR */}

<div className="flex items-center gap-3">

<Input
placeholder="Section"
value={sectionName}
onChange={(e)=>setSectionName(e.target.value.toUpperCase())}
className="w-[160px]"
/>

<Button
onClick={createSection}
disabled={loading || !selectedClass}
className="flex gap-2"
>

<Plus size={16}/>
Add Section

</Button>

</div>



{/* SECTION LIST */}

<div className="border rounded-lg overflow-hidden bg-background">

{sections.length===0 && (

<div className="text-sm text-muted-foreground p-4">
No sections available
</div>

)}

{sections.map(sec=>(

<div
key={sec._id}
className="flex justify-between items-center px-4 py-3 border-b last:border-none hover:bg-muted/40 transition"
>

<span className="text-sm font-medium">
Section {sec.section}
</span>

<Button
variant="ghost"
size="icon"
onClick={()=>{
setDeleteType("section")
setDeleteId(sec._id)
}}
>

<Trash2 size={14}/>

</Button>

</div>

))}

</div>

</div>

</div>



{/* DELETE MODAL */}

<Dialog open={!!deleteType} onOpenChange={()=>setDeleteType(null)}>

<DialogContent>

<DialogHeader>
<DialogTitle>
Confirm Delete
</DialogTitle>
</DialogHeader>

<p className="text-sm text-muted-foreground">
Are you sure you want to delete this {deleteType}?
</p>

<DialogFooter>

<Button
variant="outline"
onClick={()=>setDeleteType(null)}
>
Cancel
</Button>

<Button
variant="destructive"
onClick={confirmDelete}
>
Delete
</Button>

</DialogFooter>

</DialogContent>

</Dialog>

</div>

</div>

)

}