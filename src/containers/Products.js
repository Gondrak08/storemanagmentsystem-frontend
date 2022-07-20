import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../context/auth';
import { ContentContext } from '../context/content';
import { MdEdit, MdDeleteForever, MdToggleOff, MdToggleOn} from 'react-icons/md';
import {Input} from './index';

import api from '../services/api';


const Products =()=>{
    const auth = useContext(AuthContext);
    const context = useContext(ContentContext);

    useEffect(()=>{
        getProduct();
    },[]);
    useEffect(() => {
        api.get("/category/get", {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                context.setCategories(res.data)
            }
        }).catch(err => console.log(err));
    }, [])
 
    const getProduct =()=>{
        api.get("/product/get", {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                context.setProducts(res.data)
            }
        }).catch(err => console.log(err));
    }

    const addProduct =(e)=>{
        api.post("/product/add", {
            categoryId:context.category,
            name: context.name,
            description:context.description,
            price:context.price,
            quantity: context.quantity,

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
        getProduct();
    }
    
    const editProduct=(e)=>{
        if (context.getId) {
            api.patch("/product/update", {
                id: context.getId,
                categoryId:context.category,
                name: context.name,
                price:context.price,
                quantity:context.quantity,
                description:context.description

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
            getProduct();
            context.setIsOpen(false);
        }
    }

    const deleteProduct =(e)=>{
        if (context.getId) {
            api.delete(`/product/delete/${context.getId}`, {
                headers: {
                    Authorization: 'Bearer ' + auth.authToken
                }
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res)
                }
            }).catch(err => console.log(err));
            e.preventDefault();
            getProduct();
            context.setIsOpen(false);
        }
    }
    
    const statusUpdate = (e, item, value)=>{
        if(item.id){
            api.patch("/product/updateStatus", {
                id: item.id,
                status: value
            }, {
                headers: {
                    Authorization: 'Bearer ' + auth.authToken
                }
            }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data.message)
                }
            }).catch(err => console.log(err));
        }        
        getProduct();
    }

    return(
        <>
            <section className="responsive py-3 flex flex-col items-center gap-[25px]">
                
                <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex items-center justify-between">
                    <h3>Manage Products</h3>
                    <button className="bg-msblue2 hover:bg-msblue1 text-white p-3 rounded"
                        onClick={() => context.setIsOpen(!context.isOpen) || context.setModalType('Add')}>
                        Add Product
                    </button>
                </div>

                <div className="container shadow-xl rounded flex flex-col bg-mswhite py-3 px-5">
                    <Input placeHolder={"Search"} inputType={"search"} />
                </div>

                <table className="container  table-fixed shadow-xl rounded-md bg-mswhite">
                    
                    <thead>
                        <tr  >
                        <th className="py-3 text-msgray text-center ">Name</th>
                        <th className="py-3 text-msgray text-center ">Category</th>
                        <th className="py-3 text-msgray  text-center ">Description</th>
                        <th className="py-3 text-msgray text-center">Price</th>
                        <th className="py-3 text-msgray  text-center">Quantity</th>
                        <th className="py-3 text-msgray  text-center">Action</th> 
                        </tr>
                    </thead>

                    <tbody>
                    {context.products ? Object.values(context.products).filter(item=>{
                            if(context.search == ''){
                                return item;
                            }else if(item.name.toLowerCase().includes(context.search.toLowerCase())){
                                return item;
                            }
                         }

                        ).map(item => (
                        <tr id={item.id} className=" w-full  border-0 border-b-[1px] border-msgray " >
                            <td className="py-3 text-msdark text-center text-center">
                                {item.name}
                            </td>
                            <td className="py-3 text-msdark  text-center">
                                {item.categoryName}
                            </td>

                            <td className="py-3 text-msdark w-[auto] text-center">
                                {item.description}
                            </td>

                            <td className="py-3 text-msdark w-[auto] text-center">
                                $ {item.price}
                            </td>

                            <td className="py-3 text-msdark w-[auto] text-center">
                                {item.quantity}
                            </td>

                            <td className="flex py-3 gap-3 justify-center " >
                                <MdEdit onClick={() => context.setIsOpen(!context.isOpen) || context.setModalType('Edit') || context.setGetId(item.id) || context.setName(item.name) || context.setPrice(item.price) || context.setQuantity(item.quantity) || context.setCategory(item.categoryId) || context.setDescription(item.description) } fontSize={25} className="text-msblue1  cursor-pointer  text-center " />
                                <MdDeleteForever onClick={() => context.setIsOpen(!context.isOpen) || context.setModalType('Delete') || context.setGetId(item.id)} fontSize={25} className=" text-center text-red-500 cursor-pointer" />

                                <>
                                
                                {
                                    item.status == 'true' ? (
                                        <MdToggleOn  fontSize={25} className="text-center text-red-500 cursor-pointer" onClick={(e)=>  statusUpdate(e, item, "false")
                                        }/>
                                    )  :  null
                                }
                                {
                                     item.status == 'false' ? (
                                        <MdToggleOff fontSize={25} className="text-center text-gray-500 cursor-pointer" onClick={(e)=>   statusUpdate(e, item, "true")} />
                                    ):null
                                }

                                </>

                                
                            </td>
                        </tr>
                    )) : null}
                    </tbody>
                </table>

                {
                    context.isOpen ? (
                        <>
                            <div className="modalbox flex h-screen w-screen justify-center items-center bg-[rgba(0,0,0,0.75)] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 ">
                                <div className=" responsive rounded-md max-w-[50em] w-full z-100  h-[fit-content] bg-mswhite " >
                                    <div className="p-3 bg-msblue2 rounded-t-md text-white text-[20px] flex justify-center items-center" >
                                        <h2>{context.modalType} Product</h2>
                                    </div>
                                    <div className='p-3 w-full flex flex-col gap-5'>
                                        {
                                            context.modalType == 'Add' ? (
                                                <>  
                                                    <input type="text" placeholder="Name" onChange={(e) => context.setName(e.target.value)} 
                                                    className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <input text="price" placeholder="$ Price" onChange={(e) => context.setPrice(e.target.value)}
                                                        className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                        <input text="Quantity" placeholder="Quantity" onChange={(e) => context.setQuantity(e.target.value)}
                                                        className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                        <select className="options-box"  onChange={(e)=> context.setCategory(e.target.value)} >
                                                            {context.categories ? Object.values(context.categories).map(item=>(
                                                                <option key={item.id} value={item.id} >
                                                                    {item.name}
                                                                </option>
                                                            )):null}
                                                        </select>
                                                    </div>
                                                    <input text="description" placeholder="description" onChange={(e) => context.setDescription(e.target.value)}
                                                    className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                </>
                                            ) :  context.modalType == 'Edit' ? Object.values(context.products).map(item=>{
                                                if(context.getId == item.id){ 
                                                    return (
                                                        <>
                                                            <input type="text" placeholder="Name" defaultValue={item.name} onChange={(e) => context.setName(e.target.value)} 
                                                            className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <input text="price" placeholder="$ Price" defaultValue={item.price} onChange={(e) => context.setPrice(e.target.value)}
                                                                className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                                <input text="Quantity" placeholder="Quantity" defaultValue={item.quantity}  onChange={(e) => context.setQuantity(e.target.value)}
                                                                className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                                <select className="options-box" defaultValue={item.categoryId} onChange={(e)=> context.setCategory(e.target.value)} >
                                                                    {context.categories ? Object.values(context.categories).map(item=>(
                                                                        <option key={item.id} value={item.id} >
                                                                            {item.name}
                                                                        </option>
                                                                    )):null}
                                                                </select>
                                                            </div>
                                                            <input text="description" placeholder="description" defaultValue={item.description} onChange={(e) => context.setDescription(e.target.value)}
                                                            className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
                                                        </>
                                                    )
                                                }
                                            }) :
                                            context.modalType == 'Delete' ? (
                                                <>
                                                    <h2 className="text-center text-[25px] " >This will be deleted forever</h2>
                                                </>
                                            ) : (
                                                <>
                                                    <input text="name" placeholder={context.modalType} onChange={(e) => context.setName(e.target.value)}
                                                        className="w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 focus:border-0 " />
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

export default Products;