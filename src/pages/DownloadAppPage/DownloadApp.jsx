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
          <div className="absolute top-6 left-1/2 lg:left-6 -translate-x-1/2 lg:translate-x-0 z-20 transition-all duration-300">
            <div className="p-3  rounded-2xl hover:scale-105 transition-all duration-300 ">
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

          <div className="text-center p-4 mt-8 sm:mt-0 md:p-12 lg:p-16 pt-24 md:pt-24 relative z-10">
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

            {/* Single Line CTA Buttons - Responsive */}
            <div className="mt-8 mb-6">
              <div className="flex flex-col items-center lg:flex-row gap-4 max-w-4xl mx-auto justify-center">
                {/* App Store */}
                <div className="">
                  <a
                    href="https://apps.apple.com/in/app/quickmyslot-provider/id6753897063"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="flex  items-center gap-4 px-5 rounded-xl  text-white transition-all duration-300 hover:scale-[1.03]">
                      <img
                        src="/appstore.png"
                        alt="Apple"
                        className="w-46 sm:w-48 h-14"
                      />
                    </div>
                  </a>
                </div>

                {/* Google Play */}
                <div className="">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.qms_provider"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="flex  items-center gap-4 px-5 rounded-xl  text-white transition-all duration-300 hover:scale-[1.03]">
                      <img
                        src="/playstore.png"
                        alt="Apple"
                        className="w-40 sm:w-48 h-14"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="m-2">OR</div>
            <div className="flex-1 mt-1 lg:flex-none lg:w-full">
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
            <div className="pt-8 border-t border-orange-100 max-w-md mx-auto">
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
