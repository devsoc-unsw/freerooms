import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'md',
    },
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#F6915A',
                secondary: '#D3613A',
                tertiary: '#B45231',
                accent: '#BBD6E4',
                error: '#FF5252',
                info: '#FFDFB9',
                success: '#4CAF50',
                warning: '#FAAC4E',
            },
            dark: { // Unimplemented
            }
        }
    }
});
// B45231, D3613A, FFDFB9, BBD6E4, FAAC4E (from favicon by desn team).