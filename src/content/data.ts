import type { Job, Profile, Project, SkillGroup } from './types'

export const profile: Profile = {
  name: 'Huynh Thai Duong',
  role: 'Software Engineer',
  email: 'thaiduong.works@gmail.com',
  github: 'https://github.com/TDuong04',
  linkedin:
    'https://www.linkedin.com/in/hu%E1%BB%B3nh-th%C3%A1i-d%C6%B0%C6%A1ng-4aa58824a/',
  highlights: [
    'Bosch CodeRace: 2nd Runner-Up, real-time CAN-bus hill-driving safety system',
    'NAVER AI Hackathon: 2nd Runner-Up (top 10% of projects), Travista',
    'Vin Hackathon 2026: Finalist, "Green Application" backend',
    'Katalon Testathon: Top 5, found 40/40 defects, automated 26 test cases',
  ],
  education:
    'RMIT University: Bachelor of Software Engineering (Honours), Oct 2022 – Sep 2026 (graduated), GPA 3.64 / 4.0',
}

export const projects: Project[] = [
  {
    id: 'vital-agent',
    title: 'Vital Agent',
    period: 'Apr – Sep 2026',
    summary:
      'ECG/PPG research-recording quality platform built with OUCRU (Oxford). Backend of 11 FastAPI modules (auth, RBAC, audit, review, study-scoped access) plus a Qwen-based assistant that explains deterministic signal-quality results and runs guarded backend actions. On a 115-case safety set, dangerous unsupported answers fell 32.1% → 0% and safety accuracy rose 81.7% → 97.4%. Running on OUCRU infrastructure (~50 patients/day).',
    tags: ['FastAPI', 'Qwen', 'PostgreSQL', 'RBAC', 'Signal quality'],
    links: [{ label: 'GitHub', url: 'https://github.com/Oucru-Innovations/vital-agent' }],
  },
  {
    id: 'plantos',
    title: 'PlantOS + The Garden Wars',
    period: 'Mar – Jun 2025',
    summary:
      'A bare-metal OS from scratch for Raspberry Pi 3/4: custom boot flow, memory management, CPU exception handling, UART driver and CLI, framebuffer graphics, plus a real-time tower-defence game on top.',
    tags: ['C', 'AArch64 ASM', 'UART', 'QEMU'],
    links: [
      { label: 'GitHub', url: 'https://github.com/TDuong04/plantos-the-garden-wars' },
      { label: 'Demo video', url: 'https://youtu.be/r9GJwLXUIRY' },
    ],
  },
  {
    id: 'can-safety',
    title: 'Bosch CodeRace: CAN Safety System',
    period: '2025',
    summary:
      'Multi-ECU CAN bus system (MCP2515, 500 kbps) with traction-loss detection, brake integrity monitoring, alive-counter watchdogs, and fault-injection / HIL simulation. 2nd Runner-Up.',
    tags: ['Embedded C', 'Arduino', 'CAN', 'SPI'],
    links: [
      { label: 'GitHub', url: 'https://github.com/TDuong04/Coderace-CAN-Signal-System' },
    ],
  },
  {
    id: 'fish-detection',
    title: 'Fish Detection on Jetson Nano',
    period: 'Ongoing',
    summary:
      'IoT for environmental aquaculture. Fine-tuned YOLOv8 on DeepFish for real-time underwater fish detection, counting and size estimation in low-visibility conditions. Optimised with TensorRT on an NVIDIA Jetson Nano to reach 10 FPS; benchmarked optical and sonar datasets (DeepFish, OzFish, Caltech Fish Counting) and designed the end-to-end system architecture.',
    tags: ['YOLOv8', 'TensorRT', 'Jetson Nano', 'Computer vision'],
    links: [{ label: 'GitHub', url: 'https://github.com/TDuong04/image-fish-AI' }],
  },
  {
    id: 'scootr',
    title: 'Scootr',
    period: 'Apr – May 2026',
    summary:
      'Distributed scooter-rental IoT system: Master Pi controller and Agent Pis over TCP + MQTT, QR scanning, Sense HAT display, FastAPI backend with role-based auth.',
    tags: ['Python', 'MQTT', 'FastAPI', 'Raspberry Pi'],
    links: [{ label: 'GitHub', url: 'https://github.com/TDuong04/Scootr' }],
  },
  {
    id: 'devision',
    title: 'DEVision Job Manager',
    period: 'Oct 2025 – Jan 2026',
    summary:
      'Cloud-native job platform of 8+ independently deployable services talking over Apache Kafka, behind Spring Cloud Gateway and Eureka. Owned JobPost / Company / Notification services, JWT/JWE gateway auth, and C4 architecture docs.',
    tags: ['Java 21', 'Spring Boot 3.5', 'Kafka', 'PostgreSQL', 'Redis', 'Docker', 'AWS EC2'],
    links: [{ label: 'GitHub', url: 'https://github.com/TDuong04/JobManager_Server' }],
  },
  {
    id: 'rentmate',
    title: 'RentMate',
    period: 'Oct 2025 – Jan 2026',
    summary:
      'Rental management platform for tenants, landlords and property managers: listings, leases, payments, maintenance, messaging. RBAC via Spring Security OAuth2, Stripe payments, S3 presigned uploads, CI/CD to Render.',
    tags: ['Java 21', 'Spring Boot', 'Stripe', 'AWS S3', 'Docker'],
    links: [{ label: 'GitHub', url: 'https://github.com/TDuong04/RentMate1' }],
  },
  {
    id: 'travista',
    title: 'Travista',
    period: 'Oct – Dec 2025',
    summary:
      'AI travel planner for South Korea built on NAVER HyperCLOVA X prompt orchestration with NAVER Maps route visualisation. NAVER AI Hackathon 2nd Runner-Up.',
    tags: ['Next.js', 'TypeScript', 'HyperCLOVA X'],
    links: [
      { label: 'GitHub', url: 'https://github.com/dattv23/travista' },
      { label: 'Live demo', url: 'https://travista-kappa.vercel.app/' },
    ],
  },
  {
    id: 'guess-your-paddy',
    title: 'Guess Your Paddy',
    period: 'COSC2753, RMIT',
    summary:
      'CNN pipeline for rice disease classification, variety identification and crop-age regression on 10,000+ images. Benchmarked VGG16, EfficientNetB0 and ResNet50V2; deployed as a web app.',
    tags: ['Python', 'TensorFlow', 'scikit-learn'],
    links: [
      {
        label: 'GitHub',
        url: 'https://github.com/TDuong04/COSC2753-machine-learning-assignment-2',
      },
    ],
  },
  {
    id: 'clock-watch',
    title: 'Clock Watch NUC140',
    period: '2025',
    summary:
      'A bare-metal stopwatch / alarm state machine on the Nuvoton NUC140 in C (GPIO, interrupts, Timer0, 7-segment multiplexing), with lap-time storage.',
    tags: ['C', 'Keil MDK', 'NUC140'],
    links: [{ label: 'GitHub', url: 'https://github.com/TDuong04/Clock-Watch-NUC140' }],
  },
  {
    id: 'pyman',
    title: 'Pyman',
    period: '2025',
    summary:
      'A Pac-Man-style Raspberry Pi game in Python/Pygame with four-ghost AI (Chase, Scatter, Frightened, Eaten), local multiplayer and a visual map editor.',
    tags: ['Python', 'Pygame', 'Raspberry Pi'],
    links: [{ label: 'GitHub', url: 'https://github.com/TDuong04/Pyman' }],
  },
]

