import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import AddBlogPage from "./pages/AddBlog";
import BlogIdPage from "./pages/BlogId";
import BlogPage from "./pages/Blogs";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AuthProvider from "./providers/auth-provider";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import DashBoard from "./pages/DashBoard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/blog/:id" element={<BlogIdPage />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/addblog" element={<AddBlogPage />} />
          </Route>
          <Route path="/" element={<AdminRoute />}>
            <Route path="/dashboard" element={<DashBoard />} />
          </Route>
          
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
