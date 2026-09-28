import { Task, AlertItem, CalendarEvent } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1WlQWXrYVawPo14wTmNhu8vtZKrKTsNtBV9dUUH6gKoyPQLniMFC6saN3DbsJ6KBNFE9Y6Ls0iyOwaMLz7sXRZ6Sw5zX0IG79QBAR6WJR4rU59bczkiBsH7OBnHbWVkpmP3q5Rt32aACTUeu5QtE3nQMDwbNHhlVOkay0Gw-syNMdeSslqereKrXIdW_s12P2akbMixiiWx5SQjjgfVWZqpYUe8GbHDhFw2qlORJbfi2QAih53OmipZ5OQ',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYrieQGlDn9O8U8H5hiRmVSnsxq5Z5ttLtvtEz8Psbb7B0mYanTaXKyUpP521HJFDdv-EuI8mMAfj5u8mCDKrs_KxWqNlNT_tEFXIrYIhrNv7lh9dfhve191dgSZiDXLDPsJG8FTp3ex6IWRogoMZ1p9XyoyqsSH3wJNtP5mNNUn0Vu2dnPJHTvu2EgsN42K5wpnYA42ZzEwA030jTpCvA32OzRIokqcjZbyHhZqrl31RJtqzPLF98',
  avatarDesigner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAB777dJATyofhOF5PqbCMle8h7EccuiC2J7mnWz4mHftcyRnEQfcJgSYH6iWDmu_J-oW86rxdGOUyII77dl0HJzLWGF2N6K-ElLu7ge7ymzi50mHjfp5LTuBvWpyuqHd-w_VT9hTY6IuKf6OG_fpp-tZm7LJSgE9AHP18PkpJCa1yPdPfEo2rNEF1-l9w0Yv0OrbkSLKsvUFZ7kUK9OoRKD5zMO1Agbnu9_3g7XZGNJEJ4SMd0WO6I',
  avatarEngineer: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgUOzsblKclpd4J_j4T0rJu2FmJJBwopYzyU943ox4dA9vFYBVXrM0zhYtqysA_gFlrrWDqeUcfPHW1hnijhjQBGfF2E7wWJvZ0kBC9X9xWfCsL10kLg4FWKoAfHkdgDPxynFAerKmFW3IrimnmCiTXzQamrEkJdqh97QvszO0THW2K6WCOLxXBAn-aFeZ40eamGm4c60MGAzCW-toaXEUw3b7PjcGDhgIBYd2IRgAMT1OtzpQRJuC',
  mapMarket: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3OJVlCrLFVZpTsiJhrzWv5Vi_V17DEDexceFgZsYU2l67CcNpjjhzAyU1W0teJSJuNT39XqoRBYQ0HB8URNvaxuqISSd02Ru7YuPtCl-v9oWZjtbV09Da_AxAifh-nRCJthdmqUQ74UX0UKa961aEKJQPGOyGNrZHmNTetH6e2klHe2sMFCvO6swKcAXVfa9Fwqxm__9XAMhEM9SmaFJ85DnqR7l6ixkimoHKv-pvIn0QwOqbSn0T'
};

