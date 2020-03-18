<template>
  <div class="view-project">
    <v-container py-0>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Project: {{ project ? project.title : 'Project Title' }}</v-expansion-panel-header>
              <v-expansion-panel-content>

                <v-form v-if="project">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4">
                              <v-text-field v-model="project.title" label="Project title" required></v-text-field>
                              <v-text-field v-model="project.status" label="Status" required></v-text-field>
                              <v-text-field v-model="project.person" label="Person" required disabled></v-text-field>
                              <v-text-field v-model="project.id" label="id" required disabled></v-text-field>
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
                                
                                <!-- <v-btn
                                  color="warning"
                                  class="mr-4"
                                  @click="discardProjectChanges()"
                                  :loading="loadingProject"
                                >
                                  Discard changes
                                </v-btn> -->
                                
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
                  :items="nodes"
                  :items-per-page="10"
                  single-select
                  item-key="name"
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
import ViewDiagram from '@/components/diagram/ViewDiagram'
import db from '@/fb'
import router from '@/router'

export default {
  name: 'ViewProjectAlt',
  components: { 
    ViewDiagram,
  },
  data(){
    return{
      loadingProject: false,
      snackbarUpdatedProject: false,
      snackbarDeletedProject: false,
      search: '',
      headers: [
        { text: 'Node name', value: 'name', align: 'left' },
        { text: 'Description', value: 'description' },
        { text: 'Parent', value: 'parent' },
        { text: 'Type', value: 'type' },
      ],
      nodes: [
        {
          name: 'A good node',
          description: 'A nice description of this node',
          parent: 'The parent node',
          type: 'DS',
        },
      ],
    }
  },
  computed: {
    project () {
      return this.$store.getters.project
    },
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
          //console.error("Error deleting project: ", error);
      });
    },
    saveProjectChanges(){
      // save to db
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
          //console.error("Error writing document: ", error);
      });

    },
  },
  created(){
    this.$store.dispatch('setProjectAction', this.$route.params.id)
  },
  mounted(){
    // Do like in ViewDiagram, including some update function?
  },
}
</script>

<style>

</style>

