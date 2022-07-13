import React, {useState, useContext, useEffect} from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/auth';

import{HiMenuAlt4}from 'react-icons/hi';
import{FaUserCircle}from 'react-icons/fa';
import{AiFillCloseCircle}from 'react-icons/ai';

export const PasswordBox =({isClosed})=>{
    const[newPassword, setNewPassword] = useState('')
    const[isPass, setIsPass] = useState(false);
    const[isUpdated,setIsUpdated] = useState(false);
    const auth = useContext(AuthContext);
    const inputStyle = "w-full p-2 border-b-[2px] border-b-msblue1"

   const handleInputValue =(e, id) =>{
        let valueOne = document.getElementById('inputone').value;
        let valueTwo = document.getElementById('inputtwo').value;
        if(valueOne==='')setIsPass(false);
        if(valueOne.length > 0 && valueTwo.length > 0 && valueOne===valueTwo){
            setIsPass(true); 
            setNewPassword(valueOne);
        };
   }

   const updatePassword =()=> {
       api.post('/user/changePassword',{
        email:auth.userEmail,
        oldPassword:auth.userPass,
        newPassword:newPassword
       },{
           headers: {
                   Authorization: 'Bearer ' + auth.authToken,
                   ContentType: "application/json",
               },
           }).then((res)=>{
               if(res.status==200){
                    setIsUpdated(true)
                    auth.setUserPass(newPassword);                               
               }
           }).catch(err=>console.log(err));
   }

   useEffect(()=>{
        if(isUpdated)
            setTimeout(isClosed, 1500);
   })
   useEffect(()=>{
        setIsUpdated(false)
   },[])
   

    return(
        <div className='absolute rounded-t-lg bg-mswhite drop-shadow-md m-auto top-[-150px] bottom-0 left-0 right-0 h-[fit-content] w-[30em]' >
            <div className='relative'>
                {isUpdated ?
                (
                    <>
                        <div className='updateBox p-3'>
                            <div className='w-full text-center'>
                                <h3>Your password has been updated.</h3>
                            </div>
                        </div>
                    </>
                ):(
                    <>
                        <div className='w-full flex justify-between p-3 bg-msblue2 text-white rounded-t-lg '>
                            <h3>Change your password</h3>
                            <AiFillCloseCircle 
                                className=" right-[25px] text-white hover:text-msblue1 cursor-pointer" 
                                fontSize={25} 
                                onClick={() => isClosed()} 
                                />
                        </div>
                        <div className='p-3'>
                            <div className='flex flex-col gap-3 my-2'>
                                <label>
                                    New Password
                                </label>
                                <input id="inputone" 
                                type="text" 
                                placeholder='New password' 
                                className={inputStyle}
                                onChange={e=> handleInputValue(e, e.target.id) }
                                />
                                <label>
                                    Repeat Password
                                </label>
                                <input id="inputtwo"
                                type="text" 
                                placeholder='Repeat new password' 
                                className={inputStyle} 
                                onChange={e=> handleInputValue(e, e.target.id) }
                                />
                            </div>
                            <button
                            onClick={(e)=> updatePassword(e) }
                            className={` ${isPass ? 
                            'bg-msblue2 hover:bg-msblue1 cursor-pointer'
                            :'bg-msgray'} py-2 my-3 px-5 rounded text-white  text-[18px]`}
                            >
                                Change Password
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

const Navbar=({menuopen})=>{
    const[isOptions, setIsOptions] = useState(false);
    const[isPasswordBox, setIsPasswordBox] = useState(false); 
    return(
        <>
        <div className="w-full bg-msblue2 flex justify-center items-center py-5 px-6">
            <div className="relative w-full flex justify-between">
                <div className="flex items-center justify-between w-full max-w-[1500px] gap-8">
                    <div className='flex items-center w-auto gap-8' >
                        <HiMenuAlt4 
                        fontSize={30} 
                        className="cursor-pointer text-white hover:text-msdark" 
                        onClick={()=> menuopen()}
                        />
                        <h1 className="text-white text-xl" >Store Managment System</h1>
                    </div>
                    <div className='relative'>
                        <FaUserCircle 
                        fontSize={30}
                        className={`cursor-pointer text-white hover:text-msblue1 ${isOptions?"text-msblue1":""}`}
                        onClick={()=> setIsOptions(!isOptions) }
                        />
                        <div className={`options-box drop-shadow-md w-[10em] px-3 py-5  ${isOptions ? 
                            'absolute left-[-60px] top-[35px] visbile bg-white  h-[fit-content]' 
                            : 'hidden'} `}>
                            <div className='flex flex-col justify-center items-center gap-3'>
                                <button
                                className='' 
                                onClick={()=>setIsPasswordBox(!isPasswordBox)} 
                                >Change Password</button>
                                <button>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {isPasswordBox?( <PasswordBox  isClosed={()=> setIsPasswordBox(false)} /> ):null}
        </>
    )
}

export default Navbar;