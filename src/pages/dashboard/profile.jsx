import React, { useState } from 'react';
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
    name: "سارة كريبتو",
    role: "متداولة عملات رقمية",
    walletAddress: "0x1234...5678",
    preferredExchange: "بينانس",
    tradingVolume: "50,000$",
    favoriteCoin: "إيثيريوم",
  });

  const handleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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

  return (
    <Card className="mx-3 mt-8 mb-6 lg:mx-4 border border-blue-gray-100" dir="rtl">
      <CardHeader className="h-48 bg-gradient-to-l from-blue-500 to-purple-500">
        <div className="absolute bottom-0 right-0 left-0 transform translate-y-1/2 flex justify-center">
          <Avatar
            src="/api/placeholder/150/150"
            alt="الصورة الشخصية"
            size="xxl"
            className="border-4 border-white"
          />
        </div>
      </CardHeader>
      <CardBody className="p-4">
        <div className="mb-10 text-center">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {profileData.name}
          </Typography>
          <Typography variant="lead" color="blue-gray" className="font-normal">
            {profileData.role}
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderEditableField("عنوان المحفظة", "walletAddress")}
          {renderEditableField("المنصة المفضلة", "preferredExchange")}
          {renderEditableField("حجم التداول (آخر 30 يوم)", "tradingVolume")}
          {renderEditableField("العملة المفضلة", "favoriteCoin")}
        </div>
        <div className="mt-8">
          <Typography variant="h5" color="blue-gray" className="mb-4 text-right">
            آخر المعاملات
          </Typography>
          {/* هنا يمكن إضافة مكون لعرض آخر المعاملات */}
        </div>
        <div className="mt-8">
          <Typography variant="h5" color="blue-gray" className="mb-4 text-right">
            توزيع المحفظة
          </Typography>
          {/* هنا يمكن إضافة مكون لعرض توزيع المحفظة */}
        </div>
      </CardBody>
    </Card>
  );
}

export default Profile;