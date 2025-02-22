"use client";
import Header, { SchoolList } from "@/app/components/schools";
import AddSchool from "@/app/components/toggles/addSchool";
import { useState } from "react";

export default function Schools(){
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [setupSchoolId, setSetupSchoolId] = useState<number | null>(null);

  const toggleAddSchool = () => {
    setShowAddSchool(true);
  }
  const closeAddSchool = () => {
    setShowAddSchool(false);
  }
  const handleSchoolViewClick = (SchoolId: number) => {
    setSetupSchoolId(SchoolId); // Set the ID for the setup form
  };
  const closeSchoolView = () => {
    setSetupSchoolId(null); // Close the setup product form
  };

  return (
    <>
    <Header onAddSchoolClick={toggleAddSchool}/>
    <SchoolList onSchoolView={handleSchoolViewClick}/>
    {showAddSchool && (
      <AddSchool onClose={closeAddSchool} />
    )}
    </>
  );
}