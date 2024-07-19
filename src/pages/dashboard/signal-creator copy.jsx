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
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { PlusIcon, MinusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const ITEMS_PER_PAGE = 20;
const BASE_CURRENCIES = ['USDT', 'BNB', 'BTC', 'ETH', 'BUSD'];
const PRICE_COMPARISON_OPTIONS = ['الإغلاق', 'الافتتاح', 'الأعلى', 'الأدنى', 'السعر الحالي', 'قيمة مخصصة'];

const DEFAULT_FILTER = {
  type: 'closePrice',
  comparison: '>=',
  value: '',
  comparisonValue: 'currentPrice'
};

export function Tables() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState([DEFAULT_FILTER]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [strategies, setStrategies] = useState([]);
  const [currentStrategy, setCurrentStrategy] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramApiToken, setTelegramApiToken] = useState('');
  const [advancedProgramming, setAdvancedProgramming] = useState('');
  const [showAdvancedProgramming, setShowAdvancedProgramming] = useState(false);
  const [candlePatterns, setCandlePatterns] = useState({
    doji: false,
    hammer: false,
    engulfing: false,
  });
  const [technicalIndicators, setTechnicalIndicators] = useState({
    sma: { enabled: false, period: 14 },
    ema: { enabled: false, period: 14 },
    macd: { enabled: false, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    rsi: { enabled: false, period: 14 },
    bollingerBands: { enabled: false, period: 20, stdDev: 2 },
  });

  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
    loadStrategies();
    loadSettings();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.reload();
    }
  }, [selectedSymbol]);

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

  const calculateIndicators = (prices) => {
    const indicators = {};
    
    if (technicalIndicators.sma.enabled) {
      indicators.sma = SMA.calculate({period: technicalIndicators.sma.period, values: prices});
    }
    if (technicalIndicators.ema.enabled) {
      indicators.ema = EMA.calculate({period: technicalIndicators.ema.period, values: prices});
    }
    if (technicalIndicators.macd.enabled) {
      indicators.macd = MACD.calculate({
        fastPeriod: technicalIndicators.macd.fastPeriod,
        slowPeriod: technicalIndicators.macd.slowPeriod,
        signalPeriod: technicalIndicators.macd.signalPeriod,
        values: prices
      });
    }
    if (technicalIndicators.rsi.enabled) {
      indicators.rsi = RSI.calculate({period: technicalIndicators.rsi.period, values: prices});
    }
    if (technicalIndicators.bollingerBands.enabled) {
      indicators.bollingerBands = BollingerBands.calculate({
        period: technicalIndicators.bollingerBands.period,
        stdDev: technicalIndicators.bollingerBands.stdDev,
        values: prices
      });
    }

    return indicators;
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
      
      return true;
    });

    setFilteredData(filteredWithPatterns);
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
        whatsappNumber,
        telegramApiToken,
        advancedProgramming
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
      setWhatsappNumber(strategy.whatsappNumber);
      setTelegramApiToken(strategy.telegramApiToken);
      setAdvancedProgramming(strategy.advancedProgramming);
      setCurrentStrategy(strategyName);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('whatsappNumber', whatsappNumber);
    localStorage.setItem('telegramApiToken', telegramApiToken);
    localStorage.setItem('advancedProgramming', advancedProgramming);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const loadSettings = () => {
    setWhatsappNumber(localStorage.getItem('whatsappNumber') || '');
    setTelegramApiToken(localStorage.getItem('telegramApiToken') || '');
    setAdvancedProgramming(localStorage.getItem('advancedProgramming') || '');
  };

  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <Button onClick={saveStrategy} color="purple">حفظ الاستراتيجية</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Select
            label="تحميل استراتيجية"
            value={currentStrategy}
            onChange={loadStrategy}
          >
            {strategies.map(strategy => (
              <Option key={strategy.name} value={strategy.name}>{strategy.name}</Option>
            ))}
          </Select>
        </div>
        <Accordion>
          <AccordionHeader onClick={() => setShowAdvancedProgramming(!showAdvancedProgramming)}>
            البرمجة المتقدمة
          </AccordionHeader>
          <AccordionBody>
            <Input
              type="text"
              label="البرمجة المتقدمة"
              value={advancedProgramming}
              onChange={(e) => setAdvancedProgramming(e.target.value)}
            />
          </AccordionBody>
        </Accordion>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            type="text"
            label="رقم الواتساب"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
          />
          <Input
            type="text"
            label="توكن API تلغرام"
            value={telegramApiToken}
            onChange={(e) => setTelegramApiToken(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button onClick={saveSettings} color="indigo">حفظ الإعدادات</Button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Typography variant="h6" className="mb-2">أنماط الشموع</Typography>
            <div className="flex flex-col gap-2">
              <Chip
                value="Doji"
                onClick={() => setCandlePatterns(prev => ({ ...prev, doji: !prev.doji }))}
                color={candlePatterns.doji ? "blue" : "gray"}
              />
              <Chip
                value="Hammer"
                onClick={() => setCandlePatterns(prev => ({ ...prev, hammer: !prev.hammer }))}
                color={candlePatterns.hammer ? "blue" : "gray"}
              />
              <Chip
                value="Engulfing"
                onClick={() => setCandlePatterns(prev => ({ ...prev, engulfing: !prev.engulfing }))}
                color={candlePatterns.engulfing ? "blue" : "gray"}
              />
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
              {["الرمز", "السعر", "التغيير", "الحجم"].map((el) => (
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
            {paginatedData.map((item, index) => {
              const className = `py-3 px-5 ${
                index === paginatedData.length - 1
                  ? ""
                  : "border-b border-blue-gray-50"
              }`;

              return (
                <tr key={item.symbol} onClick={() => setSelectedSymbol(item.symbol)} className="cursor-pointer hover:bg-gray-100">
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
    </Card>
    <div className="flex justify-center mt-4">
      <IconButton
        variant="outlined"
        color="blue-gray"
        size="sm"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      {[...Array(Math.min(7, pageCount))].map((_, index) => {
        let pageNumber;
        if (pageCount <= 7) {
          pageNumber = index + 1;
        } else if (currentPage <= 4) {
          pageNumber = index + 1;
        } else if (currentPage >= pageCount - 3) {
          pageNumber = pageCount - 6 + index;
        } else {
          pageNumber = currentPage - 3 + index;
        }

        return (
          <IconButton
            key={index}
            variant={currentPage === pageNumber ? "filled" : "text"}
            color="blue-gray"
            size="sm"
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </IconButton>
        );
      })}
      {pageCount > 7 && currentPage < pageCount - 3 && (
        <>
          <IconButton variant="text" color="blue-gray" size="sm" disabled>
            ...
          </IconButton>
          <IconButton
            variant="text"
            color="blue-gray"
            size="sm"
            onClick={() => setCurrentPage(pageCount)}
          >
            {pageCount}
          </IconButton>
        </>
      )}
      <IconButton
        variant="outlined"
        color="blue-gray"
        size="sm"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
        disabled={currentPage === pageCount}
      >
        <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>

    <Card className="mt-8">
      <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          الرسم البياني المتقدم في الوقت الحقيقي
        </Typography>
      </CardHeader>
      <CardBody>
        <AdvancedRealTimeChart
          ref={chartRef}
          theme="light"
          symbol={`BINANCE:${selectedSymbol}`}
          width="100%"
          height={400}
          interval="D"
          timezone="Etc/UTC"
          style="1"
          locale="ar"
          toolbar_bg="#f1f3f6"
          enable_publishing={false}
          hide_top_toolbar={false}
          allow_symbol_change={true}
          container_id="tradingview_chart"
        />
      </CardBody>
    </Card>
  </div>
  );
}