"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminServices } from "@/services/admin/admin.service";
import { Card, CardContent } from "@/components/ui/card";
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
import { 
  UserPlus, ShieldCheck, User, Phone, 
  Settings2, BookOpen, MapPin, Camera, 
  UploadCloud, X 
} from "lucide-react";

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
  const [photoPreview, setPhotoPreview] = useState(null);

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
      const file = files[0];
      setForm((prev) => ({ ...prev, photo: file }));
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    /* when class changes load sections */
    if (name === "course") {
      const filtered = allClasses.filter((c) => c.className === value);
      // remove duplicates + sort sections
      const uniqueSections = [
        ...new Map(filtered.map((sec) => [sec.section, sec])).values(),
      ].sort((a, b) => a.section.localeCompare(b.section));

      setSections(uniqueSections);
    }
  };

  /* HANDLE SUBMIT */
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (form.roleName === "user") {
        if (!form.course) {
          setError("Please select a class");
          setSubmitting(false);
          return;
        }
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          if (form[key]) {
            formData.append(key, form[key]);
          }
        });
        const res = await adminServices.createStudent(formData);
        setSuccess(res?.data?.message || "Student created successfully");
      } else {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          roleName: form.roleName,
        };
        const res = await adminServices.createUser(payload);
        setSuccess(res?.data?.message || "User created successfully");
      }
      setShowSuccessDialog(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Shared Premium Input Styles
  const inputStyles = "bg-slate-50 border-slate-200 focus:bg-white focus:border-[#178F9E] focus:ring-2 focus:ring-[#178F9E]/20 rounded-xl  transition-all shadow-sm";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-4 md:p-8 font-sans overflow-y-hidden">
      <div className="max-w-4xl mx-auto space-y-auto">
        
        {/* HEADER AREA (Outside the card for an airy feel) */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#178F9E]/10 flex items-center justify-center text-[#178F9E]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Create New User
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Add a new student, instructor, or administrator to the platform.
            </p>
          </div>
        </div>

        {/* MASTER CARD - Using only ONE card for the entire form */}

         
            <form onSubmit={onSubmit} className="divide-y divide-slate-100">
              
              {/* STATUS MESSAGES */}
              {(error || success) && (
                <div className={`p-4 mx-6 mt-6 rounded-xl text-sm font-medium ${error ? "bg-red-50 text-red-600" : "bg-teal-50 text-[#178F9E]"}`}>
                  {error || success}
                </div>
              )}

              {/* ROLE SELECTION HEADER */}
              <div className="p-6 md:p-8 bg-slate-50/50">
                <div className="space-y-3 max-w-sm">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#178F9E]" /> Assign Role
                  </label>
                  <Select
                    value={form.roleName}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, roleName: value }))}
                  >
                    <SelectTrigger className={`h-10 bg-white ${inputStyles}`}>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-lg border-slate-200">
                      <SelectItem value="user">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DYNAMIC FORM FIELDS */}
              <div className="p-6 md:p-8 space-y-auto">
                {form.roleName === "user" ? (
                  // ==============================
                  // STUDENT FORM
                  // ==============================
                  <div className="space-y-10">
                    
                    {/* Basic Information */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-[#178F9E]">
                        <User className="w-5 h-5" />
                        <h3 className="text-base font-bold">Basic Information</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <Input name="firstName" placeholder="First Name" onChange={onChange} required className={inputStyles} />
                        <Input name="lastName" placeholder="Last Name" onChange={onChange} required className={inputStyles} />
                        <Input name="fatherName" placeholder="Father's Name" onChange={onChange} className={inputStyles} />
                        <Input name="motherName" placeholder="Mother's Name" onChange={onChange} className={inputStyles} />
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-[#178F9E]">
                        <Phone className="w-5 h-5" />
                        <h3 className="text-base font-bold">Contact Details</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <Input name="phone" placeholder="Student Phone Number" onChange={onChange} className={inputStyles} />
                        <Input name="parentPhone" placeholder="Parent Phone Number" onChange={onChange} className={inputStyles} />
                        <Input type="email" name="email" placeholder="Email Address" onChange={onChange} className={`md:col-span-2 ${inputStyles}`} />
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-[#178F9E]">
                        <Settings2 className="w-5 h-5" />
                        <h3 className="text-base font-bold">Personal Details</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-5">
                        <Input type="date" name="dateOfBirth" onChange={onChange} className={inputStyles} />
                        
                        <Select value={form.gender} onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}>
                          <SelectTrigger className={`h-12 ${inputStyles}`}>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={form.category} onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}>
                          <SelectTrigger className={`h-12 ${inputStyles}`}>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="obc">OBC</SelectItem>
                            <SelectItem value="sc">SC</SelectItem>
                            <SelectItem value="st">ST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-[#178F9E]">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="text-base font-bold">Academic Enrollment</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <Select
                          value={form.course}
                          onValueChange={(value) => {
                            setForm((prev) => ({ ...prev, course: value }));
                            const filtered = allClasses.filter((c) => c.className === value);
                            const uniqueSections = [...new Map(filtered.map((sec) => [sec.section, sec])).values()].sort((a, b) => a.section.localeCompare(b.section));
                            setSections(uniqueSections);
                          }}
                        >
                          <SelectTrigger className={`h-12 ${inputStyles}`}>
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                            {[...new Map(allClasses.map((c) => [c.className, c])).values()]
                              .sort((a, b) => Number(a.className) - Number(b.className))
                              .map((cls) => (
                                <SelectItem key={cls.className} value={cls.className}>
                                  Class {cls.className}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <Select value={form.section} onValueChange={(value) => setForm((prev) => ({ ...prev, section: value }))}>
                          <SelectTrigger className={`h-12 ${inputStyles}`}>
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 shadow-lg">
                            {sections.map((sec) => (
                              <SelectItem key={sec._id} value={sec.section}>
                                Section {sec.section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Address & Photo */}
                    <div className="grid md:grid-cols-2 gap-8 pt-2">
                      <div className="space-y-5">
                        <div className="flex items-center gap-2 text-[#178F9E]">
                          <MapPin className="w-5 h-5" />
                          <h3 className="text-base font-bold">Address</h3>
                        </div>
                        <Input name="address" placeholder="Full Residential Address" onChange={onChange} className={inputStyles} />
                      </div>

                      <div className="space-y-5">
                        <div className="flex items-center gap-2 text-[#178F9E]">
                          <Camera className="w-5 h-5" />
                          <h3 className="text-base font-bold">Profile Photo</h3>
                        </div>
                        <div className="flex items-center gap-5">
                          {photoPreview ? (
                            <div className="relative">
                              <img src={photoPreview} alt="preview" className="w-16 h-16 rounded-full object-cover border-2 border-[#178F9E] shadow-md" />
                              <button
                                type="button"
                                onClick={() => { setPhotoPreview(null); setForm((prev) => ({ ...prev, photo: null })); }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                          <label className="cursor-pointer border border-[#178F9E] px-5 py-2.5 rounded-xl text-sm font-medium text-[#178F9E] hover:bg-[#178F9E] hover:text-white transition-all shadow-sm flex items-center gap-2">
                            <UploadCloud className="w-4 h-4" />
                            {photoPreview ? "Change Photo" : "Upload Photo"}
                            <input type="file" name="photo" accept="image/*" onChange={onChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // ==============================
                  // ADMIN / INSTRUCTOR FORM
                  // ==============================
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <Input name="name" placeholder="John Doe" onChange={onChange} required className={inputStyles} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <Input type="email" name="email" placeholder="john@example.com" onChange={onChange} required className={inputStyles} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Temporary Password</label>
                      <Input type="password" name="password" placeholder="••••••••" onChange={onChange} required className={inputStyles} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <Input name="phone" placeholder="+1 (555) 000-0000" onChange={onChange} className={inputStyles} />
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER / SUBMIT BUTTON */}
              <div className="p-6 md:p-8 bg-slate-50/50 flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#178F9E] hover:bg-[#0F6F7C] text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-[#178F9E]/20 transition-all text-base"
                >
                  {submitting ? "Processing..." : `Create ${form.roleName === "user" ? "Student" : form.roleName.charAt(0).toUpperCase() + form.roleName.slice(1)}`}
                </Button>
              </div>
            </form>
      

        {/* SUCCESS MODAL */}
        <AlertDialog open={showSuccessDialog}>
          <AlertDialogContent className="rounded-2xl border-slate-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#178F9E] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> Success
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 text-base">
                {success || "User account has been successfully created and added to the system."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                className="bg-[#178F9E] hover:bg-[#0F6F7C] rounded-xl px-6"
                onClick={() => {
                  setShowSuccessDialog(false);
                  router.push("/admin/dashboard/users");
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
};

export default AddUsers;