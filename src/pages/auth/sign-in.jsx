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
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [identityType, setIdentityType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdentityTypeChange = (value) => {
    setIdentityType(value);
    // Reset other identity fields
    setFormData({
      ...formData,
      username: '',
      email: '',
      phone: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // التحقق من إدخال كلمة المرور وواحد على الأقل من اليوزر نيم أو الهاتف أو البريد الإلكتروني
    if (!formData.password || !(formData.username || formData.email || formData.phone)) {
      setError('يرجى إدخال كلمة المرور وواحد على الأقل من اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف');
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
        // حفظ التوكن في الكوكيز
        document.cookie = `token=${data.token}; path=/; max-age=86400`; // صالح لمدة يوم واحد

        // حفظ التوكن في local storage
        localStorage.setItem('token', data.token);

        // التوجيه إلى الصفحة الرئيسية
        navigate('/');
      } else {
        setError('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setError('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.');
    }
  };

  const renderIdentityInput = () => {
    switch (identityType) {
      case 'username':
        return (
          <Input
            size="lg"
            name="username"
            placeholder="اسم المستخدم"
            onChange={handleChange}
            value={formData.username}
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
            name="email"
            type="email"
            placeholder="name@mail.com"
            onChange={handleChange}
            value={formData.email}
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
            name="phone"
            type="tel"
            placeholder="رقم الهاتف"
            onChange={handleChange}
            value={formData.phone}
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
              value={identityType}
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