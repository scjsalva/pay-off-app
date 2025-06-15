import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

// Create Vuex store
const store = createStore({
    state() {
        return {
            profiles: JSON.parse(localStorage.getItem('payoffProfiles')) || [],
            activeProfileId: localStorage.getItem('payoffActiveProfile') || null,
            settings: JSON.parse(localStorage.getItem('payoffSettings')) || {
                deductPHContributions: true,
                theme: 'light'
            }
        }
    },
    mutations: {
        setProfiles(state, profiles) {
            state.profiles = profiles
            localStorage.setItem('payoffProfiles', JSON.stringify(profiles))
        },
        setActiveProfile(state, profileId) {
            state.activeProfileId = profileId
            localStorage.setItem('payoffActiveProfile', profileId)
        },
        setSettings(state, settings) {
            state.settings = { ...state.settings, ...settings }
            localStorage.setItem('payoffSettings', JSON.stringify(state.settings))
        }
    },
    getters: {
        activeProfile: (state) => {
            return state.profiles.find(p => p.id === state.activeProfileId)
        }
    }
})

// Create and mount the app
const app = createApp(App)
app.use(store)
app.mount('#app') 
