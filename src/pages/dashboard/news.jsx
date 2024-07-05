import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { Clock, ArrowUpRight, TrendingUp } from "lucide-react";

const cryptoNews = [
  {
    id: 1,
    title: "بيتكوين يتجاوز 50,000 دولار لأول مرة منذ عامين",
    content: "شهدت العملة المشفرة الرائدة ارتفاعًا كبيرًا في قيمتها السوقية...",
    date: "2024-07-05",
    source: "موقع كريبتو نيوز",
    type: "featured"
  },
  {
    id: 2,
    title: "إيثريوم 2.0 يطلق تحديثًا رئيسيًا لتحسين كفاءة الشبكة",
    content: "أعلن مطورو إيثريوم عن إطلاق تحديث جديد يهدف إلى تحسين سرعة المعاملات...",
    date: "2024-07-04",
    source: "مجلة بلوكتشين اليوم",
    type: "regular"
  },
  {
    id: 3,
    title: "دولة عربية تعلن عن خطط لإصدار عملة رقمية وطنية",
    content: "في خطوة تاريخية، أعلنت إحدى الدول العربية عن مشروع لإطلاق عملتها الرقمية...",
    date: "2024-07-03",
    source: "وكالة أنباء الشرق الأوسط للتكنولوجيا",
    type: "regular"
  },
  {
    id: 4,
    title: "شركة تسلا تعيد قبول البيتكوين كوسيلة دفع",
    content: "أعلنت شركة تسلا عن عودتها لقبول البيتكوين كوسيلة دفع لشراء سياراتها الكهربائية...",
    date: "2024-07-02",
    source: "مجلة السيارات والتكنولوجيا",
    type: "breaking"
  },
  {
    id: 5,
    title: "منصة بينانس تطلق خدمة جديدة للتداول الآمن",
    content: "أعلنت منصة بينانس، إحدى أكبر منصات تداول العملات المشفرة، عن إطلاق خدمة جديدة تهدف إلى تعزيز أمان المستخدمين...",
    date: "2024-07-01",
    source: "نشرة الأمن السيبراني",
    type: "regular"
  },
  {
    id: 6,
    title: "ارتفاع قياسي في عدد محافظ البيتكوين النشطة",
    content: "سجلت شبكة البيتكوين ارتفاعًا قياسيًا في عدد المحافظ النشطة، مما يشير إلى زيادة الاهتمام والاستخدام...",
    date: "2024-06-30",
    source: "تحليلات البلوكتشين اليومية",
    type: "breaking"
  },
];

const BreakingNewsTickerR= () => {
  const breakingNews = cryptoNews.filter(news => news.type === 'breaking');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-red-600 text-white p-2 overflow-hidden">
      <div className="flex items-center animate-marquee">
        <TrendingUp className="mr-2" />
        <Typography variant="small" className="font-bold">
          خبر عاجل:
        </Typography>
        <Typography variant="small" className="mr-4">
          {breakingNews[currentNewsIndex].title}
        </Typography>
      </div>
    </div>
  );
};

const NewsCard = ({ news }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={`overflow-hidden ${news.type === 'featured' ? 'col-span-2 row-span-2' : ''}`}>
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
          {news.title}
        </Typography>
        <Typography className={`mb-4 text-gray-700 ${expanded ? '' : 'line-clamp-3'}`}>
          {news.content}
        </Typography>
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="mr-2" />
          <Typography variant="small">{news.date}</Typography>
        </div>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button
          size="sm"
          variant="text"
          className="flex items-center gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "اقرأ أقل" : "اقرأ المزيد"}
          <ArrowUpRight size={16} />
        </Button>
        <Typography variant="small" color="gray">
          المصدر: {news.source}
        </Typography>
      </CardFooter>
    </Card>
  );
};

export function News() {
  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-xl shadow-lg">
      <Typography variant="h2" className="text-3xl font-bold mb-6 text-center text-blue-900">
        آخر أخبار الكريبتو
      </Typography>
      
      <BreakingNewsTickerR />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {cryptoNews.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
}
