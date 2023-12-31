import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { CompositeScreenProps } from "@react-navigation/native";
import { RoomStatus } from "@common/types";

// Bottom Tab Navigator
export type RootTabParamList = {
  Home: undefined;
  Buildings: NavigatorScreenParams<BuildingStackParamList>;
  Map: undefined;
};

// Bottom Tab Screens
export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

// Stack Navigator ( Nested )
export type BuildingStackParamList = {
  "All Buildings": undefined;
  Building: { buildingName: string; buildingId: string };
  Room: { roomName: string; roomId: string; status: RoomStatus };
  "Room Filter": undefined;
  "Building Filter": undefined;
  Timetable: { roomId: string };
};

// Type for Screens in nested Navigator
export type BuildingStackScreenProps<T extends keyof BuildingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<BuildingStackParamList, T>,
    BottomTabScreenProps<RootTabParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
