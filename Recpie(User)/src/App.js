import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Register from './Components/Register';
import ChangePassword from './Components/ChangePassword';
import UserFeed from './Components/UserFeed';
import AddRecipe from './Components/AddRecepie';
import UserProfile from './Components/UserProfile';
import ViewDetails from './Components/ViewDetails';
import LandingPage from './Components/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path='/login'element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/changepassword'element={<ChangePassword></ChangePassword>}></Route>
        <Route path='/userfeed'element={<UserFeed></UserFeed>}></Route>
        <Route path='/addrecipe/'element={<AddRecipe></AddRecipe>}></Route>
        <Route path='/addrecipe/:id'element={<AddRecipe></AddRecipe>}></Route>
        <Route path='/userprofile'element={<UserProfile></UserProfile>}></Route>
        <Route path='/viewdetails/:id'element={<ViewDetails></ViewDetails>}></Route>
      </Routes>

    </Router>
    
      
    
  );
}

export default App;
