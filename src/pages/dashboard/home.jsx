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
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsChartsData,
  marketOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";


const cryptoProjectsData = [
  {
    img: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    name: "بيتكوين",
    symbol: "BTC",
    marketCap: "$1,046,899,935,348",
    progress: 65,
  },
  {
    img: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    name: "إيثيريوم",
    symbol: "ETH",
    marketCap: "$225,559,775,406",
    progress: 40,
  },
  {
    img: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    name: "بينانس كوين",
    symbol: "BNB",
    marketCap: "$36,033,694,611",
    progress: 30,
  },
  {
    img: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
    name: "يو إس دي كوين",
    symbol: "USDC",
    marketCap: "$26,169,885,690",
    progress: 80,
  },
  {
    img: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
    name: "تيثر",
    symbol: "USDT",
    marketCap: "$83,761,350,141",
    progress: 70,
  },
];

export function Home() {
  return (
    <div className="mt-12 bg-gray-100 p-6 rounded-xl">
      <Typography variant="h3" color="blue-gray" className="mb-8 text-right">
        لوحة تحكم العملات المشفرة
      </Typography>
    
      <div dir="rtl" className="mb-4 text-right grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-lg">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-purple-500"
          >
            <div>
              <Typography variant="h6" color="white" className="mb-1">
                مشاريع العملات المشفرة
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-50"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-green-300" />
                <strong>5 عملات رئيسية</strong> في السوق
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="white">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currentColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>تفاصيل</MenuItem>
                <MenuItem>تحليل</MenuItem>
                <MenuItem>تصدير البيانات</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["العملة", "الرمز", "القيمة السوقية", "التقدم"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-right"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
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
                  ({ img, name, symbol, marketCap, progress }, key) => {
                    const className = `py-3 px-5 ${
                      key === cryptoProjectsData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={name}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <img src={img} alt={name} className="w-8 h-8" />
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
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {symbol}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {marketCap}
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
                              color={progress > 50 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-lg">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6 bg-gradient-to-r from-green-400 to-cyan-500"
          >
            <Typography variant="h6" color="white" className="mb-2">
              نظرة عامة على السوق
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-50"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-300"
              />
              <strong>15%</strong> زيادة في حجم التداول
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {marketOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:right-2/4 after:w-0.5 after:translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                      key === marketOverviewData.length - 1
                        ? "after:h-0"
                        : "after:h-4/6"
                    }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}
