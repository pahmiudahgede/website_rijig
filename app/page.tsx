import { Navbar } from "@/components/landing/Navbar";
import LandingPageShow from "./(welcome)/page";

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-4 p-15 pt-0 w-full h-full">
        <LandingPageShow />
      </main>
    </>
  );
}

export default Home;
