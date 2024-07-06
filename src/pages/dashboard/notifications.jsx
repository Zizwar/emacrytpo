import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Input, Select, Option } from "@material-tailwind/react";

export function Notifications() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTCUSDT');
  const [priceAlert, setPriceAlert] = useState('');
  const [cryptoData, setCryptoData] = useState([]);
  const [timeframe, setTimeframe] = useState('1d');
  
  const chartRefs = [useRef(null), useRef(null), useRef(null)];

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
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [selectedCrypto, timeframe]);

  useEffect(() => {
    if (cryptoData.length > 0 && am5) {
      chartRefs.forEach((ref, index) => {
        if (ref.current) {
          ref.current.dispose();
        }

        let root = am5.Root.new(`chartdiv${index + 1}`);
        ref.current = root;

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

        let series;
        switch (index) {
          case 0:
            series = chart.series.push(
              am5xy.LineSeries.new(root, {
                name: "Price",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "close",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                  labelText: "{valueY}"
                })
              })
            );
            break;
          case 1:
            series = chart.series.push(
              am5xy.ColumnSeries.new(root, {
                name: "Volume",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "volume",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                  labelText: "{valueY}"
                })
              })
            );
            break;
          case 2:
            series = chart.series.push(
              am5xy.CandlestickSeries.new(root, {
                name: "Candlestick",
                xAxis: xAxis,
                yAxis: yAxis,
                openValueYField: "open",
                highValueYField: "high",
                lowValueYField: "low",
                closeValueYField: "close",
                valueXField: "date",
                tooltip: am5.Tooltip.new(root, {
                  labelText: "Open: {openValueY}\nHigh: {highValueY}\nLow: {lowValueY}\nClose: {closeValueY}"
                })
              })
            );
            break;
        }

        series.data.setAll(cryptoData);

        chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
      });
    }

    return () => {
      chartRefs.forEach(ref => {
        if (ref.current) {
          ref.current.dispose();
        }
      });
    };
  }, [cryptoData]);

  const handleCryptoChange = (value) => {
    setSelectedCrypto(value);
  };

  const handleAlertSet = () => {
    alert(`Alert set at price: $${priceAlert}`);
  };

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
  };

  return (
    <Card className="w-full max-w-[1200px] mx-auto">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h2" color="blue-gray" className="text-center">
          Crypto Dashboard
        </Typography>
      </CardHeader>
      <CardBody>
        <div className="mb-4 flex justify-between">
          <Select
            label="Select Cryptocurrency"
            value={selectedCrypto}
            onChange={handleCryptoChange}
            className="w-1/3"
          >
            <Option value="BTCUSDT">Bitcoin</Option>
            <Option value="ETHUSDT">Ethereum</Option>
            <Option value="BNBUSDT">Binance Coin</Option>
            <Option value="ADAUSDT">Cardano</Option>
            <Option value="XRPUSDT">Ripple</Option>
          </Select>
          <Select
            label="Select Timeframe"
            value={timeframe}
            onChange={handleTimeframeChange}
            className="w-1/3"
          >
            <Option value="1m">1 minute</Option>
            <Option value="5m">5 minutes</Option>
            <Option value="15m">15 minutes</Option>
            <Option value="1h">1 hour</Option>
            <Option value="4h">4 hours</Option>
            <Option value="1d">1 day</Option>
          </Select>
          <div className="w-1/3 flex items-center">
            <Input
              type="number"
              label="Set Price Alert"
              value={priceAlert}
              onChange={(e) => setPriceAlert(e.target.value)}
              className="mr-2"
            />
            <Button onClick={handleAlertSet}>
              Set Alert
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
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </CardFooter>
    </Card>
  );
}
