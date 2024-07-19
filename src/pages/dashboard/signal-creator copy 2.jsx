import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  Spinner,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { PlusIcon, MinusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ITEMS_PER_PAGE = 10;
const BASE_CURRENCIES = ['USDT', 'BNB', 'BTC', 'ETH', 'BUSD'];
const PRICE_COMPARISON_OPTIONS = ['الإغلاق', 'الافتتاح', 'الأعلى', 'الأدنى', 'السعر الحالي', 'قيمة مخصصة'];
const TIME_FRAMES = ['5m', '15m', '30m', '1h', '4h', '1d'];
const ENTRY_PRICE_OPTIONS = ['الإغلاق', 'الافتتاح', 'الأعلى', 'الأدنى', 'السعر الحالي', '+2%', '-2%', '+5%', '-5%', '+10%', '-10%'];
const STOP_LOSS_OPTIONS = ['الإغلاق', 'الافتتاح', 'الأعلى', 'الأدنى', '-2%', '-5%', '-10%'];
const TAKE_PROFIT_OPTIONS = ['+2%', '+5%', '+10%', '+15%', '+20%'];

const DEFAULT_FILTER = {
  type: 'closePrice',
  comparison: '>=',
  value: '',
  comparisonValue: 'currentPrice'
};

export function SignalCreator() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState([DEFAULT_FILTER]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [strategies, setStrategies] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [telegramChannelId, setTelegramChannelId] = useState('');
  const [telegramApiToken, setTelegramApiToken] = useState('');
  const [timeFrame, setTimeFrame] = useState('1h');
  const [candlePatterns, setCandlePatterns] = useState({
    doji: false,
    hammer: false,
    engulfing: false,
    morningstar: false,
    eveningstar: false,
  });
  const [technicalIndicators, setTechnicalIndicators] = useState({
    sma: { enabled: false, period: 14 },
    ema: { enabled: false, period: 14 },
    macd: { enabled: false, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    rsi: { enabled: false, period: 14 },
    bollingerBands: { enabled: false, period: 20, stdDev: 2 },
  });
  const [entryPrice, setEntryPrice] = useState('الإغلاق');
  const [stopLoss, setStopLoss] = useState('-2%');
  const [takeProfits, setTakeProfits] = useState(['+2%', '+5%', '+10%']);
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    fetchData();
    loadStrategies();
    loadSettings();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const jsonData = await response.json();
      const processedData = await Promise.all(jsonData.map(async (item) => {
        const icon = await fetchCryptoIcon(item.symbol);
        return { ...item, icon };
      }));
      setData(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchCryptoIcon = async (symbol) => {
    try {
      const baseSymbol = BASE_CURRENCIES.find(base => symbol.endsWith(base));
      const coinSymbol = baseSymbol ? symbol.slice(0, -baseSymbol.length).toLowerCase() : symbol.toLowerCase();
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinSymbol}`);
      const data = await response.json();
      return data.image.thumb;
    } catch (error) {
      console.error('Error fetching crypto icon:', error);
      return null;
    }
  };

  const applyFilters = () => {
    const filtered = data.filter(item => {
      const baseMatches = baseCurrency ? item.symbol.endsWith(baseCurrency) : true;
      if (!baseMatches) return false;

      return filters.every(filter => {
        const itemValue = getItemValue(item, filter.type);
        const comparisonValue = filter.comparisonValue === 'قيمة مخصصة' 
          ? parseFloat(filter.value)
          : getComparisonValue(item, filter.comparisonValue);
        
        switch (filter.comparison) {
          case '>':
            return itemValue > comparisonValue;
          case '>=':
            return itemValue >= comparisonValue;
          case '<':
            return itemValue < comparisonValue;
          case '<=':
            return itemValue <= comparisonValue;
          case '=':
            return itemValue === comparisonValue;
          default:
            return true;
        }
      });
    });

    // Apply candle pattern filters
    const filteredWithPatterns = filtered.filter(item => {
      // Implement candle pattern detection logic here
      // This is a placeholder and should be replaced with actual pattern detection
      const hasPattern = (pattern) => Math.random() > 0.5; // Placeholder
      
      if (candlePatterns.doji && !hasPattern('doji')) return false;
      if (candlePatterns.hammer && !hasPattern('hammer')) return false;
      if (candlePatterns.engulfing && !hasPattern('engulfing')) return false;
      if (candlePatterns.morningstar && !hasPattern('morningstar')) return false;
      if (candlePatterns.eveningstar && !hasPattern('eveningstar')) return false;
      
      return true;
    });

    setFilteredData(filteredWithPatterns.slice(0, 10));
    setCurrentPage(1);
  };

  const getItemValue = (item, type) => {
    switch (type) {
      case 'closePrice':
        return parseFloat(item.lastPrice);
      case 'openPrice':
        return parseFloat(item.openPrice);
      case 'highPrice':
        return parseFloat(item.highPrice);
      case 'lowPrice':
        return parseFloat(item.lowPrice);
      case 'priceChange':
        return parseFloat(item.priceChangePercent);
      case 'volume':
        return parseFloat(item.volume);
      default:
        return 0;
    }
  };

  const getComparisonValue = (item, comparisonValue) => {
    switch (comparisonValue) {
      case 'openPrice':
        return parseFloat(item.openPrice);
      case 'highPrice':
        return parseFloat(item.highPrice);
      case 'lowPrice':
        return parseFloat(item.lowPrice);
      case 'currentPrice':
        return parseFloat(item.lastPrice);
      default:
        return parseFloat(comparisonValue);
    }
  };

  const handleFilterChange = (index, field, value) => {
    setFilters(prevFilters => {
      const newFilters = [...prevFilters];
      newFilters[index] = { ...newFilters[index], [field]: value };
      return newFilters;
    });
  };

  const addFilter = () => {
    setFilters(prevFilters => [...prevFilters, DEFAULT_FILTER]);
  };

  const removeFilter = (index) => {
    setFilters(prevFilters => prevFilters.filter((_, i) => i !== index));
  };

  const saveStrategy = () => {
    const strategyName = prompt('أدخل اسم الاستراتيجية:');
    if (strategyName) {
      const strategy = { 
        name: strategyName, 
        filters, 
        baseCurrency, 
        candlePatterns, 
        technicalIndicators,
        telegramChannelId,
        telegramApiToken,
        timeFrame,
        entryPrice,
        stopLoss,
        takeProfits,
        additionalNotes
      };
      setStrategies(prevStrategies => [...prevStrategies, strategy]);
      localStorage.setItem('cryptoStrategies', JSON.stringify([...strategies, strategy]));
    }
  };

  const loadStrategies = () => {
    const savedStrategies = localStorage.getItem('cryptoStrategies');
    if (savedStrategies) {
      setStrategies(JSON.parse(savedStrategies));
    }
  };

  const loadStrategy = (strategyName) => {
    const strategy = strategies.find(s => s.name === strategyName);
    if (strategy) {
      setFilters(strategy.filters);
      setBaseCurrency(strategy.baseCurrency);
      setCandlePatterns(strategy.candlePatterns);
      setTechnicalIndicators(strategy.technicalIndicators);
      setTelegramChannelId(strategy.telegramChannelId);
      setTelegramApiToken(strategy.telegramApiToken);
      setTimeFrame(strategy.timeFrame);
      setEntryPrice(strategy.entryPrice);
      setStopLoss(strategy.stopLoss);
      setTakeProfits(strategy.takeProfits);
      setAdditionalNotes(strategy.additionalNotes);
      setCurrentStrategy(strategyName);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('telegramChannelId', telegramChannelId);
    localStorage.setItem('telegramApiToken', telegramApiToken);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const loadSettings = () => {
    setTelegramChannelId(localStorage.getItem('telegramChannelId') || '');
    setTelegramApiToken(localStorage.getItem('telegramApiToken') || '');
  };

  const sendToTelegram = async (symbol) => {
    try {
      const currentPrice = parseFloat(data.find(item => item.symbol === symbol).lastPrice);
      let entryPriceValue = currentPrice;
      if (entryPrice.includes('%')) {
        const percentage = parseFloat(entryPrice.replace('%', '')) / 100;
        entryPriceValue = currentPrice * (1 + percentage);
      }

      let stopLossValue = currentPrice;
      if (stopLoss.includes('%')) {
        const percentage = parseFloat(stopLoss.replace('%', '')) / 100;
        stopLossValue = currentPrice * (1 + percentage);
      }

      const takeProfitValues = takeProfits.map(tp => {
        const percentage = parseFloat(tp.replace('%', '')) / 100;
        return currentPrice * (1 + percentage);
      });

      const message = `🚀 فرصة تداول جديدة: ${symbol} 📊

💰 السعر الحالي: ${currentPrice.toFixed(2)}
🎯 سعر الدخول: ${entryPriceValue.toFixed(2)}
🛑 وقف الخسارة: ${stopLossValue.toFixed(2)}
💹 أهداف الربح:
${takeProfitValues.map((tp, index) => `   ${index + 1}. ${tp.toFixed(2)}`).join('\n')}

⏰ الإطار الزمني: ${timeFrame}

📝 ملاحظات إضافية:
${additionalNotes}

⚠️ تنبيه: هذه ليست نصيحة مالية. يرجى إجراء التحليل الخاص بك قبل اتخاذ أي قرارات تداول.`;

console.log({message})
      const url = `/api/telegram?botToken=${telegramApiToken}&id=${telegramChannelId}&message=${encodeURIComponent(message)}`;
      const response = await fetch(url);
      const responseData = await response.json();
      console.log(responseData)
      if (responseData.ok) {
        alert('تم إرسال الرسالة بنجاح إلى تيليجرام');
      } else {
        throw new Error('فشل إرسال الرسالة إلى تيليجرام');
      }
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
      alert('حدث خطأ أثناء إرسال الرسالة إلى تيليجرام');
    }
  };

  const openChartInNewWindow = (symbol) => {
    const chartUrl = `https://www.tradingview.com/chart/?symbol=BINANCE:${symbol}`;
    window.open(chartUrl, '_blank', 'width=1200,height=800');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" color="blue" />
      </div>
    );
  }
  return (
    <div className="p-4">
      <Card className="w-full mb-8">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            فلتر العملات المشفرة المتقدم
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              label="العملة الأساسية"
              value={baseCurrency}
              onChange={(value) => setBaseCurrency(value)}
            >
              {BASE_CURRENCIES.map(currency => (
                <Option key={currency} value={currency}>{currency}</Option>
              ))}
            </Select>
            <Select
              label="الإطار الزمني"
              value={timeFrame}
              onChange={(value) => setTimeFrame(value)}
            >
              {TIME_FRAMES.map(tf => (
                <Option key={tf} value={tf}>{tf}</Option>
              ))}
            </Select>
          </div>
          {filters.map((filter, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select
                label="نوع السعر"
                value={filter.type}
                onChange={(value) => handleFilterChange(index, 'type', value)}
              >
                <Option value="closePrice">سعر الإغلاق</Option>
                <Option value="openPrice">سعر الافتتاح</Option>
                <Option value="highPrice">السعر الأعلى</Option>
                <Option value="lowPrice">السعر الأدنى</Option>
                <Option value="priceChange">نسبة التغيير</Option>
                <Option value="volume">الحجم</Option>
              </Select>
              <Select
                label="المقارنة"
                value={filter.comparison}
                onChange={(value) => handleFilterChange(index, 'comparison', value)}
              >
                <Option value=">">{'>'}اكبر من</Option>
                <Option value=">=">{'>='} اكبر من او يساوي</Option>
                <Option value="<">{'<'} اصغر من</Option>
                <Option value="<=">{'<='} اصغر من او يساوي</Option>
                <Option value="=">{'='} يساوي</Option>
              </Select>
              <Select
                label="القيمة"
                value={filter.comparisonValue}
                onChange={(value) => handleFilterChange(index, 'comparisonValue', value)}
              >
                {PRICE_COMPARISON_OPTIONS.map(option => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
              {filter.comparisonValue === 'قيمة مخصصة' && (
                <Input
                  type="number"
                  label="القيمة المخصصة"
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                />
              )}
              <IconButton
                color="red"
                onClick={() => removeFilter(index)}
              >
                <MinusIcon className="h-4 w-4" />
              </IconButton>
            </div>
          ))}
          <div className="flex justify-center gap-4 mb-4">
            <Button onClick={addFilter} color="green">
              <PlusIcon className="h-4 w-4 mr-2" />
              إضافة فلتر
            </Button>
            <Button onClick={applyFilters} color="blue">تطبيق الفلتر</Button>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-8">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            أنماط الشموع والمؤشرات الفنية
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Typography variant="h6" className="mb-2">أنماط الشموع</Typography>
              <div className="flex flex-wrap gap-2">
                {Object.entries(candlePatterns).map(([key, value]) => (
                  <Chip
                    key={key}
                    value={key}
                    onClick={() => setCandlePatterns(prev => ({ ...prev, [key]: !prev[key] }))}
                    color={value ? "blue" : "gray"}
                  />
                ))}
              </div>
            </div>
            <div>
              <Typography variant="h6" className="mb-2">المؤشرات الفنية</Typography>
              <div className="flex flex-col gap-2">
                {Object.entries(technicalIndicators).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Chip
                      value={key.toUpperCase()}
                      onClick={() => setTechnicalIndicators(prev => ({ 
                        ...prev, 
                        [key]: { ...prev[key], enabled: !prev[key].enabled } 
                      }))}
                      color={value.enabled ? "blue" : "gray"}
                    />
                    {value.enabled && (
                      <Input
                        type="number"
                        label="الفترة"
                        value={value.period}
                        onChange={(e) => setTechnicalIndicators(prev => ({
                          ...prev,
                          [key]: { ...prev[key], period: parseInt(e.target.value) }
                        }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-8">
        <CardHeader variant="gradient" color="blue" className="mb-4 p-6">
          <Typography variant="h6" color="white">
            إعدادات الإرسال إلى تيليجرام
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select
              label="سعر الدخول"
              value={entryPrice}
              onChange={(value) => setEntryPrice(value)}
            >
              {ENTRY_PRICE_OPTIONS.map(option => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Select>
            <Select
              label="وقف الخسارة"
              value={stopLoss}
              onChange={(value) => setStopLoss(value)}
            >
              {STOP_LOSS_OPTIONS.map(option => (
                <Option key={option} value={option}>{option}</Option>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            <Typography variant="h6" className="mb-2">أهداف الربح</Typography>
            <div className="flex flex-wrap gap-2">
              {TAKE_PROFIT_OPTIONS.map(option => (
                <Chip
                  key={option}
                  value={option}
                  onClick={() => setTakeProfits(prev => 
                    prev.includes(option) 
                      ? prev.filter(tp => tp !== option)
                      : [...prev, option]
                  )}
                  color={takeProfits.includes(option) ? "blue" : "gray"}
                />
              ))}
            </div>
          </div>
          <Input
            type="text"
            label="ملاحظات إضافية"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              type="text"
              label="معرف قناة التيليجرام"
              value={telegramChannelId}
              onChange={(e) => setTelegramChannelId(e.target.value)}
            />
            <Input
              type="text"
              label="توكن API تيليجرام"
              value={telegramApiToken}
              onChange={(e) => setTelegramApiToken(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={saveSettings} color="indigo">حفظ الإعدادات</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            العملات المشفرة المفلترة
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["الرمز", "السعر", "التغيير", "الحجم", "إجراءات"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const className = `py-3 px-5 ${
                  index === filteredData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={item.symbol}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {item.icon && <img src={item.icon} alt={item.symbol} className="w-8 h-8" />}
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {item.symbol}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {parseFloat(item.lastPrice).toFixed(2)}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={parseFloat(item.priceChangePercent) >= 0 ? "green" : "red"}
                        value={`${parseFloat(item.priceChangePercent).toFixed(2)}%`}
                        className="py-0.5 px-2 text-[11px] font-medium"
                      />
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {parseFloat(item.volume).toLocaleString()}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Button
                        color="blue"
                        buttonType="link"
                        size="sm"
                        rounded={false}
                        block={false}
                        iconOnly={false}
                        ripple="dark"
                        onClick={() => openChartInNewWindow(item.symbol)}
                      >
                        عرض الرسم البياني
                      </Button>
                      <Button
                        color="green"
                        buttonType="link"
                        size="sm"
                        rounded={false}
                        block={false}
                        iconOnly={false}
                        ripple="dark"
                        onClick={() => sendToTelegram(item.symbol)}
                      >
                        إرسال إلى تيليجرام
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}