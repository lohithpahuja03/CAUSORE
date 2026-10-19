"""
CAUSORE Service Dependency Graph Engine
Built on NetworkX directed graph representations for causal tracing and blast radius calculation.
Strictly adhering to BRAIN.md Principle 2 & Stage 10.
"""

from typing import List, Dict, Set, Optional
import networkx as nx


class ServiceDependencyGraph:
    """
    Directed graph representing service architectures.
    Edge convention: (caller, callee) indicates 'caller depends on callee'.
    """

    def __init__(self):
        self.graph = nx.DiGraph()

    def add_service(self, service_name: str, **attributes) -> None:
        """Add a service node with metadata (role, tier, technology)."""
        self.graph.add_node(service_name, **attributes)

    def add_dependency(self, caller: str, callee: str, **attributes) -> None:
        """Record directed dependency (caller -> callee)."""
        self.add_service(caller)
        self.add_service(callee)
        self.graph.add_edge(caller, callee, **attributes)

    def load_from_dict(self, mapping: Dict[str, List[str]]) -> None:
        """Load service topology from dictionary mapping { caller: [callees] }."""
        for caller, callees in mapping.items():
            for callee in callees:
                self.add_dependency(caller, callee)

    def get_blast_radius(self, failed_service: str) -> List[str]:
        """
        Compute blast radius: all services directly or transitively impacted by failure.
        Since edge is caller -> callee, all services depending on failed_service
        are ancestors in the graph (i.e. nodes that have a path to failed_service).
        """
        if failed_service not in self.graph:
            return [failed_service]

        impacted: Set[str] = {failed_service}
        for node in self.graph.nodes:
            if node != failed_service and nx.has_path(self.graph, node, failed_service):
                impacted.add(node)

        return sorted(list(impacted))

    def get_downstream_dependencies(self, service: str) -> List[str]:
        """Get services that 'service' directly calls."""
        if service not in self.graph:
            return []
        return list(self.graph.successors(service))

    def get_upstream_callers(self, service: str) -> List[str]:
        """Get services that directly call 'service'."""
        if service not in self.graph:
            return []
        return list(self.graph.predecessors(service))

    def find_causal_paths(self, source_failure: str, target_symptom: str) -> List[List[str]]:
        """
        Find path from target_symptom down to source_failure.
        Example: api-gateway -> checkout-api -> payment-service
        """
        if target_symptom not in self.graph or source_failure not in self.graph:
            return []

        try:
            paths = list(nx.all_simple_paths(self.graph, target_symptom, source_failure))
            return paths
        except nx.NetworkXNoPath:
            return []
