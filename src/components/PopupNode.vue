<template>
  <v-dialog max-width="600px" v-model="dialog">
    
    <template v-slot:activator="{ on }">
      
      <v-speed-dial v-if="selected.selected" v-model="fab" absolute bottom right direction="left" color="success" transition="slide-x-reverse-transition">
          
          <template v-slot:activator>
              <v-btn v-model="fab" color="success" dark fab>
                  <v-icon v-if="fab">close</v-icon>
                  <v-icon v-else>add</v-icon>
              </v-btn>
          </template>
          <v-btn v-if="selected.type=='FR'" v-on="on" fab dark small color="amber" value="DS">
              DS
          </v-btn>
          <v-btn v-if="selected.type=='DS'" v-on="on" fab dark small color="blue" value="FR">
              FR
          </v-btn>
          <v-btn v-if="selected.type=='DS'" v-on="on" fab dark small color="black" value="C">
              C
          </v-btn>
      </v-speed-dial>
      
    </template>

    <v-card>
      <v-card-title>
        <!-- TODO add option of constraint -->
        <h2 class="title">Add a New {{ selected.type == 'FR' ? 'Design Solution' : 'Functional Requirement' }}</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field v-model="name" label="Name" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <!-- <v-text-field v-model="parent" label="Parent" prepend-icon="mdi-crown">{{ selected.id }}</v-text-field> -->
          <v-select 
          v-model="type" 
          label="Type" 
          prepend-icon="mdi-format-list-bulleted-type" 
          :items="allowedChildren(selected.type)" 
          :hint="`${type}`" 
          item-text="nodeType" 
          item-value="abbr" 
          :rules="inputRules"
          >
          </v-select>
          <v-textarea v-model="description" label="Description" prepend-icon="edit"></v-textarea>

          <v-spacer></v-spacer>

          <v-btn text @click="submit" class="success mx-0 mt-3" :loading="loading">Add Node</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    
  </v-dialog>
</template>

<script>
import db from '@/fb'
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'PopupNode',
  props: [
    'selected'
  ],
  data() {
    return {
      name: '',
      parent: '',
      type: '',
      description: '',
      inputRules: [
        v => !!v || 'This field is required',
        v => v.length >= 1 || 'Minimum length is 1 characters'
      ],
      loading: false,
      dialog: false,
      // nodeTypes: [
      //   {nodeType: 'Functional Requirement', abbr: 'FR'}, 
      //   {nodeType: 'Design Solution', abbr: 'DS'}, 
      //   {nodeType: 'Constraint', abbr: 'C'}
      // ],
      user: null,
      direction: 'top',
      fab: false,
    }
  },
  methods: {
    userSlug () {
      let user = this.$store.getters.user
      return user.slug
    },
    nodeTypes () {
      return this.$store.getters.nodeTypes
    },
    allowedChildren (nodeType) {
      return this.$store.getters.allowedChildren(nodeType)
    },
    submit() {
      if(this.$refs.form.validate()) {
        this.loading = true
        let ref = db.collection("nodes").doc();
        let id = ref.id;
        const node = { 
          id: id,
          name: this.name,
          description: this.description,
          type: this.type,
          //parent: this.parent,
          parent: this.selected.id,
          creator: this.user.id,
          project: this.$route.params.id,
        }
        ref.set(node).then(() => {
          this.loading = false
          this.dialog = false
          this.reset()
          this.resetValidation()
          this.$emit('nodeAdded')
        })
      }
    },
    reset () {
      //this.$refs.form.reset()
      this.name = ''
      this.parent = ''
      this.type = ''
      this.description = ''
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
  created() {
    let ref = db.collection('users')

    //get current user
    ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.user = doc.data();
          this.user.id = doc.id;
        })
      })
  }
}
</script>
