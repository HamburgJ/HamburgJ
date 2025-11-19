import { FileSystemItem } from '../types/FileSystem';

export const fileSystemData: FileSystemItem[] = [
  {
    id: 'root',
    name: 'root',
    type: 'folder',
    children: [
      {
        id: 'readme',
        name: 'README.md',
        type: 'file',
        componentKey: 'readme',
      },
      {
        id: 'education',
        name: 'Education',
        type: 'folder',
        children: [
          {
            id: 'edu-uwaterloo',
            name: 'University_of_Waterloo.edu',
            type: 'file',
            componentKey: 'edu-uwaterloo',
          },
        ],
      },
      {
        id: 'experience',
        name: 'Experience',
        type: 'folder',
        children: [
          {
            id: 'exp-expertise-ai',
            name: 'Expertise_AI.job',
            type: 'file',
            componentKey: 'exp-expertise-ai',
          },
          {
            id: 'exp-descartes',
            name: 'Descartes_Systems_Group.job',
            type: 'file',
            componentKey: 'exp-descartes',
          },
          {
            id: 'exp-charitycan',
            name: 'CharityCAN.job',
            type: 'file',
            componentKey: 'exp-charitycan',
          },
          {
            id: 'exp-cadence',
            name: 'Cadence_Agriculture.job',
            type: 'file',
            componentKey: 'exp-cadence',
          },
          {
            id: 'exp-quilt-ai',
            name: 'Quilt_AI.job',
            type: 'file',
            componentKey: 'exp-quilt-ai',
          },
        ],
      },
      {
        id: 'projects',
        name: 'Projects',
        type: 'folder',
        children: [
          {
            id: 'proj-grocery-buddy',
            name: 'Grocery_Buddy.exe',
            type: 'file',
            componentKey: 'proj-grocery-buddy',
          },
          {
            id: 'proj-infinite-levels',
            name: 'Infinite_Levels.exe',
            type: 'file',
            componentKey: 'proj-infinite-levels',
          },
          {
            id: 'proj-match-five',
            name: 'Match_Five.exe',
            type: 'file',
            componentKey: 'proj-match-five',
          },
          {
            id: 'proj-four-nines',
            name: 'Four_Nines.exe',
            type: 'file',
            componentKey: 'proj-four-nines',
          },
        ],
      },
    ],
  },
];

