"use client"
import React, { useEffect, useState } from "react";
import { 
  CreditCard, 
  Calendar, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Receipt,
  Search,
  LayoutDashboard,
  User,
  GraduationCap,
  MapPin,
  Globe,
  Phone
} from "lucide-react";
import { useSelector } from "react-redux";
import { adminServices } from "@/services/admin/admin.service";


const Page = () => {
  // Mock Data for Sahil's Fees
   const { user } = useSelector((state) => state.auth);

  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fee_payment");

  useEffect(() => {
    const fetchFees = async () => {
      try {
        if (!user?.admissionNumber) return;

        const res = await adminServices.getStudentFeeByAdmission(user.admissionNumber);

        console.log("FEE API 👉", res);

        const data = res?.data || res;

        setFeeData(data);
      } catch (err) {
        console.error("FEE ERROR ❌", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [user]);

 const totalFee = feeData?.totalFee || 0;
  const paidFee = feeData?.paidFee || 0;
  const remainingFee = feeData?.remainingFee || 0;
  const nextInstallment = feeData?.nextInstallment || 0;
  const nextDueDate = feeData?.nextDueDate || "-";
  const installments = feeData?.installments || [];

  const paidPercentage = totalFee
    ? (paidFee / totalFee) * 100
    : 0;
    // ✅ Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm font-bold text-slate-400">Loading fees...</p>
      </div>
    );
  }

 return (
  <div className="min-h-screen mt-10 bg-[#FDFDFD] font-sans text-slate-900">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">

      {/* Sidebar */}
      <aside className="w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 border-r border-slate-100 p-6 lg:p-10 bg-white">
        <div className="mb-8 mt-2">
          <h2 className="text-xl font-black tracking-tight text-[#0E94A5]">Vigyan Academy</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Student Portal</p>
        </div>

        <nav className="space-y-1.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "profile", label: "My Profile", icon: User },
            { id: "fee_payment", label: "Fee Payment", icon: CreditCard },
            { id: "results", label: "Test Reports", icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-[#0E94A5]/10 text-[#0E94A5]"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span className="text-xs font-bold">{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronRight size={12} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#F9FBFC] p-6 lg:p-12">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finance Management</h1>
            <p className="text-sm text-slate-400 font-medium">
              {user?.name} • Admission: {user?.admissionNumber}
            </p>
          </div>
        </header>

        <div className="space-y-10 max-w-5xl">

          {/* Summary */}
          <section>
            <div className="grid md:grid-cols-3 gap-8 pb-10 border-b">
              
              <div>
                <p className="text-xs font-bold text-[#0E94A5]">Outstanding</p>
                <h2 className="text-4xl font-black">₹{remainingFee}</h2>
                <div className="mt-3 text-xs text-slate-400">
                  {Math.round(paidPercentage)}% Paid
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border">
                <p className="text-xs text-slate-400">Next Installment</p>
                <h3 className="font-bold">₹{nextInstallment}</h3>
                <p className="text-xs text-orange-500">Due: {nextDueDate}</p>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-xl">
                <p className="text-xs text-teal-400">Secure Payment</p>
                <p className="text-sm font-bold">SSL Protected</p>
              </div>

            </div>
          </section>

          {/* Installments */}
          <section>
            <h3 className="font-bold mb-4">Installments</h3>

            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {installments.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3">{item.month}</td>
                      <td className="p-3">₹{item.amount}</td>
                      <td className="p-3">{item.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  </div>
);
};

export default Page;