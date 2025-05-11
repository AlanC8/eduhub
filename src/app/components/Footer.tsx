import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center py-4 mt-auto border-t bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-2">E</div>
            <p className="text-xs text-gray-500">
              ©EduHub v1.0.0, 2025
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-500 hover:text-primary text-xs flex items-center transition-colors">
              <span className="material-icons-round text-xs mr-1">info</span>
              О нас
            </Link>
            <Link href="#" className="text-gray-500 hover:text-primary text-xs flex items-center transition-colors">
              <span className="material-icons-round text-xs mr-1">policy</span>
              Правила
            </Link>
            <Link href="#" className="text-gray-500 hover:text-primary text-xs flex items-center transition-colors">
              <span className="material-icons-round text-xs mr-1">support_agent</span>
              Поддержка
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 