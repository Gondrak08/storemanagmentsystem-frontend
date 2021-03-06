import {Link, useLocation} from 'react-router-dom'
import { RiDashboardFill} from 'react-icons/ri';
import {MdCategory} from 'react-icons/md';
import {FaBox, FaUsers} from 'react-icons/fa';
import {IoIosListBox} from 'react-icons/io';
import {RiBillFill} from 'react-icons/ri';
import { AuthContext } from '../../context/auth';
import{useContext} from 'react';

const sideLinks = {
    "dashboard":{
        type:'dashboard',
        path:'dashboard',
        name:'Dashboard',
        role:['admin',"manager","user"],
        icon: <RiDashboardFill fontSize={30} className="text-mslightgray" />
    },
    "categories":{
        type:'category',
        path:'category',
        name:'Manage Category',
        role:['admin',"manager","user"],
        icon: <MdCategory fontSize={24} className="text-mslightgray"/>
    },
    "products":{
        type:'procut',
        path:'product',
        name:'Manage Product',
        role:['admin',"manager","user"],
        icon: <FaBox fontSize={24} className="text-mslightgray"/>

    },
    "orders":{
        type:"order",
        path:'order',
        name:"Manage Order",
        role:['admin',"manager","user"],
        icon: <IoIosListBox fontSize={24} className="text-mslightgray"/>

    },
    "bills":{
        type:"bill",
        path:'bill',
        name:"View Bill",
        role:['admin',"manager","user"],
        icon: <RiBillFill fontSize={24} className="text-mslightgray"/>

    },
    "users":{
        type:"user",
        path:'user',
        name:"Manage Users",
        role:['admin',"manager"],
        icon: <FaUsers fontSize={24} className="text-mslightgray"/>

    }
}


const Sidebar=({isMenuOpen})=>{
    const auth = useContext(AuthContext) 
    let location = useLocation();
    // console.log(location.pathname);
    return(
        <aside className="max-w-[20em] w-full relative bg-msblue1 h-[100%] text-white animate-slide-in" style={isMenuOpen ==true ?{display:'flex'}:{display:'none'}} >
            <div className="flex flex-col gap-3 w-full pt-3 px-3 items-center ">
                {Object.values(sideLinks).map((item)=>(
                       <>
                        {item.role.includes(auth.role) ? (
                                <Link to={item.path} className={`flex items-center gap-3 hover:bg-msblue2 active:bg-msblue2 border-[.1em] border-transparent w-full p-3 ${location.pathname == '/private/'+item.path ? 'bg-msblue2': ''} `  }>
                                {item.icon}
                                <span className="text-xl text-white" >
                                    {item.name}
                                </span>
                            </Link>
                            ):null}
                        </>
                    ))
                }
            </div>
        </aside>
    )
}

export default Sidebar;