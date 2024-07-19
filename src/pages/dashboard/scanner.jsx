import React, { useState, useEffect } from 'react';
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
  IconButton
} from "@material-tailwind/react";
import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { PlusIcon, MinusIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

const ITEMS_PER_PAGE = 20;
const BASE_CURRENCIES = ['USDT', 'BNB', 'BTC', 'ETH', 'BUSD'];
const PRICE_COMPARISON_OPTIONS = ['الإغلاق', 'الافتتاح', 'الأعلى', 'الأدنى', 'السعر الحالي'];

const DEFAULT_FILTER = {
  type: 'closePrice',
  comparison: '>=',
  value: '',
  comparisonValue: 'currentPrice'
};

export function Scanner() {
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
  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    fetchData();
    loadStrategies();
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

  const calculateIndicators = (prices) => {
    // ... (indicator calculations remain the same)
  };

  const applyFilters = () => {
    const filtered = data.filter(item => {
      const baseMatches = baseCurrency ? item.symbol.endsWith(baseCurrency) : true;
      if (!baseMatches) return false;

      return filters.every(filter => {
        const itemValue = getItemValue(item, filter.type);
        const comparisonValue = getComparisonValue(item, filter.comparisonValue);
        
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

    setFilteredData(filtered);
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
      const strategy = { name: strategyName, filters, baseCurrency };
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
      setCurrentStrategy(strategyName);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('whatsappNumber', whatsappNumber);
    localStorage.setItem('apiToken', apiToken);
    alert('تم حفظ الإعدادات بنجاح');
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
              {filter.type === 'priceChange' || filter.type === 'volume' ? (
                <Input
                  type="number"
                  label="القيمة"
                  value={filter.value}
                  onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
                />
              ) : (
                <Select
                  label="القيمة"
                  value={filter.comparisonValue}
                  onChange={(value) => handleFilterChange(index, 'comparisonValue', value)}
                >
                  {PRICE_COMPARISON_OPTIONS.map(option => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              label="رقم الواتساب"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
            <Input
              type="text"
              label="توكن API"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={saveSettings} color="indigo">حفظ الإعدادات</Button>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-8">
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            الرسم البياني المتقدم في الوقت الحقيقي
          </Typography>
        </CardHeader>
        <CardBody>
          <AdvancedRealTimeChart
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
    </div>
  );
}