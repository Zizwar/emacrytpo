import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";

const cryptoPairs = ["BTC/USDT", "ETH/USDT", "BNB/USDT", "ADA/USDT", "XRP/USDT"];
const timeframes = ["5m", "15m", "1h", "4h", "1d"];
const strategies = ["EMA Cross", "RSI Oversold/Overbought", "MACD Crossover", "Bollinger Bands Squeeze"];

export function Crypto() {
  const [recommendation, setRecommendation] = useState({
    pair: "",
    timeframe: "",
    strategy: "",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecommendation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكنك إضافة المنطق لإرسال التوصية إلى API أو Telegram
    console.log("تم إنشاء التوصية:", recommendation);
    // يمكنك إضافة رسالة نجاح أو إعادة تعيين النموذج هنا
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        إنشاء توصية جديدة
      </Typography>

      <Card>
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
          <Typography variant="h5" color="blue-gray">
            تفاصيل التوصية
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Select 
                label="زوج العملة" 
                name="pair" 
                value={recommendation.pair} 
                onChange={(value) => handleChange({target: {name: 'pair', value}})}
              >
                {cryptoPairs.map((pair) => (
                  <Option key={pair} value={pair}>{pair}</Option>
                ))}
              </Select>
            </div>
            <div>
              <Select 
                label="الإطار الزمني" 
                name="timeframe" 
                value={recommendation.timeframe} 
                onChange={(value) => handleChange({target: {name: 'timeframe', value}})}
              >
                {timeframes.map((tf) => (
                  <Option key={tf} value={tf}>{tf}</Option>
                ))}
              </Select>
            </div>
            <div>
              <Select 
                label="الاستراتيجية" 
                name="strategy" 
                value={recommendation.strategy} 
                onChange={(value) => handleChange({target: {name: 'strategy', value}})}
              >
                {strategies.map((strategy) => (
                  <Option key={strategy} value={strategy}>{strategy}</Option>
                ))}
              </Select>
            </div>
            <div>
              <Input 
                type="number" 
                label="سعر الدخول" 
                name="entryPrice" 
                value={recommendation.entryPrice} 
                onChange={handleChange}
              />
            </div>
            <div>
              <Input 
                type="number" 
                label="وقف الخسارة" 
                name="stopLoss" 
                value={recommendation.stopLoss} 
                onChange={handleChange}
              />
            </div>
            <div>
              <Input 
                type="number" 
                label="هدف الربح" 
                name="takeProfit" 
                value={recommendation.takeProfit} 
                onChange={handleChange}
              />
            </div>
            <div>
              <Input 
                type="text" 
                label="ملاحظات إضافية" 
                name="notes" 
                value={recommendation.notes} 
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="mt-4">إنشاء التوصية</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}