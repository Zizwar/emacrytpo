import React from 'react';
import { AdvancedRealTimeChart, TechnicalAnalysis, MarketOverview, TickerTape, EconomicCalendar } from "react-ts-tradingview-widgets";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

const ChartCard = ({ title, children }) => (
  <Card className="w-full lg:w-1/2 p-4 m-2">
    <CardHeader color="blue" className="p-2">
      <Typography variant="h6" color="white">
        {title}
      </Typography>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export function Views() {
  return (
    <div className="flex flex-wrap justify-center">
      <ChartCard title="الرسم البياني المتقدم في الوقت الحقيقي">
        <AdvancedRealTimeChart 
          theme="light"
          symbol="NASDAQ:AAPL"
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
      </ChartCard>

      <ChartCard title="التحليل الفني">
        <TechnicalAnalysis
          colorTheme="light"
          symbol="NASDAQ:AAPL"
          showIntervalTabs={true}
          locale="ar"
          width="100%"
          height={400}
        />
      </ChartCard>

      <ChartCard title="نظرة عامة على السوق">
        <MarketOverview
          colorTheme="light"
          height={400}
          width="100%"
          showFloatingTooltip
          locale="ar"
        />
      </ChartCard>

      <div className="w-full p-4">
        <Typography variant="h6" className="mb-2">شريط الأسعار</Typography>
        <TickerTape colorTheme="light" locale="ar" />
      </div>

      <ChartCard title="التقويم الاقتصادي">
        <EconomicCalendar
          colorTheme="light"
          height={400}
          width="100%"
          locale="ar"
        />
      </ChartCard>
    </div>
  );
}

