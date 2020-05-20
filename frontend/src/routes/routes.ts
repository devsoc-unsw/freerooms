import Vue from 'vue';
import VueRouter from "vue-router";
import Home from "../components/LandingPage.vue";
import LocationRoomView from "../components/LocationRoomView.vue";
import RoomView from "../components/RoomView.vue";

// Routes
// can add more as we go along
// for now;
// home -> list of selectable buildings/map
// locationRoomView -> list of selectable rooms for building
// roomView -> mon-fri view of avaliable times for room
// TODO add 404
const routes = [
    {
        path: "/", 
        redirect: '/home',
        name: 'home',
        component: {
            template: '<router-view/>',
        }, 
        children: [
            {
                path: '/home',
                name: 'locations',
                component: Home,
                meta: {
                    breadCrumb: "Home"
                }
            }
        ]
    },
    {
        path: "/location/:locationId",
        component: LocationRoomView,
        name: 'locationRoom',
        meta: {
            breadCrumb: "Location"
        }
    }, 
    {
        // we cannot do a nested route as we want to
        // render the <router-view> in the root element
        path: "/location/:locationId/room/:roomId",
        component: RoomView,
        name: 'room',
        meta: {
            breadCrumb: "Room"
        }
    }
];

// set history mode to get rid of #
// https://router.vuejs.org/guide/essentials/history-mode.html
// TODO configure server
const router = new VueRouter({
    mode: 'history',
    routes
});

Vue.use(VueRouter);

export default router;