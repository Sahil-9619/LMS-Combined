"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCall } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/store/features/authSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function RegisterForm({ className, ...props }) {
  const dispatch = useDispatch();
  const router = useRouter();
  //for otp
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);

  const { registerStatus, error } = useSelector((state) => state.auth);

  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  //   role: "student", // default role
  // });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    };

    setTempUserData(credentials);

    toast.success("OTP sent to your email");

    // Show OTP section
    setShowOtp(true);
    /**
    console.log(credentials, "sfsd");
    const result = await dispatch(registerUser(credentials));
    if (registerUser.fulfilled.match(result)) {
      toast.success(result.payload.message || "Registered successfully!");

      router.push("/user/login"); // Redirect on success
    }*/
  };

  const handleVerifyOtp = async () => {
  if (otp.length !== 5) {
    toast.error("Enter valid 5-digit OTP");
    return;
  }

  // Call backend to verify OTP
  // await dispatch(verifyOtp({ email: tempUserData.email, otp }))

  // If OTP correct → now register user
  const result = await dispatch(registerUser(tempUserData));

  if (registerUser.fulfilled.match(result)) {
    toast.success("Registered successfully!");
    router.push("/user/login");
  }
};

  return (
    <>{!showOtp ? (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to Register to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/user/login" className="underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </form>
    ) : (
      <div className="flex flex-col gap-6 items-center">
  <h2 className="text-xl font-semibold">Verify OTP</h2>
  <p className="text-sm text-muted-foreground">
    Enter the OTP sent to your email
  </p>

  <InputOTP
    maxLength={5}
    value={otp}
    onChange={(value) => setOtp(value)}
  >
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
    </InputOTPGroup>
  </InputOTP>

  <Button className="w-full mt-4" onClick={handleVerifyOtp}>
    Verify OTP
  </Button>
</div>
    )}
    </>
  );
}
