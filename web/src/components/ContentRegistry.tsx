import React from 'react';
import Readme from './content/Readme';
import EducationWaterloo from './content/EducationWaterloo';
import ExperienceExpertiseAI from './content/ExperienceExpertiseAI';
import ExperienceDescartes from './content/ExperienceDescartes';
import ExperienceCharityCAN from './content/ExperienceCharityCAN';
import ExperienceCadence from './content/ExperienceCadence';
import ExperienceQuiltAI from './content/ExperienceQuiltAI';
import ProjectGroceryBuddy from './content/ProjectGroceryBuddy';
import ProjectInfiniteLevels from './content/ProjectInfiniteLevels';
import ProjectMatchFive from './content/ProjectMatchFive';
import ProjectFourNines from './content/ProjectFourNines';

export const ContentRegistry: Record<string, React.FC> = {
  'readme': Readme,
  'edu-uwaterloo': EducationWaterloo,
  'exp-expertise-ai': ExperienceExpertiseAI,
  'exp-descartes': ExperienceDescartes,
  'exp-charitycan': ExperienceCharityCAN,
  'exp-cadence': ExperienceCadence,
  'exp-quilt-ai': ExperienceQuiltAI,
  'proj-grocery-buddy': ProjectGroceryBuddy,
  'proj-infinite-levels': ProjectInfiniteLevels,
  'proj-match-five': ProjectMatchFive,
  'proj-four-nines': ProjectFourNines,
};

