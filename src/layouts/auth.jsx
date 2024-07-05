import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { Navbar, Footer } from "@/widgets/layout";
import routes from "@/routes";

export function Auth() {
  const navbarRoutes = [
    {
      name: "لوحة القيادة",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "الملف الشخصي",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "التسجيل",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "تسجيل الدخول",
      path: "/auth/sign-in",
      icon: ArrowRightOnRectangleIcon,
    },
  ];

  return (
    <div className="relative min-h-screen w-full text-right" dir='rtl' style={{direction:"rtl"}}>
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
