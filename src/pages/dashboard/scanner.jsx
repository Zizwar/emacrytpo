import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Input, Select, Option } from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// بيانات وهمية للرسم البياني
const chartData = [
  { name: 'يناير', سعر: 3000 },
  { name: 'فبراير', سعر: 3500 },
  { name: 'مارس', سعر: 3200 },
  { name: 'أبريل', سعر: 3800 },
  { name: 'مايو', سعر: 4000 },
  { name: 'يونيو', سعر: 3700 },
];

// قائمة العملات الرقمية
const cryptoCurrencies = [
  { قيمة: 'BTC', اسم: 'بيتكوين' },
  { قيمة: 'ETH', اسم: 'إيثيريوم' },
  { قيمة: 'ADA', اسم: 'كاردانو' },
  { قيمة: 'BNB', اسم: 'بينانس كوين' },
  { قيمة: 'XRP', اسم: 'ريبل' },
];

export function Scanner() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [priceAlert, setPriceAlert] = useState('');
  const [currentPrice, setCurrentPrice] = useState(3700); // سعر وهمي

  useEffect(() => {
    // محاكاة تحديث السعر كل 5 ثوانٍ
    const interval = setInterval(() => {
      setCurrentPrice(prevPrice => prevPrice + (Math.random() - 0.5) * 100);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCryptoChange = (value) => {
    setSelectedCrypto(value);
  };

  const handleAlertSet = () => {
    alert(`تم تعيين التنبيه عند السعر: ${priceAlert} دولار`);
  };

  return (
    <Card className="w-full max-w-[800px] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h2" color="blue-gray" className="text-center">
          سكانر العملات الرقمية
        </Typography>
      </CardHeader>
      <CardBody>
        <div className="mb-4">
          <Select
            label="اختر العملة الرقمية"
            value={selectedCrypto}
            onChange={handleCryptoChange}
          >
            {cryptoCurrencies.map((crypto) => (
              <Option key={crypto.قيمة} value={crypto.قيمة}>
                {crypto.اسم}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mb-4">
          <Typography variant="h4" color="blue-gray" className="mb-2">
            السعر الحالي: {currentPrice.toFixed(2)} دولار
          </Typography>
        </div>
        <div className="mb-4">
          <Input
            type="number"
            label="تعيين تنبيه السعر"
            value={priceAlert}
            onChange={(e) => setPriceAlert(e.target.value)}
          />
          <Button className="mt-2" onClick={handleAlertSet}>
            تعيين التنبيه
          </Button>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="سعر" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
      <CardFooter>
        <Typography variant="small" className="text-center">
          آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
        </Typography>
      </CardFooter>
    </Card>
  );
}

export default Scanner;