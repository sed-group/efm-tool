<template>
  <div class="diagram">

    <v-container py-0>
      <v-row>

        <v-col xs="6" sm="8" lg="9" xl="10">
          <!-- Card for the diagram -->
          <v-card class="px-3">
            <v-toolbar flat>
              <v-toolbar-items>
                <v-btn icon v-if="false"> <!-- Don't show until function developed -->
                  <v-icon>mdi-download</v-icon>
                </v-btn>

                <v-btn icon v-if="false"> <!-- Don't show until function developed -->
                  <v-icon>mdi-magnify-plus-outline</v-icon>
                </v-btn>

                <v-btn icon v-if="false"> <!-- Don't show until function developed -->
                  <v-icon>mdi-backup-restore</v-icon>
                </v-btn>

                <v-btn icon v-if="false"> <!-- Don't show until function developed -->
                  <v-icon>mdi-magnify-minus-outline</v-icon>
                </v-btn>

                <v-btn icon v-if="false"> <!-- Don't show until function developed -->
                  <v-icon>mdi-arrow-collapse-up</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <!-- This is where the d3 svg is loaded -->
            <div class="canvas">
            </div>
            <!-- This is where the node add button is loaded -->
            <PopupNode 
            :selected="{
              selected: selected, 
              type: selectedNode.type, 
              name: selectedNode.name, 
              id: selectedNode.id, 
              children: selectedNode.children
              }" 
              @nodeAdded="snackbarNewNode = true" 
            />
          </v-card>
        </v-col>

        <v-col xs="6" sm="4" lg="3" xl="2">
          <!-- Card for node properties -->
          <v-card v-if="selected">
            <v-card-title 
              class="title white--text" 
              v-bind:class="[selectedNode.type]">{{ nodeTypes.filter(obj => { return obj.abbr === selectedNode.type })[0].nodeType }}
            </v-card-title>
            <v-form>
              <v-container grid-list-xl>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model.lazy="selectedNode.name"
                      label="Name"
                      required
                      outlined
                    ></v-text-field>
                    <!-- This should be a select menu using the real names of the nodes that could be the parents of the selected node -->
<!--                     <v-text-field
                      v-model.lazy="selectedNode.parent"
                      label="Parent"
                      required
                      outlined
                      disabled
                    ></v-text-field> -->
                    <v-textarea
                      v-model.lazy="selectedNode.description"
                      label="Description"
                      outlined
                    ></v-textarea>
                    <div class="caption grey--text">{{ selectedNode.id }}</div>
                  </v-flex>

                  <v-flex xs12>
                    <v-btn
                      color="success"
                      class="ma-1"
                      @click="saveNodeChanges()"
                      :loading="loadingNode"
                      small
                    >
                      Save
                    </v-btn>
                    <v-btn
                      color="warning"
                      class="ma-1"
                      @click="discardNodeChanges()"
                      :loading="loadingNode"
                      small
                    >
                      Reset
                    </v-btn>
                    <v-btn
                      color="error"
                      class="ma-1"
                      @click="deleteNode()"
                      small
                    >
                      Delete
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card>
        </v-col>

      </v-row>
    </v-container>
    
    <v-snackbar v-model="snackbarNewNode" :timeout="4000" top color="success">
      <span>Awesome! You added a new node.</span>
      <v-btn color="white" text @click="snackbarNewNode = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbarUpdatedNode" :timeout="4000" top color="success">
      <span>Awesome! You updated the node.</span>
      <v-btn color="white" text @click="snackbarUpdatedNode = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbarDeletedNode" :timeout="4000" top color="success">
      <span>Awesome! You deleted the node.</span>
      <v-btn color="white" text @click="snackbarDeletedNode = false">Close</v-btn>
    </v-snackbar>


  </div>
</template>

<script>
import * as d3 from 'd3'
import db from '@/fb'
import PopupNode from '@/components/PopupNode'
import { appendFile } from 'fs';

