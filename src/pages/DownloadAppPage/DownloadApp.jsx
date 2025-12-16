import { Button, Card, Typography } from "antd";
import { FaApple, FaGooglePlay, FaGlobe, FaMobileAlt } from "react-icons/fa";
import logo from "/logo.png";

const { Title, Text } = Typography;

export default function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content - Single Card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 md:py-20">
        <Card className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl rounded-3xl border-0 shadow-2xl bg-white backdrop-blur-xl relative overflow-hidden">
          {/* Logo positioned at top-left of card */}
          <div className="absolute top-6 left-6 z-20">
            <div className="p-3  rounded-2xl hover:scale-105 transition-all duration-300">
              <img
                src={logo}
                alt="QuickMySlot Logo"
                width={48}
                height={48}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Glass effect decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500"></div>

          <div className="text-center space-y-8 p-4 mt-4 sm:mt-0 md:p-12 lg:p-16 pt-24 md:pt-28 relative z-10">
            {/* Hero Headline */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <Title className="!text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl !font-black !leading-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent !m-0">
                Book Smarter. <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400">
                  Skip the Wait.
                </span>
              </Title>
              <Text className="text-lg sm:text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed px-4">
                Save hours of waiting in queues. Instant bookings, real-time
                tracking, and seamless experience — all in one powerful app.
              </Text>
            </div>

            {/* Personalized Download Prompt */}
            <div className="pt-4 pb-1">
              <div className="max-w-md mx-auto text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full text-sm font-semibold text-emerald-800 mx-auto">
                  <FaMobileAlt className="text-emerald-600" />
                  Download this app for YOU
                </div>
              </div>
            </div>

            {/* Single Line CTA Buttons - Responsive */}
            <div className="pt-0">
              <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
                {/* App Store */}
                <div className="flex-1">
                  <a
                    href="https://apps.apple.com/in/app/quickmyslot-provider/id6753897063"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-16 lg:h-14 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-slate-900 via-slate-800 to-black hover:from-slate-700 hover:to-slate-900 text-white text-base lg:text-lg border-0"
                  >
                    <FaApple className="text-xl lg:text-2xl text-orange-400" />
                    <span>App Store</span>
                  </a>
                </div>

                {/* Google Play */}
                <div className="flex-1">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.qms_provider
"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-16 lg:h-14 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-base lg:text-lg border-0"
                  >
                    <FaGooglePlay className="text-xl lg:text-2xl" />
                    <span>Google Play</span>
                  </a>
                </div>
              </div>
            </div>
            <div>OR</div>
            <div className="flex-1 lg:flex-none lg:w-full">
              <a
                href="https://provider.quickmyslot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-semibold text-slate-800 hover:text-orange-600 hover:underline 
               transition-all duration-300 px-2 py-2 rounded-lg hover:bg-orange-50"
              >
                <FaGlobe className="text-xl text-orange-500" />
                Join us via Website
              </a>
            </div>

            {/* Footer */}
            <div className="pt-12 border-t border-orange-100 max-w-md mx-auto">
              <Text className="text-lg font-bold text-slate-800 block mb-1">
                © {new Date().getFullYear()} QuickMySlot
              </Text>
              <Text className="text-sm md:text-base text-slate-600">
                Built for speed • Designed for simplicity • Made for you ✨
              </Text>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
