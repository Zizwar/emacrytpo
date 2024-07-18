import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export function Profile() {
  const [isEditing, setIsEditing] = useState({});
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zip: "",
    },
    roles: [],
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const token = localStorage.getItem('token') || getCookie('token');
    if (!token) {
      window.location.href = '/auth/sign-in';
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async (field) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    
    const token = localStorage.getItem('token') || getCookie('token');
    if (!token) {
      window.location.href = '/auth/sign-in';
      return;
    }

    try {
      const response = await fetch('/api/user/?method=update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          [field]: profileData[field],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile data');
      }

      // Handle successful update
      console.log(`Successfully updated ${field}`);
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderEditableField = (label, field) => (
    <div className="mb-4 text-right">
      <Typography variant="h6" color="blue-gray" className="mb-2">
        {label}
      </Typography>
      {isEditing[field] ? (
        <div className="flex items-center justify-end">
          <Button onClick={() => handleSave(field)} className="p-2 ml-2">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Input
            value={profileData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="text-right"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Button onClick={() => handleEdit(field)} className="p-2">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Typography>{profileData[field]}</Typography>
        </div>
      )}
    </div>
  );

  const renderAddressField = (label, field) => (
    <div className="mb-4 text-right">
      <Typography variant="h6" color="blue-gray" className="mb-2">
        {label}
      </Typography>
      {isEditing[`address.${field}`] ? (
        <div className="flex items-center justify-end">
          <Button onClick={() => handleSave(`address.${field}`)} className="p-2 ml-2">
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Input
            value={profileData.address[field]}
            onChange={(e) => handleChange(`address.${field}`, e.target.value)}
            className="text-right"
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Button onClick={() => handleEdit(`address.${field}`)} className="p-2">
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Typography>{profileData.address[field]}</Typography>
        </div>
      )}
    </div>
  );

  return (
    <Card className="mx-3 mt-8 mb-6 lg:mx-4 border border-blue-gray-100" dir="rtl">
      <CardHeader className="h-48 bg-gradient-to-l from-blue-500 to-purple-500">
        <div className="absolute bottom-0 right-0 left-0 transform translate-y-1/2 flex justify-center">
          <Avatar
            src={profileData.image}
            alt="الصورة الشخصية"
            size="xxl"
            className="border-4 border-white"
          />
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="mb-10 text-center">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {`${profileData.firstname} ${profileData.lastname}`}
          </Typography>
          <Typography variant="lead" color="blue-gray" className="font-normal">
            {profileData.roles.map(role => role.role.name).join(', ')}
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderEditableField("الاسم الأول", "firstname")}
          {renderEditableField("الاسم الأخير", "lastname")}
          {renderEditableField("اسم المستخدم", "username")}
          {renderEditableField("البريد الإلكتروني", "email")}
          {renderEditableField("رقم الهاتف", "phone")}
          {renderAddressField("الشارع", "street")}
          {renderAddressField("المدينة", "city")}
          {renderAddressField("الرمز البريدي", "zip")}
        </div>
      </CardBody>
    </Card>
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default Profile;