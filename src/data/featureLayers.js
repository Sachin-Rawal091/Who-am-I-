export const FEATURE_LAYERS = {
  CORE: {
    id: 'CORE',
    label: 'Input / Core Programming',
    hint: 'input languages & computation paradigms',
    color: '#f2914b', // Signal Amber
    nodes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    skills: ['Python', 'Java', 'C', 'SQL', 'Web Development'],
  },

  ML: {
    id: 'ML',
    label: 'Processing / Machine Learning',
    hint: 'data science, modeling & evaluation',
    color: '#38bdf8', // Data Cyan
    nodes: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    skills: [
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'Statistics',
      'Feature Engineering',
      'Matplotlib',
      'Seaborn',
    ],
  },

  AI: {
    id: 'AI',
    label: 'Intelligence / AI & Agents',
    hint: 'RAG, agentic workflows & LLMs',
    color: '#a855f7', // Electric Violet
    nodes: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    skills: ['RAG', 'Generative AI', 'FastMCP', 'MCP Architecture', 'Agentic Systems'],
  },

  SYSTEM: {
    id: 'SYSTEM',
    label: 'System / Full-Stack Engineering',
    hint: 'deployment, containers, DBs & APIs',
    color: '#10b981', // Emerald
    nodes: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    skills: [
      'React',
      'Django',
      'FastAPI',
      'Docker',
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'SQLite',
      'Git & GitHub',
    ],
  },
}
