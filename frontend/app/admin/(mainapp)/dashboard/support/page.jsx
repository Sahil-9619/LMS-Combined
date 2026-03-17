"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ContactServices } from "@/services/contact.service";

export default function SupportRequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // 👈 NEW

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await ContactServices.getContact();
      const result = res?.data || [];
      setTickets(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = tickets.filter((req) => {
    const name = req?.name || "";
    const email = req?.email || "";
    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    try {
      await ContactServices.deleteContact(id);
      fetchTickets();
      setDeleteId(null);
    } catch (error) {
      alert("Failed to delete ticket");
    }
  };

 return (
<>
<div className={deleteId ? "blur-sm pointer-events-none" : ""}>

<motion.div
className="p-10 space-y-10 max-w-7xl"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.4 }}
>

{/* HEADER */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b pb-6">

<div>

<h1 className="text-3xl font-semibold tracking-tight">
Support Requests
</h1>

<p className="text-sm text-muted-foreground mt-1">
Manage and respond to customer support tickets.
</p>

</div>

<Badge variant="secondary">
Support Center
</Badge>

</div>


{/* SEARCH */}

<div className="flex items-center gap-4 max-w-md">

<div className="relative w-full">

<Search
size={16}
className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
/>

<Input
placeholder="Search by name or email..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="pl-9"
/>

</div>

</div>

<Separator />


{/* TABLE */}

<div className="border rounded-lg overflow-hidden">

<Table>

<TableHeader>

<TableRow className="bg-muted/40">

<TableHead>User</TableHead>

<TableHead>Subject</TableHead>

<TableHead>Date</TableHead>

<TableHead className="text-right pr-6">
Actions
</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{loading ? (

<TableRow>
<TableCell colSpan={4} className="text-center py-12">
Loading support tickets...
</TableCell>
</TableRow>

) : filteredData.length === 0 ? (

<TableRow>
<TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
No support requests found
</TableCell>
</TableRow>

) : (

filteredData.map((req) => (

<TableRow key={req._id}>

<TableCell className="py-5">

<div>

<div className="font-medium">
{req?.name || "N/A"}
</div>

<div className="text-sm text-muted-foreground">
{req?.email || "N/A"}
</div>

</div>

</TableCell>


<TableCell className="max-w-[320px] truncate">
{req?.subject || "-"}
</TableCell>


<TableCell>

{req?.createdAt
? new Date(req.createdAt).toLocaleDateString()
: "-"}

</TableCell>


<TableCell className="text-right pr-6 space-x-2">

<Link href={`/admin/dashboard/support/view/${req._id}`}>

<Button
variant="outline"
size="sm"
className="gap-2"
>

<Eye size={14} />

View

</Button>

</Link>


<Button
variant="destructive"
size="sm"
className="gap-2"
onClick={() => setDeleteId(req._id)}
>

<Trash2 size={14} />

Delete

</Button>

</TableCell>

</TableRow>

))

)}

</TableBody>

</Table>

</div>

</motion.div>

</div>


{/* DELETE MODAL */}

<AnimatePresence>

{deleteId && (

<>

<motion.div
className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onClick={() => setDeleteId(null)}
/>


<motion.div
className="fixed inset-0 flex items-center justify-center z-50"
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
transition={{ duration: 0.2 }}
>

<div className="bg-background border rounded-xl shadow-lg p-8 w-[420px] text-center">

<h2 className="text-lg font-semibold mb-2">
Delete Support Ticket
</h2>

<p className="text-sm text-muted-foreground mb-6">
This action cannot be undone.
</p>

<div className="flex justify-center gap-4">

<Button
variant="outline"
onClick={() => setDeleteId(null)}
>
Cancel
</Button>

<Button
variant="destructive"
onClick={() => handleDelete(deleteId)}
>
Delete
</Button>

</div>

</div>

</motion.div>

</>

)}

</AnimatePresence>

</>
)
}