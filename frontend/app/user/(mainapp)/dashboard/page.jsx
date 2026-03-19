"use client";
import UserNavbar from "@/components/UsersNavbar";
import Image from "next/image";
import { useSelector } from "react-redux";
import Courses from "../courses/page";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "@/services/user/registration.service";
import { admissionService } from "@/services/admission.service";
import Navbar from "@/app/sections/Nav";

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
      <div className="text-center mt-100 p-10">
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
    <div>
    <Navbar/>
    <div className="h-full mt-10 bg-red-400">
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">
          {getGreeting()}, {username}
        </h1>
        </header>
      </main>
      </div>
      </div>
  );
}
