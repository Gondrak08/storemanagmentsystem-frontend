import React, {useState} from 'react';
import { HiMenuAlt4 } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'

const Navbar=({menuopen})=>{
    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <div className="w-full bg-msblue2 flex justify-center items-center py-5 px-6">
            <div className="w-full flex justify-between">
                <div className="flex items-center w-auto gap-8">
                    <HiMenuAlt4 
                    fontSize={30} 
                    className="cursor-pointer text-white hover:text-msdark" 
                    onClick={()=> menuopen()}
                    />
                    <h1 className="text-white text-xl" >Store Managment System</h1>
                </div>
            </div>
        </div>
    )
}

export default Navbar;