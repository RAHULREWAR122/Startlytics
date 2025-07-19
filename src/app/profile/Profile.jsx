'use client'
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit3, Save, X, LogOut, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { removeUser , removeToken } from '@/components/Redux/AuthSlice';
import { useSelector } from 'react-redux';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice';
import { useThemeColor } from '@/hooks/themeColors';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setuserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    jobTitle: '',
    company: '',
    bio: '',
    website: '',
    linkedin: '',
    startupType: ''
  });

  const [tempDetails, setTempDetails] = useState(userDetails);
  const route = useRouter();
  
  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
  const {background , text } = useThemeColor();   
  
  // Load Redux data from localStorage on component mount
  useEffect(()=>{
    dispatch(loadTokenFromLocalStorage())
    dispatch(loadUserFromLocalStorage())
  },[dispatch])

  // Update userDetails when Redux user data changes
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      const updatedDetails = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth || '',
        jobTitle: user.jobTitle || '',
        company: user.company || '',
        bio: user.bio || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        startupType: user.startupType || ''
      };
      setuserDetails(updatedDetails);
    }
  }, [user]);

  // Redirect if no token
  useEffect(() => {
    if (token === null || token === undefined || token === '' || !user?.email) {
      route.push('/');
    }
  }, [token, route]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempDetails(userDetails);
  };

  const handleSave = () => {
    setuserDetails(tempDetails);
    setIsEditing(false);

    if (typeof window !== 'undefined') {
      try {
        const currentUserData = user || {};
        const updatedUserData = { ...currentUserData, ...tempDetails };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  const handleCancel = () => {
    setTempDetails(userDetails);
    setIsEditing(false);
  };

  const handleLogout = () => {
    dispatch(removeToken())
    dispatch(removeUser())
    setTimeout(()=>{
      route.push('/')
    },300)
  };

  const handleInputChange = (field, value) => {
    setTempDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const shouldDisplayField = (value) => {
    return value && value.trim() !== '';
  };

  // Show loading or redirect if no token
  if (!token) {
    return <div style={{background : background.primary , color : text.primary}} className="min-h-screen flex items-center justify-center">
      <div className="text-white">Redirecting...</div>
    </div>;
  }

  return (
    <div style={{background : background.primary}} className="min-h-screen p-2 sm:p-4 lg:p-6">
      {/* Spacing for fixed navbar */}
      <div className="h-16 sm:h-20 lg:h-24"></div>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            
            {/* User Info Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h2 style={{color : text.secondary}} className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.name}
                      style={{color : text.secondary}}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 text-sm sm:text-base lg:text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                  ) : (
                    userDetails.name || 'User'
                  )}
                </h2>
                
                {(shouldDisplayField(userDetails.jobTitle) || isEditing) && (
                  <p className="text-purple-300 text-sm sm:text-base lg:text-lg mt-2">
                    {isEditing ? (
                      <input
                        type="text"
                        style={{color : text.secondary}}
                        value={tempDetails.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-1 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Job Title"
                      />
                    ) : (
                      userDetails.jobTitle
                    )}
                  </p>
                )}
                
                {shouldDisplayField(userDetails.startupType) && (
                  <span style={{color : text.secondary}} className="inline-block mt-2 px-2 py-1 sm:px-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 text-xs sm:text-sm rounded-full border border-blue-500/30">
                    {userDetails.startupType}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 sm:px-4 text-sm rounded-lg transition-colors border border-red-500/30 w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 text-sm rounded-lg transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 sm:px-4 text-sm rounded-lg transition-colors border border-green-500/30 w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 sm:px-4 text-sm rounded-lg transition-colors border border-red-500/30 w-full sm:w-auto"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-purple-300 font-medium text-sm sm:text-base">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempDetails.email}
                  style={{color : text.secondary}}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email address"
                />
              ) : (
                <p style={{color : text.secondary}} className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base break-all">
                  {userDetails.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            {(shouldDisplayField(userDetails.phone) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium text-sm sm:text-base">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempDetails.phone}
                    style={{color : text.secondary}}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                ) : (
                  <p style={{color : text.secondary}} className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base">
                    {userDetails.phone}
                  </p>
                )}
              </div>
            )}

            {/* Location Field */}
            {(shouldDisplayField(userDetails.location) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium text-sm sm:text-base">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    style={{color : text.secondary}}
                    value={tempDetails.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Location"
                  />
                ) : (
                  <p style={{color : text.secondary}} className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base">
                    {userDetails.location}
                  </p>
                )}
              </div>
            )}

            {/* Date of Birth Field */}
            {(shouldDisplayField(userDetails.dateOfBirth) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium text-sm sm:text-base">
                  <Calendar className="w-4 h-4" />
                  <span>Date of Birth</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={tempDetails.dateOfBirth}
                    style={{color : text.secondary}}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p style={{color : text.secondary}} className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base">
                    {new Date(userDetails.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {/* Company Field */}
            {(shouldDisplayField(userDetails.company) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium text-sm sm:text-base">
                  <Building className="w-4 h-4" />
                  <span>Company</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempDetails.company}
                    style={{color : text.secondary}}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company name"
                  />
                ) : (
                  <p style={{color : text.secondary}} className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base">
                    {userDetails.company}
                  </p>
                )}
              </div>
            )}

            {/* Website Field */}
            {(shouldDisplayField(userDetails.website) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium text-sm sm:text-base">
                  <span>Website</span>
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={tempDetails.website}
                    style={{color : text.secondary}}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Website URL"
                  />
                ) : (
                  <p className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base">
                    <a 
                      style={{color : text.secondary}} 
                      href={userDetails.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                    >
                      {userDetails.website}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bio Field - Full Width */}
          {(shouldDisplayField(userDetails.bio) || isEditing) && (
            <div className="mt-4 sm:mt-6 space-y-2">
              <label className="text-purple-300 font-medium text-sm sm:text-base">Bio</label>
              {isEditing ? (
                <textarea
                  value={tempDetails.bio}
                  style={{color : text.secondary}}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p style={{color : text.secondary}} className="bg-white/5 rounded-lg px-3 py-2 sm:px-4 sm:py-3 border border-white/10 text-sm sm:text-base leading-relaxed">
                  {userDetails.bio}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}