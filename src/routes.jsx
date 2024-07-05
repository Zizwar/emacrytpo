
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, Crypto, SignalsDisplay, Scanner, Views, News } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "لوحة القيادة",
        path: "/home",
        element: <Home />,
      }, 
      {
        icon: <UserCircleIcon {...icon} />,
        name: "الأخبار",
        path: "/news",
        element: <News />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "العملات الرقمية",
        path: "/crypto",
        element: <Crypto />,
      },
      /* {
        icon: <UserCircleIcon {...icon} />,
        name: "الرسوم البيانية",
        path: "/charts",
        element: <Charts />,
      }, */
      {
        icon: <UserCircleIcon {...icon} />,
        name: "الآراء",
        path: "/views",
        element: <Views />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "المسح الضوئي",
        path: "/scanner",
        element: <Scanner />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "عرض الإشارات",
        path: "/signal-display",
        element: <SignalsDisplay />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "الملف الشخصي",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "الجداول",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "الإشعارات",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "صفحات المصادقة",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "تسجيل الدخول",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "التسجيل",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
