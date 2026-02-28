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
  ],
};
