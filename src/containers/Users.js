import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { ContentContext } from '../context/content';
import api from '../services/api';

import { Input } from './index';
import { MdEdit, MdDeleteForever, MdToggleOff, MdToggleOn} from 'react-icons/md';

const Users = () =>{
    const auth = useContext(AuthContext);
    const context = useContext(ContentContext);
    const [usersList, setUsersList] = useState(null);
    
    const getUsers=()=>{
        api.get("/user/get",{
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res)=>{
            if(res.status==200){
                setUsersList(res.data)
            }
        }).catch(err=>console.log(err));
    };
    
    useEffect(()=>{
        getUsers()
    },[]);

    const updateUserStatus=(value, id)=>{
        const data={
            id:id,
            status: value
        }
        api.patch("/user/update",data,{
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res)=>{
            if(res.status==200){
               console.log(res);
               getUsers();
            }
        }).catch(err=>console.log(err));
    };

    const updateRole=(value, id)=>{
        const data={
            id:id,
            role:value
        }
        api.patch("/user/changeRole",data,{
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res)=>{
            if(res.status==200){
               console.log(res);
               getUsers();
            }
        }).catch(err=>console.log(err));
    }

    return(
        <section className="responsive py-3 flex flex-col items-center gap-[25px]">
            <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex items-center justify-between">
                <h3>Manager Users</h3>
            </div>

            <div className="container shadow-xl rounded flex flex-col bg-mswhite py-3 px-5">
                <Input placeHolder={"Search"} inputType={"search"} />
            </div>

            {
                usersList ? (
                    <table className="container table-fixed shadow-xl rounded-md py-3 bg-mswhite">
                        <thead>
                            <tr>
                                <th className="py-3 text-msgray ">Name</th>
                                <th className="py-3 text-msgray ">Email</th>
                                <th className="py-3 text-msgray text-center">status</th>
                                <th className="py-3 text-msgray text-center">roles</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map(index=>(
                                <tr id={index} className="border-0 border-t-[1px] border-msgray" >
                                    {
                                        Object.entries(index).map(([key, value])=>(
                                           <>
                                            {key !== "id" && key!=="status" && key!=="role" ? (
                                                <td className="px-3 py-3 text-msdark  text-center">
                                                    {value}
                                                </td>
                                            ):null}

                                            {key=="status" ? (
                                                <td className="px-3 py-3 flex justify-center text-msdark  text-center">
                                                {value == "false" ? (
                                                    <MdToggleOff fontSize={25} className="text-center text-gray-500 cursor-pointer"
                                                        onClick={()=>{updateUserStatus("true", index.id)}}
                                                    />) 
                                                : null }
                                                {value=="true"? (
                                                    <MdToggleOn  fontSize={25} className="text-center text-red-500 cursor-pointer" onClick={(e)=> {updateUserStatus("false", index.id)}}/>
                                                ):null}
                                                </td>
                                            ):null}
                                            {key=="role"&&(
                                                <td className='px-3 py-3 text-msdark  text-center'>
                                                   <select defaultValue={value} onChange={(e)=> updateRole(e.target.value, index.id)} >
                                                       { ['user', 'manager'].map(opt=>(
                                                        <option value={opt} >{opt}</option>
                                                       ))}
                                                   </select>
                                                </td>
                                            )}
                                            </>
                                        ))
                                    }
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                )
                :
                null
            }
        </section>
    )
}

export default Users;