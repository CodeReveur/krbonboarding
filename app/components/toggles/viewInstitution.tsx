"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface FormData {
  name: string;
  address: string;
  contact: string;
  instution: string | number;
}
interface ViewInstitutionProps{
  InstitutionId: number;
  onClose: () => void;
}
const ViewInstitution: React.FC<ViewInstitutionProps> = ({InstitutionId, onClose }) => { 

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    contact: "",
    instution: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize userId from localStorage
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("userSession") || "null");
    if (session?.id) {
      setFormData((prev) => ({ ...prev, userId: session.id }));
    }
  }, []);

   const handleActive = (id: number) => {
    setActiveId(id);
   }
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

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string);
    });
   

    try {
      const response = await fetch("/api/add/school", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        setSuccess("Submission successful!");
        setFormData({
          name: "",
          address: "",
          contact: "",
          instution: formData.instution,
        });
        setFile(null);
      } else {
        const error = await response.text();
        setError(`Submission failed. ${error}`);
      }
    } catch (error) {
      setError(`Submission failed. ${(error as Error).message}`);
    }
  };
  const buttons = [
    {"name": "details"},
    {"name": "supervisors"},
    {"name": "institution"},
    {"name": "billing"},
  ]
  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
      <div className="w-4/5 bg-slate-100 rounded-lg p-4">
        <h4 className="flex justify-between items-center p-3">
          <div>
           <h1 className="text-sm text-slate-400">Institution HEADER</h1>
           <span className="text-2xl text-slate-700 font-medium">An Organ Can Not survive ... </span> 
          </div>
          <div className="space-x-3">
            <button className="border border-red-800 py-[6px] px-10 rounded-md text-sm bg-red-200 text-red-500 text-center">Delete</button>
            <button className="border border-blue-800 py-[6px] px-6 rounded-md text-sm bg-blue-500 text-white text-center">Edit</button>
            <button className="border border-green-300 py-[6px] px-6 rounded-md text-sm text-green-500 text-center">Active</button>
          </div>
        </h4>
        <div className="flex space-x-4 px-3">
          {buttons.map((button, index) => (
            <button key={index} onClick={() => handleActive(index)} className={`py-[6px] px-4 border-b capitalize hover:border-teal-500 ${activeId === index ? 'border-teal-500': ''}`}>{button.name}</button>
          ))}

        </div>
        {success || error && (
          <div
          className={`${success ? 'bg-green-100 text-green-500 border-green-300' : 'bg-red-100 text-red-500 border-red-300'} p-4 rounded-md`}
          >
            {success ? success : error ? error : ""}
          </div>
        )}
        <form className="space-y-2" onSubmit={handleSubmit}>
        
        <div className="flex justify-between p-2 space-x-3">
          <div className="w-5/6 bg-white rounded-lg p-5">
           <div className="w-full flex items-center justify-center bg-slate-100 p-2">
            <i className="bi bi-search text-5xl text-slate-400"></i>
           </div>
           <div className="space-y-6 px-1">

            <div className="relative">
              <h4 className="font-medium pt-2">Title</h4>
              <div className={`relative text-gray-700 transition-all duration-300`}>
              A group of elite deputies in the LA County sheriff's department has to stop 
              </div>
            </div>

            <div className="relative">
              <h4 className="font-medium">Abstract </h4>
              <div className={`relative text-gray-700 transition-all duration-300`}>
              A group of elite deputies in the LA County sheriff's department has to stop a notorious crew of expert thieves from executing a robbery plan at the Federal Reserve Bank
              </div>
            </div>

            <div className="relative">
              <h4 className="font-medium pt-2">Document</h4>
              <div className={`relative text-gray-700 transition-all duration-300`}>
              <Link href={""} className="text-teal-600 underline"> A group of elite deputies in the LA County sheriff's department has to stop.pdf </Link> 
              </div>
            </div>
            
           </div>
          </div>
          <div className="w-2/6 bg-white rounded-lg p-5 space-y-2">
           <h1 className="text-lg text-slate-600 font-semibold">Institution Details</h1>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Status</h4>
            <div className="text-sm tex-slate-600">Completed</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Institutioner</h4>
            <div className="text-sm tex-slate-600">Dr Joseph Kambanda</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">University</h4>
            <div className="text-sm tex-slate-600">University Of Rwanda</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Category</h4>
            <div className="text-sm tex-slate-600">Agriculture and food technology</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Year</h4>
            <div className="text-sm tex-slate-600">2008</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">School </h4>
            <div className="text-sm tex-slate-600">School of Science</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Document Type</h4>
            <div className="text-sm tex-slate-600">PDF</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Uploaded at</h4>
            <div className="text-sm tex-slate-600">Jan, 25 2024 13:08 PM</div>
           </div>

          </div>
        </div>
        </form>
      
      </div>
    </div>
  )
}
export default ViewInstitution;