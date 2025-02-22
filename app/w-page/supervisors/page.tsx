"use client";
import Header, { SupervisorList } from "@/app/components/supervisors";
import AddSupervisor from "@/app/components/toggles/addSupervisor";
import { useState } from "react";

export default function Supervisores(){
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);

  const toggleAddSupervisor = () => {
    setShowAddSupervisor(true);
  }
  const closeAddSupervisor = () => {
    setShowAddSupervisor(false);
  }
  return (
    <>
    <Header onAddSupervisorClick={toggleAddSupervisor}/>
    <SupervisorList />
    {showAddSupervisor && (
      <AddSupervisor onClose={closeAddSupervisor} />
    )}
    </>
  );
}