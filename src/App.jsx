import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import "./style.css";
import UserProfile from './UserProfile';
import AdminDashboard from './admindashboard';
import UserDashboard from './userdashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddBook from './components/AddBook';
import UpdateBook from './components/UpdateBook';
import DeleteBook from './components/DeleteBook';
import AddCategory from './components/AddCategory';
import GetCategory from './components/GetCategory';
import GetBook from './components/GetBook'
import DeleteCategory from './components/DeleteCategory';
import GetReservations from './components/GetReservations';
import GetBorrowedBooks from './components/GetBorrowedBooks';
import BorrowBooks from './components/BorrowBooks';
import MyBorrows from './components/MyBorrows';
import ReserveBooks from './components/ReserveBooks';

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />

        <Route path="/admindashboard" element={ <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>} />
        <Route path="/GetBook" element={<GetBook />} />
        <Route path="/admin/AddBook" element={<AddBook />} />
         <Route path="/admin/UpdateBook" element={<UpdateBook />} />
         <Route path="/admin/DeleteBook" element={<DeleteBook />} />

         <Route path="/GetCategory" element={<GetCategory />} />
        <Route path="/admin/AddCategory" element={<AddCategory />} />
        <Route path="/admin/DeleteCategory" element={<DeleteCategory/>}
         />
         <Route path="/admin/GetReservations" element={<GetReservations/>} />
         <Route path="/admin/GetBorrowedBooks" element={<GetBorrowedBooks/>} />
        <Route path="/userdashboard" element={<ProtectedRoute allowedRoles={["ROLE_USER"]}>
            <UserDashboard />
          </ProtectedRoute>
} />
         <Route path="/BorrowBooks" element={<BorrowBooks />} />
         <Route path="/MyBorrows" element={<MyBorrows />} />
         <Route path="/ReserveBooks" element={<ReserveBooks />} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
