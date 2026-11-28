import "swiper/css";

import { sizes, space } from "@frontend/theme";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import { useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type CarouselHeight =
  | number
  | {
      xs: number;
      sm: number;
      md: number;
    };

const RoomImage: React.FC<{
  src: string;
  height: CarouselHeight;
}> = ({ src, height }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Image
        src={src}
        alt="Room Image"
        fill
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
};

const RoomPhotoCarousel: React.FC<{
  photos: string[];
  loading?: boolean;
  height?: CarouselHeight;
}> = ({ photos, loading, height = sizes.roomPhoto.defaultHeight }) => {
  const swiperRef = useRef<SwiperInstance | null>(null);

  const showNavigation = !loading && photos.length > 1;

  return (
    <Box
      sx={(theme) => ({
        display: "grid",
        gridTemplateColumns: {
          xs: `${theme.sizes.control.sm}px minmax(0, 1fr) ${theme.sizes.control.sm}px`,
          md: `${theme.sizes.control.lg}px minmax(0, 1fr) ${theme.sizes.control.lg}px`,
        },
        alignItems: "center",
        width: "100%",
        minWidth: 0,
        "& .MuiIconButton-root": {
          color: theme.palette.text.primary,
        },
      })}
    >
      {/* Previous photo */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {showNavigation && (
          <IconButton
            aria-label="Previous photo"
            size="small"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Photo area */}
      <Box sx={{ minWidth: 0, height }}>
        {loading || photos.length === 0 ? (
          <Skeleton
            animation={loading ? "wave" : false}
            variant="rectangular"
            width="100%"
            sx={{ height }}
          />
        ) : photos.length === 1 ? (
          <RoomImage src={photos[0]} height={height} />
        ) : (
          <Swiper
            modules={[Autoplay]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            speed={600}
            loop
            spaceBetween={space.md}
            slidesPerView={1}
            style={{ height: "100%" }}
          >
            {photos.map((photo) => (
              <SwiperSlide key={photo}>
                <RoomImage src={photo} height={height} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>

      {/* Next photo */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {showNavigation && (
          <IconButton
            aria-label="Next photo"
            size="small"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default RoomPhotoCarousel;
