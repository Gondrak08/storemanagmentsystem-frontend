import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { ContentContext } from '../context/content';
import api from '../services/api'

import { MdEdit, MdDeleteForever } from 'react-icons/md';

import {Input} from './index'


const Categories = () => {
    const auth = useContext(AuthContext);
    const context = useContext(ContentContext)

    useEffect(() => {
        getCategory()
    }, [])
    
    const getCategory =()=>{
        api.get("/category/get", {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                context.setCategories(res.data)
            }
        }).catch(err => console.log(err));
    }

    const addProduct = (e) => {
        api.post("/category/add", {
            name: context.name
        }, {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                console.log(res)
            }
        }).catch(err => console.log(err));
        e.preventDefault();
        getCategory();
    }


    const editProduct = (e) => {
        if (context.getId) {
            api.patch("/category/update", {
                id: context.getId,
                name: context.name
            }, {
                headers: {
                    Authorization: 'Bearer ' + auth.authToken
                }
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data.message)
                }
            }).catch(err => console.log(err));
            e.preventDefault();
            getCategory();
            context.setIsOpen(false);
        }
    }

    const deleteProduct = (e) => {
        if (context.getId) {
            api.delete(`/category/delete/${context.getId}`, {
                headers: {
                    Authorization: 'Bearer ' + auth.authToken
                }
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res)
                }
            }).catch(err => console.log(err));
            e.preventDefault();
            getCategory();
            context.setIsOpen(false);
        }
    }

   


    return (
        <>
            <section className="responsive py-3 flex flex-col items-center gap-[25px]">
                <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex items-center justify-between">
                    <h3>Manage Categories</h3>
                    <button className="bg-msblue2 hover:bg-msblue1 text-white p-3 rounded"
                        onClick={() => context.setIsOpen(!context.isOpen) || context.setModalType('Add')}>
                        Add Category
                    </button>
                </div>
                <div className="container shadow-xl rounded flex flex-col bg-mswhite py-3 px-5">
                    <Input placeHolder={"Search"} inputType={'search'} />
                </div>

                <table className="container table-fixed shadow-xl rounded-md py-3 bg-mswhite">
                    <thead className="" >
                        <tr>
                        <th className="py-3 text-msgray ">Name</th>
                        <th className="py-3 text-msgray ">Eidt</th>
                        <th className="py-3 text-msgray text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                    {context.categories ? Object.values(context.categories).filter(item=>{
                            if(context.search == ''){
                                return item;
                            }else if(item.name.toLowerCase().includes(context.search.toLowerCase())){
                                return item;
                            }
                        }
                    ).map(item => (
                        <tr id={item.id} className="  border-0 border-t-[1px] border-msgray " >
                            <td className="px-3 text-msdark  text-center">{item.name}</td>
                            <td align="center" className="py-3" >
                                <MdEdit onClick={() => context.setIsOpen(!context.isOpen) || context.setModalType('Edit') || context.setGetId(item.id)} fontSize={25} className="text-msblue1  cursor-pointer text-center " />
                            </td>
                            <td align="center" className="py-3" >
                            <MdDeleteForever onClick={() => context.setIsOpen(!context.isOpen) || context.setModalType('Delete') || context.setGetId(item.id)} fontSize={25} className=" text-red-500 cursor-pointer" />    
                            </td>

                        </tr>
                    )) : null}
                    </tbody>
                </table>
                {
                    context.isOpen ? (
                        <>
                            <div className="modalbox flex h-screen w-screen justify-center items-center bg-[rgba(0,0,0,0.75)] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 ">
                                <div className=" responsive rounded-md max-w-[50em] w-full z-100  h-[13em] bg-mswhite " >
                                    <div className="p-3 bg-msblue2 rounded-t-md text-white text-[20px] flex justify-center items-center" >
                                        <h2>{context.modalType} Category</h2>
                                    </div>
                                    <div className='p-3 w-full'>
                                        {
                                            context.modalType == 'Delete' ? (
                                                <>
                                                    <h2 className="text-center text-[25px] " >This will be deleted forever</h2>
                                                </>
                                            ) : context.modalType == 'Edit' ? Object.values(context.categories).map(item=>{
                                                if(context.getId == item.id){
                                                    return(
                                                        <>
                                                        <Input styleProp={'w-full'} placeHolder={context.modalType} content={item.name} />
                                                        </>
                                                    )
                                                }
                                            }) : (
                                                <>
                                                    <Input styleProp={'w-full'} placeHolder={context.modalType} />
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className='p-3 flex justify-center items-center gap-5 ' >
                                        <button className='py-2 px-5 bg-msblue2 hover:bg-msblue1 rounded text-white  text-[18px] '
                                            onClick={
                                                context.modalType == 'Edit' ? (e) => editProduct(e) :
                                                context.modalType == 'Add' ? (e) => addProduct(e) :
                                                context.modalType == 'Delete' ? (e) => deleteProduct(e) :
                                                            null} >
                                            {context.modalType}
                                        </button>
                                        <button className='bg-red-500 hover:bg-red-400 py-2 px-4 rounded text-white text-[18px]' onClick={() => context.setIsOpen(false)} >Close</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null
                }
            </section>
        </>
    )
}

export default Categories;