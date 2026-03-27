import { EventEnvelope } from '@cosmic-arc/schema/src/eventEnvelope';

/** Simple directed graph for cross‑layer relationships */
export interface GraphNode {
  id: string;
  type: string; // e.g., 'event', 'kernel', 'buffer', 'queue', 'artifact', 'crash'
  data: any;
}

export interface GraphEdge {
  from: string;
  to: string;
  relation: string; // e.g., 'caused_by', 'reads_from', 'writes_to', 'syncs_with', 'derived_from'
}

export class CorrelationGraphService {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  addEdge(edge: GraphEdge): void {
    // Ensure both nodes exist
    if (this.nodes.has(edge.from) && this.nodes.has(edge.to)) {
      this.edges.push(edge);
    }
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getEdges(): readonly GraphEdge[] {
    return this.edges;
  }

  /** Simple query API */
  findNeighbors(nodeId: string, relation?: string): GraphNode[] {
    const neighborIds = this.edges
      .filter(e => e.from === nodeId && (!relation || e.relation === relation))
      .map(e => e.to);
    return neighborIds.map(id => this.nodes.get(id)!).filter(Boolean);
  }
}
