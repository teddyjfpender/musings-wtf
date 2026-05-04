import { useMemo, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { useContent } from "../../App";
import type { GardenNode3D, GardenBranch3D, GardenTree3D, DecoStem3D, Vec3 } from "../../lib/types";
import { buildGarden3D } from "./gardenLayout";

// --- Branch as a curved tube ---
function Branch({ branch }: { branch: GardenBranch3D }) {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...branch.start);
    const mid = new THREE.Vector3(...branch.mid);
    const end = new THREE.Vector3(...branch.end);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [branch]);

  const geometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 12, branch.thickness, 6, false);
  }, [curve, branch.thickness]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#cdbb8f"
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

// --- Glowing note sphere ---
function NoteNode({
  node,
  onHover,
  onUnhover,
  onClick,
  isHovered,
}: {
  node: GardenNode3D;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const scale = isHovered ? 1.6 : 1;
  const baseSize = node.depth === 0 ? 0.25 : 0.18;
  const visibleColor = useMemo(
    () => new THREE.Color(node.color).lerp(new THREE.Color("#f2ead7"), 0.18),
    [node.color]
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.lerp(
        new THREE.Vector3(scale, scale, scale),
        0.15
      );
    }
    if (glowRef.current) {
      const targetScale = isHovered ? 3 : 1.8;
      glowRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.15
      );
    }
  });

  return (
    <group position={node.position}>
      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshBasicMaterial
          color={visibleColor}
          transparent
          opacity={isHovered ? 0.34 : 0.16}
          depthWrite={false}
        />
      </mesh>

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={onUnhover}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <sphereGeometry args={[baseSize, 16, 16]} />
        <meshStandardMaterial
          color={visibleColor}
          emissive={visibleColor}
          emissiveIntensity={isHovered ? 0.75 : 0.32}
          roughness={0.48}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

// --- Decorative stems ---
function DecoStem({ stem }: { stem: DecoStem3D }) {
  const start = new THREE.Vector3(...stem.base);
  const end = new THREE.Vector3(...stem.tip);
  const mid = start.clone().lerp(end, 0.5);

  const curve = useMemo(
    () => new THREE.LineCurve3(start, end),
    [stem]
  );
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 4, 0.012, 4, false),
    [curve]
  );

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color="#8d8067" transparent opacity={0.7} />
      </mesh>
      <mesh position={stem.tip}>
        <sphereGeometry args={[stem.radius, 10, 10]} />
        <meshStandardMaterial
          color={stem.color}
          emissive={stem.color}
          emissiveIntensity={0.28}
          transparent
          opacity={0.62}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
}

// --- Connection line (dotted arc between related nodes) ---
function ConnectionArc({
  from,
  to,
  visible,
}: {
  from: Vec3;
  to: Vec3;
  visible: boolean;
}) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 1.5;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(30);
  }, [from, to]);

  if (!visible) return null;

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineDashedMaterial
        color="#f2ead7"
        transparent
        opacity={0.24}
        dashSize={0.15}
        gapSize={0.1}
      />
    </line>
  );
}

// --- Slow camera auto-rotation ---
function CameraRig() {
  return (
    <OrbitControls
      makeDefault
      enablePan
      enableZoom
      enableRotate
      autoRotate={false}
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={0.2}
      minDistance={8}
      maxDistance={50}
      target={[0, 4, 0]}
    />
  );
}