export const INITIAL_TASKS: Task[] = [
  // Horizon tasks (shown in Today view)
  {
    id: 'horizon-1',
    title: 'Aura Glass visual architecture pass',
    description: 'Refine luminous obsidian tokens and specular contrast edges.',
    priority: 'high',
    tag: '#Design',
    category: 'high',
    status: 'in_progress',
    durationEstimate: '45m',
    isPriorityHorizon: true,
  },
  {
    id: 'horizon-2',
    title: 'Synthesize User Feedback on Quick Capture',
    description: 'Consolidate voice dictation insights from beta flight alpha.',
    priority: 'medium',
    tag: '#Sprint',
    category: 'client',
    status: 'in_progress',
    durationEstimate: '1h 15m',
    isPriorityHorizon: true,
  },
  {
    id: 'horizon-3',
    title: 'Reconcile quarterly software stack ledger',
    description: 'Approved cloud services and prototyping seats.',
    priority: 'low',
    tag: '#Finance',
    category: 'all',
    status: 'completed',
    durationEstimate: '20m',
    isPriorityHorizon: true,
    completedAt: '10:15 AM'
  },

  // Detailed Tasks (shown in Tasks view)
  {
    id: 'task-main-1',
    title: 'Design Mobile App System',
    description: 'Finalize design tokens, interactive drawer, and accessibility contrast standards.',
    priority: 'urgent',
    tag: '#Design',
    category: 'high',
    status: 'in_progress',
    dueText: 'Today, 5:00 PM',
    hasReminder: true,
    progress: { current: 4, total: 5 },
    assignees: [
      { name: 'Alex M.', avatar: ASSETS.avatarDesigner },
      { name: 'Elena R.', avatar: ASSETS.avatarEngineer }
    ],
    subtasks: [
      { id: 'sub-1', title: 'Define atomic color palettes', completed: true },
      { id: 'sub-2', title: 'Export SVG icon sets', completed: true },
      { id: 'sub-3', title: 'Compose gesture physics spec', completed: true },
      { id: 'sub-4', title: 'Run WCAG AAA contrast audits', completed: false, statusLabel: 'In Review' }
    ]
  },
  {
    id: 'task-main-2',
    title: 'Q3 Executive Sync Deck',
    description: 'Synthesize ARR projections, team capacity constraints, and roadmaps.',
    priority: 'medium',
    tag: '#Strategy',
    category: 'client',
    status: 'scheduled',
    dueText: 'Tomorrow, 11:30 AM'
  },
  {
    id: 'task-main-3',
    title: 'Refactor State Management',
    description: 'Decouple local view store into optimistic synchronized mutations.',
    priority: 'low',
    tag: '#Dev Core',
    category: 'all',
    status: 'todo',
    dueText: 'Friday',
    subtasks: [
      { id: 'sub-3-1', title: 'Extract store actions', completed: true },
      { id: 'sub-3-2', title: 'Add offline optimistic updates', completed: false }
    ]
  },

  // Completed items in Tasks view
  {
    id: 'task-comp-1',
    title: 'Client Wireframe Feedback Review',
    description: 'Reviewed and closed stakeholder comments on preliminary wireframe wireups.',
    priority: 'medium',
    tag: '#Client',
    category: 'client',
    status: 'completed',
    completedAt: '09:15 AM'
  },
  {
    id: 'task-comp-2',
    title: 'Update Obsidian Figma Tokens Library',
    description: 'Pushed version 2.4 of design token variables to Figma community repo.',
    priority: 'low',
    tag: '#Design',
    category: 'all',
    status: 'completed',
    completedAt: 'Yesterday'
  },
  {
    id: 'task-comp-3',
    title: 'Set up quarterly goals in Notion',
    description: 'Outlined OKRs for engineering team and alignment milestones.',
    priority: 'low',
    tag: '#Personal',
    category: 'personal',
    status: 'completed',
    completedAt: 'Oct 14'
  }
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    category: 'due',
    badgeType: 'urgent',
    badgeLabel: 'Urgent',
    badgeSub: 'In 30 mins',
    title: 'Quarterly Sprint Review',
    description: 'Stakeholder briefing deck ready. Meeting opens on Aura Live Room at 11:30 AM EST with 8 attendees.'
  },
  {
    id: 'alert-2',
    category: 'nudges',
    badgeType: 'streak',
    badgeLabel: 'Habit Continuity',
    badgeSub: '15 Days',
    title: 'Protect Your 15-Day Streak!',
    description: 'Deep work habit is tracking exceptionally well.',
    streakInfo: {
      current: 2,
      total: 3,
      days: 15,
      resetText: 'Resets at 9:00 PM',
      taskName: 'Deep Work Journaling',
      subtext: 'Only 1 micro-task away before 9 PM'
    }
  },
  {
    id: 'alert-3',
    category: 'nudges',
    badgeType: 'geo',
    badgeLabel: 'Geo-Trigger',
    badgeSub: 'Arrived Near Home',
    title: 'Picked up: Grocery List',
    description: 'Nearby items ready on your designated route.',
    geoInfo: {
      locationName: 'Organic Market',
      distance: '250m away from your route',
      itemCount: 4,
      bgImage: ASSETS.mapMarket
    }
  },
  {
    id: 'alert-4',
    category: 'milestones',
    badgeType: 'milestone',
    badgeLabel: 'Daily Insight',
    badgeSub: 'Evening Review',
    title: 'High Focus Velocity Achieved',
    description: 'You cleared 7 high-leverage tasks today. Velocity is +24% higher than your rolling average.',
    metrics: {
      flowHours: '5.8h',
      tasksMet: '7/8',
      onTimeRate: '96%'
    }
  }
];

export const INITIAL_SYNC_EVENTS: CalendarEvent[] = [
  {
    id: 'sync-1',
    title: 'Creative Design Review',
    time: '11:00 AM',
    duration: '45 min',
    colorType: 'primary',
    chimeActive: true
  },
  {
    id: 'sync-2',
    title: 'Weekly Product Sync',
    time: '2:30 PM',
    duration: '30 min',
    colorType: 'secondary',
    chimeActive: false
  }
];

export const DAYS_HORIZON = [
  { day: 'M', date: '21', completed: true, active: false },
  { day: 'T', date: '22', completed: true, active: false },
  { day: 'W', date: '23', completed: true, active: false },
  { day: 'T', date: '24', completed: true, active: true },
  { day: 'F', date: '25', completed: false, active: false },
  { day: 'S', date: '26', completed: false, active: false },
  { day: 'S', date: '27', completed: false, active: false }
];
