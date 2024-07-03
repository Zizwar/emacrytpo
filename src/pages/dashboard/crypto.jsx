import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Avatar, Progress } from "@material-tailwind/react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

// في الواقع، يجب استخدام متغيرات بيئية لتخزين المفاتيح السرية
const APIKEY = '';
const APISECRET = '';

// بيانات وهمية لأغراض العرض
const dummyWalletData = {
  totalBalance: 12345.67,
  assets: [
    { coin: 'BTC', balance: 0.5, value: 15000, icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { coin: 'ETH', balance: 5, value: 10000, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { coin: 'BNB', balance: 50, value: 15000, icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { coin: 'ADA', balance: 10000, value: 5000, icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  ],
  recentTransactions: [
    { type: 'buy', coin: 'BTC', amount: 0.1, value: 3000, date: '2024-07-01' },
    { type: 'sell', coin: 'ETH', amount: 2, value: 4000, date: '2024-06-30' },
    { type: 'transfer', coin: 'BNB', amount: 10, value: 3000, date: '2024-06-29' },
    { type: 'buy', coin: 'ADA', amount: 5000, value: 2500, date: '2024-06-28' },
  ]
};

const BinanceWalletDashboard = () => {
  const [walletData, setWalletData] = useState(dummyWalletData);

  // في الواقع، هنا ستقوم بجلب البيانات من API بينانس
  useEffect(() => {
    // Fetch wallet data from Binance API
    // setWalletData(fetchedData);
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        محفظتي في بينانس
      </Typography>

      {/* إجمالي الرصيد */}
      <Card className="mb-6">
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-2">
            إجمالي الرصيد
          </Typography>
          <Typography variant="h4" color="blue-gray">
            ${walletData.totalBalance.toLocaleString()}
          </Typography>
        </CardBody>
      </Card>

      {/* الأصول */}
      <Card className="mb-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            الأصول
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["العملة", "الرصيد", "القيمة ($)", "النسبة"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-right">
                    <Typography variant="small" className="text-[11px] font-medium text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {walletData.assets.map((asset) => (
                <tr key={asset.coin}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar src={asset.icon} alt={asset.coin} size="sm" />
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {asset.coin}
                      </Typography>
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {asset.balance}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      ${asset.value.toLocaleString()}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="w-10/12">
                      <Typography variant="small" className="mb-1 block text-xs font-medium text-blue-gray-600">
                        {((asset.value / walletData.totalBalance) * 100).toFixed(2)}%
                      </Typography>
                      <Progress
                        value={(asset.value / walletData.totalBalance) * 100}
                        color="blue"
                        className="h-1"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* العمليات الأخيرة */}
      <Card>
        <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            العمليات الأخيرة
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["النوع", "العملة", "الكمية", "القيمة ($)", "التاريخ"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-right">
                    <Typography variant="small" className="text-[11px] font-medium text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {walletData.recentTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {transaction.type === 'buy' ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 inline mr-1" />
                      ) : transaction.type === 'sell' ? (
                        <ArrowDownIcon className="h-4 w-4 text-red-500 inline mr-1" />
                      ) : (
                        <span className="text-blue-500 mr-1">↔</span>
                      )}
                      {transaction.type}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {transaction.coin}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {transaction.amount}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      ${transaction.value.toLocaleString()}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" className="text-xs font-medium text-blue-gray-600">
                      {transaction.date}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default BinanceWalletDashboard;