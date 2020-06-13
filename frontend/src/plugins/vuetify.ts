import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md',
    },
    theme: {
        themes: {
            light: {
                primary: '#FAAC4E',
                secondary: '#B45231',
                accent: '#D3613A',
                error: '#FF5252',
                info: '#FFDFB9',
                success: '#4CAF50',
                warning: '#FFC107',
            },
            dark: { // Unimplemented
            }
        }
    }
});
// B45231, D3613A, FFDFB9, BBD6E4, FAAC4E (from favicon by desn team).