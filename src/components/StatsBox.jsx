import { useMemo } from "react";
import { useDiagram } from "../hooks";

export default function StatsBox() {
  const { tables, relationships, tablesCount, relationshipsCount } = useDiagram();

  const stats = useMemo(() => {
    const tableCount = tablesCount ?? tables.length;
    const relationshipCount = relationshipsCount ?? relationships.length;

    let totalFields = 0;
    tables.forEach((table) => {
      totalFields += Array.isArray(table.fields) ? table.fields.length : 0;
    });

    const avgFields =
      tableCount > 0 ? Number((totalFields / tableCount).toFixed(1)) : 0;

    const adjacency = new Map();
    tables.forEach((t) => {
      adjacency.set(t.id, new Set());
    });
    relationships.forEach((r) => {
      if (adjacency.has(r.startTableId) && adjacency.has(r.endTableId)) {
        adjacency.get(r.startTableId).add(r.endTableId);
        adjacency.get(r.endTableId).add(r.startTableId);
      }
    });

    let maxDepth = 0;

    const bfsMaxDistance = (startId) => {
      const visited = new Set([startId]);
      const queue = [[startId, 0]];

      while (queue.length > 0) {
        const [current, dist] = queue.shift();
        const neighbors = adjacency.get(current) ?? new Set();
        neighbors.forEach((next) => {
          if (!visited.has(next)) {
            visited.add(next);
            queue.push([next, dist + 1]);
            if (dist + 1 > maxDepth) {
              maxDepth = dist + 1;
            }
          }
        });
      }
    };

    adjacency.forEach((_, id) => {
      bfsMaxDistance(id);
    });

    return {
      tableCount,
      relationshipCount,
      totalFields,
      avgFields,
      maxDepth,
    };
  }, [tables, relationships, tablesCount, relationshipsCount]);

  if (!tables.length && !relationships.length) return null;

  return (
    <div className="fixed left-5 bottom-4 z-20">
      <div className="popover-theme rounded-lg px-4 py-3 shadow-lg text-xs min-w-[200px]">
        <div className="font-semibold text-sm mb-1.5">Layout stats</div>
        <div className="flex justify-between">
          <span>Tables</span>
          <span>{stats.tableCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Relationships</span>
          <span>{stats.relationshipCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Total fields</span>
          <span>{stats.totalFields}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg fields / table</span>
          <span>{stats.avgFields}</span>
        </div>
        <div className="flex justify-between">
          <span>Max relationship depth</span>
          <span>{stats.maxDepth}</span>
        </div>
      </div>
    </div>
  );
}

