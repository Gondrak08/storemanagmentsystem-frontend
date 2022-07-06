import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { ContentContext } from '../context/content';
import api from '../services/api';
import { MdDeleteForever,} from 'react-icons/md';
import { Input } from './index'
import { saveAs } from 'file-saver';
import fileDownload from 'js-file-download';

const Orders = () => {
    const auth = useContext(AuthContext);
    const context = useContext(ContentContext);
    const [tableContent, setTableContent]=useState([]);
    const [totalPrice, setTotalPrice]=useState('');
    const [total,setTotal]=useState('');
    const [bill, setBill]=useState([]);
    const [isDownload, setisDownload]=useState(false);


    useEffect(()=>{
        api.get("/category/get", {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                context.setCategories(res.data)
            }
        }).catch(err => console.log(err));

        context.setCategory(null);
        context.setProducts(null);
        context.setProduct(null);
        context.setName(null);
        context.setEmail(null);
        context.setQuantity(null);
    },[]);   

    const getProductByCategory=(e, id)=>{
        const getCategory = context.categories ? Object.values(context.categories).filter(item=>{if(id==item.id)return item.name}) : null;
        context.setProduct(null)
        api.get(`/product/getByCategory/${id}`, {
            headers: {
                Authorization: 'Bearer ' + auth.authToken
            }
        }).then((res) => {
            if (res.status == 200) {
                context.setProducts(res.data);
                context.setCategory(getCategory);
                getProduct();
            }
        }).catch(err => console.log(err));
    };

    const getProduct=(e,id)=>{
       api.get(`/product/getById/${id}`,{
        headers: {
            Authorization: 'Bearer ' + auth.authToken
        }
        }).then((res) => {
            if (res.status == 200) {
                context.setProduct(res.data)
            }
        }).catch(err => console.log(err));
        console.log(id)
    };

    const getQuantity=(value)=>{
        if(value=='') return (setTotal(''), setTotalPrice(''));
        else{
            const productPrice = context.product? context.product.price : null;
            const result = productPrice * value;
            setTotalPrice(result);
        }
        context.setQuantity(value);
    };

    const addTable = () =>{
        const product = context.product? context.product.name : null;
        const category=context.category?context.category[0].name: null;
        const price = context.product? context.product.price:null;
        const quantity = context.quantity??null;
        const totalVal = totalPrice ??null;

        if(product&&category&&price&&quantity&&totalVal){
            const content= {...tableContent}
            const data = {
                name:product,
                category:category,
                price:price,
                quantity:quantity,
                total:totalVal
            }
            if(content){
                let bool = false;
                const prodName = Object.values(content).map(item=>{if(product == item.name ) return bool = true})
                if(bool==true){
                    return alert('product already registerd')
                } else
                setTableContent([...tableContent, data]);
            }

        }
    };
   
    useEffect(()=>{
        let totalValue;
        let values = [];
        if(tableContent){
            const content = {...tableContent};
            Object.values(content).map(item=>{
                if(item.total){
                    values.push(item.total)
                }
            })
            totalValue = values.reduce((a,b)=>a+b,0);
           setTotal(totalValue);
        }

    },[addTable]);

    const deleteTable=(id)=>{
    console.log(id);
    const tableId = tableContent.filter((item, index)=>{if(index!=id)return item});
    setTableContent(tableId);    
    };

    const generateBill=(e)=>{ 
        const data={
            name:context.name??'',
            email:context.email??'',
            paymentMethod:context.payment??'',
            contactNumber:context.contactNumber??'',
            totalAmount:total??'',
            productDetails: JSON.stringify(tableContent)
        }
        api.post("/bill/generateReport/",data, {
            headers: {
                Authorization: 'Bearer ' + auth.authToken,
                ContentType: "application/json"
            }
        }).then((res) => {
            if (res.status == 200) {
                setBill(res.data);
                getPdf(res.data.uuid)
            }
        }).catch(err => console.log(err));
        e.preventDefault()
    }
    
    const getPdf=(uuid)=>{
        if(uuid){
            api.post("/bill/getPdf",{uuid:uuid},{
                headers:{
                    Authorization: 'Bearer ' + auth.authToken,
                    ContentType: "application/json",
                },
                responseType:"blob"
            }).then(res=>{
                if(res.status==200){
                    var blob = new Blob([res.data], { type: 'application/pdf' })
                    return saveAs(blob, uuid+".pdf");
                   
                }
            }).catch(err=>console.log(err));
        }
    }

    
    return (
        <section className="responsive py-3 flex flex-col items-center gap-[25px]">
            <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex items-center justify-between">
                <h3>Manage Order</h3>
                <button className="bg-msblue2 hover:bg-msblue1 text-white p-3 rounded"
                    onClick={(e) => {generateBill(e)} }
                    >
                    Submit & Get Bill
                </button>
            </div>

            <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex flex-col gap-3">
                <h3>Customer Details:</h3>
                <div className="grid grid-cols-4 gap-3" >
                    {["name", "email", "contact number", "payment method"].map(item => {
                        if (item == "payment method") return (
                            <select className="options-box" defaultValue={item} onChange={(e) => context.setPayment(e.target.value)} >
                                {['cash', 'credit card', 'debit card', 'pix'].map(val => (
                                    <option key={val} value={val} >
                                        {val}
                                    </option>
                                ))}
                            </select>
                        )
                        else
                            return ((
                                <Input placeHolder={item} inputType={item} />
                            ))
                    })}
                </div>
            </div>

            <div className="container rounded shadow-xl bg-mswhite py-3 px-5 flex flex-col gap-3">
                <h3>Select Product:</h3>
                <div className="grid grid-cols-5 gap-3" >
                    {["category", "product", "price", "quantity", "total"].map(item => (
                        <>
                            { item == 'category'? (
                                <select className="options-box" defaultValue={item} onChange={(e) => getProductByCategory(e, e.target.value) } >
                                    {
                                        context.categories ? Object.values(context.categories).map(option=>(
                                            <option id={option.id} value={option.id} name={option.name} >
                                                {option.name}
                                            </option>
                                        )):null
                                    }
                                </select>
                                
                            ): item == 'product' ? (
                                <select className="options-box" defaultValue={item} onChange={(e) => getProduct(e,e.target.value) }>
                                     {
                                        context.products ? Object.values(context.products).map(option=>(
                                            <>
                                            
                                            <option key={option.id} defaultValue="no product"  value={option.id} >
                                                {option.name}
                                            </option>
                                            </>
                                        )):(
                                            <option>
                                               No product
                                            </option>
                                        )
                                     }
                                </select>
                            ): item=='price' ? (
                                <Input placeHolder={item} inputType={item}  content={context.product ? context.product.price:''} />
                            ):(
                                <Input placeHolder={item} inputType={item} func={ getQuantity } content={totalPrice ? totalPrice:''} />
                            )
                            
                            }
                        </>
                    )
                    )}
                </div>
                <div className="flex justify-between items-center my-2" >
                    <button onClick={e=> addTable(e) } className={`px-3 py-2 ${context.product && context.quantity ? 'text-white bg-msblue1' : 'text-msgray bg-mslightgray' }`} >add</button>
                    <span id="total-value" className="capitalize" >total amount: {total??''}  </span>
                </div>
            </div>

            <table className="container table-fixed shadow-xl rounded-md py-3 bg-mswhite">
                <thead className="" >
                    <tr>
                        <th className="py-3 text-msgray ">Name</th>
                        <th className="py-3 text-msgray ">Category</th>
                        <th className="py-3 text-msgray text-center">Price</th>
                        <th className="py-3 text-msgray text-center">Quantity</th>
                        <th className="py-3 text-msgray text-center">Total</th>
                        <th className="py-3 text-msgray text-center">delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    tableContent ? 
                    tableContent.map((item, index) => 
                            (
                                <tr id={item}  className="border-0 border-t-[1px] border-msgray " >
                                    {
                                        Object.values(item).map(val=>(
                                            <>
                                            <td className="px-3 text-msdark  text-center">
                                                {val}  
                                            </td>
                                            
                                            </>
                                        ))
                                    }
                                    <td className="px-3  flex justify-center text-center">
                                        <MdDeleteForever onClick={(e) =>deleteTable(index) } fontSize={25} 
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
        </section>
    )
}

export default Orders;