import { UserProfile, WidgetType, WidgetEntry } from '../models/widget.model';

// ── User Profile ──

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Frodo',
  lastLogin: 'February 27 at 8:15am CET',
};

// ── Single Source of Truth: widget metadata + mock responses ──

export const WIDGET_MOCK_DATA: Record<WidgetType, WidgetEntry[]> = {
  kpi: [
    {
      id: 'fellowship-count',
      label: 'Fellowship Members',
      title: 'Fellowship Members',
      value: 9,
    },
    {
      id: 'rings-of-power',
      label: 'Rings of Power',
      title: 'Rings of Power',
      value: 20,
    },
    { id: 'battles-won', label: 'Battles Won', title: 'Battles Won', value: 6 },
    { id: 'realms', label: 'Realms of Middle-earth', title: 'Realms', value: 7 },
    { id: 'dark-lords', label: 'Dark Lords', title: 'Dark Lords', value: 2 },
    { id: 'wizards', label: 'Istari (Wizards)', title: 'Wizards', value: 5 },
  ],
  stat: [
    {
      id: 'orc-armies',
      label: 'Orc Army Size',
      title: 'Orc Armies',
      value: '~150,000',
      badge: 'Mordor',
      badgeSeverity: 'danger',
    },
    {
      id: 'elf-population',
      label: 'Elf Population',
      title: 'Elven Population',
      value: '~10,000',
      badge: 'Declining',
      badgeSeverity: 'warn',
    },
    {
      id: 'hobbit-meals',
      label: 'Hobbit Daily Meals',
      title: 'Hobbit Meals',
      value: '7/day',
      badge: 'On Track',
      badgeSeverity: 'success',
    },
  ],
  'bar-chart': [
    {
      id: 'faction-armies',
      label: 'Faction Armies',
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
  ],
  'radar-chart': [
    {
      id: 'fellowship-skills',
      label: 'Fellowship Skills',
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
  ],
  'horizontal-bar-chart': [
    {
      id: 'battle-casualties',
      label: 'Battle Casualties',
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
  ],
};
