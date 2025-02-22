import { useEffect, useState } from "react";
import ChatAnalytics from "./chartAnalytics";
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DivPreloader from "./preloader";

const sampleData = [
  { day: "Mon", previous: 10, current: 15 },
  { day: "Tue", previous: 8, current: 12 },
  { day: "Wed", previous: 12, current: 18 },
  { day: "Thu", previous: 14, current: 20 },
  { day: "Fri", previous: 16, current: 22 },
  { day: "Sat", previous: 9, current: 14 },
  { day: "Sun", previous: 11, current: 17 },
];
const performance = {
  top: "Harvard University",
  topValue: 90,
  me: 50,
  least: "Community College",
  leastValue: 50,
};

interface ResearchHeaderProps{
  onAddResearchClick: () => void;
}

export interface Analytics {
  total_researches: number;
  total_supervisors: number;
  total_students: number;
  total_requests: number;
  percentage_change: {
    total_researches: number;
    total_supervisors: number;
    total_students: number;
    total_requests: number;
  };
}


const Dashboard = ({onAddResearchClick}: ResearchHeaderProps) => {
            const [analytics, setAnalytics] = useState<Analytics | null>(null);
            const [loading, setLoading] = useState(false);
              // Fetch Institutions
              useEffect(() => {
                setLoading(true)
                const userSession = JSON.parse(localStorage.getItem('institutionSession') || '{}');
                let id = "";
                if(userSession && userSession.id){
                  id = userSession.id;
                }
                const fetchInstitutions = async () => {
                  try {
                    const response = await fetch(`/api/analytics/dashboard?institution_id=${id}`);
                    if (!response.ok) throw new Error("Failed to fetch Institutions");
                    const data = await response.json();
                    setAnalytics(data);
                    setLoading(false);
                  } catch (error) {
                    console.log("An error occurred while fetching Institutions.");
                  }
                };
                fetchInstitutions();
              }, []);
  if(loading) {
    return <DivPreloader />
  }
  return (
    <>
     <div>
      <div className="flex justify-between items-center py-1">
        <div className="space-y-1">
          <h1 className="text-slate-600 font-medium text-3xl">Dashboard</h1>
          <span className="text-slate-400 text-xs">Plans, decisions, analytics, billings, materials, your tasks and management</span>
        </div>
        <div className="flex space-x-4 items-center text-sm font-medium">
          <button className="bgbtn1 space-x-1 border rounded-3xl py-2 px-3 text-slate-50 flex items-center" onClick={onAddResearchClick}><i className="bi bi-plus text-lg"></i> Add Research</button>
          <button className="space-x-1 border border-teal-800 rounded-3xl py-2 px-3 text-teal-800"><i className="bi bi-upload"></i> Export Data</button>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-5 space-y-2">

      <div className="bgbtn1 rounded-2xl px-5 py-4 w-[18vw] space-y-2 text-white">
          <h4 className="flex items-center justify-between">
            <span className="">Total Researches </span>
            <i className="bi bi-arrow-right py-[2px] px-2 text-sm rounded-full bg-white text-slate-700"></i>
          </h4>
          <div className="count font-semibold text-2xl py-2">
            {analytics?.total_researches}
          </div>
          <div className="flex items-center text-[10px] space-x-2 text-teal-800 font-semibold">
            <span className={`border ${Number(analytics?.percentage_change.total_researches) > 0 ? 'border-teal-500 text-teal-300' : 'border-red-500 text-red-600'} rounded-lg space-x-1 p-[2px]`}>
              <i className={`bi bi-graph-${Number(analytics?.percentage_change.total_researches) > 0 ? 'up': 'down'}-arrow mr-[2px]`}></i>
              {analytics?.percentage_change.total_researches}%
            </span>
           <span>Increase from last month</span>
          </div>
        </div>

        <div className="rounded-2xl px-5 py-4 w-[18vw] space-y-2 bg-white min-w-[10vw] text-slate-500">
          <h4 className="flex items-center justify-between">
            <span className="font-semibold text-amber-500">Total Students </span>
            <i className="bi bi-arrow-right p-1 rounded-full bg-white"></i>
          </h4>
          <div className="count font-semibold text-2xl py-2">
            {analytics?.total_students}
          </div>
          <div className="flex items-center text-[10px] space-x-2 text-teal-800 font-semibold">
            <span className={`border ${Number(analytics?.percentage_change.total_students) > 0 ? 'border-teal-500 text-teal-600' : 'border-red-500 text-red-600'} rounded-lg space-x-1 p-[2px]`}>
              <i className={`bi bi-graph-${Number(analytics?.percentage_change.total_students) > 0 ? 'up': 'down'}-arrow mr-[2px]`}></i>
              {analytics?.percentage_change.total_students}%
            </span>
           <span>Increase from last month</span>
          </div>
        </div>

        
        <div className="rounded-2xl px-5 py-4 w-[18vw] space-y-2 bg-white min-w-[10vw] text-slate-500">
          <h4 className="flex items-center justify-between">
            <span className="font-semibold text-teal-600">Total Supervisors </span>
            <i className="bi bi-arrow-right p-1 rounded-full bg-white"></i>
          </h4>
          <div className="count font-semibold text-2xl py-2">
            {analytics?.total_supervisors}
          </div>
          <div className="flex items-center text-[10px] space-x-2 text-teal-800 font-semibold">
            <span className={`border ${Number(analytics?.percentage_change.total_supervisors) > 0 ? 'border-teal-500 text-teal-600' : 'border-red-500 text-red-600'} rounded-lg space-x-1 p-[2px]`}>
              <i className={`bi bi-graph-${Number(analytics?.percentage_change.total_supervisors) > 0 ? 'up': 'down'}-arrow mr-[2px]`}></i>
              {analytics?.percentage_change.total_supervisors}%
            </span>
           <span>Increase from last month</span>
          </div>
        </div>

        <div className="rounded-2xl px-5 py-4 w-[18vw] space-y-2 bg-white min-w-[10vw] text-slate-500">
          <h4 className="flex items-center justify-between">
            <span className="font-semibold text-orange-500">Total Requests </span>
            <i className="bi bi-arrow-right p-1 rounded-full bg-white"></i>
          </h4>
          <div className="count font-semibold text-2xl py-2">
            {analytics?.total_requests}
          </div>
          <div className="flex items-center text-[10px] space-x-2 text-teal-800 font-semibold">
            <span className={`border ${Number(analytics?.percentage_change.total_requests) > 0 ? 'border-teal-500 text-teal-600' : 'border-red-500 text-red-600'} rounded-lg space-x-1 p-[2px]`}>
              <i className={`bi bi-graph-${Number(analytics?.percentage_change.total_requests) > 0 ? 'up': 'down'}-arrow mr-[2px]`}></i>
              {analytics?.percentage_change.total_requests}%
            </span>
           <span>Increase from last month</span>
          </div>
        </div>


      </div>
     </div>    
     <ChatAnalytics data={sampleData}/>
     <div className="flex space-x-5 justify-between">
      <div className="bg-white flex space-x-5 border p-5 rounded-md">
      <div className="p-4 rounded-2xl bg-white w-[25vw] border  overflow-hidden">
        <h4 className="text-lg text-teal-600 font-medium">Team Collaboration</h4>
        <div className="block py-2 space-y-2 max-h-[45vh] overflow-hidden overflow-y-visible">

          <div className="box p-1">
            <h1 className="font-semibold">User name</h1>
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500">New login from Joseph, Today, <span className="font-medium text-teal-400">12:04 PM</span></div>
              {true ? <div><button className="border text-orange-500 text-xs border-orange-500 bg-orange-100  py-1 px-2 rounded-md">Approve</button></div> : <></>}
            </div>
          </div>
          
          <div className="box p-1">
            <h1 className="font-semibold">User name</h1>
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500">New login from Joseph, Today, <span className="font-medium text-teal-400">12:04 PM</span></div>
              {true ? <div><button className="border text-orange-500 text-xs border-orange-500 bg-orange-100  py-1 px-2 rounded-md">Approve</button></div> : <></>}
            </div>
          </div>

          <div className="box p-1">
            <h1 className="font-semibold">User name</h1>
            <div className="flex justify-between items-center">
              <div className="text-xs text-slate-500">New login from Joseph, Today, <span className="font-medium text-teal-400">12:04 PM</span></div>
              {true ? <div><button className="border text-orange-500 text-xs border-orange-500 bg-orange-100 py-1 px-2 rounded-md">Approve</button></div> : <></>}
            </div>
          </div>

        </div>
      </div>
      
      <div className="flex flex-col items-center p-5 w-[20vw] rounded-2xl border border-teal-300 bg-slate-200">
        <h3 className="text-lg font-semibold text-teal-700">Performance Comparison</h3>
        <div className="relative w-40 h-40">
          <CircularProgressbar
            value={performance.me}
            maxValue={100}
            strokeWidth={17}
            styles={buildStyles({
              pathColor: "#0f766e",
              trailColor: "#cbd5e1",
              textSize: "16px",
              strokeLinecap: "round",
              pathTransitionDuration: 0.5,
              rotation: 0.75,
            })}
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-gray-700">
            {performance.me}%
          </div>
       
        </div>
        <div className="mt-2 space-y-1 text-xs text-gray-600 text-center">
          <span className="block font-semibold text-teal-600"><span className="text-orange-500">Least:</span> {performance.least} ({performance.leastValue}%)</span>
          <span className="block font-bold text-teal-700"><span className="text-teal-500">Top:</span> {performance.top} ({performance.topValue}%)</span>
        </div>
      </div>
      </div>
      
      <div className="bg-white flex flex-col items-center space-y-5 p-5 border rounded-lg w-[25vw]">
      <div className="bgbtn1 flex flex-col items-center p-5 h-max w-full text-white space-y-1 rounded-2xl border border-teal-600">
        <h4 className="text-lg text-orange-500 font-semibold">PAYMENT STATUS</h4>
        <div className="font-bold text-base text-gray-300">1y 2m 10d</div>
        <div className="font-bold text-3xl py-2">12:37:23s</div>
        <div className="text-green-400 text-xs font-bold border border-teal-400 rounded-lg p-2">MAINTAINED</div>
      </div>
      </div>
    
     </div>
    </>
  );
}
export default Dashboard;