export interface Note {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  connections: string[];
  htmlContent: string;
  wordCount: number;
  coverImage?: string;
  coverAlt?: string;
}

export type Vec3 = [number, number, number];

export interface GardenNode3D {
  slug: string;
  note: Note;
  position: Vec3;
  color: string;
  depth: number;
  children: GardenNode3D[];
}

export interface GardenBranch3D {
  start: Vec3;
  end: Vec3;
  mid: Vec3;
  thickness: number;
}

export interface GardenTree3D {
  root: GardenNode3D;
  branches: GardenBranch3D[];
  allNodes: GardenNode3D[];
}

export interface DecoStem3D {
  base: Vec3;
  tip: Vec3;
  color: string;
  radius: number;
}
