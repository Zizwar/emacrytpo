import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Dummy data for the chart
const cryptoData = [
  { name: 'Jan', BTC: 4000, ETH: 2400, XRP: 2400 },
  { name: 'Feb', BTC: 3000, ETH: 1398, XRP: 2210 },
  { name: 'Mar', BTC: 2000, ETH: 9800, XRP: 2290 },
  { name: 'Apr', BTC: 2780, ETH: 3908, XRP: 2000 },
  { name: 'May', BTC: 1890, ETH: 4800, XRP: 2181 },
  { name: 'Jun', BTC: 2390, ETH: 3800, XRP: 2500 },
  { name: 'Jul', BTC: 3490, ETH: 4300, XRP: 2100 },
];

const CryptoDashboard = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" color="blue-gray">
          Crypto Dashboard
        </Typography>
        <div className="flex space-x-2">
          <IconButton variant="text" color="blue-gray">
            <BellIcon className="h-5 w-5" />
          </IconButton>
          <IconButton variant="text" color="blue-gray">
            <CogIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Bitcoin Price", value: "$34,567.89", change: "+5.67%", icon: CurrencyDollarIcon, color: "text-green-500" },
          { title: "24h Volume", value: "$1.23B", change: "-2.34%", icon: ChartBarIcon, color: "text-red-500" },
          { title: "Market Cap", value: "$645.78B", change: "+1.23%", icon: CurrencyDollarIcon, color: "text-green-500" },
          { title: "Dominance", value: "42.3%", change: "+0.5%", icon: ChartBarIcon, color: "text-green-500" },
        ].map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" color="blue-gray">
                    {stat.value}
                  </Typography>
                </div>
                <div className={`rounded-full p-2 bg-blue-gray-50`}>
                  {React.createElement(stat.icon, {
                    className: "w-6 h-6 text-blue-gray-800",
                  })}
                </div>
              </div>
              <Typography variant="small" className={`flex items-center gap-1 font-normal ${stat.color}`}>
                {stat.change.includes('+') ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                {stat.change}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Price Chart */}
      <Card className="mb-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="flex items-center justify-between p-4">
          <div>
            <Typography variant="h6" color="blue-gray">
              Cryptocurrency Price Chart
            </Typography>
            <Typography variant="small" color="gray">
              Last 7 days performance
            </Typography>
          </div>
          <Menu placement="left-start">
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </IconButton>
            </MenuHandler>
            <MenuList>
              <MenuItem>View Full Chart</MenuItem>
              <MenuItem>Export Data</MenuItem>
              <MenuItem>Settings</MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>
        <CardBody>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cryptoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="BTC" stroke="#FFA500" strokeWidth={2} />
                <Line type="monotone" dataKey="ETH" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="XRP" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Top Cryptocurrencies */}
      <Card className="mb-6">
        <CardHeader floated={false} shadow={false} color="transparent" className="flex items-center justify-between p-4">
          <Typography variant="h6" color="blue-gray">
            Top Cryptocurrencies
          </Typography>
          <Typography variant="small" color="gray" className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4 text-blue-gray-400" />
            Updated 5 mins ago
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Rank", "Name", "Price", "24h Change", "Market Cap", "Volume (24h)"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "Bitcoin", symbol: "BTC", price: "$34,567.89", change: "+5.67%", marketCap: "$645.78B", volume: "$28.45B" },
                { rank: 2, name: "Ethereum", symbol: "ETH", price: "$2,345.67", change: "+3.21%", marketCap: "$274.56B", volume: "$15.78B" },
                { rank: 3, name: "Cardano", symbol: "ADA", price: "$1.23", change: "-2.34%", marketCap: "$39.45B", volume: "$2.67B" },
                { rank: 4, name: "Binance Coin", symbol: "BNB", price: "$345.67", change: "+1.23%", marketCap: "$58.90B", volume: "$1.89B" },
                { rank: 5, name: "XRP", symbol: "XRP", price: "$0.78", change: "-0.56%", marketCap: "$36.12B", volume: "$3.45B" },
              ].map((coin, index) => (
                <tr key={coin.name}>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {coin.rank}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                      <Avatar src={`https://cryptologos.cc/logos/${coin.name.toLowerCase()}-${coin.symbol.toLowerCase()}-logo.png`} alt={coin.name} size="sm" />
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {coin.name}
                        </Typography>
                        <Typography variant="small" color="gray" className="font-normal">
                          {coin.symbol}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {coin.price}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography
                      variant="small"
                      className={`font-medium ${coin.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {coin.change}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {coin.marketCap}
                    </Typography>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {coin.volume}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader floated={false} shadow={false} color="transparent" className="flex items-center justify-between p-4">
          <Typography variant="h6" color="blue-gray">
            Market Sentiment
          </Typography>
        </CardHeader>
        <CardBody>
          <div className="flex justify-between items-center mb-2">
            <Typography variant="small" color="blue-gray">Fear & Greed Index</Typography>
            <Typography variant="small" color="green" className="font-medium">65 - Greed</Typography>
          </div>
          <Progress value={65} color="green" className="h-1" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Buy", value: 65, color: "green" },
              { label: "Hold", value: 20, color: "blue" },
              { label: "Sell", value: 15, color: "red" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="small" color="blue-gray">{item.label}</Typography>
                  <Typography variant="small" color={item.color} className="font-medium">{item.value}%</Typography>
                </div>
                <Progress value={item.value} color={item.color} className="h-1" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CryptoDashboard;