
"use client";
import React, { useEffect, useState } from "react";
import Preloader from "../app/buttonPreloader";
import AlertNotification from "../app/notify";

interface Departments {
  id: number;
  name: string;
  school: string;
  institute: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string | number;
  uniqueid: string;
}

const AddStudent: React.FC<{ onClose: () => void }> = ({ onClose }) => { 

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    uniqueid: "",
  });
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
 
   
   // Fetch departments
   useEffect(() => {
     const fetchDepartments = async () => {
       setLoading(true);
       const userSession = JSON.parse(localStorage.getItem('institutionSession') || '{}');
       let id = "";
       if(userSession && userSession.id){
         id = userSession.id;
       }
       try {
         const response = await fetch(`/api/departments?institution_id=${id}`);
         if (!response.ok) throw new Error("Failed to fetch.");
         const data = await response.json();
         setDepartments(data);
         setLoading(false);
       } catch (error) {
         setLoading(false);
         setError("An error occurred!.");
       }
     };
     fetchDepartments();
   }, []);
 
        // Function to clear messages after a few seconds
        useEffect(() => {
          if (error || success) {
            const timer = setTimeout(() => {
              setError(null);
              setSuccess(null);
            }, 10000); // Hide after 4 seconds
            return () => clearTimeout(timer);
          }
        }, [error, success]);

        
  // Initialize userId from localStorage
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("userSession") || "null");
    if (session?.id) {
      setFormData((prev) => ({ ...prev, userId: session.id }));
    }
  }, []);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      const userSession = JSON.parse(localStorage.getItem('institutionSession') || '{}');
      let id = "";
      if(userSession && userSession.id){
        id = userSession.id;
      }
      try {
        const response = await fetch(`/api/departments?institution_id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch departments");
        const data = await response.json();
        setDepartments(data);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching departments.");
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);


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

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string);
    });
    if (file) {
      payload.append("document", file);
    }

    try {
      const response = await fetch("/api/add/student", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        setSuccess("Submission successful!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          department: "",
          uniqueid: "",
        });
        setSearchTerm("");
        setLoading(false);
      } else {
        const error = await response.text();
        setError(`Submission failed. ${error}`);
        setLoading(false);
      }
    } catch (error) {
      setError(`Submission failed. ${(error as Error).message}`);
      setLoading(false);
    }
  };


  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      {error && <AlertNotification message={error} type="error" />}
      {success && <AlertNotification message={success} type="success" />}
    
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
      <div className="w-3/5 bg-white rounded-lg p-5">
        <h4 className="text-center text-3xl my-3 pb-5 font-semibold text-teal-500">Add Student </h4>
        
        <form className="space-y-6 px-8" onSubmit={handleSubmit}>
       
          {/* Row 1: First and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "first_name", label: "First Name", type: "text" },
              { id: "last_name", label: "Other Names", type: "text" },
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
          </div>

           {/* Row 2: Email */}
           <div className="relative">
            <label
              htmlFor="email"
              className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                focus["email"]
                  ? "top-[-10px] text-sm bg-white px-1"
                  : "top-2 text-base"
              }`}
            >
              Email<span className="text-red-500"> *</span>
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
              onFocus={() => handleFocus("email")}
              onBlur={(e) => handleBlur("email", e.target.value)}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

           {/* Row 3: dob and Phone */}
           <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label
                htmlFor="phone"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["phone"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                Phone Number<span className="text-red-500"> *</span>
              </label>
              <input
                id="phone"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                onFocus={() => handleFocus("phone")}
                onBlur={(e) => handleBlur("phone", e.target.value)}
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <label
                htmlFor="uniqueid"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["uniqueid"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                Student unique ID<span className="text-red-500"> *</span>
              </label>
              <input
                id="uniqueid"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                onFocus={() => handleFocus("uniqueid")}
                onBlur={(e) => handleBlur("uniqueid", e.target.value)}
                value={formData.uniqueid}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Department */}
<div className="relative">
  <label
    htmlFor="department"
    className={`absolute left-3 text-gray-500 transition-all duration-300 ${
      focus["department"] ? "top-[-10px] text-sm bg-white px-1" : "top-2 text-base"
    }`}
  >
    Department <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    id="department"
    className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparent focus:border-teal-500 focus:outline-none"
    onFocus={() => handleFocus("department")}
    onBlur={(e) => handleBlur("department", e.target.value)}
    value={""+searchTerm} // Display department name
    onChange={(e) => setSearchTerm(e.target.value)}
    required
  />
  {searchTerm && (
    <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10">
      <ul>
        {departments
          .filter((department) =>
            `${department.name} ${department.school} ${department.institute}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .map((department) => (
            <li
              key={department.id}
              className={`${searchTerm === department.name ? 'hidden' : ''} px-3 py-2 hover:bg-gray-200 cursor-pointer`}
              onClick={() => {
                setSearchTerm(department.name); // Show department name in input
                setFormData({ ...formData, department: department.id }); // Store department ID in formData
              }}
            >
              {department.name} - {department.school} - {department.institute}
            </li>
          ))}
      </ul>
    </div>
  )}
</div>
         
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
              Add
             </button>
            </div>
       

        </form>
      
      </div>
    </div>
  )
}
export default AddStudent;