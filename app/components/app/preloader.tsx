// app/components/DivPreloader.tsx
import React from 'react';

const DivPreloader: React.FC = () => {
    return (
        <div className='p-5'>

       
        <div className="relative inset-0 flex items-center justify-center z-20 ">
            <div className="w-8 h-8 border-4 border-teal-300 border-dashed rounded-full animate-spin"></div>
        </div> 
        
    </div>
    );
};

const ButtonPreloader: React.FC = () => {
  return (
      <div className="relative inset-0 flex items-center justify-center z-10 ">
          <div className="w-3 h-3 border-4 border-teal-300 border-dashed rounded-full animate-spin"></div>
      </div> 
      
  );
};

export default DivPreloader;
export {ButtonPreloader};
