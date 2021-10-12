'use strict';

class Node {
  constructor(name, children) {
    this.name = name;
    this.children = children;
  }
}

module.exports = class DependencySolver {
  constructor() {
    this.heap = [];
    this.graph = [];
    this.stack = [];
  }

  _getChildrenNode(children) {
    const {heap} = this;
    return children.map((child) => {
      const childNode = heap.find((node) => node.name === child);
      if (!childNode) {
        throw new Error(`node "${child.toString()}" does not exist`);
      }
      return childNode;
    });
  }

  _isVisited(address) {
    const node = this.stack.find((node) => node === address);
    return node !== undefined;
  }

  _sortUtil(visitedNode) {
    const {children} = visitedNode;
    children.map((child) => {
      if (this._isVisited(child)) return;
      this._sortUtil(child);
    });

    this.stack.push(visitedNode);
  }

  addNode(name, children) {
    this.heap.push(new Node(name, children));
    return this;
  }

  buildGraph() {
    this.graph = this.heap.map((node) => {
      const {children} = node;
      node.children = this._getChildrenNode(children);
      return node;
    });
    return this;
  }

  _checkCycles(node, register = {}, cycle = []) {
    if (!node) return;
    const {name, children} = node;
    register[name] = 1;
    for (const child of children) {
      const {name: childName} = child;
      if (register[childName] === undefined) {
        this._checkCycles(child, register, cycle);
      } else if (register[childName] === 1) {
        cycle.push(child);
        this._checkCycles(null, register, cycle);
      }
    }
    register[name] = 2;
    return cycle.length > 0;
  }

  isCyclic() {
    const {graph} = this;
    if (!graph.length) throw new Error(`graph not build`);
    for (const node of graph) {
      const cycle = this._checkCycles(node);
      if (cycle) return true;
    }
    return false;
  }

  sort() {
    const {graph} = this;
    if (!graph.length) throw new Error(`graph not build`);
    for (const node of graph) {
      if (!this._isVisited(node)) {
        this._sortUtil(node);
      }
    }
    return this;
  }

  getSolvedDependency() {
    this.buildGraph();
    if (this.isCyclic()) throw new Error(`cyclic dependencies not allowed`);
    this.sort();
    const {stack} = this;
    return stack.map((node) => {
      const {children} = node;
      node.children = children.map((child) => child.name);
      return node;
    });
  }
};
