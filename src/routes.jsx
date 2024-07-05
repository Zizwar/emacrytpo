import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications ,Crypto, SignalsDisplay,Scanner,
  Charts,Views,News
} from "@/pages/dashboard";
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
        name: "dashboard",
        path: "/home",
        element: <Home />,
      }, {
        icon: <UserCircleIcon {...icon} />,
        name: "news",
        path: "/news",
        element: <News />,
      },{
        icon: <UserCircleIcon {...icon} />,
        name: "crypto",
        path: "/crypto",
        element: <Crypto />,
      }, {
        icon: <UserCircleIcon {...icon} />,
        name: "charts",
        path: "/charts",
        element: <Charts />,
      }, {
        icon: <UserCircleIcon {...icon} />,
        name: "views",
        path: "/views",
        element: <Views />,
      },{
        icon: <UserCircleIcon {...icon} />,
        name: "scanner",
        path: "/scanner",
        element: <Scanner />,
      },
{
        icon: <UserCircleIcon {...icon} />,
        name: "Signals Display",
        path: "/signal-display",
        element: <SignalsDisplay />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
