export * from "@/data/statistics-cards-data";
export * from "@/data/statistics-charts-data";
export * from "@/data/projects-table-data";
export * from "@/data/orders-overview-data";
export * from "@/data/platform-settings-data";
export * from "@/data/conversations-data";
export * from "@/data/projects-data";
export * from "@/data/authors-table-data";

//

import { CurrencyDollarIcon, ArrowUpIcon, UsersIcon, CubeTransparentIcon } from "@heroicons/react/24/solid";
export const cryptoProjectsData = [
    {
      img: "/img/bitcoin.png",
      name: "بيتكوين",
      members: [
        { img: "/img/team-1.jpg", name: "أحمد محمد" },
        { img: "/img/team-2.jpg", name: "سارة علي" },
        { img: "/img/team-3.jpg", name: "محمد خالد" },
      ],
      marketCap: "$751.3 مليار",
      progress: 90,
    },
    {
      img: "/img/ethereum.png",
      name: "إيثيريوم",
      members: [
        { img: "/img/team-4.jpg", name: "ليلى أحمد" },
        { img: "/img/team-5.jpg", name: "عمر حسن" },
      ],
      marketCap: "$287.5 مليار",
      progress: 75,
    },
    {
      img: "/img/cardano.png",
      name: "كاردانو",
      members: [
        { img: "/img/team-1.jpg", name: "فاطمة علي" },
        { img: "/img/team-2.jpg", name: "ياسر محمود" },
        { img: "/img/team-3.jpg", name: "نور الدين" },
      ],
      marketCap: "$45.2 مليار",
      progress: 60,
    },
    {
      img: "/img/polkadot.png",
      name: "بولكادوت",
      members: [
        { img: "/img/team-4.jpg", name: "رانيا سمير" },
      ],
      marketCap: "$19.8 مليار",
      progress: 40,
    },
  ];
  
  export const marketOverviewData = [
    {
      icon: CurrencyDollarIcon,
      color: "text-green-500",
      title: "إجمالي القيمة السوقية",
      description: "$2.1 تريليون - زيادة بنسبة 3.1%",
    },
    {
      icon: ArrowUpIcon,
      color: "text-red-500",
      title: "حجم التداول اليومي",
      description: "$113 مليار - انخفاض بنسبة 5.2%",
    },
    {
      icon: UsersIcon,
      color: "text-blue-500",
      title: "مستخدمون جدد",
      description: "12,721 - زيادة بنسبة 9.3%",
    },
    {
      icon: CubeTransparentIcon,
      color: "text-orange-500",
      title: "عقود ذكية جديدة",
      description: "1,203 - زيادة بنسبة 12.6%",
    },
  ];