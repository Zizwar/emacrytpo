import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Textarea,
  Chip,
  Spinner,
} from "@material-tailwind/react";
import { Mic as Microphone, StopCircle, Speaker, Send, Search } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export function Notifications () {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const observerRef = useRef(null);
  const allCryptoDataRef = useRef([]);

  const lastCryptoElementRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setUserPrompt(prevPrompt => prevPrompt + transcript + ' ');
      };

      recognitionRef.current.onerror = function(event) {
        console.error('خطأ في التعرف على الكلام:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('خطأ: لم يتم السماح باستخدام الميكروفون. يرجى التحقق من إعدادات المتصفح والسماح بالوصول إلى الميكروفون.');
        } else {
          setErrorMessage('حدث خطأ أثناء التعرف على الكلام. يرجى المحاولة مرة أخرى.');
        }
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    fetchCryptoData();
  }, [page]);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      const sortedData = data.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
      allCryptoDataRef.current = sortedData;
      const paginatedData = sortedData.slice((page - 1) * 10, page * 10);
      setCryptoData(prevData => {
        const newData = [...prevData, ...paginatedData];
        return Array.from(new Set(newData.map(crypto => crypto.symbol)))
          .map(symbol => newData.find(crypto => crypto.symbol === symbol));
      });
      setHasMore(paginatedData.length === 10);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setErrorMessage('حدث خطأ أثناء جلب بيانات العملات المشفرة.');
    }
  };

  const toggleListening = () => {
    setErrorMessage('');
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userPrompt,
          system: systemPrompt
        }),
      });
      const data = await response.json();
      setResponse(data.text);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    }
    setIsLoading(false);
  };

  const speakResponse = () => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = 'ar-SA';
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const results = allCryptoDataRef.current.filter(crypto => 
      crypto.symbol.toLowerCase().includes(term)
    ).slice(0, 10);
    setSearchResults(results);
  };

  const handleCryptoSelection = (crypto) => {
    if (selectedCryptos.length < 20) {
      setSelectedCryptos(prev => [...prev, crypto]);
      setSearchTerm("");
      setSearchResults([]);
    } else {
      setErrorMessage('يمكنك اختيار 20 عملة كحد أقصى.');
    }
  };

  const removeCrypto = (symbol) => {
    setSelectedCryptos(prev => prev.filter(crypto => crypto.symbol !== symbol));
  };

  useEffect(() => {
    const selectedCryptosData = JSON.stringify(selectedCryptos, null, 2);
    setSystemPrompt(selectedCryptosData);
  }, [selectedCryptos]);

  return (
    <Card className="w-full max-w-[64rem] mx-auto">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
          مساعد العملات المشفرة الصوتي
        </Typography>
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              label="الرسالة"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="pr-10"
            />
            <Button
              size="sm"
              color={isListening ? "red" : "blue"}
              className="!absolute right-1 top-1"
              onClick={toggleListening}
            >
              {isListening ? <StopCircle /> : <Microphone />}
            </Button>
          </div>
          {errorMessage && (
            <Typography color="red" className="text-center">
              {errorMessage}
            </Typography>
          )}
          <Button onClick={handleSubmit} fullWidth>
            <Send className="mr-2 h-5 w-5" /> إرسال
          </Button>
          {isLoading && (
            <div className="flex justify-center mt-4">
              <Spinner className="h-6 w-6" />
            </div>
          )}
        </div>
        <CardFooter className="pt-0">
        {response && (
          <div  dir="rtl" className="mt-4 p-4 bg-gray-100 rounded-lg relative">
            <ReactMarkdown>{response}</ReactMarkdown>
            <Button
              size="sm"
              color={isSpeaking ? "red" : "green"}
              className="!absolute right-2 top-2"
              onClick={speakResponse}
            >
              <Speaker />
            </Button>
          </div>
        )}
      </CardFooter>
    

        <div className="mt-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            العملات المختارة
          </Typography>
          <div className="flex flex-wrap gap-2">
            {selectedCryptos.map((crypto) => (
              <Chip
                key={crypto.symbol}
                value={crypto.symbol}
                onClose={() => removeCrypto(crypto.symbol)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            البحث عن العملات المشفرة
          </Typography>
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث عن العملات..."
              value={searchTerm}
              onChange={handleSearch}
              icon={<Search />}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full bg-white shadow-md rounded-b-lg">
                {searchResults.map((crypto) => (
                  <div
                    key={crypto.symbol}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCryptoSelection(crypto)}
                  >
                    {crypto.symbol}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="mt-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            قائمة العملات
          </Typography>
          <div className="h-64 overflow-auto">
            {cryptoData.map((crypto, index) => (
              <div
                key={crypto.symbol}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCryptoSelection(crypto)}
                ref={index === cryptoData.length - 1 ? lastCryptoElementRef : null}
              >
                {crypto.symbol} - {crypto.lastPrice}
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    
    </Card>
  );
}
