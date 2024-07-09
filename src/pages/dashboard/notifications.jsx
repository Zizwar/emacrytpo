import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Slider,
  Button,
  Select,
  Option,
  Input,
} from "@material-tailwind/react";

export function Notifications() {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    averageVolume30: { min: 50000, max: 50000000 },
    averageVolume60: { min: 50000, max: 50000000 },
    averageVolume90: { min: 50000, max: 50000000 },
    relativeVolume: { type: 'Below', value: 5000 },
    open: { type: 'Between', min: 0, max: 1000000 },
    price: { type: 'Between', min: 0, max: 1000000 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await response.json();
        setCryptoData(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    const filtered = cryptoData.filter(crypto => {
      const volume = parseFloat(crypto.volume);
      const lastPrice = parseFloat(crypto.lastPrice);
      const openPrice = parseFloat(crypto.openPrice);

      return (
        volume >= filters.averageVolume30.min && volume <= filters.averageVolume30.max &&
        volume >= filters.averageVolume60.min && volume <= filters.averageVolume60.max &&
        volume >= filters.averageVolume90.min && volume <= filters.averageVolume90.max &&
        (filters.relativeVolume.type === 'Below' ? volume < filters.relativeVolume.value :
         filters.relativeVolume.type === 'Above' ? volume > filters.relativeVolume.value :
         volume >= filters.relativeVolume.min && volume <= filters.relativeVolume.max) &&
        (filters.open.type === 'Below' ? openPrice < filters.open.value :
         filters.open.type === 'Above' ? openPrice > filters.open.value :
         openPrice >= filters.open.min && openPrice <= filters.open.max) &&
        (filters.price.type === 'Below' ? lastPrice < filters.price.value :
         filters.price.type === 'Above' ? lastPrice > filters.price.value :
         lastPrice >= filters.price.min && lastPrice <= filters.price.max)
      );
    });

    setFilteredData(filtered);
  };

  const handleSliderChange = (key, values) => {
    setFilters(prev => ({ ...prev, [key]: { ...prev[key], min: values[0], max: values[1] } }));
  };

  const handleSelectChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: { ...prev[key], type: value } }));
  };

  const handleInputChange = (key, value, minMax = null) => {
    if (minMax) {
      setFilters(prev => ({ ...prev, [key]: { ...prev[key], [minMax]: parseFloat(value) } }));
    } else {
      setFilters(prev => ({ ...prev, [key]: { ...prev[key], value: parseFloat(value) } }));
    }
  };

  const renderVolumeSlider = (key, label) => (
    <div className="mb-4" key={key}>
      <Typography variant="h6" color="blue-gray" className="mb-2">
        {label}
      </Typography>
      <Slider
        value={[filters[key].min, filters[key].max]}
        onChange={(e) => handleSliderChange(key, e.target.value)}
        min={50000}
        max={50000000}
        step={10000}
      />
      <div className="flex justify-between">
        <Input value={`<${filters[key].min.toLocaleString()}`} disabled className="w-24" />
        <Input value={`>${filters[key].max.toLocaleString()}`} disabled className="w-24" />
      </div>
    </div>
  );

  const renderComparisonFilter = (key, label) => (
    <div className="mb-4" key={key}>
      <Typography variant="h6" color="blue-gray" className="mb-2">
        {label}
      </Typography>
      <div className="flex items-center space-x-2">
        <Select value={filters[key].type} onChange={(value) => handleSelectChange(key, value)}>
          <Option value="Below">Below</Option>
          <Option value="Above">Above</Option>
          <Option value="Between">Between</Option>
        </Select>
        {filters[key].type === 'Between' ? (
          <>
            <Input
              type="number"
              value={filters[key].min}
              onChange={(e) => handleInputChange(key, e.target.value, 'min')}
              className="w-24"
              placeholder="Min"
            />
            <Input
              type="number"
              value={filters[key].max}
              onChange={(e) => handleInputChange(key, e.target.value, 'max')}
              className="w-24"
              placeholder="Max"
            />
          </>
        ) : (
          <Input
            type="number"
            value={filters[key].value}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-32"
          />
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-[90rem] mx-auto bg-gray-900 text-white">
      <CardHeader floated={false} shadow={false} className="rounded-none bg-transparent">
        <Typography variant="h3" color="white" className="mb-2 text-center">
          لوحة تحكم العملات المشفرة المتقدمة
        </Typography>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {renderVolumeSlider('averageVolume30', 'Average Volume (30 day)')}
          {renderVolumeSlider('averageVolume60', 'Average Volume (60 day)')}
          {renderVolumeSlider('averageVolume90', 'Average Volume (90 day)')}
          {renderComparisonFilter('relativeVolume', 'Relative Volume')}
          {renderComparisonFilter('open', 'Open')}
          {renderComparisonFilter('price', 'Price')}
        </div>
        <div className="flex justify-between mb-4">
          <Button onClick={applyFilters} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            تطبيق الفلاتر
          </Button>
          <Button onClick={() => {
            setFilters({
              averageVolume30: { min: 50000, max: 50000000 },
              averageVolume60: { min: 50000, max: 50000000 },
              averageVolume90: { min: 50000, max: 50000000 },
              relativeVolume: { type: 'Below', value: 5000 },
              open: { type: 'Between', min: 0, max: 1000000 },
              price: { type: 'Between', min: 0, max: 1000000 },
            });
            setFilteredData(cryptoData);
          }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            إعادة تعيين الفلاتر
          </Button>
        </div>
        
        <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
          <table className="w-full min-w-max table-auto text-left">
            <thead className="bg-blue-gray-800 text-blue-gray-100">
              <tr>
                {["الرمز", "السعر الحالي", "نسبة التغير", "الحجم", "الافتتاح", "الإغلاق"].map((head) => (
                  <th key={head} className="border-b border-blue-gray-700 p-4 sticky top-0 bg-blue-gray-800">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map(({ symbol, lastPrice, priceChangePercent, volume, openPrice, prevClosePrice }, index) => (
                <tr key={symbol} className={index % 2 === 0 ? "bg-blue-gray-900" : "bg-blue-gray-800"}>
                  <td className="p-4 font-medium text-blue-gray-100">{symbol}</td>
                  <td className="p-4">{parseFloat(lastPrice).toFixed(2)}</td>
                  <td className={`p-4 ${parseFloat(priceChangePercent) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {parseFloat(priceChangePercent).toFixed(2)}%
                  </td>
                  <td className="p-4">{parseFloat(volume).toLocaleString()}</td>
                  <td className="p-4">{parseFloat(openPrice).toFixed(2)}</td>
                  <td className="p-4">{parseFloat(prevClosePrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};


