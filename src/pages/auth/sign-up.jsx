import React, { useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.password || !(formData.email || formData.phone)) {
      setError('يرجى إدخال كلمة المرور والبريد الإلكتروني أو رقم الهاتف على الأقل');
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
        setSuccessMessage('تم التسجيل بنجاح!');
        setTimeout(() => {
          navigate('/auth/sign-in');
        }, 2000);
      } else {
        setError(data.message || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setError('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.');
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <img height={200} width={200} src="https://cdn-icons-png.flaticon.com/512/887/887768.png" alt="Icon" className="mx-auto mb-4"/>
          <Typography variant="h2" className="font-bold mb-4">انضم إلينا اليوم</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">أدخل بياناتك للتسجيل.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Input
              size="lg"
              name="firstname"
              placeholder="الاسم الأول"
              onChange={handleChange}
              value={formData.firstname}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Input
              size="lg"
              name="lastname"
              placeholder="اسم العائلة"
              onChange={handleChange}
              value={formData.lastname}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Input
              size="lg"
              name="username"
              placeholder="اسم المستخدم"
              onChange={handleChange}
              value={formData.username}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Input
              size="lg"
              name="email"
              type="email"
              placeholder="البريد الإلكتروني"
              onChange={handleChange}
              value={formData.email}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Input
              size="lg"
              name="password"
              type="password"
              placeholder="كلمة المرور"
              onChange={handleChange}
              value={formData.password}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Input
              size="lg"
              name="phone"
              placeholder="رقم الهاتف"
              onChange={handleChange}
              value={formData.phone}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                أوافق على&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  الشروط والأحكام
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          {error && <Alert color="red" className="mt-4">{error}</Alert>}
          {successMessage && <Alert color="green" className="mt-4">{successMessage}</Alert>}
          <Button className="mt-6" fullWidth type="submit">
            سجل الآن
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            لديك حساب بالفعل؟
            <Link to="/auth/sign-in" className="text-gray-900 mr-1">تسجيل الدخول</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;