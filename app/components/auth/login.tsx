
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import VerifyForm from "./forgot-password";
import Preloader from "../app/buttonPreloader";


interface FormData {
  login: string;
  password: string;
}

const LoginForm = () => { 

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    login: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFocus = (field: string) =>
    setFocus((prev) => ({ ...prev, [field]: true }));

  const handleBlur = (field: string, value: string) =>
    setFocus((prev) => ({ ...prev, [field]: value.trim().length > 0 }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
  
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure JSON format
          Accept: "application/json",
        },
        body: JSON.stringify(formData), // Convert form data to JSON
      });
    
      if (!response.ok) {
        setLoading(false);
        const errorText = await response.json();
        throw new Error(`${errorText.message}`);
        
      }
    
      const data = await response.json();
    
      setSuccess("Login successful");
      setFormData({ login: "", password: "" });
      // Update localStorage with the new session
      localStorage.setItem('institutionSession', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        session_id: data.user.session_id,
        profile: data.user.profile,
        status: data.user.status,
    }));
     setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
    
  };

  if(success?.includes('success')){
    setTimeout(() => {
     router.push('/');
    }, 2000)
   }

  if(error?.includes("not verified")){
     return <VerifyForm />
   }

  return (
    <div className="min-h-screen py-5 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg py-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full shadow-lg shadow-teal-100 bg-indigo-100">
            <img src="/logo.svg" alt="Logo" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        {/* Welcome Message */}
        <h2 className="text-center text-xl font-medium text-teal-600 mb-8 px-2">
          Welcome back, Login here
        </h2>

        {/* Form */}
        <form className="space-y-6 px-8" onSubmit={handleSubmit}>
        {(success || error) && (
          <div
          className={`${success?.includes('success') ? 'bg-green-100 text-green-500 border-green-300 ' : ' bg-red-100 text-red-500 border-red-300 '} font-medium px-4 py-2 rounded-md `}
          >
            {success ? success : error ? error : ""}
          </div>
        )}
   
            {[
              { id: "login", label: "Username", type: "text" },
              { id: "password", label: "Password", type: "password" },
            ].map((field) => (
              <div key={field.id} className="relative">
                <label
                  htmlFor={field.id}
                  className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                    focus[field.id]
                      ? "top-[-10px] text-sm bg-white px-1"
                      : "top-2 text-base"
                  }`}
                >
                  {field.label}
                  <span className="text-red-500"> *</span>
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                  onFocus={() => handleFocus(field.id)}
                  onBlur={(e) => handleBlur(field.id, e.target.value)}
                  value={(formData as any)[field.id]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          
             {/* Submit Button */}
             <div className="text-center flex justify-center">
             <button
              type="submit"
              disabled={loading}
              className="w-[150px] flex items-center justify-center space-x-2 border border-teal-400 text-teal-500 py-2 rounded-md hover:bg-teal-100 transition-all duration-300"
             >
              {loading && (
                <Preloader />
              )}
              Login
             </button>
            </div>
            <div className="relative flex flex-col justify-center space-y-1 text-center">
              <Link href={"/auth/forgot-password"} className="text-sm text-teal-600">Forgot password?</Link>
            </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 border-t border-teal-300 mt-6 py-2">

          © 2023 - 2025 Kamero Research Base
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
