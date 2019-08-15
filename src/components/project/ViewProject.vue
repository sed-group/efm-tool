<template>
  <div class="view-project">
    <v-container py-0>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Project: {{ project.title }}</v-expansion-panel-header>
              <v-expansion-panel-content>

                <v-form>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field v-model="project.title" label="Project title" required></v-text-field>
                              <v-text-field v-model="project.person" label="Person" required disabled></v-text-field>
                              <v-text-field v-model="project.status" label="Status" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="8">
                              <v-textarea v-model="project.description" label="Description" required></v-textarea>
                            </v-col>
                            <v-col cols="12">
                              <v-flex justify="space-around">
                                <v-btn
                                  color="success"
                                  class="mr-4"
                                  @click="saveProjectChanges()"
                                  :loading="loadingProject"
                                >
                                  Save changes
                                </v-btn>
                                
                                <v-btn
                                  color="warning"
                                  class="mr-4"
                                  @click="discardProjectChanges()"
                                  :loading="loadingProject"
                                >
                                  Discard changes
                                </v-btn>
                                
                                <v-btn
                                  color="error"
                                  class="mr-4"
                                  @click="deleteProject()"
                                >
                                  Delete project
                                </v-btn>
                              </v-flex>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>

              </v-expansion-panel-content>
            </v-expansion-panel>
            
            <v-expansion-panel>
              <v-expansion-panel-header>Project elements</v-expansion-panel-header>
              <v-expansion-panel-content>

                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
                <v-data-table
                  :headers="headers"
                  :items="desserts"
                  :items-per-page="10"
                  single-select
                  item-key="name"
                  group-by="type"
                  show-select
                  :search="search"
                  class="elevation-0"
                ></v-data-table>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>

    <ViewDiagram />

    <v-snackbar v-model="snackbarUpdatedProject" :timeout="4000" top color="success">
      <span>Awesome! You updated the project.</span>
      <v-btn color="white" text @click="snackbarUpdatedProject = false">Close</v-btn>
    </v-snackbar>

    <v-snackbar v-model="snackbarDeletedProject" :timeout="4000" top color="success">
      <span>Awesome! You deleted the project.</span>
      <v-btn color="white" text @click="snackbarDeletedProject = false">Close</v-btn>
    </v-snackbar>

  </div>
</template>

<script>
import ViewDiagram from '@/components/project/ViewDiagram'
import db from '@/fb'
import router from '@/router'

export default {
  name: 'ViewProject',
  components: { 
    ViewDiagram,
  },
  data(){
    return{
      project: {
        title: '',
      },
      projectChanged: false,
      originalProject: {
        title: '',
        status: '',
        description: '',
      },
      loadingProject: false,
      snackbarUpdatedProject: false,
      snackbarDeletedProject: false,
      search: '',
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
          type: 'delicious',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
          type: 'delicious',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
          type: 'delicious',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
          type: 'delicious',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
          type: 'delicious',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
          type: 'delicious',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
          type: 'meh',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
          type: 'meh',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
          type: 'meh',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
          type: 'meh',
        },
      ],
    }
  },
  methods: {
    deleteProject(){
      db.collection('projects').doc(this.$route.params.id).delete().then(() => {
        this.snackbarDeletedProject = true;
        //delete all the nodes related to the project
        db.collection('nodes').where('project', '==', this.$route.params.id)
          .get()
          .then(function(querySnapshot) {
            // Once we get the results, begin a batch
            var batch = db.batch();
            querySnapshot.forEach(function(doc) {
              // For each doc, add a delete operation to the batch
              batch.delete(doc.ref);
            });

            // Commit the batch
            return batch.commit();
          })
          .then(function() {
            router.push('/dashboard');
          });
      })
      .catch(function(error) {
          console.error("Error deleting project: ", error);
      });
    },
    discardProjectChanges(){
      this.selectedProject.title = this.originalProject.title;
      this.selectedProject.status = this.originalProject.status;
      this.selectedProject.description= this.originalProject.description;
    },
    saveProjectChanges(){
      if (this.project.title == this.originalProject.title & this.project.status == this.originalProject.status &this.project.description == this.originalProject.description) {
      } else {
        // save to db
        if(true) {
          this.loadingProject = true
          const project = { 
            title: this.project.title,
            person: this.project.person,
            status: this.project.status,
            description: this.project.description,
          }
          db.collection('projects').doc(this.$route.params.id).set(project).then(() => {
            this.loadingProject = false
            this.snackbarUpdatedProject = true;
          })
          .catch(function(error) {
              console.error("Error writing document: ", error);
          });
        }
      }
    },
  },
  created(){
    let ref = db.collection('projects')
    ref.doc(this.$route.params.id).get()
    .then(project => {
      this.project = project.data();
      if (!project.exists) {
        router.push('/dashboard');
      }
    })
  }
}
</script>

<style>

</style>

