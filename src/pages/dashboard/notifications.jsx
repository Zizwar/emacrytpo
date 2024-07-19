import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { Mic as Microphone, StopCircle, Speaker, Send } from "lucide-react";

export function Notifications() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cryptoData, setCryptoData] = useState([]);
  const [selectedCryptos, setSelectedCryptos] = useState([]);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

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

    fetchCryptoData();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
      const data = await response.json();
      setCryptoData(data.slice(0, 100)); // نأخذ أول 100 عملة فقط للتبسيط
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

  const handleCryptoSelection = (symbol) => {
    setSelectedCryptos(prev => {
      if (prev.includes(symbol)) {
        return prev.filter(s => s !== symbol);
      } else if (prev.length < 20) {
        return [...prev, symbol];
      } else {
        setErrorMessage('يمكنك اختيار 20 عملة كحد أقصى.');
        return prev;
      }
    });
  };

  useEffect(() => {
    const selectedCryptosData = cryptoData.filter(crypto => selectedCryptos.includes(crypto.symbol));
    const systemPromptData = JSON.stringify(selectedCryptosData, null, 2);
    setSystemPrompt(systemPromptData);
  }, [selectedCryptos, cryptoData]);

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
        </div>

        <div className="mt-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            اختر العملات المشفرة (الحد الأقصى 20)
          </Typography>
          <div className="grid grid-cols-4 gap-2">
            {cryptoData.map((crypto) => (
              <Checkbox
                key={crypto.symbol}
                label={crypto.symbol}
                checked={selectedCryptos.includes(crypto.symbol)}
                onChange={() => handleCryptoSelection(crypto.symbol)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Typography variant="h6" color="blue-gray" className="mb-2">
            العملات المختارة
          </Typography>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {["الرمز", "السعر الأخير", "نسبة التغير", "الحجم"].map((head) => (
                  <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cryptoData.filter(crypto => selectedCryptos.includes(crypto.symbol)).map(({ symbol, lastPrice, priceChangePercent, volume }) => (
                <tr key={symbol} className="even:bg-blue-gray-50/50">
                  <td className="p-4">{symbol}</td>
                  <td className="p-4">{lastPrice}</td>
                  <td className="p-4">{priceChangePercent}%</td>
                  <td className="p-4">{volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg relative">
            <Typography>{response}</Typography>
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
    </Card>
  );
}