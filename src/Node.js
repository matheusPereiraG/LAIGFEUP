/**
 * Node
 * @constructor
 */
function Node(graph){
    this.graph = graph;
    this.id = null; //ID of the current node
    this.materials = []; //"inherit" or [Material] array with materials 
    this.texture = []; //array with id of texture, amp_s and amp_t, null if none, or array with string inherit, amp_s and amp_t
    this.componentRef = []; //id of nodes that are references
    this.primitive = null;  //primitive id
    this.animations = []; //animation id
    this.animationIndex = 0; //as we declare animations, we need to know which go first
    this.transformMatrix = mat4.create(); //matrix that contains all transformations for the current node
  }

Node.prototype.addChild=function(id){
  this.componentRef.push(id);
};

Node.prototype.setPrimitive=function(id){
  this.primitive = id;
};

Node.prototype.setMaterials=function(materials){
  this.materials = materials; 
};
Node.prototype.addAnimation=function(animation){
this.animations.push(animation);
};

