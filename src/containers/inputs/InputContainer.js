import React,{useContext, useEffect} from 'react';
import { ContentContext } from '../../context/content';

const Input =({styleProp, placeHolder, content, inputType,label,labelStyle, func})=>{
    const context = useContext(ContentContext);
    // console.log({styleProp, placeHolder, content, inputType,label, func});
    return(
        <div className='w-full relative'>
            {label?(
                <label className={`${labelStyle??null}`} >
                    {label == "name" ? 
                    "product"+" "+ label 
                    : 
                    label=='total' ? 
                    label +" "+ "value" 
                    : 
                    label }
                </label>
            ):null
            }
            <input type="text" 
            defaultValue={content??null}
            value={
                inputType == 'Search' ? context.search : 
                inputType=='price'? content :
                inputType=='total'? content : 
                null}     
            placeholder={placeHolder??null}
            onChange={(e) => 
                inputType == 'search' ? context.setSearch(e.target.value) : 
                inputType == 'email' ? context.setEmail(e.target.value) : 
                inputType == 'contact number' ? context.setContactNumber(e.target.value) : 
                inputType == 'quantity' ? func(e.target.value) 
                :
                context.setName(e.target.value)
            }
            className={`${styleProp ?? null} w-full rounded-t border-0 border-b-[2px] border-msblue2 bg-mslightgray p-2 placeholder:capitalize `}/>
        </div>
    )
}

export default Input;