import {
  HomeIcon,
  NewspaperIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon,
  QrCodeIcon,
  SignalIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, Crypto, SignalsDisplay, Scanner, Views, News, SignalCreator } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const iconStyle = (color) => ({
  className: `w-5 h-5 text-${color}`,
});

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...iconStyle("blue-500")} />,
        name: "لوحة القيادة",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <NewspaperIcon {...iconStyle("green-500")} />,
        name: "الأخبار",
        path: "/news",
        element: <News />,
      },
      {
        icon: <CurrencyDollarIcon {...iconStyle("yellow-500")} />,
        name: "العملات الرقمية",
        path: "/crypto",
        element: <Crypto />,
      },
      {
        icon: <SignalIcon {...iconStyle("purple-500")} />,
        name: "عرض الإشارات",
        path: "/signal-display",
        element: <SignalsDisplay />,
      },
      {
        icon: <ChartBarIcon {...iconStyle("red-500")} />,
        name: "صانع التوصيات",
        path: "/signals-creator",
        element: <SignalCreator />,
      },
      {
        icon: <EyeIcon {...iconStyle("indigo-500")} />,
        name: "الآراء",
        path: "/views",
        element: <Views />,
      },
      {
        icon: <QrCodeIcon {...iconStyle("pink-500")} />,
        name: "المسح الضوئي",
        path: "/scanner",
        element: <Scanner />,
      },
      {
        icon: <UserCircleIcon {...iconStyle("teal-500")} />,
        name: "الملف الشخصي",
        path: "/profile",
        element: <Profile />,
      },
      /*
      {
        icon: <TableCellsIcon {...iconStyle("orange-500")} />,
        name: "الجداول",
        path: "/tables",
        element: <Tables />,
      },
      */
      {
             icon: <SignalIcon {...iconStyle("cyan-500")} />,
        name: "تداول بذكاء",
        path: "/ai",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "صفحات المصادقة",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...iconStyle("emerald-500")} />,
        name: "تسجيل الدخول",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...iconStyle("fuchsia-500")} />,
        name: "التسجيل",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
