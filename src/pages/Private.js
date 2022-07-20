import React, {useState, useEffect,useContext} from 'react';
import {Navbar, Sidebar} from '../containers';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';


const Private = ()=>{
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const auth = useContext(AuthContext)
    let navigate = useNavigate();
    useEffect(()=>{
        navigate("dashboard")
    },[])
    
    return(
        <div className="w-sceen h-screen">
           <Navbar menuopen={()=>{setIsMenuOpen(!isMenuOpen)}} />
           <section className="flex w-full h-full" >
            <Sidebar isMenuOpen={isMenuOpen}/>
            <div className="display w-full h-full flex justify-center bg-mslightgray " >
                <div className="container " >
                    <Outlet/>
                </div>
            </div>
           </section>
        </div>
    )
}

export default Private;