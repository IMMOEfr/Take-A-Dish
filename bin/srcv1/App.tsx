import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import { LandingPage } from './pages/landing page/landing-page';
import { Menu } from './pages/menu/menu';
import { CreateItem } from './pages/staff/create-item/create-item';
import { Cart } from './pages/user/cart';
import { TableManager } from './pages/staff/tablepage/table-manager';
import { PasswordReset } from './pages/staff/password-reset';
import { Navbar } from './components/navbar';
import { Status } from './pages/user/order-status';
import { EditItem } from './pages/staff/edit-item/edit-item';
import { CREATEROUTE, MENUROUTE, HOME, CARTROUTE, STATUSROUTE, TABLEROUTE, PASSWORDROUTE, EDITROUTE, ENDROUTE, STAFFTABLEROUTE } from './lib/routes';
import { EditForm } from './pages/staff/edit-item/edit-form';
import { ItemContext, ItemContextProvider } from './components/ItemContext';
import { LoadingIcon } from './components/LoadingIcon';
import { useEffect, useState } from 'react';
import React from 'react';
import { EndingPage } from './pages/user/ending-page';
import { TableOverview } from './pages/staff/tablepage/table-overview';
// import { TableForm } from './components/modals/TableForm';



function App() {
  const [isLoading, setIsLoadingState] = useState<boolean>(false); 
  const wrapNavbar = (componentIN: JSX.Element) => {
    return (
      <>
        {isLoading && <LoadingIcon loading = {isLoading}/>}
        <Navbar />
        {React.cloneElement(componentIN, {handleLoadProp: setIsLoadingState})}
        {/* {componentIN} */}
      </>
    );
  }

  const setIsLoading = (isLoading: boolean) => {
    setIsLoadingState(isLoading);
  };

  return (
    <div className="App"> 
      <ItemContextProvider>
        <Router>
          <Routes>
            <Route path = {HOME} element={<LandingPage/>}/>
            <Route path = {MENUROUTE} element={wrapNavbar(<Menu handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {CREATEROUTE} element={wrapNavbar(<CreateItem handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {CARTROUTE} element={wrapNavbar(<Cart handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {STATUSROUTE} element={<Status/>}/>
            <Route path = {TABLEROUTE} element={wrapNavbar(<TableManager handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {STAFFTABLEROUTE} element={wrapNavbar(<TableOverview handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {PASSWORDROUTE} element={wrapNavbar(<PasswordReset handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {EDITROUTE} element={wrapNavbar(<EditItem handleLoadProp = {setIsLoading}/>)}/>
            <Route path = {ENDROUTE} element={<EndingPage/>}/>
          </Routes>
        </Router>
      </ItemContextProvider>
    </div>
  );
}

export default App;

 // const wrapContext = (componentIN: JSX.Element) => {
  //   return (
  //     <>
  //       <ItemContextProvider>
  //         {componentIN}
  //       </ItemContextProvider>
  //     </>
  //   )
  // }