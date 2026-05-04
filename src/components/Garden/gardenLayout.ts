import type { Note, Vec3, GardenNode3D, GardenBranch3D, GardenTree3D, DecoStem3D } from "../../lib/types";
import { getTagColor, getPrimaryTag } from "../../lib/colors";

function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function buildGarden3D(notes: Note[]): {
  trees: GardenTree3D[];
  decoStems: DecoStem3D[];
} {
  const noteMap = new Map<string, Note>();
  for (const n of notes) noteMap.set(n.slug, n);

  // Build undirected adjacency
  const adj = new Map<string, Set<string>>();
  for (const n of notes) {
    if (!adj.has(n.slug)) adj.set(n.slug, new Set());
    for (const c of n.connections) {
      if (noteMap.has(c)) {
        adj.get(n.slug)!.add(c);
        if (!adj.has(c)) adj.set(c, new Set());
        adj.get(c)!.add(n.slug);
      }
    }
  }

  // Find connected components
  const visited = new Set<string>();
  const components: Note[][] = [];
  for (const n of notes) {
    if (visited.has(n.slug)) continue;
    const component: Note[] = [];
    const queue = [n.slug];
    visited.add(n.slug);
    while (queue.length) {
      const slug = queue.shift()!;
      component.push(noteMap.get(slug)!);
      for (const neighbor of adj.get(slug) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    components.push(component);
  }

  const rng = makeRng(42);
  const trees: GardenTree3D[] = [];

  // Distribute tree roots on the ground plane (xz)
  const totalTrees = components.length;
  const spacing = 8;

  for (let ti = 0; ti < components.length; ti++) {
    const comp = components[ti];
    comp.sort((a, b) => (a.date < b.date ? -1 : 1));
    const rootNote = comp[0];

    // Root position on ground
    const rootX = (ti - (totalTrees - 1) / 2) * spacing;
    const rootZ = (rng() - 0.5) * 3;

    // BFS to build tree structure
    const bfsVisited = new Set<string>();
    const rootNode: GardenNode3D = {
      slug: rootNote.slug,
      note: rootNote,
      position: [rootX, 0, rootZ],
      color: getTagColor(getPrimaryTag(rootNote.tags)),
      depth: 0,
      children: [],
    };
    bfsVisited.add(rootNote.slug);

    const bfsQueue: GardenNode3D[] = [rootNode];
    while (bfsQueue.length) {
      const parent = bfsQueue.shift()!;
      const neighbors = adj.get(parent.slug) || new Set();
      for (const neighborSlug of neighbors) {
        if (bfsVisited.has(neighborSlug)) continue;
        bfsVisited.add(neighborSlug);
        const neighborNote = noteMap.get(neighborSlug)!;
        const childNode: GardenNode3D = {
          slug: neighborSlug,
          note: neighborNote,
          position: [0, 0, 0],
          color: getTagColor(getPrimaryTag(neighborNote.tags)),
          depth: parent.depth + 1,
          children: [],
        };
        parent.children.push(childNode);
        bfsQueue.push(childNode);
      }
    }

    // Position nodes in 3D, growing upward (Y+)
    const branches: GardenBranch3D[] = [];
    const allNodes: GardenNode3D[] = [];

    function layoutNode(
      node: GardenNode3D,
      parentPos: Vec3,
      baseAngleXZ: number, // radians around Y axis
      elevAngle: number,   // angle from vertical (0 = straight up)
      branchLen: number,
      thickness: number
    ) {
      if (node.depth === 0) {
        // Trunk: go straight up
        const trunkH = comp.length === 1 ? 1.5 + rng() * 2 : 3 + rng() * 1.5;
        const trunkTop: Vec3 = [parentPos[0], parentPos[1] + trunkH, parentPos[2]];

        // Slight curve in trunk
        const midY = (parentPos[1] + trunkTop[1]) / 2;
        const jx = (rng() - 0.5) * 0.3;
        const jz = (rng() - 0.5) * 0.3;
        const mid: Vec3 = [parentPos[0] + jx, midY, parentPos[2] + jz];

        branches.push({ start: parentPos, end: trunkTop, mid, thickness: Math.max(0.04, thickness) });

        node.position = trunkTop;
        allNodes.push(node);

        if (comp.length === 1) return; // solo stem

        // Spread children radially in 3D
        const childCount = node.children.length;
        const baseAzimuth = rng() * Math.PI * 2;
        for (let i = 0; i < childCount; i++) {
          const azimuth = baseAzimuth + (i / childCount) * Math.PI * 2 + (rng() - 0.5) * 0.5;
          const elev = 0.3 + rng() * 0.4; // 15-40 degrees from vertical
          const len = 2.5 + rng() * 1.5;
          layoutNode(node.children[i], trunkTop, azimuth, elev, len, thickness * 0.7);
        }
        return;
      }

      // Non-root: grow from parent in the given direction
      const sinElev = Math.sin(elevAngle);
      const cosElev = Math.cos(elevAngle);
      const dx = sinElev * Math.cos(baseAngleXZ) * branchLen;
      const dy = cosElev * branchLen;
      const dz = sinElev * Math.sin(baseAngleXZ) * branchLen;

      const endPos: Vec3 = [
        parentPos[0] + dx,
        parentPos[1] + dy,
        parentPos[2] + dz,
      ];

      // Organic bezier midpoint
      const jx = (rng() - 0.5) * branchLen * 0.2;
      const jy = (rng() - 0.5) * branchLen * 0.1;
      const jz = (rng() - 0.5) * branchLen * 0.2;
      const mid: Vec3 = [
        (parentPos[0] + endPos[0]) / 2 + jx,
        (parentPos[1] + endPos[1]) / 2 + jy,
        (parentPos[2] + endPos[2]) / 2 + jz,
      ];

      branches.push({ start: parentPos, end: endPos, mid, thickness: Math.max(0.02, thickness) });

      node.position = endPos;
      allNodes.push(node);

      // Recurse children
      const childCount = node.children.length;
      if (childCount > 0) {
        for (let i = 0; i < childCount; i++) {
          // Vary direction from parent's direction
          const childAzimuth = baseAngleXZ + (rng() - 0.5) * 1.2 + (i - (childCount - 1) / 2) * 0.8;
          const childElev = elevAngle + (rng() - 0.5) * 0.3;
          const len = branchLen * (0.6 + rng() * 0.3);
          layoutNode(node.children[i], endPos, childAzimuth, childElev, len, thickness * 0.65);
        }
      }
    }

    layoutNode(rootNode, [rootX, 0, rootZ], 0, 0, 3, 0.06);
    trees.push({ root: rootNode, branches, allNodes });
  }

  // Decorative stems scattered on the ground
  const decoColors = ["#FF6B6B", "#4ECDC4", "#9B59B6", "#F39C12", "#3498DB", "#2ECC71", "#E91E63", "#FF9800"];
  const decoStems: DecoStem3D[] = [];
  for (let i = 0; i < 30; i++) {
    const x = (rng() - 0.5) * 30;
    const z = (rng() - 0.5) * 16;
    const h = 0.3 + rng() * 1.5;
    decoStems.push({
      base: [x, 0, z],
      tip: [x + (rng() - 0.5) * 0.15, h, z + (rng() - 0.5) * 0.15],
      color: decoColors[Math.floor(rng() * decoColors.length)],
      radius: 0.06 + rng() * 0.1,
    });
  }

  return { trees, decoStems };
}
