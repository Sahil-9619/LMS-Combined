"use client";

import React, { useState } from "react";
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
    studentPhone: "",
    parentPhone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    category: "",
    course: "",
    photo: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* HANDLE CHANGE */
  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
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
          setError("Please select class");
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

      setTimeout(() => {
        router.push("/admin/dashboard/users");
      }, 800);

    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="max-w-3xl mx-auto shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create User</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}

            {/* ROLE */}
            <div>
              <label className="block mb-1 text-sm font-medium">Role</label>
              <Select
                value={form.roleName}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, roleName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* STUDENT FORM */}
            {form.roleName === "user" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" placeholder="First Name" onChange={onChange} required />
                  <Input name="lastName" placeholder="Last Name" onChange={onChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input name="fatherName" placeholder="Father Name" onChange={onChange} />
                  <Input name="motherName" placeholder="Mother Name" onChange={onChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input name="studentPhone" placeholder="Student Phone" onChange={onChange} />
                  <Input name="parentPhone" placeholder="Parent Phone" onChange={onChange} />
                </div>

                <Input type="email" name="email" placeholder="Email" onChange={onChange} />

                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" name="dateOfBirth" onChange={onChange} />

                  <Select
                    value={form.gender}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input name="address" placeholder="Address" onChange={onChange} />

                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                  </SelectContent>
                </Select>

                {/* STATIC CLASS SELECT */}
                <select
                  name="course"
                  value={form.course}
                  onChange={onChange}
                  className="input"
                >
                  <option value="">Select Class</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>

                <Input type="file" name="photo" onChange={onChange} />
              </>
            ) : (
              <>
                <Input name="name" placeholder="Full Name" onChange={onChange} required />
                <Input type="email" name="email" placeholder="Email" onChange={onChange} required />
                <Input type="password" name="password" placeholder="Password" onChange={onChange} required />
                <Input name="phone" placeholder="Phone" onChange={onChange} />
              </>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUsers;