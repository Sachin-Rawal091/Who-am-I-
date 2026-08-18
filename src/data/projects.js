const baseUrl = import.meta.env.BASE_URL || './'

export const PROJECTS = [
  {
    id: 'formanchor',
    title: 'FormAnchor',
    description:
      'Record once, replay across rows — a Chrome extension that automates repetitive form-filling from spreadsheet data.',
    stack: ['TypeScript', 'React', 'Vite', 'Zustand', 'FastAPI', 'MongoDB'],
    linkLabel: 'View live',
    href: 'https://formanchor-web-three.vercel.app/',
    image: `${baseUrl}projects/formanchor.png`,
    imageAlt: 'FormAnchor Chrome extension automation interface and spreadsheet data grid',
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
    image: `${baseUrl}projects/expense-tracker.png`,
    imageAlt: 'AI Expense Tracker FastMCP server natural language telemetry dashboard',
    visual: 'nodes',
    pipeline: ['User Query', 'NL Intent Parser', 'FastMCP Server', 'PostgreSQL', 'Response Sent ✓'],
  },
  {
    id: 'shark-tank-dashboard',
    title: 'Shark Tank India — Investment Dashboard',
    description:
      'A data analysis dashboard exploring deal and shark investment trends from the Shark Tank India dataset.',
    stack: ['Django', 'JavaScript', 'HTML', 'CSS', 'Python'],
    linkLabel: 'View live',
    href: 'https://shark-tank-analysis-dashboard.vercel.app/',
    github: 'https://github.com/Sachin-Rawal091/Shark_Tank_Analysis_Dashboard-',
    image: `${baseUrl}projects/shark-tank.png`,
    imageAlt: 'Shark Tank India investment trends financial analytics dashboard',
    visual: 'bars',
    pipeline: ['Raw Dataset', 'Data Cleaning', 'Aggregation Engine', 'Django App', 'Dashboard Live ✓'],
  },
  {
    id: 'netflix-eda',
    title: 'Netflix Movies & TV Shows — EDA',
    description:
      'Exploratory data analysis of genre and release trends across Netflix’s content catalog.',
    stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    linkLabel: 'View on GitHub',
    href: 'https://github.com/Sachin-Rawal091/NETFLIX_PROJECT_ON_MATPLOTLIB',
    image: `${baseUrl}projects/netflix-eda.png`,
    imageAlt: 'Netflix Movies and TV Shows exploratory data analysis dashboard visualization',
    visual: 'donut',
    pipeline: ['Catalog CSV', 'Pandas Cleaning', 'Statistical EDA', 'Matplotlib Plots', 'Insights Exported ✓'],
  },
]

