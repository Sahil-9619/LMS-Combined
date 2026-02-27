"use client";

import { motion, AnimatePresence } from "framer-motion";
import Nav from "../sections/Nav";
import Footer from "../sections/Footer";
import { useState } from "react";

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

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
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

      {/* STEP NAVIGATION */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="flex justify-between relative">
          {["Personal", "Address", "Class", "Payment"].map((label, index) => {
            const stepNumber = index + 1;
            const isActive = step === stepNumber;
            const isCompleted = step > stepNumber;

            return (
              <div key={index} className="flex-1 text-center relative">
                <button
                  type="button"
                  onClick={() => setStep(stepNumber)}
                  className={`pb-4 text-sm font-semibold transition-all duration-300
                    ${
                      isActive
                        ? "text-[#BC6C25]"
                        : isCompleted
                        ? "text-[#606C38]"
                        : "text-[#283618]/50"
                    }
                  `}
                >
                  {label}
                </button>

                <div
                  className={`absolute bottom-0 left-0 w-full h-[3px] transition-all duration-500
                    ${
                      isActive
                        ? "bg-[#BC6C25]"
                        : isCompleted
                        ? "bg-[#606C38]"
                        : "bg-[#606C38]/20"
                    }
                  `}
                />
              </div>
            );
          })}
        </div>
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
                  Personal Details
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <Input required label="First Name" name="firstName" onChange={handleChange} />
                  <Input required label="Last Name" name="lastName" onChange={handleChange} />
                  <Input required label="Father's Name" name="fatherName" onChange={handleChange} />
                  <Input required label="Mother's Name" name="motherName" onChange={handleChange} />
                  <Input required label="Student Phone" name="phone" onChange={handleChange} />
                  <Input required label="Parent Phone" name="parentPhone" onChange={handleChange} />
                  <Input required label="Email" name="email" type="email" onChange={handleChange} />
                  <Input required label="Date of Birth" name="dob" type="date" onChange={handleChange} />
                </div>

                <div className="flex justify-end pt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextStep}
                    className="px-10 py-3 bg-[#BC6C25] text-white font-semibold rounded-full shadow-md hover:bg-[#DDA15E] transition-all duration-300"
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

                <Textarea label="Residential Address" name="address" onChange={handleChange} />

                <div>
                  <label className="block mb-2">Category</label>
                  <select name="category" onChange={handleChange} className="input">
                    <option value="">Select Category</option>
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                  </select>
                </div>

                <div className="flex justify-between pt-12">
                  <AnimatedBack prevStep={prevStep} />
                  <AnimatedNext nextStep={nextStep} />
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

                <select name="course" onChange={handleChange} className="input">
                  <option value="">Select Class</option>
                  <option>Class 6</option>
                  <option>Class 7</option>
                  <option>Class 8</option>
                  <option>Class 9</option>
                </select>

                <div className="space-y-4">

                <label className="block font-semibold text-[#283618]">
                  Upload Your Photo
                </label>

  {/* Styled Upload Area */}
              <div className="flex items-center gap-6">

                {/* Custom Button */}
                <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-[#283618] px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleChange(e);
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          photo: file,
                          preview: URL.createObjectURL(file),
                        }));
                      }
                    }}
                    className="hidden"
                  />
                </label>
                
                {/* File Name */}
                {formData.photo && (
                  <span className="text-sm text-[#606C38]">
                    {formData.photo.name}
                  </span>
                )}

              </div>
            
              {/* Image Preview */}
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
            <AnimatedNext nextStep={nextStep} />
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

function AnimatedNext({ nextStep }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={nextStep}
      className="px-10 py-3 bg-[#BC6C25] text-white font-semibold rounded-full shadow-md hover:bg-[#DDA15E] transition-all duration-300"
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

function Input({ label, name, type="text", onChange }) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required
        onChange={onChange}
        className="input"
      />
    </div>
  );
}

function Textarea({ label, name, onChange }) {
  return (
    <div>
      <label className="block mb-2">{label}</label>
      <textarea
        name={name}
        rows="1"
        required
        onChange={onChange}
        className="input"
      />
    </div>
  );
}