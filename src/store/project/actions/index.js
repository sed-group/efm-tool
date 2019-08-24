import db from '@/fb'
import router from '@/router'

export default {
  setProjectAction({commit}, payload) {
    let ref = db.collection('projects')
    ref.doc(payload).get()
    .then(project => {
      this.project = project.data();
      if (!project.exists) {
        router.push('/dashboard');
      } else {
        commit('setProject', { ...project.data(), ...{id: project.id}})
      }
    })
    .catch(err => {
      console.log(err)
    })
  },
}