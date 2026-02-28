"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { adminServices } from "@/services/admin/admin.service";

export default function ViewUserPage() {
  const router = useRouter();
  const { id } = useParams();

 
const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await adminServices.getUserWithStudentCheck(id);
console.log("API RESPONSE FULL:", JSON.stringify(res, null, 2));      
setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchUser();
}, [id]);

if (!user) {
  return <div className="p-10 text-center">Loading...</div>;
}

  return (
    <div className="min-h-screen bg-white p-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-2xl rounded-3xl border border-gray-200">
          <CardHeader className="border-b bg-gray-50 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                {user.role?.name}
              </CardTitle>
              <Badge className="capitalize bg-black text-white">
                {user.role?.name}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">

            {/* ADMIN / INSTRUCTOR */}
            {(user.role?.name === "admin" ||
              user.role?.name === "instructor") && (
              <div className="grid grid-cols-2 gap-6">

                <Info label="Full Name" value={user.name} />
                <Info label="Email" value={user.email} />
                <Info label="Phone" value={user.phone} />

              </div>
            )}

            {/* STUDENT */}
            {user.role?.name === "user" && (
              <div className="space-y-8">

                {/* Personal */}
                <div className="grid grid-cols-2 gap-6">
                  <Info
                        label="First Name"
                        value={user.firstName || user.name?.split(" ")[0]}
                      />

                      <Info
                        label="Last Name"
                        value={
                          user.lastName ||
                          user.name?.split(" ").slice(1).join(" ")
                        }
                      />
                  <Info label="Father Name" value={user.fatherName} />
                  <Info label="Mother Name" value={user.motherName} />
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-6">
                  <Info label="Email" value={user.email} />
                  <Info label="Student Phone" value={user.studentPhone} />
                  <Info label="Parent Phone" value={user.parentPhone} />
                </div>

                {/* Academic */}
                <div className="grid grid-cols-2 gap-6">
                  <Info label="Date of Birth" value={user.dateOfBirth} />
                  <Info label="Gender" value={user.gender} />
                  <Info label="Category" value={user.category} />
                  <Info label="Class" value={`Class ${user.course}`} />
                </div>

                <Info label="Address" value={user.address} />

                {/* Photo */}
                {user.photo && (
                  <div>
                    <p className="text-sm font-medium mb-2">Photo</p>
                    <img
                      src={user.photo}
                      alt="student"
                      className="w-32 h-32 rounded-xl object-cover border shadow"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="pt-6">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Go Back
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

/* Small Info Component */
function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-lg">{value || "-"}</p>
    </div>
  );
}