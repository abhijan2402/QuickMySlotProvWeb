// src/pages/Home.jsx
import Hero from "../components/Hero";
import HeroIntro from "../components/HeroIntro";
import ShopDetailCards from "../components/ShopDetailCards";
import VendorUpcomingBookings from "../components/VendorUpcomingBookings";

export default function Home() {
  return (
    <>
      <Hero />
      <ShopDetailCards/>
      <VendorUpcomingBookings/>
      <HeroIntro/>
    </>
  );
}
