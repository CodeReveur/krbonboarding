interface TopBarProps {
    page: String
}
const TopBar = ({page}: TopBarProps) => {
    return (
       <div className="w-full flex justify-between items-center transition-transform duration-300 ease-in-out">
         <h1 className="text-2xl ">{page}</h1>
         <div className="flex">
            <div className="flex min-w-[50vh] py-2 px-4 bg-slate-50 border rounded-md">
                <i className="bi bi-search text-slate-500 text-md mr-2"></i>
                <input 
                type="search" 
                name="" 
                id="" 
                placeholder="Search..."
                className=" border w-full text-slate-600 outline-none bg-transparent border-none"
                />
            </div>
            <div className="flex mx-7 py-2 border rounded-full w-10 h-10 items-center justify-center">
                <i className="bi bi-bell text-xl text-slate-500"></i>
                <span className="bg-red-500 w-2 h-2 rounded-full absolute ml-3 mt-[-12px]"></span>
            </div>
            <div className="flex mr-7 py-2 border rounded-full w-10 h-10 items-center justify-center">
                <i className="bi bi-chat-dots text-xl text-slate-500"></i>
                <span className="bg-red-500 w-2 h-2 rounded-full absolute ml-4 mt-[-10px]"></span>
            </div>
            <div className="flex mr-3 py-2 border rounded-full w-10 h-10 items-center justify-center">
                <i className="bi bi-person text-xl text-slate-500"></i>
            </div>
         </div>
       </div>
       
    );
}
export default TopBar;