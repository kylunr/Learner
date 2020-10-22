import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { selectUser, login, logout } from './features/userSlice';
import Login from "./components/Login";
import { auth } from './firebase';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import History from './pages/History';


function App() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email: authUser.email,
          displayName: authUser.displayName,
        }));
      } else {
        dispatch(logout());
      }
    })
  }, [user]);

  return (
    <div className="App">
      {user ? 
        <Router>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' exact component={About} />
            <Route path='/history' exact component={History} />
          </Switch>
        </Router> 
        : 
        <Login />}
    </div>
  );
}

export default App;
