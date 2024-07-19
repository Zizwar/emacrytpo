import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import { Clock, ArrowUpRight, TrendingUp } from "lucide-react";

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

const TranslateButton = () => {
  useEffect(() => {
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'ar',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );
      };

      addScript();
    }

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="flex items-center justify-end mb-4">
      <Globe className="mr-2" />
      <div id="google_translate_element"></div>
    </div>
  );
};
const BreakingNewsTicker = ({ breakingNews }) => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % breakingNews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [breakingNews]);

  return (
    <div className="bg-red-600 text-white p-2 overflow-hidden">
      <div className="flex items-center animate-marquee">
        <TrendingUp className="ml-2" />
        <Typography variant="small" className="font-bold ml-2">
          خبر عاجل:
        </Typography>
        <Typography variant="small" className="ml-4">
          {breakingNews[currentNewsIndex]?.title || 'جاري التحميل...'}
        </Typography>
      </div>
    </div>
  );
};

const NewsCard = ({ news, size }) => {
  const [expanded, setExpanded] = useState(false);

  const cardSizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-2",
    large: "col-span-1 md:col-span-2 lg:col-span-3",
  };

  const cardColorClasses = [
    "bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-red-50", "bg-purple-50"
  ];

  const randomColorClass = cardColorClasses[Math.floor(Math.random() * cardColorClasses.length)];

  return (
    <Card className={`overflow-hidden ${cardSizeClasses[size]} ${randomColorClass}`}>
      {news.thumb_2x && (
        <img
          src={news.thumb_2x}
          alt={news.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-2 font-bold">
          {news.title}
        </Typography>
        <Typography className={`mb-4 text-gray-700 ${expanded ? '' : 'line-clamp-3'}`}>
          {news.description}
        </Typography>
        <div className="flex items-center text-gray-600">
          <Clock size={16} className="ml-2" />
          <Typography variant="small">
            {new Date(news.updated_at * 1000).toLocaleString('ar-SA')}
          </Typography>
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
          المصدر: {news.news_site}
        </Typography>
      </CardFooter>
    </Card>
  );
};

export function News() {
  const [news, setNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${COINGECKO_API_URL}/news`);
        const newsArray = response.data.data || [];
        setNews(newsArray);
        setBreakingNews(newsArray.slice(0, 5));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []); 

  const getCardSize = (index) => {
    if (index % 7 === 0) return "large";
    if (index % 3 === 0) return "medium";
    return "small";
  };

  return (
    <div dir="rtl" className="container mx-auto p-4 bg-gray-100 rounded-xl shadow-lg">
      <Typography variant="h2" className="text-3xl font-bold mb-6 text-center text-blue-900">
        آخر أخبار العملات الرقمية
      </Typography>
      
      {breakingNews.length > 0 && <BreakingNewsTicker breakingNews={breakingNews} />}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {news.map((item, index) => (
          <NewsCard key={index} news={item} size={getCardSize(index)} />
        ))}
      </div>
    </div>
  );
}