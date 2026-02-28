"use client";

import { motion, AnimatePresence } from "framer-motion";
import Nav from "../sections/Nav";
import Footer from "../sections/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registrationService } from "@/services/user/registration.service";
import { useSelector } from "react-redux";


export default function AdmissionPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    parentPhone: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    category: "",
    address: "",
    course: "",
    photo: null,
    preview: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const router = useRouter();

const { user } = useSelector((state) => state.auth);

useEffect(() => {
  if (user?.email) {
    setFormData((prev) => ({
      ...prev,
      email: user.email,
    }));
  }
}, [user]);

const handleSubmit = async (e) => {
  console.log("Submitting form with data:", formData);
  e.preventDefault();
  setLoading(true);
  setError("");
  setSuccess("");

  try {

    const payload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "preview") {
        payload.append(key, formData[key]);
      }
    });

    const res = await registrationService.registerStudent(payload);

    setSuccess("Student registered successfully");

    setTimeout(() => {
      router.push("/admission/registered");
    }, 1000);

  } catch (err) {
    setError(err?.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};
  /*HANDLE CHANGE  */

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          photo: file,
          preview: URL.createObjectURL(file),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));

    }
  };

  /* ================== VALIDATION ================== */

  const isStep1Valid =
    formData.firstName &&
    formData.lastName &&
    formData.fatherName &&
    formData.motherName &&
    formData.phone &&
    formData.parentPhone &&
    formData.email &&
    formData.dob;

  const isStep2Valid =
    formData.address &&
    formData.category;

  const isStep3Valid =
    formData.course &&
    formData.photo;

  const nextStep = () => {
    if (
      (step === 1 && isStep1Valid) ||
      (step === 2 && isStep2Valid) ||
      (step === 3 && isStep3Valid)
    ) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="bg-[#FEFAE0] text-[#283618] min-h-screen">
      <Nav />

      {/* HERO */}
      <section className="pt-36 pb-16 bg-[#283618] text-center text-[#FEFAE0]">
        <h1 className="text-5xl font-bold text-[#DDA15E]">
          Admission Registration 2026
        </h1>
        <p className="mt-4 text-[#FEFAE0]/80">
          Registration Fee: ₹2000
        </p>
      </section>

      {/* PROGRESS BAR */}
      <div className="w-full h-2 bg-[#606C38]/20">
        <motion.div
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-[#BC6C25]"
        />
      </div>

      {/* FORM */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-[#BC6C25]">
                  Fill Personal Details
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                  <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                  <Input label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                  <Input label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
                  <Input label="Student Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <Input label="Parent Phone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} />
                  <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} readOnly />
                  <Input label="Alternate Email" name="altEmail" type="email" value={formData.altEmail} onChange={handleChange} />
                  <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                  <select name="gender" value={formData.gender} onChange={handleChange} className="input">
                    <option value="">Select Gender</option> 
                    <option value="male"> Male</option>
                    <option value="female"> Female</option>
                    <option value="other"> Other</option>
                  </select> 
                  
                </div>

                <div className="flex justify-end pt-12">
                  <motion.button
                    whileHover={isStep1Valid ? { scale: 1.05 } : {}}
                    whileTap={isStep1Valid ? { scale: 0.95 } : {}}
                    disabled={!isStep1Valid}
                    onClick={nextStep}
                    className={`px-10 py-3 font-semibold rounded-full shadow-md transition-all duration-300
                      ${
                        isStep1Valid
                          ? "bg-[#BC6C25] text-white hover:bg-[#DDA15E]"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Next →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-[#BC6C25]">
                  Address & Category
                </h2>

                <Textarea label="Residential Address" name="address" value={formData.address} onChange={handleChange} />

                <div>
                  <label className="block mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select Category</option>
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                  </select>
                </div>

                <div className="flex justify-between pt-12">
                  <AnimatedBack prevStep={prevStep} />
                  <AnimatedNext nextStep={nextStep} disabled={!isStep2Valid} />
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#BC6C25]">
                  Select Class & Photo
                </h2>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select Class</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>

                <div className="space-y-4">
                  <label className="block font-semibold text-[#283618]">
                    Upload Your Photo
                  </label>

                  <div className="flex items-center gap-6">
                    <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-[#283618] px-6 py-3 rounded-lg font-medium transition-all duration-300">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>

                    {formData.photo && (
                      <span className="text-sm text-[#606C38]">
                        {formData.photo.name}
                      </span>
                    )}
                  </div>

                  {formData.preview && (
                    <div className="mt-4">
                      <img
                        src={formData.preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border border-[#606C38]/30 shadow-md"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-12">
                  <AnimatedBack prevStep={prevStep} />
                  <AnimatedNext nextStep={nextStep} disabled={!isStep3Valid} />
                </div>
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 text-center"
              >
                <h2 className="text-2xl font-bold text-[#BC6C25]">
                  Registration Fee Payment
                </h2>
            
                <p className="text-lg">
                  Admission Registration Fee: <strong>₹2000</strong>
                </p>
            
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-14 py-4 bg-[#BC6C25] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#DDA15E] transition-all duration-300"
                >
                  Pay ₹2000 Securely →
                </motion.button>

                <AnimatedBack prevStep={prevStep} />
              </motion.div>
            )}
            </AnimatePresence>
                    </div>
                  </section>

                  <Footer />
                </main>
              );
            }

/* BUTTON COMPONENTS */

function AnimatedNext({ nextStep, disabled }) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={nextStep}
      disabled={disabled}
      className={`px-10 py-3 font-semibold rounded-full shadow-md transition-all duration-300
        ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#BC6C25] text-white hover:bg-[#DDA15E]"
        }`}
    >
      Next →
    </motion.button>
  );
}

function AnimatedBack({ prevStep }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={prevStep}
      className="px-8 py-3 border-2 border-[#606C38] text-[#283618] font-medium rounded-full hover:bg-[#606C38]/10 transition-all duration-300"
    >
      ← Back
    </motion.button>
  );
}

/* INPUT COMPONENTS */

function Input({ label, name, type="text", onChange, value, readOnly=false }) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className="input"
      />
    </div>
  );
}

function Textarea({ label, name, onChange, value }) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <textarea
        name={name}
        rows="1"
        value={value}
        onChange={onChange}
        className="input"
      />
    </div>
  );
}