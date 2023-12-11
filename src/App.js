import React from 'react';
import Login from './components/login';
import Home from './components/home';
import Todos from './components/todos';
import Posts from './components/posts';
import Comments from './components/comments';
import Albums from './components/albums';
import Photos from './components/photos';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return <Router>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/user/:userId' element={<Home />} />
      <Route path='/user/:userId/todos' element={<Todos />} />
      <Route path='/user/:userId/posts' element={<Posts />} />
      <Route path='/user/:userId/posts/:postId/comments' element={<Comments />} />
      <Route path='/user/:userId/albums' element={<Albums />} />
      <Route path='/user/:userId/albums/:albumId/photos' element={<Photos />} />
    </Routes>
  </Router>
}

export default App;

