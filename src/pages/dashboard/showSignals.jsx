import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

// بيانات وهمية للتوصيات
const dummyRecommendations = [
  { id: 1, pair: "BTC/USDT", timeframe: "1h", strategy: "EMA Cross", entryPrice: 35000, stopLoss: 34500, takeProfit: 36000, status: "مفتوحة", createdAt: "2024-07-04 10:00:00" },
  { id: 2, pair: "ETH/USDT", timeframe: "4h", strategy: "RSI Oversold", entryPrice: 2200, stopLoss: 2150, takeProfit: 2300, status: "مغلقة (ربح)", createdAt: "2024-07-03 14:00:00" },
  { id: 3, pair: "BNB/USDT", timeframe: "1d", strategy: "MACD Crossover", entryPrice: 300, stopLoss: 290, takeProfit: 320, status: "مغلقة (خسارة)", createdAt: "2024-07-02 09:00:00" },
];

export function SignalsDisplay() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // هنا يمكنك جلب البيانات من API
    setRecommendations(dummyRecommendations);
  }, []);

  const getStatusColor = (status) => {
    if (status === "مفتوحة") return "text-blue-500";
    if (status === "مغلقة (ربح)") return "text-green-500";
    if (status === "مغلقة (خسارة)") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        التوصيات الحالية
      </Typography>

      <Card>
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="blue-gray">
              قائمة التوصيات
            </Typography>
            <Button size="sm">إنشاء توصية جديدة</Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["الزوج", "الإطار الزمني", "الاستراتيجية", "سعر الدخول", "وقف الخسارة", "الهدف", "الحالة", "التاريخ", "الإجراءات"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-right">
                    <Typography variant="small" className="text-[11px] font-medium text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => (
                <tr key={rec.id}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-semibold text-blue-gray-600">
                      {rec.pair}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {rec.timeframe}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {rec.strategy}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {rec.entryPrice}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {rec.stopLoss}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {rec.takeProfit}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className={`text-xs font-medium ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {rec.createdAt}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-2">
                      <IconButton variant="text" color="blue-gray">
                        <ArrowUpIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton variant="text" color="blue-gray">
                        <ArrowDownIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}