"use client";

import React, { useState, useEffect } from "react";
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

  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roleName: "user",
    admissionNumber: "",
    rollNumber: "",
    firstName: "",
    lastName: "",
    gender: "",
    classId: "",
    academicYear: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await adminServices.getClasses();
        setClasses(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    };
    fetchClasses();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (form.roleName === "user") {

        // 🔴 Student validation
        if (!form.classId) {
          setError("Please select a class");
          setSubmitting(false);
          return;
        }

        if (
          !form.admissionNumber ||
          !form.rollNumber ||
          !form.firstName ||
          !form.lastName ||
          !form.academicYear
        ) {
          setError("All student fields are required");
          setSubmitting(false);
          return;
        }

        const payload = {
          admissionNumber: form.admissionNumber.trim(),
          rollNumber: Number(form.rollNumber),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          gender: form.gender || undefined,
          phone: form.phone || undefined,
          email: form.email.trim(),
          classId: form.classId,
          academicYear: form.academicYear.trim(),
        };

        const res = await adminServices.createStudent(payload);
        setSuccess(res?.data?.message || "Student created successfully");

      } else {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined,
          roleName: form.roleName,
        };

        const res = await adminServices.createUser(payload);
        setSuccess(res?.data?.message || "User created successfully");
      }

      setTimeout(() => {
        router.push("/admin/dashboard/users");
      }, 800);

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add User</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Full Name
              </label>
              <Input name="name" value={form.name} onChange={onChange} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email
              </label>
              <Input type="email" name="email" value={form.email} onChange={onChange} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Password
              </label>
              <Input type="password" name="password" value={form.password} onChange={onChange} required />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Phone
              </label>
              <Input name="phone" value={form.phone} onChange={onChange} />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Role
              </label>

              <Select
                value={form.roleName}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, roleName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User (Student)</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.roleName === "user" && (
              <>
                <Input
                  name="admissionNumber"
                  value={form.admissionNumber}
                  placeholder="Admission Number"
                  onChange={onChange}
                  required
                />

                <Input
                  name="rollNumber"
                  value={form.rollNumber}
                  type="number"
                  placeholder="Roll Number"
                  onChange={onChange}
                  required
                />

                <Input
                  name="firstName"
                  value={form.firstName}
                  placeholder="First Name"
                  onChange={onChange}
                  required
                />

                <Input
                  name="lastName"
                  value={form.lastName}
                  placeholder="Last Name"
                  onChange={onChange}
                  required
                />

                <Input
                  name="gender"
                  value={form.gender}
                  placeholder="male / female / other"
                  onChange={onChange}
                />

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Select Class
                  </label>

                  <Select
                    value={form.classId}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, classId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  name="academicYear"
                  value={form.academicYear}
                  placeholder="2024-25"
                  onChange={onChange}
                  required
                />
              </>
            )}

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create User"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUsers;