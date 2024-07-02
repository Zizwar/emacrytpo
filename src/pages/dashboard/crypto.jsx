import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Card, 
  CardHeader, 
  CardBody, 
  Tabs, 
  TabsHeader, 
  TabsBody, 
  Tab, 
  TabPanel,
  Select,
  Option,
  Button,
  Input,
  Switch
} from "@material-tailwind/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const translations = {
  en: {
    title: "Binance Trading Dashboard",
    marketOverview: "Market Overview",
    symbol: "Symbol",
    price: "Price",
    change24h: "24h Change",
    volume24h: "24h Volume",
    selectTradingPair: "Select Trading Pair",
    priceChart: "Price Chart",
    orderBook: "Order Book",
    bids: "Bids",
    asks: "Asks",
    amount: "Amount",
    total: "Total",
    recentTrades: "Recent Trades",
    time: "Time",
    refreshInterval: "Refresh Interval",
    priceAlerts: "Price Alerts",
    alertPrice: "Alert Price",
    alertAbove: "Alert Above",
    alertBelow: "Alert Below",
    activeAlerts: "Active Alerts",
    language: "Language",
    direction: "Direction"
  },
  ar: {
    title: "لوحة تداول بينانس",
    marketOverview: "نظرة عامة على السوق",
    symbol: "الرمز",
    price: "السعر",
    change24h: "التغيير 24 ساعة",
    volume24h: "الحجم 24 ساعة",
    selectTradingPair: "اختر زوج التداول",
    priceChart: "مخطط الأسعار",
    orderBook: "سجل الطلبات",
    bids: "العروض",
    asks: "الطلبات",
    amount: "الكمية",
    total: "المجموع",
    recentTrades: "آخر الصفقات",
    time: "الوقت",
    refreshInterval: "فترة التحديث",
    priceAlerts: "تنبيهات الأسعار",
    alertPrice: "سعر التنبيه",
    alertAbove: "تنبيه فوق",
    alertBelow: "تنبيه تحت",
    activeAlerts: "التنبيهات النشطة",
    language: "اللغة",
    direction: "الاتجاه"
  }
};

export function Crypto(){
  const [tickerData, setTickerData] = useState([]);
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [candlestickData, setCandlestickData] = useState([]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(60000);
  const [alertPrice, setAlertPrice] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);

  const t = translations[language];

  useEffect(() => {
    document.body.dir = isRTL ? 'rtl' : 'ltr';
    document.body.lang = language;
  }, [isRTL, language]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchTickerData(),
        fetchCandlestickData(),
        fetchOrderBook(),
        fetchRecentTrades()
      ]);
    };

    fetchData();

    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [selectedPair, refreshInterval]);

  useEffect(() => {
    const checkAlerts = () => {
      const currentPrice = parseFloat(tickerData.find(t => t.symbol === selectedPair)?.lastPrice);
      alerts.forEach(alert => {
        if ((alert.type === 'above' && currentPrice > alert.price) ||
            (alert.type === 'below' && currentPrice < alert.price)) {
          alert(`Price Alert: ${selectedPair} is now ${currentPrice}`);
          setAlerts(alerts.filter(a => a !== alert));
        }
      });
    };

    if (tickerData.length > 0) {
      checkAlerts();
    }
  }, [tickerData, selectedPair, alerts]);

  const fetchTickerData = async () => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
      setTickerData(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching ticker data:', error);
    }
  };

  const fetchCandlestickData = async () => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/klines`, {
        params: {
          symbol: selectedPair,
          interval: '1h',
          limit: 24
        }
      });
      const formattedData = response.data.map(candle => ({
        time: new Date(candle[0]).toLocaleTimeString(),
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4])
      }));
      setCandlestickData(formattedData);
    } catch (error) {
      console.error('Error fetching candlestick data:', error);
    }
  };

  const fetchOrderBook = async () => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/depth`, {
        params: {
          symbol: selectedPair,
          limit: 10
        }
      });
      setOrderBook(response.data);
    } catch (error) {
      console.error('Error fetching order book:', error);
    }
  };

  const fetchRecentTrades = async () => {
    try {
      const response = await axios.get(`https://api.binance.com/api/v3/trades`, {
        params: {
          symbol: selectedPair,
          limit: 10
        }
      });
      setRecentTrades(response.data);
    } catch (error) {
      console.error('Error fetching recent trades:', error);
    }
  };

  const handleSetAlert = (type) => {
    if (alertPrice) {
      setAlerts([...alerts, { price: parseFloat(alertPrice), type }]);
      setAlertPrice('');
    }
  };

  return (
    <div className={`p-4 bg-gray-100 min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" color="blue-gray">
          {t.title}
        </Typography>
        <div className="flex items-center gap-4">
          <Select 
            label={t.language} 
            value={language} 
            onChange={(value) => setLanguage(value)}
          >
            <Option value="en">English</Option>
            <Option value="ar">العربية</Option>
          </Select>
          <Switch 
            label={t.direction}
            checked={isRTL}
            onChange={() => setIsRTL(!isRTL)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Market Overview */}
        <Card className="col-span-2">
          <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
            <Typography variant="h6" color="blue-gray">
              {t.marketOverview}
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[t.symbol, t.price, t.change24h, t.volume24h].map((el) => (
                      <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                        <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickerData.map((ticker) => (
                    <tr key={ticker.symbol} className="hover:bg-blue-gray-50/50 cursor-pointer" onClick={() => setSelectedPair(ticker.symbol)}>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {ticker.symbol}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          ${parseFloat(ticker.lastPrice).toFixed(2)}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography
                          variant="small"
                          className={`font-medium ${parseFloat(ticker.priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {parseFloat(ticker.priceChangePercent).toFixed(2)}%
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          ${parseFloat(ticker.volume).toLocaleString()}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Pair Selector */}
        <Card>
          <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
            <Typography variant="h6" color="blue-gray">
              {t.selectTradingPair}
            </Typography>
          </CardHeader>
          <CardBody>
            <Select label={t.selectTradingPair} value={selectedPair} onChange={(value) => setSelectedPair(value)}>
              {tickerData.map((ticker) => (
                <Option key={ticker.symbol} value={ticker.symbol}>{ticker.symbol}</Option>
              ))}
            </Select>
          </CardBody>
        </Card>
      </div>

      {/* Price Chart */}
      <Card className="mb-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
          <Typography variant="h6" color="blue-gray">
            {t.priceChart} - {selectedPair}
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={candlestickData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Order Book and Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
            <Typography variant="h6" color="blue-gray">
              {t.orderBook}
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <Tabs value="bids">
              <TabsHeader>
                <Tab value="bids">{t.bids}</Tab>
                <Tab value="asks">{t.asks}</Tab>
              </TabsHeader>
              <TabsBody>
                <TabPanel value="bids">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px] table-auto">
                      <thead>
                        <tr>
                          {[t.price, t.amount, t.total].map((el) => (
                            <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                              <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                                {el}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orderBook.bids.slice(0, 10).map((bid, index) => (
                          <tr key={index}>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="green" className="font-medium">
                                {parseFloat(bid[0]).toFixed(2)}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                {parseFloat(bid[1]).toFixed(4)}
                              </Typography>
                            </td>
                            <td className="py-3 px-5 border-b border-blue-gray-50">
                              <Typography variant="small" color="blue-gray" className="font-medium">
                                {(parseFloat(bid[0]) * parseFloat(bid[1])).toFixed(2)}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
                <TabPanel value="asks">
                  {/* Similar structure as bids, but for asks */}
                </TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>

        <Card>
          <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
            <Typography variant="h6" color="blue-gray">
              {t.recentTrades}
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] table-auto">
                <thead>
                  <tr>
                    {[t.price, t.amount, t.time].map((el) => (
                      <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                        <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade) => (
                    <tr key={trade.id}>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color={trade.isBuyerMaker ? "red" : "green"} className="font-medium">
                          {parseFloat(trade.price).toFixed(2)}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {parseFloat(trade.qty).toFixed(4)}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {new Date(trade.time).toLocaleTimeString()}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Refresh Interval Selector */}
      <Card className="mt-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
          <Typography variant="h6" color="blue-gray">
            Refresh Interval
          </Typography>
        </CardHeader>
        <CardBody>
          <Select 
            label="Refresh Interval" 
            value={refreshInterval.toString()} 
            onChange={(value) => setRefreshInterval(parseInt(value))}
          >
            <Option value="30000">30 seconds</Option>
            <Option value="60000">1 minute</Option>
            <Option value="300000">5 minutes</Option>
          </Select>
        </CardBody>
      </Card>

      {/* Price Alerts */}
      <Card className="mt-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="p-4">
          <Typography variant="h6" color="blue-gray">
            Price Alerts
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            <Input 
              type="number" 
              label="Alert Price" 
              value={alertPrice} 
              onChange={(e) => setAlertPrice(e.target.value)}
            />
            <Button onClick={() => handleSetAlert('above')}>Alert Above</Button>
            <Button onClick={() => handleSetAlert('below')}>Alert Below</Button>
          </div>
          <div className="mt-4">
            <Typography variant="h6" color="blue-gray">
              Active Alerts:
            </Typography>
            {alerts.map((alert, index) => (
              <Typography key={index} variant="small" color="blue-gray">
                {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} {alert.price}
              </Typography>
            ))}
          </div>
        </CardBody>
      </Card>
      </div> 
  );
};
