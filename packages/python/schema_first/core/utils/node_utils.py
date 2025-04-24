"""Node utilities module for working with graph nodes."""

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple, Union, TypedDict, cast

from pydantic import BaseModel, Field


class BaseNode(BaseModel):
    """Base node model that all nodes inherit from."""

    id: str
    type: str
    title: Optional[str] = None
    description: Optional[str] = None
    parent_ids: List[str] = Field(default_factory=list)
    child_ids: List[str] = Field(default_factory=list)
    created_at: str
    updated_at: str
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class CreateNodeOptions(BaseModel):
    """Options for creating a new node."""

    type: str
    title: Optional[str] = None
    description: Optional[str] = None
    parent_ids: List[str] = Field(default_factory=list)
    child_ids: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_by: Optional[str] = None


def create_base_node(options: CreateNodeOptions) -> BaseNode:
    """Create a new base node.
    
    Args:
        options: Options for creating the node
        
    Returns:
        The created node
    """
    now = datetime.utcnow().isoformat() + "Z"
    
    return BaseNode(
        id=str(uuid.uuid4()),
        type=options.type,
        title=options.title,
        description=options.description,
        parent_ids=options.parent_ids,
        child_ids=options.child_ids,
        created_at=now,
        updated_at=now,
        created_by=options.created_by,
        updated_by=options.created_by,
        tags=options.tags,
        metadata=options.metadata
    )


def add_child_node(parent: BaseNode, child: BaseNode) -> Tuple[BaseNode, BaseNode]:
    """Add a child node to a parent node.
    
    Args:
        parent: The parent node
        child: The child node
        
    Returns:
        The updated parent and child nodes
    """
    # Create new instances to avoid mutating the originals
    updated_parent = parent.model_copy(deep=True)
    updated_child = child.model_copy(deep=True)
    
    # Update child IDs in parent
    if child.id not in updated_parent.child_ids:
        updated_parent.child_ids.append(child.id)
        updated_parent.updated_at = datetime.utcnow().isoformat() + "Z"
    
    # Update parent IDs in child
    if parent.id not in updated_child.parent_ids:
        updated_child.parent_ids.append(parent.id)
        updated_child.updated_at = datetime.utcnow().isoformat() + "Z"
    
    return updated_parent, updated_child


def remove_child_node(
    parent: BaseNode, child_id: str, child: Optional[BaseNode] = None
) -> Tuple[BaseNode, Optional[BaseNode]]:
    """Remove a child node from a parent node.
    
    Args:
        parent: The parent node
        child_id: The ID of the child node to remove
        child: Optional child node to update
        
    Returns:
        The updated parent node and child node (if provided)
    """
    # Create new instances to avoid mutating the originals
    updated_parent = parent.model_copy(deep=True)
    
    # Update child IDs in parent
    if child_id in updated_parent.child_ids:
        updated_parent.child_ids.remove(child_id)
        updated_parent.updated_at = datetime.utcnow().isoformat() + "Z"
    
    updated_child = None
    if child:
        updated_child = child.model_copy(deep=True)
        
        # Update parent IDs in child
        if parent.id in updated_child.parent_ids:
            updated_child.parent_ids.remove(parent.id)
            updated_child.updated_at = datetime.utcnow().isoformat() + "Z"
    
    return updated_parent, updated_child


def is_root_node(node: BaseNode) -> bool:
    """Check if a node is a root node (has no parents).
    
    Args:
        node: The node to check
        
    Returns:
        True if the node is a root node
    """
    return len(node.parent_ids) == 0


def is_leaf_node(node: BaseNode) -> bool:
    """Check if a node is a leaf node (has no children).
    
    Args:
        node: The node to check
        
    Returns:
        True if the node is a leaf node
    """
    return len(node.child_ids) == 0


def find_root_nodes(nodes: List[BaseNode]) -> List[BaseNode]:
    """Find the root nodes in a collection of nodes.
    
    Args:
        nodes: The collection of nodes
        
    Returns:
        An array of root nodes
    """
    return [node for node in nodes if is_root_node(node)]


def find_child_nodes(parent_node: BaseNode, all_nodes: List[BaseNode]) -> List[BaseNode]:
    """Find all child nodes of a parent node in a collection of nodes.
    
    Args:
        parent_node: The parent node
        all_nodes: The collection of all nodes
        
    Returns:
        An array of child nodes
    """
    return [node for node in all_nodes if node.id in parent_node.child_ids]


def find_parent_nodes(child_node: BaseNode, all_nodes: List[BaseNode]) -> List[BaseNode]:
    """Find all parent nodes of a child node in a collection of nodes.
    
    Args:
        child_node: The child node
        all_nodes: The collection of all nodes
        
    Returns:
        An array of parent nodes
    """
    return [node for node in all_nodes if node.id in child_node.parent_ids] 