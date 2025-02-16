import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import CreateListing from './Pages/CreateListing.js'
import Search from './Pages/Search.js';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Listing from './Pages/Listing.js'
import Header from './Components/Header.js';
import Profile from './Components/Profile.js';
import PrivateRoute from './Components/Private.js';
import About from './Pages/About.js';
function App() {
return(
  <BrowserRouter>  
  <Header />
  <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
      </Routes>
   </BrowserRouter>
)
}

export default App;
