import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type SliderProps = {
  imagens: string[];
};

export function Slider({ imagens }: SliderProps) {
  return (
    <div className="my-15 px-4">
      <Carousel
        plugins={[Autoplay({ delay: 5000 })]}
        className="w-full max-w-4xl rounded-[22px] aspect-[21/10] mx-auto overflow-hidden z-1"
      >
        <CarouselContent>
          {imagens.map((src, index) => (
            <CarouselItem key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover aspect-[21/10]"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white hover:text-white transition border-0 ml-2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/30 hover:bg-white/50 text-white hover:text-white transition border-0 mr-2" />
      </Carousel>
    </div>
  );
}

export default Slider;
