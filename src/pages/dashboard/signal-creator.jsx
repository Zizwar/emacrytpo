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
const timeframes = ["5م", "15م", "1س", "4س", "1ي"];
const strategies = ["تقاطع المتوسطات المتحركة", "مؤشر القوة النسبية", "تقاطع MACD", "انكماش بولينجر"];

export  function SignalCreator() {
  const [recommendation, setRecommendation] = useState({
    pair: "",
    timeframe: "",
    strategy: "",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecommendation(prev => ({ ...prev, [name]: value }));
  };

  const sendToTelegram = async (recommendation) => {
    setIsLoading(true);

    try {
          recommendation.createdAt =new Date().toISOString();
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recommendation),
      });
      
      if (!response.ok) {
        throw new Error('فشل في إرسال التوصية');
      }



      setMessage('تم إرسال التوصية بنجاح!');
    } catch (error) {
      console.error('خطأ:', error);
      setMessage('حدث خطأ أثناء إرسال التوصية.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendToTelegram(recommendation);
    
    // إعادة تعيين النموذج
    setRecommendation({
      pair: "",
      timeframe: "",
      strategy: "",
      entryPrice: "",
      stopLoss: "",
      takeProfit: "",
      notes: "",
    });
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        إنشاء توصية جديدة
      </Typography>

      <Card dir="rtl">
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
            <Button type="submit" className="mt-4" disabled={isLoading}>
              {isLoading ? 'جاري الإرسال...' : 'إنشاء وإرسال التوصية'}
            </Button>
          </form>
          {message && (
            <Typography color={message.includes('نجاح') ? 'green' : 'red'} className="mt-4">
              {message}
            </Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}