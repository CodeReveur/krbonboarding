"use client"

import { useEffect, useState } from "react";
import Dashboard from "../components/app/dashboard";
import AddResearch from "../components/toggles/addResearch";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddResearch, setShowAddResearch] = useState(false);

  const showSideBar = () => {
    setIsOpen(!isOpen);
  }
 const closeSideBar = () => {
  setIsOpen(false);
 }
 const toggleAddResearch = () => {
  setShowAddResearch(true);
}
const closeAddResearch = () => {
  setShowAddResearch(false);
}

 
  return (
    <>
     <Dashboard onAddResearchClick={toggleAddResearch}/>
     {showAddResearch && (
      <AddResearch onClose={closeAddResearch}/>
     )}
    </>
  );
}
export default App;