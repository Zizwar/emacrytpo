import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, Card, CardHeader, CardBody, Progress
} from "@material-tailwind/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { 
  AdvancedRealTimeChart, 
  TechnicalAnalysis, 
  MarketOverview, 
  TickerTape, 
  
  CryptoCurrencyMarket
} from "react-ts-tradingview-widgets";

// دالة جلب بيانات أهم العملات المشفرة
const fetchTopCryptos = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    console.log('تم جلب بيانات العملات المشفرة:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب بيانات العملات المشفرة:', error);
    return [];
  }
};

// دالة جلب البيانات العالمية للعملات المشفرة
const fetchGlobalData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/global');
    console.log('تم جلب البيانات العالمية:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('خطأ في جلب البيانات العالمية:', error);
    return null;
  }
};

// دالة جلب مؤشر الخوف والجشع
const fetchFearGreedIndex = async () => {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    console.log('تم جلب مؤشر الخوف والجشع:', response.data);
    return response.data.data[0];
  } catch (error) {
    console.error('خطأ في جلب مؤشر الخوف والجشع:', error);
    return null;
  }
};

const CryptoCard = ({ crypto }) => (
  <Card className="w-full shadow-lg">
    <CardBody>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img src={crypto.image} alt={crypto.name} className="w-8 h-8 ml-2" />
          <Typography variant="h6">{crypto.name}</Typography>
        </div>
        <Typography variant="h6">${crypto.current_price.toLocaleString()}</Typography>
      </div>
      <div className="flex justify-between items-center">
        <Typography color="gray">التغير خلال 24 ساعة</Typography>
        <Typography 
          color={crypto.price_change_percentage_24h > 0 ? "green" : "red"}
          className="flex items-center"
        >
          {crypto.price_change_percentage_24h > 0 ? (
            <ArrowUpIcon className="h-4 w-4 ml-1" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 ml-1" />
          )}
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </Typography>
      </div>
      <Progress 
        value={Math.abs(crypto.price_change_percentage_24h)} 
        color={crypto.price_change_percentage_24h > 0 ? "green" : "red"}
        className="mt-2"
      />
    </CardBody>
  </Card>
);

const MarketOverviewCard = ({ globalData }) => (
  <Card className="w-full shadow-lg">
    <CardHeader color="blue" className="p-4">
      <Typography variant="h6" color="white">نظرة عامة على السوق</Typography>
    </CardHeader>
    <CardBody>
      <div className="space-y-4">
        <div>
          <Typography variant="h6">إجمالي القيمة السوقية</Typography>
          <Typography>${globalData.total_market_cap.usd.toLocaleString()}</Typography>
        </div>
        <div>
          <Typography variant="h6">حجم التداول 24 ساعة</Typography>
          <Typography>${globalData.total_volume.usd.toLocaleString()}</Typography>
        </div>
        <div>
          <Typography variant="h6">هيمنة البيتكوين</Typography>
          <Typography>{globalData.market_cap_percentage.btc.toFixed(2)}%</Typography>
        </div>
        <div>
          <Typography variant="h6">عدد العملات النشطة</Typography>
          <Typography>{globalData.active_cryptocurrencies}</Typography>
        </div>
        <div>
          <Typography variant="h6">عدد الأسواق</Typography>
          <Typography>{globalData.markets}</Typography>
        </div>
      </div>
    </CardBody>
  </Card>
);

const FearGreedCard = ({ indexData }) => (
  <Card className="w-full shadow-lg">
    <CardHeader color="purple" className="p-4">
      <Typography variant="h6" color="white">مؤشر الخوف والجشع</Typography>
    </CardHeader>
    <CardBody>
      <Typography variant="h4" className="text-center mb-4">{indexData.value}</Typography>
      <Typography variant="h6" className="text-center">{indexData.value_classification}</Typography>
      <Progress value={parseInt(indexData.value)} color="purple" className="mt-4" />
    </CardBody>
  </Card>
);

const ChartCard = ({ title, children }) => (
  <Card className="w-full p-4 m-2">
    <CardHeader color="blue" className="p-2">
      <Typography variant="h6" color="white" className="text-right">
        {title}
      </Typography>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [fearGreedIndex, setFearGreedIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cryptoData = await fetchTopCryptos();
      setCryptos(cryptoData);

      const global = await fetchGlobalData();
      setGlobalData(global);

      const fgi = await fetchFearGreedIndex();
      setFearGreedIndex(fgi);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 rtl">
      <Typography variant="h3" className="mb-8 text-right">لوحة معلومات العملات المشفرة</Typography>
      
      <div className="w-full mb-8">
        <Typography variant="h6" className="mb-2 text-right">أخبار العملات المشفرة</Typography>
        <TickerTape colorTheme="light" displayMode="compact" locale="ar" symbols={[
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          },
          {
            "proName": "BINANCE:BNBUSD",
            "title": "Binance Coin"
          },
          {
            "proName": "BINANCE:ADAUSD",
            "title": "Cardano"
          },
          {
            "proName": "BINANCE:DOGEUSD",
            "title": "Dogecoin"
          }
        ]} />
      </div>

      <div className="mb-8">
        <ChartCard title="جدول العملات المشفرة">
          <CryptoCurrencyMarket 
            colorTheme="light"
            width="100%"
            height={400}
            locale="ar"
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {cryptos.map((crypto) => (
          <CryptoCard key={crypto.id} crypto={crypto} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {globalData && <MarketOverviewCard globalData={globalData} />}
        {fearGreedIndex && <FearGreedCard indexData={fearGreedIndex} />}
      </div>

      <div className="mb-8">
        <ChartCard title="الرسم البياني للبيتكوين">
          <div style={{ height: '60vh', minHeight: '400px' }}>
            <AdvancedRealTimeChart 
              theme="light"
              symbol="BINANCE:BTCUSDT"
              interval="D"
              timezone="Etc/UTC"
              style="1"
              locale="ar"
              toolbar_bg="#f1f3f6"
              enable_publishing={false}
              hide_top_toolbar={false}
              allow_symbol_change={true}
              container_id="tradingview_chart"
              height="100%"
              width="100%"
            />
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ChartCard title="التحليل الفني">
          <TechnicalAnalysis
            colorTheme="light"
            symbol="BINANCE:BTCUSDT"
            showIntervalTabs={true}
            locale="ar"
            width="100%"
            height={400}
          />
        </ChartCard>

        <ChartCard title="نظرة عامة على سوق العملات المشفرة">
          <MarketOverview
            colorTheme="light"
            height={400}
            width="100%"
            showFloatingTooltip
            locale="ar"
            tabs={[
              {
                title: "العملات المشفرة",
                symbols: [
                  {
                    s: "BINANCE:BTCUSDT"
                  },
                  {
                    s: "BINANCE:ETHUSDT"
                  },
                  {
                    s: "BINANCE:BNBUSD"
                  },
                  {
                    s: "BINANCE:ADAUSDT"
                  },
                  {
                    s: "BINANCE:DOGEUSDT"
                  }
                ]
              }
            ]}
          />
        </ChartCard>
      </div>
     </div>
  );
}

export default Home;