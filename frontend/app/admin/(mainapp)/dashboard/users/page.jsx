"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  setUserFilters,
  setUserPagination,
} from "@/lib/store/features/adminSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getMediaUrl } from "@/app/utils/getAssetsUrl";
import { adminServices } from "@/services/admin/admin.service";
import { toast } from "sonner";


const AllUsers = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { users, usersStatus, usersError, pagination, summary, filters } =
    useSelector((s) => s.admin);

  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // 🔥 AUTO SEARCH WITH DEBOUNCE
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(setUserFilters({ search: localSearch }));
      dispatch(setUserPagination({ page: 1 }));
    }, 10); // 10ms delay

    return () => clearTimeout(delay);
  }, [localSearch, dispatch]);

  // fetch whenever filters/pagination change
  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        role: filters.role,
      })
    );
  }, [
    dispatch,
    pagination.page,
    pagination.limit,
    filters.search,
    filters.role,
  ]);

  const totalPages = useMemo(
    () => pagination.totalPages || 0,
    [pagination.totalPages]
  );

  /*const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setUserFilters({ search: localSearch }));
    dispatch(setUserPagination({ page: 1 }));
  };*/

  const handleRoleChange = (value) => {
    dispatch(setUserFilters({ role: value === "all" ? "" : value }));
    dispatch(setUserPagination({ page: 1 }));
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setUserPagination({ page }));
  };

  const handleDelete = async (id) => {
    try {

      await adminServices.deleteUser(id);

      // refetch current page
      dispatch(
        fetchAllUsers({
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          role: filters.role,
        })
      );

      toast.success("User deleted", {
        position: "bottom-center",
        style: {
          background: "#178F9E",
          color: "#fff",
        },
      });

    } catch (e) {

      toast.error(
        e?.response?.data?.message || "Failed to delete user",
        {
          position: "top-center",
        }
      );

    }
  };

