import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { ContentContext } from '../context/content';
import api from '../services/api';

import { Input } from './index';
import { MdSimCardDownload, MdDeleteForever } from 'react-icons/md';
import { AiFillEye, AiFillCloseCircle } from 'react-icons/ai';

import { saveAs } from 'file-saver';



const Bills = () => {
    const auth = useContext(AuthContext);
    const context = useContext(ContentContext);
    const [billList, setBillList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const filteredList = [
        'name',
        'email',
        'contactNumber',
        'paymentMethod',
        'total'
    ];

    const getBills = (e) => {
        api.get("/bill/getBills", {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                setBillList(res.data);
            }
        }).catch(err => console.log(err));
    };

    const downloadBill = (e, uuid) => {
        if (uuid) {
            api.post("/bill/getPdf", { uuid: uuid }, {
                headers: {
                    Authorization: 'Bearer ' + auth.authToken,
                    ContentType: "application/json",
                },
                responseType: "blob"
            }).then(res => {
                if (res.status == 200) {
                    var blob = new Blob([res.data], { type: 'application/pdf' })
                    return saveAs(blob, uuid + ".pdf");

                }
            }).catch(err => console.log(err));
        }
    };

    const deleteTable = (id) => {
        console.log(id)
        api.delete(`/bill/delete/${id}`, {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                console.log(res)
                return getBills();
            }
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        getBills();
    }, []);

    const modalHandle = (prop) => {
        if (typeof prop == 'number') context.setGetId(prop);
        if (typeof prop == 'object') { context.setProduct(prop); }
        return setIsOpen(true);
    };

    const Modal = () => {
        var clientData=[];
        const product = context.product ?? null;
        const productDetails =  product? JSON.parse(product['productDetails']):null
        const filteredClientData = [
        'name',
        'email',
        'contactNumber',
        'paymentMethod'
        ];
        
        if(product){
            Object.keys(product).map(key=>{
                filteredClientData.filter(filteredKey=>{
                    if(filteredKey==key){
                      clientData.push({[key]: product[key]});
                    }
                })
            })
        }

        const [name, email, contactNumber, paymentMethod] = clientData ?? {};

        return (
            <div className="modalbox flex h-screen w-screen justify-center items-center bg-[rgba(0,0,0,0.75)] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 ">
                <div className="rounded-md max-w-[60em] w-full z-100  h-[fit-content] bg-mswhite ">
                    <div className="relative p-3 bg-msblue2 rounded-t-md text-white text-[20px] flex justify-center items-center" >
                        <h2>{context.modalType} bill</h2>
                        
                        {context.modalType==="View" ? (
                            <AiFillCloseCircle 
                            className="absolute right-[25px] text-white hover:text-msblue1 cursor-pointer" 
                            fontSize={25} 
                            onClick={() => setIsOpen(false)} 
                            />
                        ) : 
                        null }

                    </div>

                    {
                        name.name || email.email ||contactNumber.contactNumber || paymentMethod.paymentMethod ?(
                            <div className='grid grid-cols-2 gap-3 mx-3 my-4 px-2 py-4 shadow-md'>
                                    {
                                        clientData.map(key=>(
                                        Object.keys(key).map(index=>(
                                            <>
                                            <Input 
                                                placeHolder={index} 
                                                label={index}  
                                                labelStyle={"text-xl"} 
                                                content={key[index]??'#######'}  
                                            />
                                            </>
                                        ))                            
                                    ))
                                    } 
                            </div>
                        ) : null
                    }


                    {productDetails && context.modalType == 'View'? (
                        <div className="p-3 w-full flex ">
                            <table className="table-auto w-full shadow-xl rounded-md py-3 bg-mswhite">
                                <thead>
                                    <tr>
                                        <th className="py-3 text-msgray ">Name</th>
                                        <th className="py-3 text-msgray ">Category</th>
                                        <th className="py-3 text-msgray text-center">Price</th>
                                        <th className="py-3 text-msgray text-center">Quantity</th>
                                        <th className="py-3 text-msgray text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(productDetails).map(key => (
                                            <tr id={key} className="border-0 border-t-[1px] border-msgray">

                                                {
                                                    Object.keys(productDetails[key]).map(index => (
                                                        <td className="px-3 py-3 text-msdark  text-center">
                                                            {productDetails[key][index]}
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    ) : null}

                    {
                        context.modalType == 'Delete' ? (
                            <div className="p-3 w-full flex justify-center items-center ">
                                <h2 className="text-center text-[25px] " >This will be deleted forever</h2>
                            </div>
                        ) 
                        :
                        null
                    }

                    <div className='p-3 flex justify-center items-center gap-5 ' >
                        {
                            context.modalType == 'Delete' ? (
                                <button className='py-2 px-5 bg-msblue2 hover:bg-msblue1 rounded text-white  text-[18px] '
                                    onClick={e => deleteTable(context.getId) || setIsOpen(false)} >
                                    {context.modalType}
                                </button>
                            ) : null
                        }
                        {context.modalType !=='View' ? (
                            <button className='bg-red-500 hover:bg-red-400 py-2 px-4 rounded text-white text-[18px]' 
                            onClick={() => setIsOpen(false) } 
                            > Close
                            </button>
                        ): null}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="responsive py-3 flex flex-col items-center gap-[25px]">
            <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex items-center justify-between">
                <h3>View Bills</h3>
            </div>
            <div className="container shadow-xl rounded flex flex-col bg-mswhite py-3 px-5">
                <Input placeHolder={"Search"} inputType={"search"} styleProp={"w-full"} />
            </div>

            <table className="container table-fixed shadow-xl rounded-md py-3 bg-mswhite">
                <thead className="" >
                    <tr>
                        <th className="py-3 text-msgray ">Name</th>
                        <th className="py-3 text-msgray ">Email</th>
                        <th className="py-3 text-msgray text-center">Contact Number</th>
                        <th className="py-3 text-msgray text-center">Payment Method</th>
                        <th className="py-3 text-msgray text-center">Total</th>
                        <th className="py-3 text-msgray text-center">Options</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        billList ?
                            billList.filter(item => {
                                if (context.search == '') {
                                    return item
                                } else if (item.name.toLowerCase().includes(context.search.toLowerCase())) {
                                    return item;
                                }
                            }
                            ).map((bill, index) =>
                            (
                                <tr id={index} className="border-0 border-t-[1px] border-msgray " >
                                    {
                                        Object.keys(bill).map((key, i) => (
                                            <>
                                                {
                                                    filteredList.map(filt => {
                                                        if (filt == key) return (
                                                            <td className="px-3 py-3 text-msdark  text-center">
                                                                {bill[key].length === 0 ? 'empty' : bill[key]}
                                                            </td>
                                                        )
                                                    })
                                                }
                                            </>
                                        ))
                                    }
                                    {/* {console.log(bill.uuid)} */}
                                    <td className="px-3 py-3 flex justify-center items-center text-center gap-[10px]">
                                        <AiFillEye onClick={(e) => modalHandle(bill) || context.setModalType('View')} fontSize={25}
                                            className="aling-center text-red-500 cursor-pointer" />
                                        <MdSimCardDownload onClick={(e) => { downloadBill(e, bill.uuid) }} fontSize={25}
                                            className="aling-center text-red-500 cursor-pointer" />
                                        <MdDeleteForever onClick={(e) => { modalHandle(bill.id) || context.setModalType('Delete') }} fontSize={25}
                                            className="aling-center text-red-500 cursor-pointer" />
                                    </td>
                                </tr>
                            )
                            )
                            :
                            null
                    }
                </tbody>
            </table>
            {isOpen ? (
                <Modal />
            ) : null}
        </section>
    )
}

export default Bills;