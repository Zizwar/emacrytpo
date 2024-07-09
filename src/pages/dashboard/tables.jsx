eimport React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Chip,
  Spinner
} from "@material-tailwind/react";

// افتراض أن هذه الدالة موجودة لحساب مؤشر البولينجر باند
const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
  // هذه مجرد محاكاة بسيطة. في الواقع، ستحتاج إلى حساب المتوسط المتحرك والانحراف المعياري
  const upperBand = parseFloat(data.lastPrice) * (1 + 0.02);
  const lowerBand = parseFloat(data.lastPrice) * (1 - 0.02);
  return { upper: upperBand, lower: lowerBand };
};

export function Tables() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    changePercent: '',
    volume: '',
    bollingerBand: 'none',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // تحديث كل دقيقة
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = data.filter(item => {
      const price = parseFloat(item.lastPrice);
      const change = parseFloat(item.priceChangePercent);
      const volume = parseFloat(item.volume);
      const { upper, lower } = calculateBollingerBands(item);

      return (
        (filters.priceMin === '' || price >= parseFloat(filters.priceMin)) &&
        (filters.priceMax === '' || price <= parseFloat(filters.priceMax)) &&
        (filters.changePercent === '' || Math.abs(change) >= parseFloat(filters.changePercent)) &&
        (filters.volume === '' || volume >= parseFloat(filters.volume)) &&
        (filters.bollingerBand === 'none' ||
         (filters.bollingerBand === 'above' && price > upper) ||
         (filters.bollingerBand === 'below' && price < lower))
      );
    });

    setFilteredData(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="موقع السعر من نطاق البولينجر"
              name="bollingerBand"
              value={filters.bollingerBand}
              onChange={(value) => setFilters({ ...filters, bollingerBand: value })}
            >
              <Option value="none">لا يهم</Option>
              <Option value="above">فوق النطاق العلوي</Option>
              <Option value="below">تحت النطاق السفلي</Option>
            </Select>
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
                {["الرمز", "السعر", "التغيير", "الحجم", "نطاق البولينجر"].map((el) => (
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
                const { upper, lower } = calculateBollingerBands(item);

                return (
                  <tr key={item.symbol}>
                    <td className={className}>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        {item.symbol}
                      </Typography>
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
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {`${lower.toFixed(2)} - ${upper.toFixed(2)}`}
                      </Typography>
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
};

