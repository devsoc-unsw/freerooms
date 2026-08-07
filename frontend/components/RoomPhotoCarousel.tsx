import "swiper/css";
import "swiper/css/navigation";
import Box from "@mui/material/Box";
import Image from "next/image"
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const RoomImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 500,
        position: "relative",
      }}
    >
      <Image
        src={src}
        alt="Room Image"
        fill
        style={{ objectFit: "cover", borderRadius: 10 }}
      />
    </Box>
  );
};

const RoomPhotoCarousel: React.FC<{ photos: string[] }> = ({ photos }) => {
  if (photos.length <= 1) {
    return <RoomImage src={photos[0]} />;
  }

  return (
    <Box
      sx={(theme) => ({
        maxWidth: "100%",
        height: 500,
        position: "relative",
        "& .swiper-button-prev, & .swiper-button-next": {
          backgroundColor: theme.palette.background.default,
          width: 50,
          height: 50,
        },
        "& .swiper-button-prev:hover, & .swiper-button-next:hover": {
          backgroundColor: theme.palette.background.paper,
        },

        "& .swiper-button-prev svg, & .swiper-button-next svg": {
          width: "50%",
          height: "50%",
          color: theme.palette.text.primary,
        },
        "& .swiper-button-prev svg path, & .swiper-button-next svg path": {
          stroke: "currentColor",
          strokeWidth: 0.8,
        },
      })}
    >
      <Swiper
        modules={[Autoplay, Navigation]}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={600}
        loop={true}
        spaceBetween={50}
        slidesPerView={1}
        style={
          {
            height: "100%",
            "--swiper-navigation-sides-offset": "0px",
          } as React.CSSProperties
        }
      >
        {photos.map((p) => (
          <SwiperSlide key={p} style={{ position: "relative" }}>
            <Image
              src={p}
              alt="Room Image"
              fill
              style={{ objectFit: "cover", borderRadius: 10 }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default RoomPhotoCarousel
