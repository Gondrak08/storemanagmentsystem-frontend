import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/auth';
import api from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Login = ({authenticate}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [useremail, setuserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btnType, setBtnType] = useState('');
    const auth = useContext(AuthContext) 
    const navigate = useNavigate()

    function handleLogin(e){
        setIsLoading(true);
        e.preventDefault();
        api.post("/user/login",{
            email: useremail,
            password:password
        },{headers:{
            Authorization: 'Bearer' + '7d93f1a044946a47c1df611c9b7c32f7de0953460430bbd2200b328fb3fdf0239c113017f86d280c18041d42597b94aebdfdba2a56d65eacf93ef51560503653'
        }}).then((res)=>{
            if(res.status == 200){
                auth.setAuthToken(res.data.token);
                auth.setRole(res.data.role);
                auth.setUserEmail(res.data.email);
                auth.setUserPass(res.data.password);
                authenticate();
            }
        }).catch(err=>console.log(err)).finally(()=>{
            setIsLoading(false);
        })
        ;        
    };
    
    const handleRegister = (e) => {
        e.preventDefault();
        api.post("/user/signup",{name:userName, email:useremail, password:password}).then((res)=>{
            console.log(res);
            setBtnType('');
        }).catch(err=>console.log(err));
    };
    
    const handleLostPassword =(e)=>{
        api.post("/user/forgotPassword",{email:useremail}).then(res=>{
            console.log(res);
        }).catch(err=>console.log(err));
        e.preventDefault();
    }
   
    let inputStyles = [
        "w-full h-[2em] border-b-[1px] border-blue-500 p-2"
    ]


    return(
    <div className="w-full h-full bg-[#3671E9] flex justify-center items-center">
            <div className="container flex justify-center items-center max-h-[450px] h-full">
                <div className="register-card relative rounded-md bg-mswhite max-w-[25em] px-5 h-full w-full  flex  flex-col justify-center  items-center">
                    <div className='text-center w-full absolute top-5'>
                        <h1 className="text-[5em] text-msblue2">MS</h1>
                        <span className="italic relative bottom-4 text-msgray ">Managment System</span>
                    </div>
                    
                    <div className="input-forms  mt-3 flex flex-col gap-[1em] h-auto w-full border-b-[solid 1px] ">
                        {

                            btnType == '' ? (
                                <div className="flex flex-col mt-24 gap-3" >         
                                {
                                    ['Login', 'Register', 'forget password ?'].map((item, index)=>(
                                    <a key={index} 
                                    onClick={(e)=> setBtnType(item)} 
                                    className={`self-center text-center cursor-pointer  border-transparent hover:border-msblue1 border-[1px] w-full max-w-[15em] p-2 
                                        ${item == 'Login' ? 'bg-msblue1 hover:bg-msblue2 text-white ': '' } 
                                        ${item == 'Register' ? 'bg-gray-200': ''} 
                                        ${item=='forget password ?'  ? 'underline':'' }
                                    `}
                                    >{item}</a>))
                                }
                            </div>
                            ) : (
                                <>
                                {
                                    isLoading ? 
                                    (<div className='loading-spinner self-center bg-msblue2' />) 
                                    :
                                    (
                                        <div className='mt-5 gap-3 flex flex-col' >
                                        <input type="text" onChange={(e)=> {setUserName(e.target.value)}} placeholder="Name" className={inputStyles} style={btnType != 'Register' ? {display:'none'} : null} />
                                        <input type="text" onChange={(e)=> {setuserEmail(e.target.value)}} placeholder="Email" className={inputStyles}  />
                                        <input type="password" onChange={(e)=> setPassword(e.target.value) } placeholder="Password" className={inputStyles} style={btnType =='forget password ?' ? {display:'none'}:null}  />
                                        
                                        <div className="flex justify-between items-center" >
                                            <button onClick={btnType=='Register' ?  e => handleRegister(e) : btnType == 'Login' ? e => handleLogin(e) :  e => handleLostPassword(e)} className="bg-white hover:bg-msblue2 border-[1px] text-msblue1 hover:text-white border-msblue2 hover:border-transparent  px-3 py-1 max-w-[30%]" >{btnType == 'Singup' ? 'Register': btnType == 'forget password ?' ? 'Send' : btnType}</button>
                                            {btnType=='Login' ? (<a href='#' onClick={(e)=> setBtnType('forget password ?') } > forget password ? </a>)  : null}
                                        </div>
                                        <FaArrowLeft onClick={(e)=> setBtnType('')} className="absolute  left-6 bottom-8 cursor-pointer"  color="" fontSize="1.5em" />
                                        </div>
                                    )
                                }
                                </>
                            )
                            
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;