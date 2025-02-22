
  "use client";
import React, { useEffect, useState } from "react";

interface schools {
  id: number;
  name: string;
  institute: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  school: string;
  profilePicture: File | null;
}

const AddSupervisor: React.FC<{ onClose: () => void }> = ({ onClose }) => { 

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    school: "",
    profilePicture: null
  });
  const [schools, setschools] = useState<schools[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch schools
  useEffect(() => {
    const fetchschools = async () => {
      const userSession = JSON.parse(localStorage.getItem('institutionSession') || '{}');
      let id = "";
      if(userSession && userSession.id){
        id = userSession.id;
      }
      try {
        const response = await fetch(`/api/schools?institution_id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch schools");
        const data = await response.json();
        setschools(data);
      } catch (error) {
        setError("An error occurred while fetching schools.");
      }
    };
    fetchschools();
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

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string);
    });
    if (file) {
      payload.append("profilePicture", file);
    }

    try {
      const response = await fetch("/api/add/supervisor", {
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
          dob: "",
          school: "",
          profilePicture: null
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

    // File upload trigger handling
    useEffect(() => {
      const fileUploadTrigger = document.getElementById("file-upload-trigger");
      const fileUploadInput = document.getElementById("file-upload") as HTMLInputElement;
      const fileNameDisplay = document.getElementById("file-name");
  
      fileUploadTrigger?.addEventListener("click", () => {
        fileUploadInput?.click();
      });
  
      fileUploadInput?.addEventListener("change", (event) => {
        if (event.target instanceof HTMLInputElement && event.target.files?.[0]) {
          const file = event.target.files[0];
          setFile(file);
  
          if (fileNameDisplay) {
            fileNameDisplay.textContent = file.name;
          }
        }
      });
    }, []);

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
    if(success?.includes("success")){
      setTimeout(() => {
        onClose
      }, 1000)
    }
  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
      <div className="w-3/5 bg-white rounded-lg p-5">
        <h4 className="text-center text-3xl my-3 pb-5 font-semibold text-teal-500">Add Supervisor </h4>
        
        <form className="space-y-6 px-8" onSubmit={handleSubmit}>
        {(success || error) && (
          <div
          className={`${success?.includes('success') ? 'bg-green-100 text-green-500 border-green-300 ' : ' bg-red-100 text-red-500 border-red-300 '} font-semibold px-4 py-2 rounded-md`}
          >
            {success ? success : error ? error : ""}
          </div>
        )}
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
                htmlFor="dob"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["dob"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                Date of Birth<span className="text-red-500"> *</span>
              </label>
              <input
                id="dob"
                type="date"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                onFocus={() => handleFocus("dob")}
                onBlur={(e) => handleBlur("dob", e.target.value)}
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/** school */}
          <div className="relative">
              <label
                htmlFor="school"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["school"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                School<span className="text-red-500"> *</span>
              </label>
              <select
                id="school"
                className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
                onFocus={() => handleFocus("school")}
                onBlur={(e) => handleBlur("school", e.target.value)}
                value={formData.school}
                onChange={handleChange}
                required
              >
               <option value=""></option>
               {schools.map((school) =>(
                <option key={school.id} value={school.id}>{school.name +" - " +  school.institute}</option>
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
            <div className="mt-1 border border-gray-300 bg-gray-100 rounded-lg py-2 text-center flex flex-col justify-center">
              <label
                htmlFor="profilePicture"
                className="py-1 px-5 border text-gray-400 border-dashed rounded-md mx-auto w-min h-min text-center cursor-pointer border-teal-500"
              >
                <i className="bi bi-upload tex-xl"></i>
              </label>
              <label
                htmlFor="profilePicture"
                className="cursor-pointer text-teal-600 hover:text-teal-300"
              >
                Click here to upload profile picture
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Support for a single file. Supported formats: .png, .jpg, .svg, .gif
              </p>
              <span id="file-name" className="text-base font-semibold py-2"></span>
            </div>
          </div>
           
             {/* Submit Button */}
            <div className="text-center">
             <button
              type="submit"
              className="w-[150px] border border-teal-400 text-teal-500 py-2 rounded-md hover:bg-teal-100 transition-all duration-300"
             >
              Add
             </button>
            </div>
       

        </form>
      
      </div>
    </div>
  )
}
export default AddSupervisor;