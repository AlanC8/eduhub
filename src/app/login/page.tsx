'use client';
import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Interceptor from "@/service/Interceptor";
import useRequest from "@/app/hooks/useRequest";
import { LoginApiResponse, LoginFormState } from "@/types";

const IconMail = () => <span className="material-icons-round text-lg">alternate_email</span>;
const IconLock = () => <span className="material-icons-round text-lg">lock_open</span>; 
const IconEye = () => <span className="material-icons-round text-lg">visibility</span>;
const IconEyeSlash = () => <span className="material-icons-round text-lg">visibility_off</span>;
const IconArrowRight = ({ className }: { className?: string }) => (
  <span className={`material-icons-round text-lg ${className || ''}`}>arrow_forward</span>
);
const IconSpinner = () => <span className="material-icons-round animate-spin text-lg">sync</span>; 
const IconAlertTriangle = () => <span className="material-icons-round text-lg">warning_amber</span>; 

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState<LoginFormState>({
    login: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); 
  const [currentLanguage, setCurrentLanguage] = useState("Русский");

  const {
    request: loginRequest,
    loading,
    error: apiError,
  } = useRequest<LoginApiResponse, LoginFormState>();  

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordVisibilityToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.login || !form.password) return;
  
    const payload = { login: form.login, password: form.password };
  
    try {
      const response = await loginRequest("/auth/login", {
        method: "POST",
        data: payload,
      });
      
      console.log('Login API response:', response);
      
      if (response?.data?.token) {
        console.log('Token found, saving data...');
        console.log('Response data:', response.data);
        
        const interceptor = Interceptor.getInstance();
        interceptor.setToken(response.data.token);
        interceptor.setRole(response.data.role);
        interceptor.setUserId(response.data.user_id);
        
        console.log('Data saved to localStorage');
        console.log('Role saved:', response.data.role);
        console.log('Token saved:', response.data.token);
        console.log('User ID saved:', response.data.user_id);
        
        switch (response.data.role) {
          case "admin":
            console.log('Redirecting to /admin');
            router.push("/admin");
            break;
          case "teacher":
            console.log('Redirecting to /teacher');
            router.push("/teacher");
            break;
          case "student":
            console.log('Redirecting to /');
            router.push("/");
            break;
          default:
            console.log('Unknown role, redirecting to /');
            router.push("/");
        }
      } else {
        console.log('No token in response:', response);
      }
    } catch (err) {
      console.error("Login failed on component level:", err);
    }
  };

  const getErrorMessage = () => {
    if (!apiError) return null;
    if (apiError.response?.status === 401 || apiError.response?.status === 403) {
        return "Неверный логин или пароль.";
    }
    return "Что-то пошло не так. Попробуйте снова.";
  };
  const userFriendlyError = getErrorMessage();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans antialiased">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 xl:p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full opacity-50 mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute -bottom-24 -right-16 w-96 h-96 bg-secondary/10 rounded-full opacity-40 mix-blend-screen animation-delay-2000 animate-pulse-slower"></div>

        <div className="z-10">
          <Link href="/" className="inline-flex items-center space-x-2.5 group mb-24">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center 
                            group-hover:scale-110 group-hover:rotate-[-12deg] transition-transform duration-300 ease-out">
              <span className="text-2xl font-bold text-slate-900">E</span>
            </div>
            <span className="text-2xl font-medium tracking-tight">EduHub</span>
          </Link>

          <h1 className="text-4xl xl:text-[52px] font-semibold mb-6 leading-tight tracking-tighter">
            Будущее обучения. <br /> Уже здесь.
          </h1>
          <p className="text-lg xl:text-xl text-slate-300 max-w-lg leading-relaxed">
            Присоединяйтесь к тысячам студентов и преподавателей на платформе, которая меняет представление об образовании.
          </p>
        </div>

        <div className="z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} EduHub Inc. Все права защищены. <br />
          <Link href="/privacy" className="hover:text-slate-200 transition-colors">Политика конфиденциальности</Link> · 
          <Link href="/terms" className="hover:text-slate-200 transition-colors">Условия использования</Link>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white dark:bg-slate-950 p-6 sm:p-10 xl:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-xl font-bold text-white">E</span>
              </div>
              <span className="text-xl font-medium text-slate-800 dark:text-slate-200">EduHub</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
              С возвращением!
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Введите свои данные для входа в систему.
            </p>
          </div>

          {userFriendlyError && (
            <div className="mb-5 flex items-center space-x-2 p-3.5 rounded-md bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 text-sm text-red-700 dark:text-red-300">
              <IconAlertTriangle />
              <span>{userFriendlyError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email или логин
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <IconMail />
                </div>
                <input
                  type="text"
                  id="login"
                  name="login"
                  value={form.login}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg 
                             bg-white dark:bg-slate-900 
                             text-slate-900 dark:text-white
                             placeholder-slate-400 dark:placeholder-slate-500 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                             transition-colors duration-150 ease-in-out"
                  placeholder="you@example.com"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Пароль
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium transition-colors"
                >
                  Забыли пароль?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <IconLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-11 py-3 border border-slate-300 dark:border-slate-700 rounded-lg 
                             bg-white dark:bg-slate-900 
                             text-slate-900 dark:text-white
                             placeholder-slate-400 dark:placeholder-slate-500 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                             transition-colors duration-150 ease-in-out"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={handlePasswordVisibilityToggle}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 
                             transition-colors focus:outline-none"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <IconEyeSlash /> : <IconEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center pt-1">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary accent-primary bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded 
                           focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950"
              />
              <label htmlFor="rememberMe" className="ml-2.5 block text-sm text-slate-700 dark:text-slate-300">
                Запомнить меня
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-white text-slate-900 font-semibold py-3.5 px-4 rounded-lg
                         hover:bg-primary-dark dark:hover:bg-primary-light
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-950
                         transition-all duration-150 ease-in-out
                         disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <IconSpinner />
                  <span className="ml-2">Обработка...</span>
                </>
              ) : (
                <>
                  <span>Войти</span>
                  <IconArrowRight className="ml-1.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
            Нет аккаунта?{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light transition-colors">
              Зарегистрироваться
            </Link>
          </div>

          <div className="mt-12 text-center">
            {["EN", "РУС"].map(lang => (
              <button 
                key={lang}
                onClick={() => setCurrentLanguage(lang === "РУС" ? "Русский" : "English")} 
                className={`px-2 py-1 text-xs transition-colors
                  ${(currentLanguage === "Русский" && lang === "РУС") || (currentLanguage === "English" && lang === "EN")
                    ? 'text-primary font-semibold' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`
                }
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
