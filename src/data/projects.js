export const PROJECTS = [
  {
    id: 'formanchor',
    title: 'FormAnchor',
    description:
      'Record once, replay across rows — a Chrome extension that automates repetitive form-filling from spreadsheet data.',
    stack: ['TypeScript', 'React', 'Vite', 'Zustand', 'FastAPI', 'MongoDB'],
    linkLabel: 'View live',
    href: 'https://formanchor-web-three.vercel.app/',
    visual: 'form',
    pipeline: ['Spreadsheet Data', 'Chrome Extension', 'Automation Engine', 'Form Fill', 'Submitted ✓'],
  },
  {
    id: 'expense-tracker-mcp',
    title: 'Expense Tracker — MCP Server',
    description:
      'A multi-user expense tracker built as an MCP server, with natural-language date parsing and hybrid master-key/session auth.',
    stack: ['FastMCP', 'PostgreSQL', 'Docker', 'Railway', 'Python'],
    linkLabel: 'View on GitHub',
    href: 'https://github.com/Sachin-Rawal091/Expenses_Tracker_MCP',
    visual: 'nodes',
    pipeline: ['User Query', 'NL Intent Parser', 'FastMCP Server', 'PostgreSQL', 'Response Sent ✓'],
  },
  {
    id: 'shark-tank-dashboard',
    title: 'Shark Tank India — Investment Dashboard',
    description:
      'A data analysis dashboard exploring deal and shark investment trends from the Shark Tank India dataset.',
    stack: ['Django', 'JavaScript', 'HTML', 'CSS', 'Python'],
    linkLabel: 'View on GitHub',
    href: 'https://github.com/Sachin-Rawal091/Shark_Tank_Analysis_Dashboard-',
    visual: 'bars',
    pipeline: ['Raw Dataset', 'Data Cleaning', 'Aggregation Engine', 'Django App', 'Dashboard Live ✓'],
  },
  {
    id: 'netflix-eda',
    title: 'Netflix Movies & TV Shows — EDA',
    description:
      'Exploratory data analysis of genre and release trends across Netflix\u2019s content catalog.',
    stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    linkLabel: 'View on GitHub',
    href: 'https://github.com/Sachin-Rawal091/NETFLIX_PROJECT_ON_MATPLOTLIB',
    visual: 'donut',
    pipeline: ['Catalog CSV', 'Pandas Cleaning', 'Statistical EDA', 'Matplotlib Plots', 'Insights Exported ✓'],
  },
]
