import "@testing-library/jest-dom";

import RoomPhotoCarousel from "@frontend/components/RoomPhotoCarousel";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Autoplay } from "swiper/modules";

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));
jest.mock("swiper/modules", () => ({ Autoplay: {}, Navigation: {} }));

describe("Carousel", () => {
  test("renders a single image without Swiper when there is one photo", () => {
    render(<RoomPhotoCarousel photos={["https://example.com/room-1.jpg"]} />);

    expect(screen.queryByTestId("swiper")).not.toBeInTheDocument();
    expect(screen.getByAltText(/room image/i)).toHaveAttribute(
      "src",
      expect.stringContaining("room-1.jpg")
    );
  });

  test("renders a Swiper slide per photo when there are multiple photos", () => {
    const photos = [
      "https://example.com/room-photo-1.jpg",
      "https://example.com/room-photo-2.jpg",
    ];

    render(<RoomPhotoCarousel photos={photos} />);
    expect(screen.queryByTestId("swiper")).toBeInTheDocument();
    const slides = screen.getAllByTestId("swiper-slide");
    expect(slides).toHaveLength(2);

    const images = screen.getAllByAltText(/room image/i);
    expect(images[0]).toHaveAttribute(
      "src",
      expect.stringContaining("room-photo-1.jpg")
    );
    expect(images[1]).toHaveAttribute(
      "src",
      expect.stringContaining("room-photo-2.jpg")
    );
  });
});
