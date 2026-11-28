"use client";

import "swiper/css";

import NearbyRoomCard from "@frontend/components/rooms/NearbyRoomCard";
import useNearbyRooms from "@frontend/hooks/rooms/useNearbyRooms";
import { space } from "@frontend/theme";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type NearbyRoomsCarouselProps = {
  roomId?: string;
};

const NearbyRoomsCarousel = ({ roomId }: NearbyRoomsCarouselProps) => {
  const { nearbyRooms, isLoading, error } = useNearbyRooms(roomId);

  const swiperRef = useRef<SwiperInstance | null>(null);

  const [navigation, setNavigation] = useState({
    canGoBack: false,
    canGoForward: false,
  });

  const updateNavigation = useCallback((swiper: SwiperInstance) => {
    const canGoBack = !swiper.isBeginning && !swiper.isLocked;
    const canGoForward = !swiper.isEnd && !swiper.isLocked;

    setNavigation((previous) => {
      if (
        previous.canGoBack === canGoBack &&
        previous.canGoForward === canGoForward
      ) {
        return previous;
      }

      return { canGoBack, canGoForward };
    });
  }, []);

  return (
    <Stack
      component="section"
      aria-label="Available Rooms Nearby"
      spacing={space.md}
      sx={{ width: "100%", minWidth: 0 }}
    >
      <Typography variant="h4" component="h2">
        Available Rooms Nearby
      </Typography>

      {error ? (
        <Typography color="text.secondary" variant="body2">
          Could not load nearby rooms
        </Typography>
      ) : !isLoading && nearbyRooms?.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          There are no available nearby rooms right now
        </Typography>
      ) : (
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            gap: theme.space.sm,
            width: "100%",
            minWidth: 0,
          })}
        >
          <IconButton
            aria-label="Previous nearby rooms"
            disabled={isLoading || !navigation.canGoBack}
            onClick={() => swiperRef.current?.slidePrev()}
            sx={(theme) => ({
              display: { xs: "none", md: "inline-flex" },
              flexShrink: 0,
              width: theme.sizes.control.md,
              height: theme.sizes.control.md,
            })}
          >
            <NavigateBeforeIcon />
          </IconButton>

          <Box
            sx={(theme) => ({
              flex: 1,
              minWidth: 0,

              "& .swiper": {
                width: "100%",
              },

              "& .swiper-slide": {
                width: theme.sizes.nearbyRoomCard.width,
                maxWidth: "100%",

                [theme.breakpoints.down("md")]: {
                  maxWidth: "85%",
                },
              },
            })}
          >
            <Swiper
              modules={[A11y]}
              slidesPerView="auto"
              spaceBetween={space.sm}
              watchOverflow
              grabCursor
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                updateNavigation(swiper);
              }}
              onProgress={updateNavigation}
              onLock={updateNavigation}
              onUnlock={updateNavigation}
              onResize={updateNavigation}
              onUpdate={updateNavigation}
            >
              {isLoading
                ? Array.from({ length: 5 }, (_, index) => (
                    <SwiperSlide key={`loading-${index}`}>
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="100%"
                        sx={(theme) => ({
                          height: theme.sizes.nearbyRoomCard.height,
                          borderRadius: `${theme.radius.card}px`,
                        })}
                      />
                    </SwiperSlide>
                  ))
                : nearbyRooms?.map((nearbyRoom) => (
                    <SwiperSlide key={nearbyRoom.room.id}>
                      <NearbyRoomCard {...nearbyRoom} />
                    </SwiperSlide>
                  ))}
            </Swiper>
          </Box>

          <IconButton
            aria-label="Next nearby rooms"
            disabled={isLoading || !navigation.canGoForward}
            onClick={() => swiperRef.current?.slideNext()}
            sx={(theme) => ({
              display: { xs: "none", md: "inline-flex" },
              flexShrink: 0,
              width: theme.sizes.control.md,
              height: theme.sizes.control.md,
            })}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      )}
    </Stack>
  );
};

export default NearbyRoomsCarousel;
