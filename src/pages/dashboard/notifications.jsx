import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { Mic, StopCircle, Speaker, Send } from "lucide-react";

export  function Notifications() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    setErrorMessage(''); // مسح رسائل الخطأ السابقة
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

  return (
    <Card className="w-96 mx-auto mt-10">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
          واجهة الدردشة الذكية
        </Typography>
        <div className="space-y-4">
          <Input
            label="النظام"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
          />
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
              {isListening ? <StopCircle /> : <Mic />}
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