// --- Main scene content ---
function GardenScene() {
  const { notes } = useContent();
  const navigate = useNavigate();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const { trees, decoStems } = useMemo(() => {
    if (notes.length === 0) return { trees: [], decoStems: [] };
    return buildGarden3D(notes);
  }, [notes]);

  const allNodes = useMemo(() => trees.flatMap((t) => t.allNodes), [trees]);
  const hoveredNode = allNodes.find((n) => n.slug === hoveredSlug) || null;

  // Find connections to highlight
  const connectionArcs = useMemo(() => {
    if (!hoveredNode) return [];
    const arcs: { from: Vec3; to: Vec3 }[] = [];
    for (const node of allNodes) {
      if (
        node.slug !== hoveredNode.slug &&
        (node.note.connections.includes(hoveredNode.slug) ||
          hoveredNode.note.connections.includes(node.slug))
      ) {
        arcs.push({ from: hoveredNode.position, to: node.position });
      }
    }
    return arcs;
  }, [hoveredNode, allNodes]);

  return (
    <>
      <ambientLight intensity={0.75} />
      <pointLight position={[10, 15, 10]} intensity={0.65} color="#f2ead7" />
      <pointLight position={[-8, 10, -5]} intensity={0.35} color="#8f7c58" />

      <CameraRig />

      <group position={[0, -3.25, 0]}>
        {/* Trees */}
        {trees.map((tree) => (
          <group key={tree.root.slug}>
            {tree.branches.map((b, i) => (
              <Branch key={i} branch={b} />
            ))}
            {tree.allNodes.map((node) => (
              <NoteNode
                key={node.slug}
                node={node}
                isHovered={hoveredSlug === node.slug}
                onHover={() => setHoveredSlug(node.slug)}
                onUnhover={() => setHoveredSlug(null)}
                onClick={() => navigate(`/note/${node.slug}`)}
              />
            ))}
          </group>
        ))}

        {/* Decorative stems */}
        {decoStems.map((stem, i) => (
          <DecoStem key={i} stem={stem} />
        ))}

        {/* Connection arcs */}
        {connectionArcs.map((arc, i) => (
          <ConnectionArc key={i} from={arc.from} to={arc.to} visible />
        ))}

        {/* Tooltip */}
        {hoveredNode && (
          <Html
            position={[
              hoveredNode.position[0],
              hoveredNode.position[1] + 0.5,
              hoveredNode.position[2],
            ]}
            center
            style={{ pointerEvents: "none" }}
          >
            <div
              className="whitespace-nowrap px-3 py-2 font-mono text-xs"
            style={{
              background: "rgba(11, 11, 10, 0.94)",
              border: "1px solid rgba(242, 234, 215, 0.18)",
              borderRadius: 9,
              color: "#f2ead7",
              backdropFilter: "blur(8px)",
            }}
            >
              <div className="font-medium" style={{ color: hoveredNode.color }}>
                {hoveredNode.note.title}
              </div>
              <div style={{ color: "rgba(242,234,215,0.5)", marginTop: 2 }}>
                {new Date(hoveredNode.note.date).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}

// --- Root component ---
export default function GardenCanvas() {
  const { notes, loading } = useContent();
  const navigate = useNavigate();
  const sortedNotes = useMemo(
    () =>
      [...notes]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [notes]
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--paper)]">
        <div className="font-mono text-xs text-[var(--muted)] animate-pulse">
          growing garden...
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen w-full grid-cols-[minmax(360px,520px)_1fr] overflow-hidden bg-[var(--paper)] text-[var(--ink)] max-lg:grid-cols-1 max-lg:overflow-auto">
      <aside className="article-index h-screen overflow-y-auto border-r border-[var(--hairline)] px-10 py-10 max-lg:h-auto max-lg:border-b max-lg:border-r-0 max-lg:px-6 max-sm:px-5 max-sm:py-7">
        <header className="mb-10">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            personal notes
          </div>
          <h1 className="font-serif text-[clamp(2.6rem,7vw,5.25rem)] font-normal leading-[0.92]">
            musings.wtf
          </h1>
          <p className="mt-6 max-w-[330px] border-t border-[var(--hairline)] pt-5 font-serif text-[18px] leading-[1.3]">
            Notes on crypto, markets, privacy, agents, and internet systems.
          </p>
        </header>

        <div className="mb-4 flex items-baseline justify-between border-y border-[var(--hairline)] py-3">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
            Articles
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
            {notes.length} posts
          </span>
        </div>

        <div className="divide-y divide-[var(--hairline)]">
          {sortedNotes.map((note) => {
            const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            });

            return (
              <article key={note.slug} className="py-3.5">
                <button
                  onClick={() => navigate(`/note/${note.slug}`)}
                  className="group grid w-full grid-cols-[86px_1fr] gap-3 text-left max-sm:grid-cols-[72px_1fr]"
                >
                  {note.coverImage ? (
                    <img
                      src={note.coverImage}
                      alt={note.coverAlt || ""}
                      className="mt-0.5 aspect-[4/3] w-full border border-[var(--hairline)] bg-[var(--paper-soft)] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mt-0.5 flex aspect-[4/3] w-full flex-col justify-between border border-[var(--hairline)] bg-[var(--paper-soft)] p-2">
                      <span className="font-serif text-[28px] leading-none text-[var(--ink)]">
                        §
                      </span>
                      <span className="font-mono text-[8px] uppercase leading-tight tracking-[0.1em] text-[var(--muted)]">
                        {note.tags[0] || "essay"}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="mb-1.5 font-mono text-[10px] text-[var(--muted)]">
                      {formattedDate}
                    </div>
                    <h3 className="font-serif text-[20px] leading-[1.05] underline decoration-[var(--hairline)] underline-offset-4 transition group-hover:decoration-[var(--ink)]">
                      {note.title}
                    </h3>
                    {note.description && (
                      <p className="mt-1.5 font-serif text-[13px] leading-[1.25] text-[var(--muted)]">
                        {note.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[9px] text-[var(--muted)]">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span key={tag}>[{tag}]</span>
                      ))}
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      </aside>

      <div className="relative h-screen min-h-[560px] overflow-hidden bg-[#080807] max-lg:h-[70vh]">
        <div className="pointer-events-none absolute left-6 top-6 z-10 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
          garden figure
        </div>

        <Canvas
          camera={{ position: [0, 16, 20], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => {
            gl.setClearColor("#0b0b0a", 1);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
          style={{ cursor: "grab" }}
        >
          <GardenScene />
        </Canvas>

        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--faint)] max-sm:hidden">
          drag to orbit / click a node
        </div>
      </div>
    </div>
  );
}
