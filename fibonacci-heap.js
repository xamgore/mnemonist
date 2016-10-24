/* eslint no-constant-condition: 0 */
/**
 * Mnemonist Fibonacci Heap
 * =========================
 *
 * Fibonacci heap implementation.
 */
var comparators = require('./utils/heap-comparators.js');

var DEFAULT_COMPARATOR = comparators.DEFAULT_COMPARATOR,
    DEFAULT_REVERSED_COMPARATOR = comparators.DEFAULT_REVERSED_COMPARATOR;

/**
 * Fibonacci Heap.
 *
 * @constructor
 */
function FibonacciHeap() {
  this.clear();
  this.comparator = DEFAULT_COMPARATOR;
}

/**
 * Method used to clear the heap.
 *
 * @return {undefined}
 */
FibonacciHeap.prototype.clear = function() {

  // Properties
  this.root = null;
  this.min = null;
  this.size = 0;
};

/**
 * Function used to create a node.
 *
 * @param  {any}    item - Target item.
 * @return {object}
 */
function createNode(item) {
  return {
    item: item,
    degree: 0
  };
}

/**
 * Function used to merge the given node with the root list.
 *
 * @param {FibonacciHeap} heap - Target heap.
 * @param {Node}          node - Target node.
 */
function mergeWithRoot(heap, node) {
  if (!heap.root) {
    heap.root = node;
  }
  else {
    node.right = heap.root.right;
    node.left = heap.root;
    heap.root.right.left = node;
    heap.root.right = node;
  }
}

/**
 * Method used to push an item into the heap.
 *
 * @param  {any}    item - Item to push.
 * @return {number}
 */
FibonacciHeap.prototype.push = function(item) {
  var node = createNode(item);
  node.left = node;
  node.right = node;
  mergeWithRoot(this, node);

  if (!this.min || this.comparator(node.item, this.min.item) <= 0)
    this.min = node;

  return ++this.size;
};

/**
 * Method used to get the "first" item of the heap.
 *
 * @return {any}
 */
FibonacciHeap.prototype.peek = function() {
  return this.min ? this.min.item : undefined;
};

/**
 * Function used to iterate in the linked list.
 *
 * @param {Node} head - Head node.
 * @param {array}
 */
function iterate(head) {
  var nodes = [],
      node = head,
      flag = false;

  while (true) {
    if (node === head && flag)
      break;
    else if (node === head)
      flag = true;

    nodes.push(node);
    node = node.right;
  }

  return nodes;
}

/**
 * Function used to remove the target node from the root list.
 *
 * @param {FibonacciHeap} heap - Target heap.
 * @param {Node}          node - Target node.
 */
function removeFromRoot(heap, node) {
  if (heap.root === node)
    heap.root = node.right;
  node.left.right = node.right;
  node.right.left = node.left;
}

/**
 * Function used to merge the given node with the child list of a root node.
 *
 * @param {Node} parent - Parent node.
 * @param {Node} node   - Target node.
 */
function mergeWithChild(parent, node) {
  if (!parent.child) {
    parent.child = node;
  }
  else {
    node.right = parent.child.right;
    node.left = parent.child;
    parent.child.right.left = node;
    parent.child.right = node;
  }
}

/**
 * Function used to link one node to another in the root list.
 *
 * @param {FibonacciHeap} heap - Target heap.
 * @param {Node}          y - Y node.
 * @param {Node}          x - X node.
 */
function link(heap, y, x) {
  removeFromRoot(heap, y);
  y.left = y;
  y.right = y;
  mergeWithChild(x, y);
  x.degree++;
  y.parent = x;
}

/**
 * Function used to consolidate the heap.
 *
 * @param {FibonacciHeap} heap - Target heap.
 */
function consolidate(heap) {
  var A = new Array(heap.size),
      nodes = iterate(heap.root),
      i, l, x, y, d, t;

  for (i = 0, l = nodes.length; i < l; i++) {
    x = nodes[i];
    d = x.degree;

    while (A[d]) {
      y = A[d];

      if (heap.comparator(x.item, y.item) > 0) {
        t = x;
        x = y;
        y = t;
      }

      link(heap, y, x);
      A[d] = null;
      d++;
    }

    A[d] = x;
  }

  for (i = 0; i < heap.size; i++) {
    if (A[i] && heap.comparator(A[i].item, heap.min.item) <= 0)
      heap.min = A[i];
  }
}

/**
 * Method used to retrieve & remove the "first" item of the heap.
 *
 * @return {any}
 */
FibonacciHeap.prototype.pop = function() {
  if (!this.size)
    return undefined;

  var z = this.min;

  if (z.child) {
    var nodes = iterate(z.child),
        node,
        i,
        l;

    for (i = 0, l = nodes.length; i < l; i++) {
      node = nodes[i];

      mergeWithRoot(this, node);
      delete node.parent;
    }
  }

  removeFromRoot(this, z);

  if (z === z.right) {
    this.min = null;
    this.root = null;
  }
  else {
    this.min = z.right;
    consolidate(this);
  }

  this.size--;

  return z.item;
};

/**
 * Fibonacci Maximum Heap.
 *
 * @constructor
 */
function MaxFibonacciHeap() {
  this.clear();
  this.comparator = DEFAULT_REVERSED_COMPARATOR;
}

MaxFibonacciHeap.prototype = FibonacciHeap.prototype;

/**
 * Exporting.
 */
FibonacciHeap.MinFibonacciHeap = FibonacciHeap;
FibonacciHeap.MaxFibonacciHeap = MaxFibonacciHeap;
module.exports = FibonacciHeap;
