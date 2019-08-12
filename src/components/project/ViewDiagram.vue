<template>
  <div class="diagram">
    <v-snackbar v-model="snackbarNode" :timeout="4000" top color="success">
      <span>Awesome! You added a new node.</span>
      <v-btn color="white" text @click="snackbarNode = false">Close</v-btn>
    </v-snackbar>
    

    <v-navigation-drawer permanent floating absolute right v-if="propertiesDrawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Properties
          </v-list-item-title>
          <v-list-item-subtitle>
            of the selected node
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        
        <v-form>
          <v-container grid-list-xl>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="selectedNode.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  v-model="selectedNode.type"
                  :counter="10"
                  label="Type"
                  required
                ></v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field
                  v-model="selectedNode.parent"
                  label="Parent"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>

      </v-list>
    </v-navigation-drawer>

            <v-container class="my-1 canvas">

            </v-container>

        <!-- <v-layout row wrap>
          <v-flex xs12 md6>

          </v-flex>
          <v-flex xs12 md6>
            <v-form>
              <v-container grid-list-xl>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model="selectedNode.name"
                      label="Name"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="selectedNode.type"
                      :counter="10"
                      label="Type"
                      required
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                    <v-text-field
                      v-model="selectedNode.parent"
                      label="Parent"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
            
          </v-flex>
        </v-layout> -->


    
    <PopupNode @nodeAdded="snackbarNode = true" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import db from '@/fb'
import PopupNode from '@/components/PopupNode'

export default {
  name: 'ViewDiagram',
  components: { 
    PopupNode,
  },
  data() {
    return {
      snackbarNode: false,
      selectedNode: {
        name: '',
        type: '',
        parent: '',
        description: '',
      },
      propertiesDrawer: false,
    }
  },
  props: {
  },
  methods: {
    createSvg(){

      let vueComponent = this;

      var margin = {top: 50, right: 50, bottom: 50, left: 50}
        , width = (window.innerWidth - margin.left - margin.right)/2 - 50
        , height = window.innerHeight - margin.top - margin.bottom - 250;

      const svg = d3.select('.canvas')
        .append('svg')
        .attr('width', width + 100)
        .attr('height', height + 100);

      const graph = svg.append('g')
        .attr('transform', 'translate(50, 50)');

      // tree and stratify
      const stratify = d3.stratify()
        .id(d => d.name)
        .parentId(d => d.parent);

      const tree = d3.tree()
        .size([width, height]);

      // create ordinal scale
      const colour = d3.scaleOrdinal(['#FFC107', '#2196F3', '#000000', '#9E9E9E']);

      // update function  
      const update = (data) => {

        // remove current nodes
        graph.selectAll('.node').remove();
        graph.selectAll('.link').remove();

        // update ordinal scale domain
        // colour.domain(data.map(d => d.department));

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
            .attr('stroke-width', 2)
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
                vueComponent.propertiesDrawer = true;
                vueComponent.selectedNode = {
                  name: d.data.name,
                  type: d.data.type,
                  parent: d.data.parent,
                  description: d.data.description,
                }
                d3.selectAll('rect')
                  .classed("selected", false)
                  .attr("stroke","#555")
                  .attr('stroke-width', 2);
                node.classed("selected", true)
                node.transition()
                  .attr("stroke","red")
                  .attr('stroke-width', 4);
              }else{
                node.classed("selected", false);
                vueComponent.propertiesDrawer = false;
                vueComponent.selectedNode = {
                  name: '',
                  type: '',
                  parent: '',
                  description: '',
                }
                node.transition()
                  .attr("stroke","#555")
                  .attr('stroke-width', 2);
              }            
            });
            
        // append rects to enter nodes
        enterNodes.append('rect')
          .attr('class', d => d.data.type)
          // apply the ordinal scale for fill
          //.attr('fill', d => colour(d.data.type))
          .attr('stroke', '#555')
          .attr('stroke-width', 2)
          .attr('width', d => d.data.name.length * 10 + 10)
          .attr('height', 50)
          .attr('transform', (d) => { // (d,i,n)
            let x = (d.data.name.length * 5 + 5);
            return `translate(${-x}, -25)`
          });

        enterNodes.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', 5)
          .attr('fill', 'white')
          .text(d => d.data.name); 

      };

      // data & firebase hook-up
      var data = [];

      db.collection('nodes').where('project', '==', this.$route.params.id).onSnapshot(res=> {

        res.docChanges().forEach(change => {

          const doc = {...change.doc.data(), id: change.doc.id};

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
  }
};

</script>

<style>
.FR {
  fill: #2196F3;
}
.DS {
  fill: #FFC107;
}
.C {
  fill: #000000;
}
.CC {
  fill: #9E9E9E;
}
</style>
