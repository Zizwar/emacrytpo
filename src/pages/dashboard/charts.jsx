import React from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, CandlestickChart, Candlestick, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

const data = [
  { name: 'يناير', قيمة: 4000, حجم: 2400, فتح: 100, إغلاق: 300, أعلى: 400, أدنى: 50 },
  { name: 'فبراير', قيمة: 3000, حجم: 1398, فتح: 120, إغلاق: 200, أعلى: 380, أدنى: 80 },
  { name: 'مارس', قيمة: 2000, حجم: 9800, فتح: 150, إغلاق: 250, أعلى: 300, أدنى: 100 },
  { name: 'أبريل', قيمة: 2780, حجم: 3908, فتح: 180, إغلاق: 220, أعلى: 320, أدنى: 120 },
  { name: 'مايو', قيمة: 1890, حجم: 4800, فتح: 200, إغلاق: 280, أعلى: 360, أدنى: 150 },
  { name: 'يونيو', قيمة: 2390, حجم: 3800, فتح: 220, إغلاق: 270, أعلى: 340, أدنى: 180 },
];

const ChartCard = ({ title, children }) => (
  <Card className="w-full md:w-1/2 lg:w-1/3 p-4 m-2">
    <CardHeader color="blue" className="p-2">
      <Typography variant="h6" color="white">
        {title}
      </Typography>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);

export function Charts() {
  return (
    <div className="flex flex-wrap justify-center">
      <ChartCard title="مخطط الخط">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="قيمة" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="مخطط الأعمدة">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="حجم" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="مخطط المساحة">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="قيمة" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="مخطط الشموع">
        <ResponsiveContainer width="100%" height={300}>
          <CandlestickChart data={data}>
            <XAxis dataKey="name" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Candlestick
              yAccessor={d => [d.فتح, d.أعلى, d.أدنى, d.إغلاق]}
              stroke="#000000"
              fill={(d) => (d.إغلاق > d.فتح ? "#00ff00" : "#ff0000")}
            />
          </CandlestickChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

