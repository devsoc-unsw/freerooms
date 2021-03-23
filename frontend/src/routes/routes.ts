import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/LandingPage.vue";
import LocationRoomView from "../views/LocationRoomView.vue";
import RoomView from "../views/RoomView.vue";

// Current routes
// home (landingPage) - list of selectable buildings
// locationRoomView - list of selectable rooms for a certain building
// roomView-  mon-fri view of avaliable times for room
// TODO add 404
const routes = [
  {
    path: "/",
    redirect: "/home",
    name: "home",
    component: {
      template: "<router-view/>",
    },
    children: [
      {
        path: "/home",
        name: "locations",
        component: Home,
        meta: {
          breadCrumb: "Home",
        },
      },
    ],
  },
  {
    path: "/location/:locationId",
    component: LocationRoomView,
    name: "locationRoom",
    meta: {
      breadCrumb: "Location",
    },
  },
  {
    // we cannot do a nested route as we want to
    // render the <router-view> in the root element
    path: "/location/:locationId/room/:roomId",
    component: RoomView,
    name: "room",
    meta: {
      breadCrumb: "Room",
    },
  },
];

// set history mode to get rid of #
// https://router.vuejs.org/guide/essentials/history-mode.html
// TODO configure server
const router = new VueRouter({
  mode: "history",
  routes,
});

Vue.use(VueRouter);

export default router;
