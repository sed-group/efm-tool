import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        project: {
            title: 'test',
            description: 'test',
            status: 'test',
            person: 'test'
        },
        currentUser: {
            name: 'test',
            id: 'test',
            user_id: 'test',
            email: 'test',
            person: 'test'
        }
    }
})