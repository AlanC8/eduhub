'use client'
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SiteMap() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-[70px] lg:ml-[76px] w-full">
        {/* Header */}
        <Header activePage="map" />
        
        {/* Breadcrumb */}
        <div className="px-6 py-3 text-sm bg-white/70 border-b backdrop-blur-sm">
          <div className="container mx-auto flex items-center">
            <Link href="/" className="text-gray-500 hover:text-primary transition-colors flex items-center">
              <span className="material-icons-round text-sm mr-1">home</span>
              <span>Главная</span>
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-800 font-medium">Карта сайта</span>
          </div>
        </div>
        
        {/* Site Map Content */}
        <div className="p-4 sm:p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <h1 className="text-2xl font-medium text-gray-800 mb-1 flex items-center">
                <span className="material-icons-round text-primary mr-2">map</span>
                Карта сайта
              </h1>
              <p className="text-gray-500">Полная структура разделов и страниц портала</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Learning Process Section */}
              <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 py-4 px-6">
                  <div className="flex items-center">
                    <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">school</span>
                    <h2 className="text-xl font-medium text-white">Учебный процесс</h2>
                  </div>
                </div>
                
                <div className="p-5">
                  <ul className="space-y-2">
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">calendar_month</span>
                        <span>Академический календарь</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">checklist</span>
                        <span>Индивидуальный учебный план</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">meeting_room</span>
                        <span>Учебная аудитория</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">schedule</span>
                        <span>Расписание</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">insert_chart</span>
                        <span>Журнал оценок</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">assignment</span>
                        <span>Задания</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">quiz</span>
                        <span>Тестирование</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                        <span className="material-icons-round text-gray-400 mr-3 group-hover:text-primary transition-colors">gavel</span>
                        <span>Апелляции</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Central Column */}
              <div className="space-y-6">
                {/* Online Attestation Section */}
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-4 px-6">
                    <div className="flex items-center">
                      <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">assignment_turned_in</span>
                      <h2 className="text-xl font-medium text-white">Аттестация онлайн</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-purple-50 transition-colors group">
                          <span className="material-icons-round text-gray-400 mr-3 group-hover:text-secondary transition-colors">fact_check</span>
                          <span>Промежуточная аттестация</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Study Materials Section */}
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                  <div className="bg-gradient-to-r from-sky-500 to-cyan-600 py-4 px-6">
                    <div className="flex items-center">
                      <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">menu_book</span>
                      <h2 className="text-xl font-medium text-white">Учебные материалы</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-blue-50 transition-colors group">
                          <span className="material-icons-round text-gray-400 mr-3 group-hover:text-sky-500 transition-colors">local_library</span>
                          <span>Библиотека</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Applications Section */}
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 py-4 px-6">
                    <div className="flex items-center">
                      <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">description</span>
                      <h2 className="text-xl font-medium text-white">Заявления</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-green-50 transition-colors group">
                          <span className="material-icons-round text-gray-400 mr-3 group-hover:text-teal-500 transition-colors">badge</span>
                          <span>Личный кабинет</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Surveys Section */}
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-4 px-6">
                    <div className="flex items-center">
                      <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">poll</span>
                      <h2 className="text-xl font-medium text-white">Анкетирование</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-amber-50 transition-colors group">
                          <span className="material-icons-round text-gray-400 mr-3 group-hover:text-amber-500 transition-colors">edit_note</span>
                          <span>Анкеты</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Personal Data Section */}
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-4 px-6">
                    <div className="flex items-center">
                      <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">person</span>
                      <h2 className="text-xl font-medium text-white">Личные данные</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-indigo-50 transition-colors group">
                          <span className="material-icons-round text-gray-400 mr-3 group-hover:text-indigo-500 transition-colors">badge</span>
                          <span>Личные данные</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Additional Section */}
                <div className="bg-white rounded-2xl shadow-soft hover:shadow-md transition-all overflow-hidden card">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-800 py-4 px-6">
                    <div className="flex items-center">
                      <span className="material-icons-round text-white mr-3 p-2 bg-white/20 rounded-xl">more_horiz</span>
                      <h2 className="text-xl font-medium text-white">Дополнительно</h2>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <ul className="space-y-2">
                      <li>
                        <Link href="#" className="flex items-center py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors group">
                          <span className="material-icons-round text-gray-400 mr-3 group-hover:text-gray-600 transition-colors">credit_card</span>
                          <span>Оплата и задолженности</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
} 