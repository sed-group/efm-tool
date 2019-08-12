<template>
  <div class="diagram">
    <v-snackbar v-model="snackbarNode" :timeout="4000" top color="success">
      <span>Awesome! You added a new node.</span>
      <v-btn color="white" text @click="snackbarNode = false">Close</v-btn>
    </v-snackbar>
    <h1 class="subtitle-1 grey--text">Diagram</h1>
    <v-container class="my-1 canvas">
    </v-container>
    
    <PopupNode @nodeAdded="snackbarNode = true" />
  </div>
</template>

<script>
import * as d3 from 'd3'
import db from '@/fb'
import PopupNode from '@/components/PopupNode'

export default {
  name: 'Diagram',
  components: { 
    PopupNode,
  },
  data() {
    return {
      snackbarNode: false,
    }
  },
  props: {
  },
  methods: {
    createSvg(){

      var margin = {top: 50, right: 50, bottom: 50, left: 50}
        , width = window.innerWidth - margin.left - margin.right - 50
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
        colour.domain(data.map(d => d.department));

        // get updated root Node data
        const rootNode = stratify(data);
        const treeData = tree(rootNode).descendants();
        
        // get nodes selection and join data
        const nodes = graph.selectAll('.node')
          .data(treeData);

        // get link selection and join new data
        const link = graph.selectAll('.link')
          .data(tree(rootNode).links());

        // enter new links
        link.enter()
          .append('path')
            .transition().duration(300)
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#aaa') 
            .attr('stroke-width', 2)
            .attr('d', d3.linkVertical()
              .x(d => d.x)
              .y(d => d.y )
            );

        // create enter node groups
        const enterNodes = nodes.enter()
          .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);
            
        // append rects to enter nodes
        enterNodes.append('rect')
          // apply the ordinal scale for fill
          .attr('fill', d => colour(d.data.department))
          .attr('stroke', '#555')
          .attr('stroke-width', 2)
          .attr('width', d => d.data.name.length * 10)
          .attr('height', 50)
          .attr('transform', (d) => { // (d,i,n)
            let x = (d.data.name.length * 5);
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

      db.collection('employees').onSnapshot(res=> {

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

</style>
