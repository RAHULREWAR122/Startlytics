'use client'
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Edit3, Save, X, LogOut, Building } from 'lucide-react';

export default function UserDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
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

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData) {
        setUserDetails({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          location: userData.location || '',
          dateOfBirth: userData.dateOfBirth || '',
          jobTitle: userData.jobTitle || '',
          company: userData.company || '',
          bio: userData.bio || '',
          website: userData.website || '',
          linkedin: userData.linkedin || '',
          startupType: userData.startupType || ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempDetails(userDetails);
  };

  const handleSave = () => {
    setUserDetails(tempDetails);
    setIsEditing(false);
    
    try {
      const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
      const updatedUserData = { ...currentUserData, ...tempDetails };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleCancel = () => {
    setTempDetails(userDetails);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    alert("Logout successful");
      window.location.href = '/';
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

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <br />
      <br />
      <br />
      <br />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-white text-3xl font-bold">
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Full Name"
                    />
                  ) : (
                    userDetails.name || 'User'
                  )}
                </h2>
                {(shouldDisplayField(userDetails.jobTitle) || isEditing) && (
                  <p className="text-purple-300 text-lg mt-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempDetails.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className="bg-white/10 border border-purple-500/30 rounded-lg px-3 py-1 text-purple-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Job Title"
                      />
                    ) : (
                      userDetails.jobTitle
                    )}
                  </p>
                )}
                {shouldDisplayField(userDetails.startupType) && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                    {userDetails.startupType}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors border border-green-500/30"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/30"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-purple-300 font-medium">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email address"
                />
              ) : (
                <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                  {userDetails.email}
                </p>
              )}
            </div>

           {(shouldDisplayField(userDetails.phone) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                ) : (
                  <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    {userDetails.phone}
                  </p>
                )}
              </div>
            )}

            {(shouldDisplayField(userDetails.location) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempDetails.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Location"
                  />
                ) : (
                  <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    {userDetails.location}
                  </p>
                )}
              </div>
            )}

            {(shouldDisplayField(userDetails.dateOfBirth) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>Date of Birth</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={tempDetails.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    {new Date(userDetails.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            {(shouldDisplayField(userDetails.company) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium">
                  <Building className="w-4 h-4" />
                  <span>Company</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempDetails.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company name"
                  />
                ) : (
                  <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    {userDetails.company}
                  </p>
                )}
              </div>
            )}

            {(shouldDisplayField(userDetails.website) || isEditing) && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-purple-300 font-medium">
                  <span>Website</span>
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={tempDetails.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Website URL"
                  />
                ) : (
                  <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
                    <a href={userDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                      {userDetails.website}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>

          {(shouldDisplayField(userDetails.bio) || isEditing) && (
            <div className="mt-6 space-y-2">
              <label className="text-purple-300 font-medium">Bio</label>
              {isEditing ? (
                <textarea
                  value={tempDetails.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-white bg-white/5 rounded-lg px-4 py-3 border border-white/10">
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