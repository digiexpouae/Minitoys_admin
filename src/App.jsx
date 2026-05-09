import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Order from './components/Order/order'
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Project from "./pages/project";
import Settings from "./pages/setting";
import Services from "./components/services";
import Modules from "./pages/module";
import { LoginUser } from "./redux/Authslice.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ManageProducts from "./components/Product/manageProduct";
import AddProduct from "./components/Product/addProduct";
import AddCategory from "./components/category/category";
import ManageCategory from "./components/category/manageCategory";
import ManageSeller from './components/Seller/seller'
import Cookie from 'js-cookie'
import ProtectedRoute from "./components/auth/protectedRoute";
import AddSeller from "./components/Seller/addSelller";
import AdminProtectedroute from './components/auth/adminProtectedRoute'
import BulkProduct from './components/Product/addbulkProduct'
export default function App() {




  return (
    <>

      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* <Route element={<ProtectedRoute />}> */}
            <Route index path="/" element={<ProtectedRoute><Home /> </ProtectedRoute>} />

            {/* Others Page */}
            <Route path="/profile" element={<ProtectedRoute><UserProfiles /> </ProtectedRoute>} />

            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/project" element={<ProtectedRoute> <Project /></ProtectedRoute>} />
            <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path='/manage-products' element={<ProtectedRoute><ManageProducts /> </ProtectedRoute>} />
            <Route path="/update-product/:slug" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path="/add-bulk-products" element={<ProtectedRoute><BulkProduct /> </ProtectedRoute>} />

            <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />

            <Route path="/add-category" element={<AdminProtectedroute><AddCategory /></AdminProtectedroute>} />
            <Route path="/update-category/:id" element={<AdminProtectedroute><AddCategory /></AdminProtectedroute>} />
            <Route path="/manage-category" element={<ProtectedRoute><ManageCategory /> </ProtectedRoute>} />
            <Route path="manage-seller" element={<AdminProtectedroute><ManageSeller /></AdminProtectedroute>} />
            <Route path="/add-seller" element={<AdminProtectedroute><AddSeller /></AdminProtectedroute>} />
            <Route path="/update-seller/:id" element={<AdminProtectedroute><AddSeller /></AdminProtectedroute>} />


          </Route>
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>

    </>)
}
