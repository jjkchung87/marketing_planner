import React, {useState, useEffect} from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainNavBar from './components/MainNavBar';
import Drawer from './components/Drawer';
import './App.css';
import Campaign from './pages/campaign-manager/CampaignManager';
import CampaignManager from './pages/campaign-manager/CampaignManager';
import MarketingPlannerApi from './api';
import useLocalStorageState from './hooks/useLocalStorageState';
import LoadingSpinner from './components/LoadingSpinner';
import { CurrentUserType, SignupFormDataType, LoginFormDataType } from './types/types';
import { decodeToken} from 'react-jwt';
import Signup from './pages/signup/signup';

// Define the expected structure of your decoded token
interface DecodedToken {
  username: string;
  // Add other properties from your token here as needed
}

const App: React.FC = () => {
  const [infoLoaded, setInfoLoaded] = useState(false); // has user data been pulled from API?
  const [currentUser, setCurrentUser] = useState<CurrentUserType>(null);
  const [token, setToken] = useLocalStorageState<string | null>("token", null);
  const navigate = useNavigate(); // used to navigate to different routes
  
  /******************************************************************************************************
    Debug Info: infoLoaded, currentUser, token
  *******************************************************************************************************/
  console.debug(
    "App",
    "infoLoaded=", infoLoaded,
    "currentUser=", currentUser,
    "token=", token,
  );

  /******************************************************************************************************
    Load User Info. Until a user is logged in and they have a token, this should not run. 
    It only needs to re-run when a user logs out, so the value of the token is a dependency for this effect.
  *******************************************************************************************************/
    useEffect(function loadUserInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);
    
      async function getCurrentUser() {
        if (token) {
          try {
            const decoded = decodeToken<DecodedToken>(token); // Use the generic parameter to specify the expected shape
            if (decoded) {
              const { username } = decoded;
              // put the token on the Api class so it can use it to call the API.
              MarketingPlannerApi.token = token;
              const currentUser = await MarketingPlannerApi.getCurrentUser(username);
              setCurrentUser(currentUser);
            }
          } catch (err) {
            console.error("App loadUserInfo: problem loading", err);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }
  
      // set infoLoaded to false while async getCurrentUser runs; once the
      // data is fetched (or even if an error happens!), this will be set back
      // to false to control the spinner.
      setInfoLoaded(false);
      getCurrentUser();
    }, [token]);


  
  /******************************************************************************************************
   Handle Signup   
   *******************************************************************************************************/

  const handleSignup = async (data: SignupFormDataType) => {
    try {
      let token = await MarketingPlannerApi.signup(data);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /******************************************************************************************************
   Handle Login   
   *******************************************************************************************************/
  
   // Handle login. If successful returns { success: true } otherwise { success: false, errors: string[] }
   const handleLogin = async (data: LoginFormDataType) => {
    try {
      let token = await MarketingPlannerApi.login(data);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  /******************************************************************************************************
   Handle Logout
   *******************************************************************************************************/

   const handleLogout = () => {
    setToken(null)
    setCurrentUser(null)
    navigate('/')
   }

  /******************************************************************************************************
    Loading Spinner. Will run until infoLoaded is true.  
   *******************************************************************************************************/

  if (!infoLoaded) return <LoadingSpinner />;


  return (
    <div className="App">
      <Drawer />
      <Routes>
        <Route path="/campaigns" element={<CampaignManager />} />
        <Route path="/campaigns/:id" element={<Campaign />} />
        <Route path="/signup" element={<Signup handleSignup={handleSignup} />} />
      </Routes>
    </div>
  );
};

export default App;
