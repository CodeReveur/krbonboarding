"use client";
import React, { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Preloader from "../app/buttonPreloader";
import AlertNotification from "../app/notify";

const researchTopics = [
  "Pest surveillance and management",
  "Sustainable farming practices",
  "Crop diversification",
  "Food systems",
  "Biofortification",
  "HIV/AIDS and other sexually transmitted infections",
  "Reproductive health and family planning",
  "Infectious diseases (e.g., malaria, Ebola, Marburg virus)",
  "Occupational safety and health in agriculture",
  "Advanced surgical techniques",
  "Higher education development",
  "Access to education in rural areas",
  "Educational technology integration",
  "Curriculum development",
  "Electronic case management systems",
  "Digital transformation in public services",
  "Artificial intelligence applications",
  "Post-genocide reconciliation and justice",
  "Social equity in healthcare",
  "Gender studies",
  "Community development",
  "Climate change adaptation",
  "Biodiversity conservation",
  "Sustainable urban planning",
  "Water resource management",
  "Trade and market dynamics",
  "Infrastructure development",
  "Social protection programs",
  "Energy sector growth",
  "Policy strengthening in labor sectors",
  "Public administration reforms",
  "Legal system effectiveness"
];

interface Departments {
  id: number;
  name: string;
  institute: string;
  school: string;
}

interface FormData {
  title: string;
  researcher: string;
  category: string;
  status: string;
  department: string | number;
  year: string;
  abstract: string;
}


const AddResearch: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    title: "",
    researcher: "",
    category: "",
    status: "",
    department: "",
    year: "",
    abstract: "",
  });
    const [departments, setDepartments] = useState<Departments[]>([]);
  const [institution, setInstitution] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    let quillInstance: any = null;

    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default; // ✅ Access the default export

      quillInstance = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
      });

      quillInstance.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          abstract: quillInstance.root.innerHTML,
        }));
      });
    });

    return () => {
      if (quillInstance) {
        quillInstance.off("text-change");
      }
    };
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
    setSubmitting(true);
    setLoading(true)
    e.preventDefault();

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string);
    });
    if (file) {
      payload.append("document", file);
    }

    
    if(institution){
      payload.append("institution", institution);

    try {
      
      const response = await fetch("/api/add/research", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        setSuccess("Research added successfully");
        setFormData({
          title: "",
          researcher: "",
          category: "",
          status: "",
          department: "",
          year: "",
          abstract: "",
        });
        setSearchTerm("");
        setFile(null);
        setSubmitting(false);
        setLoading(false)
        setTimeout(() => {onClose();}, 2000) 
      } else {
        const error = await response.json();
        setError(`${error.error}`);
        setSubmitting(false)
        setLoading(false)
      }
    } catch (error) {
      setError(`${(error as Error).message}`);
      setSubmitting(false)
      setLoading(false)
    }
  }
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
    
  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40 overflow-hidden overflow-y-visible">
      {error && <AlertNotification message={error} type="error" />}
      {success && <AlertNotification message={success} type="success" />}
     
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
     

      
      <div className="w-3/5 bg-white rounded-lg px-5 py-3 navbar max-h-[96vh] overflow-hidden overflow-y-visible">
        <h4 className="text-center text-2xl mb-5 font-semibold text-teal-600">Upload Research Material </h4>
        <form className="space-y-4 px-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "title", label: "Title", type: "text" },
              { id: "researcher", label: "Researcher", type: "text" },
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
          <div className="grid grid-cols-2 gap-4">
          <div className="relative">
              <label
                htmlFor="category"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["category"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                Research category<span className="text-red-500"> *</span>
              </label>
              <select
                id="category"
                className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
                onFocus={() => handleFocus("category")}
                onBlur={(e) => handleBlur("category", e.target.value)}
                value={formData.category}
                onChange={handleChange}
                required
              >
                 <option value=""></option>
                {researchTopics.map((topic, i) => (
                   <option key={i} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label
                htmlFor="status"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["status"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                Status<span className="text-red-500"> *</span>
              </label>
              <select
                id="status"
                className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
                onFocus={() => handleFocus("status")}
                onBlur={(e) => handleBlur("status", e.target.value)}
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value=""></option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
         
          <div className="grid grid-cols-2 gap-4">

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

            <div className="relative">
              <label
                htmlFor="year"
                className={`absolute left-3 text-gray-500 transition-all duration-300 ${
                  focus["year"]
                    ? "top-[-10px] text-sm bg-white px-1"
                    : "top-2 text-base"
                }`}
              >
                Year<span className="text-red-500"> *</span>
              </label>
              <input
                id="year"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                onFocus={() => handleFocus("year")}
                onBlur={(e) => handleBlur("year", e.target.value)}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>


            

            
          </div>
          
          <div
        id="editor-container"
        className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
      >
        <div id="toolbar" className="rounded-t-lg border-b-0">
          <select className="ql-header">
            <option value="1"></option>
            <option value="2"></option>
            <option selected></option>
          </select>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-link"></button>

          
        </div>
        <div className="relative">
          <label
            htmlFor="abstract"
            className={`absolute left-3 text-gray-500 transition-all duration-300 ${
              focus["abstract"]
                ? "top-[-50px] text-sm bg-white px-1"
                : "top-3 text-base"
            }`}
          >
            Abstract<span className="text-red-500"> *</span>
          </label>
          <div
            id="editor"
            aria-placeholder="Write the Abstract here..."
            className="w-full border border-t-0 rounded-b-md border-gray-300 px-3 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
            onFocus={() =>{
              handleFocus("abstract");
            }}
            
          ></div>
         </div>
        </div>
            {/* Row 3: Profile Picture Upload */}
            <div className="relative mb-6">
            <input
              type="file"
              id="profilePicture"
              className="hidden"
              accept=".pdf, .docx, .txt, .pptx, .xlsx"
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
                Click file upload button to upload research document
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Support for a single file. Supported formats: .pdf, .docx, .txt, .pptx, .xlsx
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
              Upload
              
            </button>
          </div>
        </form>
      
      </div>
    </div>
  );
}
export default AddResearch;