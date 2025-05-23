"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface FormData {
  title: string;
  researcher: string;
  category: string;
  institute: string;
  status: string;
  progress_status: string;
  school: string;
  year: string;
  abstract: string;
  document: string;
  document_type: string;
  hashed_id: string;
  created_at: string;
}
  const buttons = [
    {"name": "details"},
    {"name": "supervisors"},
    {"name": "institution"},
    {"name": "billing"},
  ];

interface ViewResearchProps{
  ResearchId: string;
  onClose: () => void;
}

function formatDate(dateString: any) {
  // Convert the string to a Date object
  const date = new Date(dateString);

  // Array of month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract parts of the date
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Construct the formatted date
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text; // Return the original text if it's within the limit
}

const ViewResearch: React.FC<ViewResearchProps> = ({ResearchId, onClose }) => { 

  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [research, setResearch] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  
   const handleActive = (id: number) => {
    setActiveId(id);
   }
  // Fetch Researches
  useEffect(() => {
    const fetchResearch = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/research/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: ResearchId }), // Use resolved ID
        });
        if (!response.ok) throw new Error("Failed to fetch researches");
        const data = await response.json();
        setResearch(data);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching researches.");
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);
 
  useEffect(() => {
    if (typeof window !== "undefined") { // ✅ Ensure it runs only on the client
      const abstract = document.getElementById("abstract") as HTMLDivElement;
      if (abstract && research?.abstract) {
        abstract.innerHTML = research.abstract;
      }
    }
  }, [research]); // ✅ Add research as a dependency to update when it changes

  const handleApprove = async (id: any) => {
    setLoading(true);
    const response = await fetch(`/api/research/approve`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: id }),
    });
  
    if (!response.ok) {
      setLoading(false);
        let errorData;
        try {
            errorData = await response.json();
            setError(errorData.message)
        } catch (err) {
            setError("Failed to approve. Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to approve");
        return;
    } else {
      setLoading(false);
      setSuccess("Request approved!")
    }

  };

  const handleReject = async (id: any) => {
    setLoading(true);
    const response = await fetch(`/api/research/reject`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: id }),
    });
  
    if (!response.ok) {
      setLoading(false);
        let errorData;
        try {
            errorData = await response.json();
            setError(errorData.message)
        } catch (err) {
            setError("Failed to reject. Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to reject");
        return;
    } else {
      setLoading(false);
      setSuccess("Request approved!")
    }

  };
  const handleHold = async (id: any) => {
    setLoading(true);
    const response = await fetch(`/api/research/hold`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: id }),
    });
  
    if (!response.ok) {
      setLoading(false);
        let errorData;
        try {
            errorData = await response.json();
            setError(errorData.message)
        } catch (err) {
            setError("Failed to hold. Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to hold");
        return;
    } else {
      setLoading(false);
      setSuccess("Request approved!")
    }

  };

  const handleReview = async (id: any) => {
    setLoading(true);
    const response = await fetch(`/api/research/review`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: id }),
    });
  
    if (!response.ok) {
      setLoading(false);
        let errorData;
        try {
            errorData = await response.json();
            setError(errorData.message)
        } catch (err) {
            setError("Failed to reject. Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to reject");
        return;
    } else {
      setLoading(false);
      setSuccess("Request approved!")
    }

  };
  if(research?.status === "Pending" || research?.status === "Draft"){
    handleReview(ResearchId);
  }

  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
      <div className="w-4/5 bg-slate-100 rounded-lg p-4">
        <h4 className="flex justify-between items-center p-3">
          <div>
           <h1 className="text-sm text-slate-400">RESEARCH HEADER</h1>
           <span className="text-2xl text-slate-700 font-medium">{truncateText(research?.title ?? "" , 40)} </span> 
          </div>
          <div className="space-x-3">
            <button className="border border-blue-800 py-[6px] px-6 rounded-md text-sm bg-blue-500 text-white text-center" onClick={() => {handleApprove(research?.hashed_id);}}>Publish</button>
            <button className="border border-amber-800 py-[6px] px-6 rounded-md text-sm bg-amber-900 text-white text-center" onClick={() => {handleReject(research?.hashed_id);}}>Reject</button>
            <button className="border border-orange-300 py-[6px] px-6 rounded-md text-sm text-orange-500 text-center" onClick={() => {handleHold(research?.hashed_id);}}>Hold</button>
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
        <form className="space-y-2 max-h-[70vh] overflow-hidden overflow-y-visible">
        
        <div className="flex justify-between p-2 space-x-3">
          <div className="w-5/6 bg-white rounded-lg p-5">
           <div className="w-full flex items-center justify-center bg-slate-100 p-2">
            <i className="bi bi-search text-5xl text-slate-400"></i>
           </div>
           <div className="space-y-6 px-1">

            <div className="relative">
              <h4 className="font-medium pt-2">Title</h4>
              <div className={`relative text-gray-700 transition-all duration-300`}>
              {research?.title}
              </div>
            </div>

            <div className="relative">
              <h4 className="font-medium">Abstract </h4>
              <div className={`relative text-gray-700 transition-all duration-300`} id="abstract"></div>
            </div>

            <div className="relative">
              <h4 className="font-medium pt-2">Document</h4>
              <div className={`relative text-gray-700 transition-all duration-300`}>
              <Link href={research?.document ?? ""} className="text-teal-600 underline">{truncateText(research?.document ?? "" , 80)}</Link> 
              </div>
            </div>
            
           </div>
          </div>
          <div className="w-2/6 bg-white rounded-lg p-5 space-y-2 h-max">
           <h1 className="text-lg text-slate-600 font-semibold">Research Details</h1>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Status</h4>
            <div className="text-sm tex-slate-600">{research?.progress_status}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Researcher</h4>
            <div className="text-sm tex-slate-600">{research?.researcher}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">University</h4>
            <div className="text-sm tex-slate-600">{research?.institute}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Category</h4>
            <div className="text-sm tex-slate-600">{research?.category}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Year</h4>
            <div className="text-sm tex-slate-600">{research?.year}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">School </h4>
            <div className="text-sm tex-slate-600">{research?.school}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Document Type</h4>
            <div className="text-sm tex-slate-600">{research?.document_type}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Uploaded at</h4>
            <div className="text-sm tex-slate-600">{formatDate(research?.created_at)}</div>
           </div>

          </div>
        </div>
        </form>
      
      </div>
    </div>
  )
}
export default ViewResearch;