export default {
  name: 'ViewDiagram',
  components: { 
    PopupNode,
  },
  data() {
    return {
      user: null,
      snackbarNewNode: false,
      snackbarUpdatedNode: false,
      snackbarDeletedNode: false,
      selected: false,
      selectedNode: {
        id: '',
        name: '',
        type: '',
        parent: '',
        description: '',
        children: [],
      },
      nodeChanged: false,
      originalNode: {
        id: '',
        name: '',
        type: '',
        parent: '',
        description: '',
        children: [],
      },
      loadingNode: false,
    }
  },
  props: {
  },
  computed: {
    userSlug () {
      let user = this.$store.getters.user
      return user.slug
    },
    nodeTypes () {
      return this.$store.getters.nodeTypes
    },
  },
  methods: {
    deleteNode() {
      db.collection('nodes').doc(this.selectedNode.id).delete().then(() => {
        //this.selected = false;
        this.snackbarDeletedNode = true;
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    },
    discardNodeChanges(){
      this.selectedNode.name = this.originalNode.name;
      this.selectedNode.parent = this.originalNode.parent; // watch out for this when we do the children
      this.selectedNode.description= this.originalNode.description;
      this.selectedNode.children= this.originalNode.children;
    },
    saveNodeChanges(){
      if (JSON.stringify(this.selectedNode) == JSON.stringify(this.originalNode)) {
        console.log('Nothing changed!')
      } else {
        console.log('Something changed')
        // save to database
        this.loadingNode = true
        const node = { 
          name: this.selectedNode.name,
          id: this.selectedNode.id,
          description: this.selectedNode.description,
          type: this.selectedNode.type,
          parent: this.selectedNode.parent,
          creator: this.userSlug,
          project: this.$route.params.id,
        }
        db.collection('nodes').doc(this.selectedNode.id).set(node).then(() => {
          //this.selected = false;
          this.loadingNode = false;
          this.snackbarUpdatedNode = true;
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

      }
    },
    createSvg(){

      let vueComponent = this;

      var margin = {top: 50, right: 50, bottom: 50, left: 50}
        , width = (window.innerWidth - margin.left - margin.right)/2 - 50
        , height = window.innerHeight - margin.top - margin.bottom - 250;

      const svg = d3.select('.canvas')
        .append('svg')
        .attr('width', width + 100)
        .attr('height', height + 100)
        .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
        }));

      const graph = svg.append('g')
        .attr('transform', 'translate(50, 50)');

      // tree and stratify
      const stratify = d3.stratify()
        .id(d => d.id)
        .parentId(d => d.parent);

      const tree = d3.tree()
        .size([width, height]);
        //.nodeSize([100, 100]);

      // create ordinal scale
      const colour = d3.scaleOrdinal(['#FFC107', '#2196F3', '#000000', '#9E9E9E']);

      // update function  
      const update = (data) => {

        // remove current nodes
        graph.selectAll('.node').remove();
        graph.selectAll('.link').remove();

        // get updated root Node data
        const rootNode = stratify(data);
        const treeData = tree(rootNode).descendants();
        
        // get nodes selection and join data
        const nodes = graph.selectAll('.node')
          .data(treeData);

        // get link selection and join new data
        const link = graph.selectAll('.link')
          .data(tree(rootNode).links());


        // create enter link groups
        const enterLinks = link.enter()
          .append('g')
            .attr('class', 'link');

        // enter new links
        enterLinks.append('path')
            .transition().duration(300)
            .attr('fill', 'none')
            .attr('stroke', '#aaa') 
            .attr('stroke-width', 1)
            .attr('d', d3.linkVertical()
              .x(d => d.x)
              .y(d => d.y )
            );

        enterLinks.append('text')
            .attr('font-family', 'Arial, Helvetica, sans-serif')
            .attr('fill', 'Black')
            .style('font', 'normal 12px Arial')
            .attr('transform', function(d) {
                return 'translate(' +
                    ((d.source.x + d.target.x)/2) + ',' + 
                    ((d.source.y + d.target.y)/2) + ')';
            })   
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .text(function(d) {
                let source = d.source.data.type;
                let target = d.target.data.type;
                if( source  == 'FR' & target == 'DS' ){
                  var label = 'isb'
                } else if( source  == 'DS' & target == 'FR' ) {
                  var label = 'rf'
                } else if( source  == 'DS' & target == 'C' ) {
                  var label = 'icb'
                } else if( source  == 'DS' & target == 'DS' ) {
                  var label = 'iw'
                } else if( source  == 'C' & target == 'DS' ) {
                  var label = 'ipmb'
                } else {
                  var label = ''
                }
                return label;
            });

        // create enter node groups
        const enterNodes = nodes.enter()
          .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .on("click", function(d){
              let node = d3.select(this).select('rect')
              if (!node.classed("selected") ){
                vueComponent.selected = true;
                vueComponent.originalNode = {
                  id: d.data.id,
                  name: d.data.name,
                  type: d.data.type,
                  parent: d.data.parent,
                  description: d.data.description,
                  children: [],
                }
                vueComponent.selectedNode = {
                  id: d.data.id,
                  name: d.data.name,
                  type: d.data.type,
                  parent: d.data.parent,
                  description: d.data.description,
                  children: [],
                }
                d3.selectAll('rect')
                  .classed("selected", false)
                  .attr("stroke","#555")
                  .attr('stroke-width', 1);
                node.classed("selected", true)
                node.transition()
                  .attr("stroke","red")
                  .attr('stroke-width', 2);
              }else{
                node.classed("selected", false);
                vueComponent.selected = false;
                vueComponent.selectedNode = {
                  name: '',
                  type: '',
                  parent: '',
                  description: '',
                  children: []
                }
                node.transition()
                  .attr("stroke","#555")
                  .attr('stroke-width', 1);
              }            
            });
            
        // append rects to enter nodes
        enterNodes.append('rect')
          .attr('class', d => d.data.type)
          .attr('stroke', '#555')
          .attr('stroke-width', 1)
          .attr('width', d => d.data.name.length <= 10 ? d.data.name.length * 10 + 10 : 110)
          .attr('height', 50)
          .attr('transform', (d) => { // (d,i,n)
            let x = (d.data.name.length <= 10 ? d.data.name.length * 5 + 5 : 55);
            return `translate(${-x}, -25)`
          });

        enterNodes.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', 5)
          .attr('fill', 'white')
          .style('font', 'normal 12px Arial')
          .text(d => d.data.name.length <= 10 ? d.data.name : d.data.name.substring(0,10) + '...'); 

        enterNodes.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', -12)
          .attr('fill', d => d.data.type == 'FR' ? '#0D47A1' : d.data.type == 'DS' ? '#FF6F00' : '#FFFFFF' )
          .style('font', 'normal 8px Arial')
          .text(d => d.data.type); 

      };

      // data & firebase hook-up
      var data = [];

      db.collection('nodes').where('project', '==', this.$route.params.id).onSnapshot(res=> {

        res.docChanges().forEach(change => {

          const doc = change.doc.data();

          switch (change.type) {
            case 'added':
              data.push(doc);
              break;
            case 'modified': {
              const index = data.findIndex(item => item.id == doc.id);
              data[index] = doc;
              break;
            }
            case 'removed':
              data = data.filter(item => item.id !== doc.id);
              break;
            default:
              break;
          }

        });

        update(data);

      });


    }
  },
  mounted(){
    this.createSvg();
  },
};

</script>

<style>
.node {
  cursor: pointer;
}
.selected {
  stroke-dasharray: 6;
  stroke-linecap: round;
}
.DS {
  stroke: #FF6F00;
  fill: #FFC107;
}
.FR {
  stroke: #0D47A1;
  fill: #2196F3;
}
.C {
  stroke: #424242;
  fill: #000000;
}
.CC {
  stroke: #757575;
  fill: #9E9E9E;
}
.v-card__title.FR {
  background-color: #2196F3;
}
.v-card__title.DS {
  background-color: #FFC107;
}
.v-card__title.C {
  background-color: #000000;
}
.v-card__title.CC {
  background-color: #9E9E9E;
}
</style>