return (
<div className="px-8 py-6 space-y-8">

{/* PAGE TITLE */}

<div className="flex items-center justify-between">

<div>
<h1 className="text-3xl font-semibold tracking-tight">
User Management
</h1>
<p className="text-sm text-muted-foreground">
View, search and manage all system users
</p>
</div>

<Button asChild className="bg-[#178F9E] hover:bg-[#0F6F7C]">
<Link href="/admin/dashboard/users/add-user">
Add New User
</Link>
</Button>

</div>



{/* TOOLBAR */}



{/* SEARCH + FILTER BAR */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 border-b">

{/* LEFT SIDE SEARCH */}

<div className="flex items-center gap-3 flex-1">

<div className="relative w-[300px]">

<Input
placeholder="Search users..."
value={localSearch}
onChange={(e)=>setLocalSearch(e.target.value)}
className="pl-10"
/>

<svg
xmlns="http://www.w3.org/2000/svg"
className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
/>
</svg>

</div>


<Select
value={filters.role || "all"}
onValueChange={handleRoleChange}
>

<SelectTrigger className="w-[180px]">
<SelectValue placeholder="Role"/>
</SelectTrigger>

<SelectContent>

<SelectItem value="all">
All Roles
</SelectItem>

<SelectItem value="admin">
Admin
</SelectItem>

<SelectItem value="instructor">
Instructor
</SelectItem>

<SelectItem value="user">
User
</SelectItem>

</SelectContent>

</Select>

</div>


{/* RIGHT SIDE INFO */}

<div className="flex items-center gap-4">




</div>

</div>

<div className="text-sm text-muted-foreground">
  Total results: {summary.totalUsers || 0}
</div>





{/* ANALYTICS SECTION */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

<Card className="border-l-4 border-[#178F9E]">
<CardContent className="p-5">
<p className="text-sm text-muted-foreground">
Total Users
</p>
<p className="text-3xl font-semibold">
{summary.totalUsers || 0}
</p>
</CardContent>
</Card>

<Card className="border-l-4 border-purple-500">
<CardContent className="p-5">
<p className="text-sm text-muted-foreground">
Admins
</p>
<p className="text-3xl font-semibold">
{summary.byRole?.admin || 0}
</p>
</CardContent>
</Card>

<Card className="border-l-4 border-orange-500">
<CardContent className="p-5">
<p className="text-sm text-muted-foreground">
Instructors
</p>
<p className="text-3xl font-semibold">
{summary.byRole?.instructor || 0}
</p>
</CardContent>
</Card>

<Card className="border-l-4 border-green-500">
<CardContent className="p-5">
<p className="text-sm text-muted-foreground">
Users
</p>
<p className="text-3xl font-semibold">
{summary.byRole?.user || 0}
</p>
</CardContent>
</Card>

</div>



{/* USERS PANEL */}

{/* USERS DIRECTORY */}

{/* USERS TABLE */}

<div className="space-y-4">

{/* HEADER */}

<div className="flex items-center justify-between">

<h2 className="text-lg font-semibold flex items-center gap-2">
<svg
xmlns="http://www.w3.org/2000/svg"
className="h-5 w-5 text-muted-foreground"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
d="M17 20h5V4H2v16h5m10 0v-5a3 3 0 00-3-3H10a3 3 0 00-3 3v5m10 0H7"/>
</svg>

Users Directory
</h2>

<p className="text-sm text-muted-foreground">
{users.length} users
</p>

</div>



{/* STATES */}

{usersStatus === "loading" && (
<div className="py-10 text-center text-sm text-muted-foreground">
Loading users...
</div>
)}

{usersStatus === "failed" && (
<div className="py-10 text-center text-sm text-red-600">
{usersError || "Failed to load users"}
</div>
)}



{/* TABLE */}

{usersStatus === "succeeded" && (

<div className="border rounded-lg overflow-hidden">

<Table>

{/* HEADER */}

<TableHeader>

<TableRow className="bg-muted/40">

<TableHead className="pl-6">User</TableHead>

<TableHead>Email</TableHead>

<TableHead>Role</TableHead>

<TableHead>Status</TableHead>

<TableHead className="text-right pr-6">
Actions
</TableHead>

</TableRow>

</TableHeader>



{/* BODY */}

<TableBody>

{users.map((u)=>(
<TableRow
key={u._id}
className="hover:bg-muted/30 transition"
>

{/* USER */}

<TableCell className="pl-6">

<div className="flex items-center gap-3">

<Avatar className="h-9 w-9 border">

<AvatarFallback className="text-xs">
{u.name?.split(" ").map(n=>n[0]).join("") || "U"}
</AvatarFallback>

</Avatar>

<div>

<div className="font-medium">
{u.name}
</div>

<div className="text-xs text-muted-foreground">
User ID: {u._id.slice(-6)}
</div>

</div>

</div>

</TableCell>



{/* EMAIL */}

<TableCell>

<div className="flex items-center gap-2 text-muted-foreground">

<svg xmlns="http://www.w3.org/2000/svg"
className="h-4 w-4"
fill="none"
viewBox="0 0 24 24"
stroke="currentColor"
>
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
d="M16 12H8m0 0l4-4m-4 4l4 4"/>
</svg>

<span>{u.email}</span>

</div>

</TableCell>



{/* ROLE */}

<TableCell>

<Badge
className={
u.role?.name === "admin"
? "bg-purple-600 hover:bg-purple-600"
: u.role?.name === "instructor"
? "bg-orange-500 hover:bg-orange-500"
: "bg-slate-600 hover:bg-slate-600"
}
>
{u.role?.name || "-"}
</Badge>

</TableCell>



{/* STATUS */}

<TableCell>

{u.isVerified ? (

<Badge className="bg-green-600 hover:bg-green-600">
Verified
</Badge>

) : (

<Badge variant="outline">
Pending
</Badge>

)}

</TableCell>



{/* ACTIONS */}

<TableCell className="text-right pr-6">

<div className="flex justify-end gap-2">

<Button
size="sm"
variant="outline"
onClick={() =>
router.push(`/admin/dashboard/users/view/${u._id}`)
}
>
View
</Button>



<AlertDialog>

<AlertDialogTrigger asChild>

<Button
size="sm"
variant="destructive"
>
Delete
</Button>

</AlertDialogTrigger>

<AlertDialogContent>

<AlertDialogHeader>

<AlertDialogTitle>
Delete User
</AlertDialogTitle>

<AlertDialogDescription>
This action cannot be undone.
</AlertDialogDescription>

</AlertDialogHeader>

<AlertDialogFooter>

<AlertDialogCancel>
Cancel
</AlertDialogCancel>

<AlertDialogAction
className="bg-red-600 hover:bg-red-700"
onClick={()=>handleDelete(u._id)}
>
Delete
</AlertDialogAction>

</AlertDialogFooter>

</AlertDialogContent>

</AlertDialog>

</div>

</TableCell>

</TableRow>
))}

</TableBody>

</Table>

</div>

)}

</div>



{/* PAGINATION */}

{usersStatus === "succeeded" && totalPages > 1 && (

<div className="flex items-center justify-between">

<div className="text-sm text-muted-foreground">
Page {pagination.page} of {totalPages}
</div>

<div className="flex gap-2">

<Button
variant="outline"
size="sm"
onClick={()=>goToPage(pagination.page - 1)}
disabled={pagination.page <= 1}
>
Prev
</Button>

<Button
variant="outline"
size="sm"
onClick={()=>goToPage(pagination.page + 1)}
disabled={pagination.page >= totalPages}
>
Next
</Button>

</div>

</div>

)}

</div>
);
};

export default AllUsers;
