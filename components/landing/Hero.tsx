import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";

export const Hero = () => {
  return (
    <section
      id="home"
      className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10"
    >
      <div className="text-center lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#164A41]  to-[#BDE902] text-transparent bg-clip-text">
              Sampah
            </span>{" "}
            Jadi Uang
          </h1>{" "}
          dengan{" "}
          <h2 className="inline">
            Aplikasi{" "}
            <span className="inline bg-gradient-to-r from-[#F1B24A] to-[#BDE902] text-transparent bg-clip-text">
              Rijig
            </span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Kini sekaranag anda tidak perlu bingung dengan permasalahan sampah
          anda
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <a
            rel="noreferrer noopener"
            href="#"
            target="_blank"
            className={`w-full md:w-1/3 bg-[#BDE902] ${buttonVariants({
              variant: "default"
            })}`}
          >
            Mulai sekarang
          </a>

          <a
            rel="noreferrer noopener"
            href="#"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline"
            })}`}
          >
            Pelajari selengkapnya
          </a>
        </div>
      </div>

      <div className="z-10">{/* <HeroCards /> */}</div>

      <div className="shadow"></div>
    </section>
  );
};
