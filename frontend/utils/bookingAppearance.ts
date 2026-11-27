import { AppColours } from "@frontend/theme";
import { SvgIconComponent } from "@mui/icons-material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import { BookingType } from "common/types";

type BookingTypeAppearance = {
  colour: keyof AppColours["bookingType"];
  icon: SvgIconComponent;
};

const bookingTypeAppearances: Record<BookingType, BookingTypeAppearance> = {
  [BookingType.LECTURE]: {
    colour: "lecture",
    icon: RecordVoiceOverOutlinedIcon,
  },
  [BookingType.TUTORIAL]: {
    colour: "tutorial",
    icon: ChatOutlinedIcon,
  },
  [BookingType.LABORATORY]: {
    colour: "laboratory",
    icon: ScienceOutlinedIcon,
  },
  [BookingType.TUTORIAL_LABORATORY]: {
    colour: "laboratory",
    icon: ScienceOutlinedIcon,
  },
  [BookingType.WORKSHOP]: {
    colour: "workshop",
    icon: BuildOutlinedIcon,
  },
  [BookingType.SEMINAR]: {
    colour: "tutorial",
    icon: RecordVoiceOverOutlinedIcon,
  },
  [BookingType.STUDIO]: {
    colour: "workshop",
    icon: PaletteOutlinedIcon,
  },
  [BookingType.CLASS]: {
    colour: "lecture",
    icon: MenuBookOutlinedIcon,
  },
  [BookingType.EXAMS]: {
    colour: "exam",
    icon: AssignmentOutlinedIcon,
  },
  [BookingType.SOCIETY]: {
    colour: "society",
    icon: GroupsOutlinedIcon,
  },
  [BookingType.INTERNAL]: {
    colour: "internal",
    icon: ApartmentOutlinedIcon,
  },
  [BookingType.BLOCK]: {
    colour: "internal",
    icon: LockOutlinedIcon,
  },
  [BookingType.MISC]: {
    colour: "other",
    icon: CalendarMonthOutlinedIcon,
  },
  [BookingType.OTHER]: {
    colour: "other",
    icon: CalendarMonthOutlinedIcon,
  },
};

export const getBookingTypeAppearance = (
  bookingType: string,
): BookingTypeAppearance => {
  const type = Object.values(BookingType).find((type) => type === bookingType);

  return bookingTypeAppearances[type ?? BookingType.OTHER];
};
