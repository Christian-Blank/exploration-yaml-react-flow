import { v4 as uuidv4 } from 'uuid';

/**
 * Base node interface that all nodes inherit from
 */
export interface BaseNode {
  id: string;
  type: string;
  title?: string;
  description?: string;
  parent_ids: string[];
  child_ids: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

/**
 * Options for creating a new node
 */
export interface CreateNodeOptions {
  /**
   * Type of the node
   */
  type: string;

  /**
   * Title of the node
   */
  title?: string;

  /**
   * Description of the node
   */
  description?: string;

  /**
   * Parent node IDs
   */
  parent_ids?: string[];

  /**
   * Child node IDs
   */
  child_ids?: string[];

  /**
   * Tags for the node
   */
  tags?: string[];

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;

  /**
   * ID of the creator
   */
  created_by?: string;
}

/**
 * Create a new base node
 * @param options Options for creating the node
 * @returns The created node
 */
export function createBaseNode(options: CreateNodeOptions): BaseNode {
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    type: options.type,
    title: options.title,
    description: options.description,
    parent_ids: options.parent_ids || [],
    child_ids: options.child_ids || [],
    created_at: now,
    updated_at: now,
    created_by: options.created_by,
    updated_by: options.created_by,
    tags: options.tags || [],
    metadata: options.metadata || {},
  };
}

/**
 * Add a child node to a parent node
 * @param parent The parent node
 * @param child The child node
 * @returns The updated parent and child nodes
 */
export function addChildNode(
  parent: BaseNode,
  child: BaseNode
): { parent: BaseNode; child: BaseNode } {
  // Create new instances to avoid mutating the originals
  const updatedParent = { ...parent, child_ids: [...parent.child_ids] };
  const updatedChild = { ...child, parent_ids: [...child.parent_ids] };

  // Update child IDs in parent
  if (!updatedParent.child_ids.includes(child.id)) {
    updatedParent.child_ids.push(child.id);
    updatedParent.updated_at = new Date().toISOString();
  }

  // Update parent IDs in child
  if (!updatedChild.parent_ids.includes(parent.id)) {
    updatedChild.parent_ids.push(parent.id);
    updatedChild.updated_at = new Date().toISOString();
  }

  return { parent: updatedParent, child: updatedChild };
}

/**
 * Remove a child node from a parent node
 * @param parent The parent node
 * @param childId The ID of the child node to remove
 * @param child Optional child node to update
 * @returns The updated parent node and child node (if provided)
 */
export function removeChildNode(
  parent: BaseNode,
  childId: string,
  child?: BaseNode
): { parent: BaseNode; child?: BaseNode } {
  // Create new instances to avoid mutating the originals
  const updatedParent = {
    ...parent,
    child_ids: parent.child_ids.filter(id => id !== childId),
    updated_at: new Date().toISOString(),
  };

  let updatedChild: BaseNode | undefined;

  if (child) {
    updatedChild = {
      ...child,
      parent_ids: child.parent_ids.filter(id => id !== parent.id),
      updated_at: new Date().toISOString(),
    };
  }

  return { parent: updatedParent, child: updatedChild };
}

/**
 * Check if a node is a root node (has no parents)
 * @param node The node to check
 * @returns True if the node is a root node
 */
export function isRootNode(node: BaseNode): boolean {
  return node.parent_ids.length === 0;
}

/**
 * Check if a node is a leaf node (has no children)
 * @param node The node to check
 * @returns True if the node is a leaf node
 */
export function isLeafNode(node: BaseNode): boolean {
  return node.child_ids.length === 0;
}

/**
 * Find the root nodes in a collection of nodes
 * @param nodes The collection of nodes
 * @returns An array of root nodes
 */
export function findRootNodes(nodes: BaseNode[]): BaseNode[] {
  return nodes.filter(isRootNode);
}

/**
 * Find all child nodes of a parent node in a collection of nodes
 * @param parentNode The parent node
 * @param allNodes The collection of all nodes
 * @returns An array of child nodes
 */
export function findChildNodes(parentNode: BaseNode, allNodes: BaseNode[]): BaseNode[] {
  return allNodes.filter(node => parentNode.child_ids.includes(node.id));
}

/**
 * Find all parent nodes of a child node in a collection of nodes
 * @param childNode The child node
 * @param allNodes The collection of all nodes
 * @returns An array of parent nodes
 */
export function findParentNodes(childNode: BaseNode, allNodes: BaseNode[]): BaseNode[] {
  return allNodes.filter(node => childNode.parent_ids.includes(node.id));
}
