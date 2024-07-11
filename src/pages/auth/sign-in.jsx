import React, { useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // التحقق من إدخال كلمة المرور وواحد على الأقل من اليوزر نيم أو الهاتف أو البريد الإلكتروني
    if (!formData.password || !(formData.username || formData.email || formData.phone)) {
      setError('يرجى إدخال كلمة المرور وواحد على الأقل من اسم المستخدم أو البريد الإلكتروني أو رقم الهاتف');
      return;
    }

    try {
      const response = await fetch('/api/register', {
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

        // عرض رسالة نجاح
        setSuccessMessage(`تم تسجيل الدخول بنجاح! التوكن: ${data.token}`);

        // عرض التوكن في نافذة تنبيه
        alert(`تم استلام التوكن: ${data.token}`);
      } else {
        setError('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setError('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.');
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <img src="/path/to/your/icon.png" alt="Icon" className="mx-auto mb-4"/>
          <Typography variant="h2" className="font-bold mb-4">تسجيل الدخول</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">أدخل بياناتك لتسجيل الدخول.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              اسم المستخدم
            </Typography>
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
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              البريد الإلكتروني
            </Typography>
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
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              رقم الهاتف
            </Typography>
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
            <Link to="/register" className="text-gray-900 mr-1">إنشاء حساب</Link>
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