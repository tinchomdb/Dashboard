import { WidgetType, WidgetEntry } from '../models/widget.model';
import { UserProfile } from '../models/user.model';

// ── User Profile ──

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Frodo',
  lastLogin: 'February 27 at 8:15am CET',
};

// ── Widget Mock Data ──

export const WIDGET_MOCK_DATA: Record<WidgetType, WidgetEntry[]> = {
  kpi: [
    { id: 'fellowship-count', title: 'Fellowship Members', value: 9 },
    { id: 'rings-of-power', title: 'Rings of Power', value: 20 },
    { id: 'battles-won', title: 'Battles Won', value: 6 },
    { id: 'realms', title: 'Realms of Middle-earth', value: 7 },
    { id: 'dark-lords', title: 'Dark Lords', value: 2 },
    { id: 'wizards', title: 'Istari (Wizards)', value: 5 },
    { id: 'palantiri', title: 'Palantíri', value: 7 },
    { id: 'dragon-count', title: 'Known Dragons', value: 4 },
    { id: 'ent-count', title: 'Ents of Fangorn', value: 42 },
  ],
  stat: [
    {
      id: 'orc-armies',
      title: 'Orc Armies',
      value: '~150,000',
      badge: { value: 'Mordor', severity: 'danger' },
    },
    {
      id: 'elf-population',
      title: 'Elven Population',
      value: '~10,000',
      badge: { value: 'Declining', severity: 'warn' },
    },
    {
      id: 'hobbit-meals',
      title: 'Hobbit Meals',
      value: '7/day',
      badge: { value: 'On Track', severity: 'success' },
    },
    {
      id: 'ring-bearers',
      title: 'Ring-bearers',
      value: 4,
      badge: { value: 'Bilbo · Frodo · Sam · Gandalf', severity: 'info' },
    },
    {
      id: 'mithril-reserves',
      title: 'Mithril Reserves',
      value: 'Depleted',
      badge: { value: 'Moria Lost', severity: 'danger' },
    },
    {
      id: 'shire-population',
      title: 'Shire Population',
      value: '~11,000',
      badge: { value: 'Stable', severity: 'success' },
    },
  ],
  'bar-chart': [
    {
      id: 'faction-armies',
      title: 'Army Sizes by Faction',
      subtitle: 'Forces in the War of the Ring',
      labels: ['Gondor', 'Rohan', 'Mordor', 'Isengard', 'Elves', 'Dwarves'],
      datasets: [
        {
          label: 'Army Size (thousands)',
          data: [30, 12, 150, 10, 5, 7],
          backgroundColor: [
            'rgba(54, 69, 88, 0.8)',
            'rgba(196, 163, 67, 0.8)',
            'rgba(196, 85, 71, 0.8)',
            'rgba(107, 114, 128, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(139, 92, 86, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    },
    {
      id: 'tower-heights',
      title: 'Tower Heights',
      subtitle: 'Famous towers of Middle-earth (in feet)',
      labels: ['Barad-dûr', 'Orthanc', 'Minas Tirith', 'Minas Morgul', 'Cirith Ungol'],
      datasets: [
        {
          label: 'Height (ft)',
          data: [1500, 500, 1000, 800, 350],
          backgroundColor: [
            'rgba(196, 85, 71, 0.8)',
            'rgba(107, 114, 128, 0.8)',
            'rgba(54, 69, 88, 0.8)',
            'rgba(120, 60, 120, 0.8)',
            'rgba(139, 92, 86, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    },
  ],
  'radar-chart': [
    {
      id: 'fellowship-skills',
      title: 'Fellowship Skills',
      subtitle: 'Combat abilities of key members',
      labels: ['Swordsmanship', 'Archery', 'Magic', 'Stealth', 'Diplomacy', 'Endurance'],
      datasets: [
        {
          label: 'Aragorn',
          data: [95, 60, 20, 70, 85, 90],
          backgroundColor: 'rgba(54, 69, 88, 0.2)',
          borderColor: 'rgba(54, 69, 88, 1)',
          pointBackgroundColor: 'rgba(54, 69, 88, 1)',
        },
        {
          label: 'Legolas',
          data: [75, 98, 15, 85, 60, 80],
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: 'rgba(34, 197, 94, 1)',
          pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        },
        {
          label: 'Gandalf',
          data: [70, 30, 99, 40, 90, 85],
          backgroundColor: 'rgba(139, 92, 86, 0.2)',
          borderColor: 'rgba(139, 92, 86, 1)',
          pointBackgroundColor: 'rgba(139, 92, 86, 1)',
        },
      ],
    },
    {
      id: 'realm-attributes',
      title: 'Realm Comparison',
      subtitle: 'Attributes of the Free Peoples',
      labels: ['Military', 'Economy', 'Magic', 'Fortification', 'Population', 'Territory'],
      datasets: [
        {
          label: 'Gondor',
          data: [85, 75, 20, 90, 70, 80],
          backgroundColor: 'rgba(54, 69, 88, 0.2)',
          borderColor: 'rgba(54, 69, 88, 1)',
          pointBackgroundColor: 'rgba(54, 69, 88, 1)',
        },
        {
          label: 'Rohan',
          data: [70, 50, 10, 40, 45, 65],
          backgroundColor: 'rgba(196, 163, 67, 0.2)',
          borderColor: 'rgba(196, 163, 67, 1)',
          pointBackgroundColor: 'rgba(196, 163, 67, 1)',
        },
        {
          label: 'Lothlórien',
          data: [40, 30, 95, 85, 15, 20],
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: 'rgba(34, 197, 94, 1)',
          pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        },
      ],
    },
  ],
  'horizontal-bar-chart': [
    {
      id: 'battle-casualties',
      title: 'Battle Casualties',
      subtitle: 'Losses in major battles of the Third Age',
      labels: ["Helm's Deep", 'Pelennor Fields', 'Black Gate', 'Isengard', 'Moria'],
      datasets: [
        {
          label: 'Free Peoples',
          data: [300, 6000, 2000, 50, 20],
          backgroundColor: 'rgba(54, 69, 88, 0.8)',
        },
        {
          label: 'Forces of Mordor',
          data: [8000, 18000, 15000, 0, 200],
          backgroundColor: 'rgba(196, 85, 71, 0.8)',
        },
        {
          label: 'Forces of Isengard',
          data: [10000, 0, 0, 10000, 0],
          backgroundColor: 'rgba(107, 114, 128, 0.8)',
        },
      ],
    },
    {
      id: 'race-lifespan',
      title: 'Average Lifespan by Race',
      subtitle: 'Estimated years of life',
      labels: ['Elves', 'Dwarves', 'Dúnedain', 'Hobbits', 'Men', 'Orcs'],
      datasets: [
        {
          label: 'Lifespan (years)',
          data: [10000, 350, 200, 100, 70, 40],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(139, 92, 86, 0.8)',
            'rgba(54, 69, 88, 0.8)',
            'rgba(196, 163, 67, 0.8)',
            'rgba(107, 114, 128, 0.8)',
            'rgba(196, 85, 71, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    },
  ],
  'line-chart': [
    {
      id: 'ring-corruption',
      title: 'Ring Corruption Over Time',
      subtitle: 'Effect on ring-bearers during the journey',
      labels: [
        'Shire',
        'Bree',
        'Rivendell',
        'Moria',
        'Amon Hen',
        'Dead Marshes',
        'Mordor',
        'Mt. Doom',
      ],
      datasets: [
        {
          label: 'Frodo',
          data: [5, 12, 8, 20, 35, 55, 80, 95],
          borderColor: 'rgba(54, 69, 88, 1)',
          backgroundColor: 'rgba(54, 69, 88, 0.1)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Bilbo (estimated)',
          data: [2, 5, 8, 12, 18, 25, 35, 45],
          borderColor: 'rgba(196, 163, 67, 1)',
          backgroundColor: 'rgba(196, 163, 67, 0.1)',
          fill: true,
          tension: 0.3,
          borderDash: [5, 5],
        },
      ],
    },
    {
      id: 'fellowship-morale',
      title: 'Fellowship Morale',
      subtitle: 'Group morale throughout the quest',
      labels: [
        'Rivendell',
        'Caradhras',
        'Moria Gate',
        "Gandalf's Fall",
        'Lothlórien',
        'Amon Hen',
        'Two Towers',
        "Helm's Deep",
        'Pelennor',
        'Black Gate',
        'Mt. Doom',
      ],
      datasets: [
        {
          label: 'Overall Morale',
          data: [95, 70, 60, 20, 65, 40, 50, 75, 60, 45, 85],
          borderColor: 'rgba(34, 197, 94, 1)',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
        },
        {
          label: 'Hope Index',
          data: [90, 65, 55, 15, 70, 35, 55, 80, 65, 50, 100],
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          borderDash: [3, 3],
        },
      ],
    },
  ],
  'pie-chart': [
    {
      id: 'ring-distribution',
      title: 'Rings of Power',
      subtitle: 'Distribution among races',
      labels: ['Elves (3)', 'Dwarves (7)', 'Men (9)', 'Sauron (1)'],
      datasets: [
        {
          data: [3, 7, 9, 1],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(139, 92, 86, 0.8)',
            'rgba(54, 69, 88, 0.8)',
            'rgba(196, 85, 71, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
    {
      id: 'fellowship-races',
      title: 'Fellowship Composition',
      subtitle: 'Members by race',
      labels: ['Hobbits', 'Men', 'Elves', 'Dwarves', 'Wizards'],
      datasets: [
        {
          data: [4, 2, 1, 1, 1],
          backgroundColor: [
            'rgba(196, 163, 67, 0.8)',
            'rgba(54, 69, 88, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(139, 92, 86, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
  ],
  'doughnut-chart': [
    {
      id: 'territory-control',
      title: 'Territory Control',
      subtitle: 'Middle-earth at the War of the Ring',
      labels: ['Free Peoples', 'Mordor', 'Isengard', 'Contested', 'Uninhabited'],
      datasets: [
        {
          data: [35, 20, 5, 15, 25],
          backgroundColor: [
            'rgba(54, 69, 88, 0.8)',
            'rgba(196, 85, 71, 0.8)',
            'rgba(107, 114, 128, 0.8)',
            'rgba(196, 163, 67, 0.8)',
            'rgba(209, 213, 219, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
    {
      id: 'language-distribution',
      title: 'Languages of Middle-earth',
      subtitle: 'Spoken tongues by prevalence',
      labels: ['Westron', 'Sindarin', 'Quenya', 'Khuzdul', 'Black Speech', 'Other'],
      datasets: [
        {
          data: [40, 15, 5, 8, 12, 20],
          backgroundColor: [
            'rgba(54, 69, 88, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 86, 0.8)',
            'rgba(196, 85, 71, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    },
  ],
  'polar-area-chart': [
    {
      id: 'fortress-strength',
      title: 'Fortress Strength',
      subtitle: 'Defensive power of key strongholds',
      labels: ['Minas Tirith', "Helm's Deep", 'Barad-dûr', 'Isengard', 'Rivendell', 'Lothlórien'],
      datasets: [
        {
          data: [85, 70, 95, 60, 50, 65],
          backgroundColor: [
            'rgba(54, 69, 88, 0.7)',
            'rgba(196, 163, 67, 0.7)',
            'rgba(196, 85, 71, 0.7)',
            'rgba(107, 114, 128, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(34, 197, 94, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    },
    {
      id: 'artifact-power',
      title: 'Artifact Power Levels',
      subtitle: 'Relative power of legendary items',
      labels: ['The One Ring', 'Narya', 'Andúril', 'Palantír', 'Phial of Galadriel', 'Sting'],
      datasets: [
        {
          data: [100, 60, 75, 50, 45, 30],
          backgroundColor: [
            'rgba(196, 85, 71, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(54, 69, 88, 0.7)',
            'rgba(107, 114, 128, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(34, 197, 94, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    },
  ],
};
