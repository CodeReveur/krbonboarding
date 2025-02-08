"use client";
import Header, { CollegeList } from "@/app/components/colleges";
import AddCollege from "@/app/components/toggles/addCollege";
import { useState } from "react";

export default function Colleges(){
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [setupCollegeId, setSetupCollegeId] = useState<number | null>(null);

  const toggleAddCollege = () => {
    setShowAddCollege(true);
  }
  const closeAddCollege = () => {
    setShowAddCollege(false);
  }
  const handleCollegeViewClick = (CollegeId: number) => {
    setSetupCollegeId(CollegeId); // Set the ID for the setup form
  };
  const closeCollegeView = () => {
    setSetupCollegeId(null); // Close the setup product form
  };

  return (
    <>
    <Header onAddCollegeClick={toggleAddCollege}/>
    <CollegeList onCollegeView={handleCollegeViewClick}/>
    {showAddCollege && (
      <AddCollege onClose={closeAddCollege} />
    )}
    </>
  );
}