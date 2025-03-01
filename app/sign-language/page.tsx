import { Github } from "lucide-react";

export default function SignPage() {
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-1 relative">
        <iframe
          src="https://sign.mt/?lang=en"
          className="w-full h-full border-none"
          allowFullScreen
        />
        
        <div className="absolute top-0 left-0 w-full" style={{ height: "60px", zIndex: 10 }}>
          <div className="w-full h-full bg-gray-900 flex items-center justify-between px-4">
            <h1 className="text-white text-xl font-bold">Sign Language Translator</h1>
            
            <div className="flex items-center">
              <a
                href="https://github.com/sign/translate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Github size={18} />
                <span className="hidden sm:inline">sign/translate</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full" style={{ height: "60px", zIndex: 10 }}>
          <div className="w-full h-full bg-gray-900"></div>
        </div>
      </div>
    </div>
  );
}