export const jobs: Job[] = [
  {
    id: 'oucru',
    role: 'Capstone Collaborator / Full-Stack Developer',
    org: 'Oxford University Clinical Research Unit (OUCRU)',
    period: 'Apr – Sep 2026',
    summary:
      'Built the backend for Vital Agent: 11 FastAPI REST modules covering auth, RBAC, audit, review and study-scoped access. Implemented the Qwen-based assistant with guarded backend actions, versioned reviews/reports and auditable human-review history. Co-developed hallucination and noisy-data safeguards (115-case safety set: 32.1% → 0% dangerous unsupported answers). Deployed for internal use (~50 patients/day).',
  },
  {
    id: 'naver',
    role: 'Software Engineering Intern',
    org: 'NAVER Vietnam',
    period: 'Mar – Sep 2026',
    summary:
      "Built the Java/Spring Boot backend for the internal Interview Pool recruitment platform. Integrated NAVER's AI service (Model Connect) for automated CV analysis and interview summaries. Worked with agent-based dev pipelines for ticketing, issue resolution and PR review.",
  },
  {
    id: 'neo-culture',
    role: 'Technology Manager',
    org: 'RMIT Neo Culture Tech Club',
    period: 'Jun 2025 – Feb 2026',
    summary: 'Led a 40-member tech department across 9 concurrent projects.',
  },
]

export const skillGroups: SkillGroup[] = [
  {
    name: 'Languages & backend',
    items: [
      'Java', 'Python', 'C', 'C++', 'AArch64 Assembly', 'TypeScript', 'SQL',
      'Spring Boot', 'Spring Cloud Gateway', 'Spring Security', 'FastAPI',
      'Kafka', 'JWT/OAuth2', 'RBAC & audit design',
    ],
  },
  {
    name: 'AI & machine learning',
    items: [
      'PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'Qwen LLM assistants',
      'guarded agent actions', 'LLM safety evaluation', 'YOLOv8', 'TensorRT/CUDA',
      'HyperCLOVA X', 'LLM orchestration', 'Signal processing / HRV',
    ],
  },
  {
    name: 'Embedded & systems',
    items: [
      'C++ MCU base software', 'Automotive ADAS', 'Bare-metal', 'Boot flow & drivers',
      'UART / SPI / GPIO', 'CAN bus (MCP2515)', 'MQTT', 'Jetson Nano',
      'Nuvoton NUC140', 'Interrupt-driven FSMs',
    ],
  },
  {
    name: 'Frontend, cloud & tooling',
    items: [
      'React', 'Next.js', 'Tailwind', 'Redux', 'Docker', 'AWS (EC2, S3)', 'GCP',
      'GitHub Actions CI/CD', 'Katalon', 'HIL testing', 'Jira / Agile',
    ],
  },
]
