"use client";
import React, { useEffect, useState } from "react";
import Preloader from "../app/buttonPreloader";

interface FormData {
  name: string;
  address: string;
  contact: string;
  logo: File | null,
  college: string;
}
interface College{
  id: string;
  name: string;
  institute: string;
}

const AddSchool: React.FC<{ onClose: () => void }> = ({ onClose }) => { 

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    contact: "",
    logo: null,
    college: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(false);
    // get all collegess
    useEffect(() => {
      const fetchColleges = async () => {
        setLoading(true);
        const userSession = JSON.parse(localStorage.getItem('institutionSession') || '{}');
        let id = "";
        if(userSession && userSession.id){
          id = userSession.id;
        }
        try {
          const response = await fetch(`/api/colleges?sort=name&institution_id=${id}`);
          if (!response.ok) throw new Error("Failed to fetch institutions");
          const data = await response.json();
          setColleges(data);
          setLoading(false);
        } catch (error) {
          setError("An error occurred while fetching institutions.");
          setLoading(false);
        }
      };
      fetchColleges();
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

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileNameDisplay = document.getElementById("file-name");
        const file = e.target.files?.[0];
        if (file) {
          setFormData((prev) => ({ ...prev, logo: file }));
          setFile(file);
          if (fileNameDisplay) {
            fileNameDisplay.textContent = file.name;
          }
        }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        setSuccess("Added successful!");
        setFormData({
          name: "",
          address: "",
          contact: "",
          logo: null,
          college: "",
        });
        setFile(null);
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
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
      <div className="w-3/5 bg-white rounded-lg p-5">
        <h4 className="text-center text-3xl my-3 pb-5 font-semibold text-teal-500">Add School </h4>
        
        <form className="space-y-6 px-8" onSubmit={handleSubmit}>
        {(success || error) && (
          <div
          className={`${success?.includes('success') ? 'bg-green-100 text-green-500 border-green-300 ' : ' bg-red-100 text-red-500 border-red-300 '} font-semibold p-4 rounded-md`}
          >
            {success ? success : error ? error : ""}
          </div>
        )}
          {/* Row 1: Name and contact */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "name", label: "School Name", type: "text" },
              { id: "contact", label: "Contact Info", type: "text" },
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

           {/* Row 2: Address */}
           <div className="relative">
            <label
              htmlFor="address"
              className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                focus["address"]
                  ? "top-[-10px] text-sm bg-white px-1"
                  : "top-2 text-base"
              }`}
            >
              Address <span className="text-red-500"> *</span>
            </label>
            <input
              id="address"
              type="address"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
              onFocus={() => handleFocus("address")}
              onBlur={(e) => handleBlur("address", e.target.value)}
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
              <label
                htmlFor="college"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["college"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                College <span className="text-red-500"> *</span>
              </label>
              <select
                id="college"
                className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
                onFocus={() => handleFocus("college")}
                onBlur={(e) => handleBlur("college", e.target.value)}
                value={formData.college}
                name="college"
                onChange={handleChange}
                required
              >
                <option value=""></option>
                {colleges.map((college,i) => (
                  <option key={i} value={college.id}>{college.name + " [ "+ college.institute + " ]"} </option>
                ))}
              </select>
            </div>

          {/* Row 3: Profile Picture Upload */}
          <div className="relative mb-6">
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              accept=".png, .jpg, .svg, .gif"
              onFocus={() => handleFocus("profilePicture")}
              onBlur={(e) => handleBlur("profilePicture", e.target.value)}
              onChange={handleFileChange}
              required
            />
            <div className="mt-1 border border-gray-300 bg-gray-100 rounded-lg p-3 text-center flex flex-col justify-center">
              <label
                htmlFor="profilePicture"
                className="py-2 px-12 border-2 text-teal-600 border-dashed rounded-md mx-auto w-min h-min text-center cursor-pointer border-teal-500"
              >
                <i className="bi bi-upload tex-xl"></i>
              </label>
              <label
                htmlFor="profilePicture"
                className="cursor-pointer text-lg text-teal-600 hover:text-teal-300"
              >
                Click file upload button to upload school logo
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Support for a single file. Supported formats: .png, .jpg, .svg, .gif
              </p>
              <span id="file-name" className="text-base font-semibold py-2"></span>
            </div>
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
export default AddSchool;