export default {
  nodes: null,
  nodeTypes: [
    {nodeType: 'Functional Requirement', abbr: 'FR', allowedChildren: ['DS']},
    {nodeType: 'Design Solution', abbr: 'DS', allowedChildren: ['FR', 'C']},
    {nodeType: 'Constraint', abbr: 'C', allowedChildren: []},
    {nodeType: 'Configurable Component', abbr: 'CC', allowedChildren: []},
  ],
}