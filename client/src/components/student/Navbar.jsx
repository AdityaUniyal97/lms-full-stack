import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCoursesListPage = location.pathname.includes('/course-list');
  const { backendUrl, isEducator, setIsEducator, getToken } = useContext(AppContext);
  const { user } = useUser();
  const { openSignIn } = useClerk(); 
  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setIsEducator(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between px-4 sm:px-10 md:px-14 lg:px-24 py-4 ${
        isCoursesListPage ? 'bg-white shadow-md' : 'bg-cyan-100/70'
      } transition-all duration-300`}
    >
      {/* Logo & Branding */}
      <div
        onClick={() => navigate('/')}
        className="flex items-center gap-3 cursor-pointer transition-all hover:scale-105"
      >
        <img
          src={assets.logo}
          alt="StudyNotion Logo"
          className="w-14 h-14 rounded-full animate-pulse hover:rotate-6 transition-all duration-500"
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-gray-800 leading-none">StudyNotion</h1>
          <span className="text-sm text-blue-500 font-bold tracking-wide animate-bounce">
            By Aditya Uniyal
          </span>
        </div>
      </div>

      {/* About / Tagline */}
      <div className="hidden md:flex flex-col text-center space-y-1">
        <span className="text-lg text-gray-700 font-extrabold animate-fadeInUp">
          Learn. Grow. Succeed.
        </span>
        <span className="text-sm text-gray-500 font-medium">
          Marketplace for Students & Educators
        </span>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4 text-gray-700">
        {user && (
          <>
            <button
              onClick={becomeEducator}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm hover:scale-105 transition-transform"
            >
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <Link
              to="/my-enrollments"
              className="text-sm font-medium hover:text-blue-600 transition-all"
            >
              My Courses
            </Link>
          </>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()} // This will now open the sign-in popup
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition-all"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
