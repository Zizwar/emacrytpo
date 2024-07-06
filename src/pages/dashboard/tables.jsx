import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

// بيانات العملات المشفرة الرئيسية
const topCryptosData = [
  {
    img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    name: "Bitcoin",
    symbol: "BTC",
    price: "$29,823.71",
    change: "+1.24%",
    marketCap: "$578.90B",
    volume: "$13.59B",
  },
  {
    img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    name: "Ethereum",
    symbol: "ETH",
    price: "$1,867.63",
    change: "-0.37%",
    marketCap: "$224.57B",
    volume: "$7.16B",
  },
  {
    img: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    name: "BNB",
    symbol: "BNB",
    price: "$240.14",
    change: "+0.84%",
    marketCap: "$37.93B",
    volume: "$418.55M",
  },
  {
    img: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
    name: "USD Coin",
    symbol: "USDC",
    price: "$1.00",
    change: "+0.01%",
    marketCap: "$28.47B",
    volume: "$2.50B",
  },
  {
    img: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    name: "Tether",
    symbol: "USDT",
    price: "$1.00",
    change: "-0.02%",
    marketCap: "$83.65B",
    volume: "$17.30B",
  },
];

// بيانات مشاريع العملات المشفرة
const cryptoProjectsData = [
  {
    img: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    name: "Polygon",
    members: [
      { img: "/img/team-1.jpg", name: "Ryan Tompson" },
      { img: "/img/team-2.jpg", name: "Romina Hadid" },
      { img: "/img/team-3.jpg", name: "Alexander Smith" },
      { img: "/img/team-4.jpg", name: "Jessica Doe" },
    ],
    fundingRaised: "$120M",
    progress: 60,
  },
  {
    img: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png",
    name: "Avalanche",
    members: [
      { img: "/img/team-2.jpg", name: "Romina Hadid" },
      { img: "/img/team-3.jpg", name: "Alexander Smith" },
    ],
    fundingRaised: "$230M",
    progress: 80,
  },
  {
    img: "https://assets.coingecko.com/coins/images/4380/small/download.png",
    name: "Solana",
    members: [
      { img: "/img/team-1.jpg", name: "Ryan Tompson" },
      { img: "/img/team-4.jpg", name: "Jessica Doe" },
    ],
    fundingRaised: "$314M",
    progress: 75,
  },
  {
    img: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
    name: "Chainlink",
    members: [
      { img: "/img/team-1.jpg", name: "Ryan Tompson" },
      { img: "/img/team-2.jpg", name: "Romina Hadid" },
      { img: "/img/team-3.jpg", name: "Alexander Smith" },
      { img: "/img/team-4.jpg", name: "Jessica Doe" },
    ],
    fundingRaised: "$32M",
    progress: 90,
  },
  {
    img: "https://assets.coingecko.com/coins/images/9956/small/4943.png",
    name: "Dai",
    members: [
      { img: "/img/team-4.jpg", name: "Jessica Doe" },
      { img: "/img/team-3.jpg", name: "Alexander Smith" },
    ],
    fundingRaised: "$95M",
    progress: 95,
  },
];

export function Tables() {
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            العملات المشفرة الرئيسية
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["العملة", "السعر", "التغيير", "القيمة السوقية", "حجم التداول", ""].map((el) => (
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
              {topCryptosData.map(
                ({ img, name, symbol, price, change, marketCap, volume }, key) => {
                  const className = `py-3 px-5 ${
                    key === topCryptosData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" variant="circular" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {symbol}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {price}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={change.startsWith('+') ? "green" : "red"}
                          value={change}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {marketCap}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {volume}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          تفاصيل
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            مشاريع العملات المشفرة
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["المشروع", "الفريق", "التمويل", "التقدم", ""].map(
                  (el) => (
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
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {cryptoProjectsData.map(
                ({ img, name, members, fundingRaised, progress }, key) => {
                  const className = `py-3 px-5 ${
                    key === cryptoProjectsData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={img} alt={name} size="sm" />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {name}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-blue-gray-600"
                        >
                          {fundingRaised}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-blue-gray-600"
                          >
                            {progress}%
                          </Typography>
                          <Progress
                            value={progress}
                            variant="gradient"
                            color={progress === 100 ? "green" : "blue"}
                            className="h-1"
                          />
                        </div>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
