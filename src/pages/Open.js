import { Login } from '../containers';
const OpenPage = ({authenticate})=>{

    return(
        <section className="w-screen h-screen">
            <Login authenticate={authenticate}/>
        </section>
    )
}

export default OpenPage;