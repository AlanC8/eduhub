export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80 backdrop-blur-sm">
      <div className="relative">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 mx-auto shadow-lg">
          E
        </div>
        
        {/* Loading indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
        
        {/* Text */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">Загрузка...</p>
        </div>
        
        {/* Animated ring */}
        <div className="absolute -inset-4 border-2 border-primary/30 rounded-xl animate-pulse"></div>
        <div className="absolute -inset-8 border border-secondary/20 rounded-2xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-4 h-4 bg-blue-500 rounded-full opacity-70"></div>
        <div className="absolute -bottom-8 -left-4 w-6 h-6 bg-purple-500 rounded-full opacity-50"></div>
        <div className="absolute -bottom-4 -right-8 w-3 h-3 bg-amber-500 rounded-full opacity-60"></div>
      </div>
    </div>
  );
} 