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
  Button
} from "@material-tailwind/react";
import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';

const ITEMS_PER_PAGE = 20;
const BASE_CURRENCIES = ['USDT', 'BNB', 'BTC', 'ETH', 'BUSD'];

export function Tables() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    changePercent: '',
    volume: '',
    baseCurrency: '',
    sma: { period: 14, value: '' },
    ema: { period: 14, value: '' },
    rsi: { period: 14, value: '' },
    macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, value: '' },
    bb: { period: 20, stdDev: 2, value: '' },
  });

  useEffect(() => {
    fetchData();
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
    const smaResult = SMA.calculate({period: filters.sma.period, values: prices});
    const emaResult = EMA.calculate({period: filters.ema.period, values: prices});
    const rsiResult = RSI.calculate({period: filters.rsi.period, values: prices});
    const macdResult = MACD.calculate({
      fastPeriod: filters.macd.fastPeriod,
      slowPeriod: filters.macd.slowPeriod,
      signalPeriod: filters.macd.signalPeriod,
      values: prices
    });
    const bbResult = BollingerBands.calculate({
      period: filters.bb.period,
      values: prices,
      stdDev: filters.bb.stdDev
    });

    return {
      sma: smaResult[smaResult.length - 1],
      ema: emaResult[emaResult.length - 1],
      rsi: rsiResult[rsiResult.length - 1],
      macd: macdResult[macdResult.length - 1],
      bb: bbResult[bbResult.length - 1]
    };
  };

  const applyFilters = () => {
    const filtered = data.filter(item => {
      const price = parseFloat(item.lastPrice);
      const change = parseFloat(item.priceChangePercent);
      const volume = parseFloat(item.volume);
      const baseMatches = filters.baseCurrency ? item.symbol.endsWith(filters.baseCurrency) : true;

      if (
        (filters.priceMin && price < parseFloat(filters.priceMin)) ||
        (filters.priceMax && price > parseFloat(filters.priceMax)) ||
        (filters.changePercent && Math.abs(change) < parseFloat(filters.changePercent)) ||
        (filters.volume && volume < parseFloat(filters.volume)) ||
        !baseMatches
      ) {
        return false;
      }

      const prices = item.priceHistory || [price]; // Assume we have price history, if not use current price
      const indicators = calculateIndicators(prices);

      if (
        (filters.sma.value && indicators.sma < parseFloat(filters.sma.value)) ||
        (filters.ema.value && indicators.ema < parseFloat(filters.ema.value)) ||
        (filters.rsi.value && indicators.rsi < parseFloat(filters.rsi.value)) ||
        (filters.macd.value && indicators.macd.histogram < parseFloat(filters.macd.value)) ||
        (filters.bb.value && price < indicators.bb.lower)
      ) {
        return false;
      }

      return true;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
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
            <Input
              type="number"
              label="السعر الأدنى"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="السعر الأقصى"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="نسبة التغيير الأدنى (%)"
              name="changePercent"
              value={filters.changePercent}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="الحجم الأدنى"
              name="volume"
              value={filters.volume}
              onChange={handleFilterChange}
            />
            <Select
              label="العملة الأساسية"
              name="baseCurrency"
              value={filters.baseCurrency}
              onChange={(value) => setFilters(prev => ({ ...prev, baseCurrency: value }))}
            >
              {BASE_CURRENCIES.map(currency => (
                <Option key={currency} value={currency}>{currency}</Option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="number"
              label="قيمة SMA"
              name="sma.value"
              value={filters.sma.value}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="فترة SMA"
              name="sma.period"
              value={filters.sma.period}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="قيمة EMA"
              name="ema.value"
              value={filters.ema.value}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="فترة EMA"
              name="ema.period"
              value={filters.ema.period}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="قيمة RSI"
              name="rsi.value"
              value={filters.rsi.value}
              onChange={handleFilterChange}
            />
            <Input
              type="number"
              label="فترة RSI"
              name="rsi.period"
              value={filters.rsi.period}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={applyFilters} color="blue">تطبيق الفلتر</Button>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <div className="flex justify-center mt-4">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            color={currentPage === page ? "blue" : "gray"}
            onClick={() => setCurrentPage(page)}
            className="mx-1"
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
};

