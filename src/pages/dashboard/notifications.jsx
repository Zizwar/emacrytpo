import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Input, Select, Option } from "@material-tailwind/react";

export function Notifications ()  {
  const [selectedCrypto, setSelectedCrypto] = useState('BTCUSDT');
  const [priceAlert, setPriceAlert] = useState('');
  const [cryptoData, setCryptoData] = useState([]);
  const [timeframe, setTimeframe] = useState('1d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${selectedCrypto}&interval=${timeframe}`);
        const formattedData = response.data.map(item => ({
          date: new Date(item[0]),
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
          volume: parseFloat(item[5])
        }));
        setCryptoData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // تحديث كل دقيقة

    return () => clearInterval(interval);
  }, [selectedCrypto, timeframe]);

  useEffect(() => {
    // إنشاء الرسم البياني الأول: سعر الإغلاق
    let root = am5.Root.new("chartdiv1");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "السعر",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "close",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      })
    );

    series.data.setAll(cryptoData);

    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

    return () => {
      root.dispose();
    };
  }, [cryptoData]);

  useEffect(() => {
    // إنشاء الرسم البياني الثاني: حجم التداول
    let root = am5.Root.new("chartdiv2");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX"
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "الحجم",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "volume",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}"
        })
      })
    );

    series.data.setAll(cryptoData);

    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

    return () => {
      root.dispose();
    };
  }, [cryptoData]);

  useEffect(() => {
    // إنشاء الرسم البياني الثالث: مخطط الشموع
    let root = am5.Root.new("chartdiv3");
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5stock.StockChart.new(root, {})
    );

    let mainPanel = chart.panels.push(
      am5stock.StockPanel.new(root, {
        wheelY: "zoomX",
        panX: true,
        panY: true
      })
    );

    let valueAxis = mainPanel.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    let dateAxis = mainPanel.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    );

    let series = mainPanel.series.push(
      am5stock.CandlestickSeries.new(root, {
        name: "MSFT",
        valueYField: "close",
        openValueYField: "open",
        lowValueYField: "low",
        highValueYField: "high",
        valueXField: "date",
        tooltipText: "Open: {openValueY}\nLow: {lowValueY}\nHigh: {highValueY}\nClose: {valueY}",
      })
    );

    series.data.setAll(cryptoData);

    let scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50
    }));
    chart.set("scrollbarX", scrollbar);

    return () => {
      root.dispose();
    };
  }, [cryptoData]);

  const handleCryptoChange = (value) => {
    setSelectedCrypto(value);
  };

  const handleAlertSet = () => {
    alert(`تم تعيين التنبيه عند السعر: ${priceAlert} دولار`);
  };

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
  };

  return (
    <Card className="w-full max-w-[1200px] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h2" color="blue-gray" className="text-center">
          لوحة تحكم العملات الرقمية
        </Typography>
      </CardHeader>
      <CardBody>
        <div className="mb-4 flex justify-between">
          <Select
            label="اختر العملة الرقمية"
            value={selectedCrypto}
            onChange={handleCryptoChange}
            className="w-1/3"
          >
            <Option value="BTCUSDT">بيتكوين</Option>
            <Option value="ETHUSDT">إيثيريوم</Option>
            <Option value="BNBUSDT">بينانس كوين</Option>
            <Option value="ADAUSDT">كاردانو</Option>
            <Option value="XRPUSDT">ريبل</Option>
          </Select>
          <Select
            label="اختر الإطار الزمني"
            value={timeframe}
            onChange={handleTimeframeChange}
            className="w-1/3"
          >
            <Option value="1m">دقيقة</Option>
            <Option value="5m">5 دقائق</Option>
            <Option value="15m">15 دقيقة</Option>
            <Option value="1h">ساعة</Option>
            <Option value="4h">4 ساعات</Option>
            <Option value="1d">يوم</Option>
          </Select>
          <div className="w-1/3 flex items-center">
            <Input
              type="number"
              label="تعيين تنبيه السعر"
              value={priceAlert}
              onChange={(e) => setPriceAlert(e.target.value)}
              className="mr-2"
            />
            <Button onClick={handleAlertSet}>
              تعيين التنبيه
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div id="chartdiv1" style={{ width: "100%", height: "300px" }}></div>
          <div id="chartdiv2" style={{ width: "100%", height: "300px" }}></div>
        </div>
        <div className="mt-4">
          <div id="chartdiv3" style={{ width: "100%", height: "400px" }}></div>
        </div>
      </CardBody>
      <CardFooter>
        <Typography variant="small" className="text-center">
          آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
        </Typography>
      </CardFooter>
    </Card>
  );
};

export default Notifications;