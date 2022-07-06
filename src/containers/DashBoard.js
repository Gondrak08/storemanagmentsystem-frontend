import React,{useEffect, useState, useContext} from 'react';
import { IoIosAdd } from 'react-icons/io';
import {Link, useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/auth';
import api from '../services/api';


const dashlinks = {
    "categories":{
        type:'category',
        path:'category',
        name:'View Category',
    },
    "products":{
        type:'product',
        path:'product',
        name:'View Product',

    },
    "bills":{
        type:"bill",
        path:'bill',
        name:"View Bill",
    }
}

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
    
    //console.log(data)
 

    return(
        <section className="bg-white my-3 mx-2 py-3 px-2">
            <h2 className="text-xl font-bold" >
                Dashboard
            </h2>
            <div className="flex flex-wrap mt-5 justify-between items-center " >
                
                
                {Object.values(dashlinks).map(item=>(
                    <div className='card flex flex-col items-center px-2 py-4  border-[1px] border-msblue1 max-w-[20em] w-full h-[10em] justify-between  ' >
                        <h4>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</h4>
                        
                        <span>total: {data ? 
                           Object.entries(data).map(value=>{
                               if(item.type === value[0]) return value[1]
                           })
                         : null}
                         </span>
                        <Link className='bg-msblue1 hover:bg-msblue2 w-[90%] text-center p-2 text-white '  to={'../'+item.path} onClick={()=> navigate(item.path)} >{item.name}</Link>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Dashboard;