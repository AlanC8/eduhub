import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Background and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}>
        </div>
        
        <div className="flex flex-col items-center justify-center relative z-10 p-12 text-white">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-lg">
            <span className="text-4xl font-bold">E</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-6">EduHub</h1>
          <p className="text-xl opacity-90 mb-8 text-center">Инновационная образовательная платформа</p>
          
          <div className="space-y-6 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="material-icons-round text-white mr-3">verified</span>
                <h3 className="text-lg font-semibold">Доступ ко всем материалам</h3>
              </div>
              <p className="text-white/80">Удобный доступ к учебным материалам, расписанию и заданиям</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <span className="material-icons-round text-white mr-3">insights</span>
                <h3 className="text-lg font-semibold">Аналитика прогресса</h3>
              </div>
              <p className="text-white/80">Отслеживание успеваемости и персональная статистика обучения</p>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-12 right-12 flex justify-between items-center text-white/70">
            <div className="flex items-center space-x-2">
              <span className="material-icons-round text-sm">copyright</span>
              <span>2025 EduHub</span>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white transition-colors">Помощь</Link>
              <Link href="#" className="hover:text-white transition-colors">О нас</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4">
              E
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Вход в систему</h2>
              <p className="text-gray-500 mt-2">Введите свои учетные данные для входа</p>
            </div>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Логин</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <span className="material-icons-round text-xl">person</span>
                  </span>
                  <input 
                    type="text" 
                    id="username" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder-gray-400 transition-colors" 
                    placeholder="Введите логин"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
                  <a href="#" className="text-sm text-primary hover:text-primary-dark transition-colors">Забыли пароль?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <span className="material-icons-round text-xl">lock</span>
                  </span>
                  <input 
                    type="password" 
                    id="password" 
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder-gray-400 transition-colors" 
                    placeholder="Введите пароль"
                  />
                  <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="material-icons-round text-xl">visibility</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="remember" 
                  type="checkbox" 
                  className="h-4 w-4 text-primary focus:ring-primary/30 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Запомнить меня
                </label>
              </div>
              
              <Link 
                href="/"
                className="w-full bg-gradient-primary text-white py-3 rounded-xl text-center block hover:opacity-95 transition-all font-medium shadow-md flex items-center justify-center"
              >
                <span>Войти</span>
                <span className="material-icons-round ml-1">arrow_forward</span>
              </Link>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-500">Или войти через</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="bg-[#3b5998] text-white p-2 rounded-lg flex items-center justify-center hover:opacity-95 transition-all">
                  <span className="material-icons-round">facebook</span>
                </button>
                <button className="bg-[#1da1f2] text-white p-2 rounded-lg flex items-center justify-center hover:opacity-95 transition-all">
                  <span className="material-icons-round">alternate_email</span>
                </button>
                <button className="bg-[#ea4335] text-white p-2 rounded-lg flex items-center justify-center hover:opacity-95 transition-all">
                  <span className="material-icons-round">g_translate</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex justify-center space-x-4">
              <button className="text-gray-600">Казахский</button>
              <button className="text-primary font-medium">Русский</button>
              <button className="text-gray-600">English</button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              При возникновении проблем обращайтесь по тел: <a href="tel:+77273200000" className="text-primary hover:underline">+7 (727) 320-00-00</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 