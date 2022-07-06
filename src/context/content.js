
import { createContext, useState, useRef } from "react";


export const ContentContext = createContext({});


export const ContentProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [search, setSearch] = useState('');

    const[categories, setCategories] = useState(null);
    const[products, setProducts] = useState(null);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState(null)
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(null);
    const [getId, setGetId] = useState('');
    const [payment, setPayment]= useState('');

    // client register
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    return (
        <ContentContext.Provider value={{
            categories, setCategories,
            products, setProducts,
            name, setName,
            price, setPrice,
            category, setCategory,
            product, setProduct,
            description, setDescription,
            quantity, setQuantity,
            payment, setPayment,
            getId, setGetId,
            isOpen, setIsOpen,
            modalType, setModalType,
            search, setSearch,
            email, setEmail,
            contactNumber,setContactNumber
        }} >
            {children}
        </ContentContext.Provider>
    )
}



