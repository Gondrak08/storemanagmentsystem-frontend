import React,{useEffect, useState, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/auth';
import api from '../services/api';

import {ProgressBar} from './index';

import { IoIosAdd } from 'react-icons/io';
import {MdCategory} from 'react-icons/md';
import {FaBox, FaUsers} from 'react-icons/fa';
import {RiBillFill} from 'react-icons/ri';


const dashlinks = {
    "categories":{
        type:'category',
        path:'category',
        name:'View Category',
        icon: <MdCategory fontSize={35} className="text-msblue2"/>
    },
    "products":{
        type:'product',
        path:'product',
        name:'View Product',
        icon: <FaBox fontSize={35} className="text-msblue2"/>
    },
    "bills":{
        type:"bill",
        path:'bill',
        name:"View Bill",
        icon: <RiBillFill fontSize={35} className="text-msblue2"/>

    }
}

const testData = [
    { bgcolor: "#6a1b9a", completed: 60 },
    { bgcolor: "#00695c", completed: 30 },
    { bgcolor: "#ef6c00", completed: 53 },
  ];

const Dashboard = () =>{
    const [data, setData] = useState(null);
    const context = useContext(AuthContext);
    let navigate = useNavigate()

    useEffect(()=>{
        api.get("/dashboard/details",{headers:{
            Authorization: 'Bearer ' + context.authToken
        }}).then((res)=>{
            if(res.status == 200){
                setData(res.data)
            }
        }).catch(err=>console.log(err));    
    },[])
    
    console.log(context);

    return(
        <section className="my-3 mx-2 py-3 px-2">
            <h2 className="text-xl font-bold" >
              Wellcome back,  <span className='font-normal'> {'   '} {context.userName}</span>
            </h2>
            <div className="flex flex-wrap mt-5 justify-between items-center " >
                
                {Object.values(dashlinks).map(item=>(
                    <div className='card bg-mswhite flex flex-col  px-2 py-4  border-[1px]   max-w-[20em] w-full h-[12em] justify-between shadow-lg'>
                        <div className='flex items-center gap-2' >
                            {item.icon} 
                            <h4>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h4>
                        </div>
                        
                        <span className='flex flex-col justify-center' > total:{data ? 
                           Object.entries(data).map(value=>{
                               if(item.type === value[0]) return (<ProgressBar  completed={value[1]} />)
                           })
                         : null}
                         </span>
                        <Link className='bg-msblue1 self-center hover:bg-msblue2 w-[90%] text-center p-2 text-white '  to={'../'+item.path} onClick={()=> navigate(item.path)} >{item.name}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Dashboard;