
import { useEffect, useState, useContext } from 'react';
import { AuthProvider, AuthContext} from './context/auth'
import { ContentProvider} from './context/content'

import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard, Categories, Products, Orders, Bills, Users } from './containers';


import Open from './pages/Open';
import Private from './pages/Private';
import './Global.css';

function App() {
  const [user, setUser ] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useContext(AuthContext) 

 
  useEffect(()=>{
    const u = localStorage.getItem("user");
    u && JSON.parse(u) ? setUser(true) : setUser(false);
  },[]);


  useEffect(()=>{
   localStorage.getItem("user", user);
  },[user]);
  // console.log(auth.userRole);

  return (
    <AuthProvider>
      <ContentProvider>
        <div>
          <Router>
            <Routes>
              {!user && (
                <Route path="/" element={<Open authenticate={ () => setUser(true) } />} />
              )}
              {user &&(            
                  <Route path="private" element={<Private authenticate={()=> setUser(false)}/>} >
                    <Route path="dashboard"  element={<Dashboard/>}/>
                    <Route path="category"  element={<Categories/>}/>
                    <Route path="product"  element={<Products/>}/>
                    <Route path="order"  element={<Orders/>}/>
                    <Route path="bill"  element={<Bills/>}/>
                    <Route path="user"  element={<Users/>}/>
                    <Route path=":id"  element={<Dashboard/>}/>
                  </Route>
              )}


              
              <Route path="*" element={<Navigate to={user ? "private" : "/"} />} />
            </Routes>
          </Router>
        </div>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;
