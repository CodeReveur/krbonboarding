import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from "recharts";
import DivPreloader from "./preloader";


interface ChatAnalyticsProps {
  data: { day: string; previous: number; current: number }[];
}

const COLORS = ["#b45309", "#14b8a6", "#fdba74", "#94a3b8"];

interface Analytics {
  pending_researches: number,
  total_rejected: number,
  total_inactive: number,
  total_published: number,
}
let sampleData = [];
const ChatAnalytics: React.FC<ChatAnalyticsProps> = ({ data }) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("institutionSession") || "{}");
    const id = userSession?.id || "";

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/dashboard/pie/?institution_id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("An error occurred while fetching analytics.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <DivPreloader />;
  }

  if (!analytics) {
    return <p>No data available</p>;
  }
  
  sampleData = [
    { "name": "Rejection", "value": analytics.total_rejected | 1},
    { "name": "Publishing", "value": analytics.total_published |1 },
    { "name": "Pending", "value": analytics.pending_researches | 1 },
    { "name": "Inactive", "value": analytics.total_inactive | 1},
  ];

  return (
    <div className="flex space-x-6">
    <div className="w-full p-4 my-4 rounded-2xl bg-white">
      <h2 className="text-lg font-bold mb-2 text-orange-300">Monthly Research Analytics</h2>
      <ResponsiveContainer width="100%" height={195} className={``}>
        <BarChart data={data} className="text-sm">
          <XAxis dataKey="day" className="text-gray-600" />
          <YAxis className="text-gray-600" />
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }} />
          <Legend wrapperStyle={{ color: "#4b5563" }} />
          <Bar dataKey="previous" fill="#0f766e" name="Previous month" radius={[4, 4, 0, 0]} />
          <Bar dataKey="current" fill="#f87171" name="Current month" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="w-full p-4 my-4 rounded-2xl bg-white">
       <h2 className="text-lg font-bold mb-2 text-teal-600">Monthly Research Status</h2>
      <ResponsiveContainer width="100%" height={200} className={``}>
       
        <PieChart>
          <Pie
            data={sampleData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            label
          >
            <LabelList dataKey="value" position="inside" fill="white" fontSize={13} fontWeight="bold" />
            {sampleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    
  
    </div>
    
  );
};

export default ChatAnalytics;
