import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, CardHeader, CardBody, Input, Button, Spinner } from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const CoinGeckoAPI = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export function Crypto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCoinData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await CoinGeckoAPI.get(`/coins/${searchTerm}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false
        }
      });
      setCoinData(response.data);

      const chartResponse = await CoinGeckoAPI.get(`/coins/${searchTerm}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: 7
        }
      });
      setChartData(chartResponse.data.prices.map(price => ({
        date: new Date(price[0]).toLocaleDateString('ar-SA'),
        price: price[1]
      })));
    } catch (err) {
      setError('حدث خطأ أثناء جلب البيانات. يرجى التحقق من اسم العملة والمحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchCoinData();
    }
  }, [searchTerm]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatPercentage = (num) => {
    return new Intl.NumberFormat('ar-SA', { style: 'percent', minimumFractionDigits: 2 }).format(num / 100);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen" dir="rtl">
      <Typography variant="h2" color="blue-gray" className="mb-6 text-center">
        لوحة تحكم العملات المشفرة
      </Typography>

      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-md">
          <Input
            label="ابحث عن عملة مشفرة"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <Button onClick={fetchCoinData} fullWidth color="blue" disabled={loading}>
            {loading ? <Spinner color="white" /> : 'بحث'}
          </Button>
        </div>
      </div>

      {error && (
        <Typography color="red" className="text-center mb-4">
          {error}
        </Typography>
      )}

      {coinData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="flex items-center gap-4 pt-0 pb-8 mx-0 mt-8 mb-4"
            >
              <img src={coinData.image.large} alt={coinData.name} className="w-20 h-20" />
              <div>
                <Typography variant="h3" color="blue-gray">
                  {coinData.name} ({coinData.symbol.toUpperCase()})
                </Typography>
                <Typography color="gray">{coinData.market_data.current_price.usd > 1 ? formatCurrency(coinData.market_data.current_price.usd) : formatNumber(coinData.market_data.current_price.usd)}</Typography>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-4 px-4 py-2">
                  <Typography className="font-semibold">التغير خلال 24 ساعة:</Typography>
                  <Typography
                    color={coinData.market_data.price_change_percentage_24h > 0 ? "green" : "red"}
                    className="flex items-center gap-1"
                  >
                    {coinData.market_data.price_change_percentage_24h > 0 ? (
                      <ArrowUpIcon strokeWidth={3} className="h-4 w-4" />
                    ) : (
                      <ArrowDownIcon strokeWidth={3} className="h-4 w-4" />
                    )}
                    {formatPercentage(coinData.market_data.price_change_percentage_24h)}
                  </Typography>
                </li>
                <li className="flex items-center gap-4 px-4 py-2 bg-blue-gray-50">
                  <Typography className="font-semibold">القيمة السوقية:</Typography>
                  <Typography>{formatCurrency(coinData.market_data.market_cap.usd)}</Typography>
                </li>
                <li className="flex items-center gap-4 px-4 py-2">
                  <Typography className="font-semibold">حجم التداول (24 ساعة):</Typography>
                  <Typography>{formatCurrency(coinData.market_data.total_volume.usd)}</Typography>
                </li>
                <li className="flex items-center gap-4 px-4 py-2 bg-blue-gray-50">
                  <Typography className="font-semibold">أعلى سعر (24 ساعة):</Typography>
                  <Typography>{formatCurrency(coinData.market_data.high_24h.usd)}</Typography>
                </li>
                <li className="flex items-center gap-4 px-4 py-2">
                  <Typography className="font-semibold">أدنى سعر (24 ساعة):</Typography>
                  <Typography>{formatCurrency(coinData.market_data.low_24h.usd)}</Typography>
                </li>
                <li className="flex items-center gap-4 px-4 py-2 bg-blue-gray-50">
                  <Typography className="font-semibold">إجمالي العرض:</Typography>
                  <Typography>{formatNumber(coinData.market_data.circulating_supply)} {coinData.symbol.toUpperCase()}</Typography>
                </li>
                <li className="flex items-center gap-4 px-4 py-2">
                  <Typography className="font-semibold">الحد الأقصى للعرض:</Typography>
                  <Typography>{coinData.market_data.max_supply ? formatNumber(coinData.market_data.max_supply) : 'غير محدد'} {coinData.symbol.toUpperCase()}</Typography>
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
              <Typography variant="h4" color="blue-gray">
                سعر {coinData.name} خلال 7 أيام
              </Typography>
            </CardHeader>
            <CardBody>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => value > 1 ? formatCurrency(value) : formatNumber(value)}
                    />
                    <Tooltip 
                      formatter={(value) => [value > 1 ? formatCurrency(value) : formatNumber(value), "السعر"]}
                      labelFormatter={(label) => `التاريخ: ${label}`}
                    />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

