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
import { Mic, MicOff, Speaker, Send } from "lucide-react";

export  function Notifications() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listeningMessage, setListeningMessage] = useState("");

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        // Insert the transcript at the current cursor position
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        setUserPrompt(before + transcript + after);
        
        // Move cursor to end of inserted text
        textarea.selectionStart = textarea.selectionEnd = start + transcript.length;
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setListeningMessage("");
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
    if (isListening) {
      recognitionRef.current.stop();
      setListeningMessage("");
    } else {
      recognitionRef.current.start();
      setListeningMessage("جاري الاستماع...");
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
              ref={textareaRef}
            />
            <Button
              size="sm"
              color={isListening ? "red" : "blue"}
              className="!absolute right-1 top-1"
              onClick={toggleListening}
            >
              {isListening ? <MicOff /> : <Mic />}
            </Button>
          </div>
          {listeningMessage && (
            <Typography color="blue" className="text-center">
              {listeningMessage}
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