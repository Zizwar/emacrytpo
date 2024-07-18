import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
  Select,
  Option,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

export function SignIn() {
  const [formData, setFormData] = useState({
    identityType: '',
    identityValue: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdentityTypeChange = (value) => {
    setFormData({ ...formData, identityType: value, identityValue: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.identityType || !formData.identityValue || !formData.password) {
      setError('يرجى إدخال جميع الحقول المطلوبة');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // تخزين التوكن في الكوكي
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
        
        // تخزين التوكن في Local Storage
        localStorage.setItem('token', data.token);
        
        // عرض رسالة نجاح بدون إظهار التوكن
        setSuccessMessage('تم تسجيل الدخول بنجاح!');
        
        // التوجيه إلى الصفحة الرئيسية بعد ثانية واحدة
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setError('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.');
    }
  };

  const renderIdentityInput = () => {
    switch (formData.identityType) {
      case 'username':
        return (
          <Input
            size="lg"
            name="identityValue"
            placeholder="اسم المستخدم"
            onChange={handleChange}
            value={formData.identityValue}
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        );
      case 'email':
        return (
          <Input
            size="lg"
            name="identityValue"
            type="email"
            placeholder="name@mail.com"
            onChange={handleChange}
            value={formData.identityValue}
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        );
      case 'phone':
        return (
          <Input
            size="lg"
            name="identityValue"
            type="tel"
            placeholder="رقم الهاتف"
            onChange={handleChange}
            value={formData.identityValue}
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <img height={200} width={200} src="https://cdn-icons-png.flaticon.com/512/887/887768.png" alt="Icon" className="mx-auto mb-4"/>
          <Typography variant="h2" className="font-bold mb-4">تسجيل الدخول</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">أدخل بياناتك لتسجيل الدخول.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              اختر طريقة تسجيل الدخول
            </Typography>
            <Select
              size="lg"
              name="identityType"
              value={formData.identityType}
              onChange={handleIdentityTypeChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            >
              <Option value="username">اسم المستخدم</Option>
              <Option value="email">البريد الإلكتروني</Option>
              <Option value="phone">رقم الهاتف</Option>
            </Select>
            {renderIdentityInput()}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              كلمة المرور
            </Typography>
            <Input
              type="password"
              name="password"
              size="lg"
              placeholder="********"
              onChange={handleChange}
              value={formData.password}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          {error && <Alert color="red" className="mt-4">{error}</Alert>}
          {successMessage && <Alert color="green" className="mt-4">{successMessage}</Alert>}
          <Button className="mt-6" fullWidth type="submit">
            تسجيل الدخول
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            ليس لديك حساب؟
            <Link to="/auth/sign-up" className="text-gray-900 mr-1">إنشاء حساب</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;