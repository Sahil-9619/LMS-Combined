"use client";
import UserNavbar from "@/components/UsersNavbar";
import Image from "next/image";
import { useSelector } from "react-redux";
import Courses from "../courses/page";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "@/services/user/registration.service";
import { admissionService } from "@/services/admission.service";

export default function Home() {
  const {
    status,

    user,
  } = useSelector((state) => state.auth);

  const router = useRouter();
  const [hasAdmission, setHasAdmission] = useState(null);

useEffect(() => {
  const checkUserAdmission = async () => {
    try {
      const res = await admissionService.checkAdmission();
      setHasAdmission(res?.hasAdmission === true);
    } catch (error) {
      setHasAdmission(false);
    }
  };

  checkUserAdmission();
}, []);



 if (status === "loading" || hasAdmission === null) {
  return <div>Loading...</div>;
}

  if (!hasAdmission) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl font-bold mb-4">
          You have not taken admission yet.
        </h2>
    
        <button
          onClick={() => router.push("/admission")}
          className="bg-[#BC6C25] text-white px-6 py-3 rounded-full"
        >
          Get Admission
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <Courses />

      {/* <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey with our available courses
          </p>
        </div>{" "}
      </div> */}
    </div>
  );
}
