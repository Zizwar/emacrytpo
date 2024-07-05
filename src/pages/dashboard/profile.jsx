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
    name: "Sarah Crypto",
    role: "Crypto Trader",
    walletAddress: "0x1234...5678",
    preferredExchange: "Binance",
    tradingVolume: "$50,000",
    favoriteCoin: "Ethereum",
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
    <div className="mb-4">
      <Typography variant="h6" color="blue-gray" className="mb-2">
        {label}
      </Typography>
      {isEditing[field] ? (
        <div className="flex items-center">
          <Input
            value={profileData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="mr-2"
          />
          <Button onClick={() => handleSave(field)} className="p-2">
            <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Typography>{profileData[field]}</Typography>
          <Button onClick={() => handleEdit(field)} className="p-2">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="mx-3 mt-8 mb-6 lg:mx-4 border border-blue-gray-100">
      <CardHeader className="h-48 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center">
          <Avatar
            src="/img/crypto-avatar.png"
            alt="Profile"
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
          {renderEditableField("Wallet Address", "walletAddress")}
          {renderEditableField("Preferred Exchange", "preferredExchange")}
          {renderEditableField("30-Day Trading Volume", "tradingVolume")}
          {renderEditableField("Favorite Coin", "favoriteCoin")}
        </div>
        <div className="mt-8">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Recent Transactions
          </Typography>
          {/* Здесь можно добавить компонент для отображения последних транзакций */}
        </div>
        <div className="mt-8">
          <Typography variant="h5" color="blue-gray" className="mb-4">
            Portfolio Distribution
          </Typography>
          {/* Здесь можно добавить компонент для отображения распределения портфеля */}
        </div>
      </CardBody>
    </Card>
  );
}

export default Profile;