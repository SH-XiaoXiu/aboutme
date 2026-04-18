export const basic = {
  name: 'Xiaoxiu',
  location: '深圳',
  gender: '男',
  height: '183',
  age: '21',
  occupation: 'Java 工程师',
};

export const contact = {
  email: 'me@xiuxius.cn',
  github: 'github.com/sh-xiaoxiu',
  gitee: 'gitee.com/sh-xiaoxiu',
  website: 'www.xiuxius.cn',
  douyin: 'douyin.com/user/xiaoxiu', // TODO: 改成你的真实抖音链接
};

export const skills: { category: string; items: string[] }[] = [
  { category: '编程语言', items: ['Java', 'C', 'TypeScript', 'Python', 'Assembly'] },
  { category: '后端框架', items: ['Spring Boot', 'Spring Cloud', 'Nest.js', 'FastAPI'] },
  { category: '数据 / 中间件', items: ['PostgreSQL', 'MySQL', 'Redis', 'RabbitMQ', 'Elasticsearch', 'MongoDB', 'MQTT'] },
  { category: '前端 / 客户端', items: ['Vue 3', 'React', '微信小程序', 'Vite', 'Pinia', 'Electron'] },
  { category: '嵌入式 / 硬件', items: ['ARM Cortex-M', 'STM32', 'ESP32', 'FreeRTOS'] },
  { category: '工具链', items: ['Git', 'Maven', 'Gradle', 'CMake', 'Docker', 'QEMU'] },
];

export type Experience = {
  company: string;
  position: string;
  date: string;
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: '居家 · 自己',
    position: '接单 / 写点小玩意',
    date: '2026.03 — 至今',
    highlights: [
      '居家接单干活，自己给自己排 todo，写点想写的小玩意。',
    ],
  },
  {
    company: '某创业公司 · 深圳',
    position: '软件开发工程师 / 技术负责人',
    date: '2025.08 — 2026.02',
    highlights: [
      '带领团队完成业务平台从 0 到 1 的建设，主导架构设计与核心模块开发。',
    ],
  },
  {
    company: '某网络科技公司',
    position: 'Java 开发工程师',
    date: '2024.09 — 2025.04',
    highlights: [
      '参与 IDC 服务平台的微服务架构设计，负责多个核心服务。',
    ],
  },
  {
    company: 'Ncraft Studio',
    position: '后端开发 / MC 服务端负责人',
    date: '2022 — 2024',
    highlights: [
      '主导自有 Minecraft 服务器的后端与社区平台从 0 到 1 的建设。',
    ],
  },
];

export type Project = {
  name: string;
  role: string;
  date?: string;
  desc: string;
  tech: string[];
  highlights: string[];
  featured?: boolean;
  github?: string;
  gitee?: string;
  homepage?: string;
};

export const projects: Project[] = [
  {
    name: 'Xnix · x86 微内核操作系统',
    role: '项目作者',
    date: '2025.02 — 至今',
    desc: '从零设计并实现的 x86 微内核操作系统，核心机制最小化并隔离服务，支持进程管理、IPC、权限控制及 FAT32。',
    tech: ['C11', 'x86 Assembly', 'CMake', 'QEMU', 'GRUB'],
    highlights: [],
    featured: true,
    github: 'https://github.com/sh-xiaoxiu/Xnix',
    gitee: 'https://gitee.com/sh-xiaoxiu/Xnix',
    homepage: 'https://www.xiuxius.cn/archives/voGwqamY',
  },
  {
    name: 'MyRTOS · Cortex-M4 多任务调度',
    role: '项目作者',
    desc: '基于 Cortex-M4 的多任务调度系统基本实现，参考 FreeRTOS。结构简单，文件关系清晰，测试用例可直接运行，适合作为理解多任务调度的学习参考。',
    tech: ['C', 'ARM Cortex-M4', 'CMake'],
    highlights: [],
    github: 'https://github.com/SH-XiaoXiu/MyRTOS-Demo',
    gitee: 'https://gitee.com/sh-xiaoxiu/my-rtos-demo',
  },
  {
    name: 'DomusEE · Java 企业级开发框架',
    role: '项目作者',
    desc: '面向 Java 企业级应用的开发框架。不脱离 Spring 等底层套件的前提下，把面向对象与领域驱动理念带回企业系统架构——鼓励充血领域模型，业务逻辑自然存在于领域对象中，而非传统 Service 流水线。目前处于内部可行性开发阶段。',
    tech: ['Java', 'Spring', 'DDD'],
    highlights: [],
    gitee: 'https://gitee.com/sh-xiaoxiu/domus-ee',
  },
  {
    name: 'EasyFramework · Spigot 插件框架',
    role: '项目作者',
    date: '2024.01 — 2025.04',
    desc: '借鉴 Spring 核心思想，为 Spigot / Bukkit 设计的轻量、渐进、声明式 Java 插件开发框架。',
    tech: ['Java 17', 'Spring Core', 'Spigot API', 'Reflections', 'CGLIB'],
    highlights: [],
    github: 'https://github.com/sh-xiaoxiu/easy-framework',
  },
  {
    name: 'SpigotLargerInventory · MC 背包扩容',
    role: '项目作者',
    desc: '一个 Minecraft Spigot 插件，通过分页系统扩展玩家背包容量。支持跨页拾取、跨页死亡掉落。',
    tech: ['Java', 'Spigot API'],
    highlights: [],
    gitee: 'https://gitee.com/sh-xiaoxiu/spigot-larger-inventory',
    homepage: 'https://modrinth.com/plugin/spigot-larger-inventory',
  },
  {
    name: 'EasySTC · 单片机工具链',
    role: '项目作者',
    date: '2025.06 — 2025.10',
    desc: 'STC 单片机现代化开发工具链，提供跨平台编译、烧录与 IDE 集成能力。',
    tech: ['Java', 'IntelliJ Platform', 'Picocli'],
    highlights: [],
    homepage: 'https://www.xiuxius.cn/easystc',
  },
];

/* ========================================================
 * About 编辑化块级数据
 * ======================================================== */

export type AboutBlockKind =
  | 'manifesto'
  | 'origin'
  | 'contradictions'
  | 'relationship'
  | 'now'
  | 'signature';

export type ImageLayout = 'auto' | 'portrait-side' | 'gallery' | 'single-full';

export interface AboutBlock {
  kind: AboutBlockKind;
  index: string;
  label: string;
  title?: string;
  subtitle: string;
  paragraphs?: string[];
  contradictions?: { a: string; b: string }[];
  listItems?: string[];
  meta?: string[];
  closer?: string;
  imageDir: string;
  imageLayout?: ImageLayout;
}

export const aboutBlocks: AboutBlock[] = [
  {
    kind: 'manifesto',
    index: '01',
    label: 'MANIFESTO',
    subtitle: '你看到的就是真实的我。极度坦诚',
    paragraphs: [
      '不知道咋介绍，自己都说不清楚。',
      '反正我就是我。',
    ],
    meta: ['深圳', '独立开发者', '理想主义者'],
    imageDir: '01_manifesto',
    imageLayout: 'auto',
  },
  {
    kind: 'origin',
    index: '02',
    label: 'ORIGIN',
    title: 'Minecraft。',
    subtitle: '怎么开始的。',
    paragraphs: [
      '初一。家里那台用了快十年的 i5 3代和一个巨他妈厚的VGA显示器、方块人、Python 少儿课。一开始是懵的。',
      'Minecraft——十几年了，它是入口。为了自己开服，我学 Java、写插件、写模组，在家里搞了一台 Dell R640 呼呼转',
    ],
    closer: '热爱、实践驱动。',
    imageDir: '02_origin',
    imageLayout: 'auto',
  },
  {
    kind: 'contradictions',
    index: '03',
    label: 'CONTRADICTIONS',
    title: '左右脑互博',
    subtitle: '在干嘛？？。。',
    contradictions: [
      { a: '想去别的城市', b: '但是还是喜欢深圳' },
      { a: '学历不高，很菜', b: '渴望学很多很多东西' },
      { a: '理想主义者', b: '大方承认钱越多越好' },
      { a: '写严谨代码', b: '但天天"跟着感觉走"' },
      { a: '焦虑', b: '行动力极高' },
      { a: '形象状态好才社交', b: '所以你见到我，我总在状态' },
      { a: '熬夜狂', b: '其实睡眠质量奇好' },
    ],
    closer: '就这样。',
    imageDir: '03_contradictions',
    imageLayout: 'auto',
  },
  {
    kind: 'relationship',
    index: '04',
    label: 'OF HIM',
    title: '关于他',
    subtitle: '顺其自然。',
    paragraphs: [
      '身边有一个相爱的人',
      '没什么宏大理论——愿意一起走，一起往前。',
    ],
    imageDir: '05_relationship',
    imageLayout: 'auto',
  },
  {
    kind: 'now',
    index: '05',
    label: 'NOW',
    title: '在做的，在想的。',
    subtitle: '短期列表。',
    listItems: [
      '健身，保持身材，别再胖回去。',
      '操作系统，继续啃底层。',
      '神经网络，在学，但总咕咕咕。',
      '找一份非常适合自己的工作，沉淀几年。',
      '然后，构思一个值得做的 idea。',
    ],
    closer: '幻想呗。',
    imageDir: '06_now',
    imageLayout: 'auto',
  },
  {
    kind: 'signature',
    index: '06',
    label: 'SIGNATURE',
    title: '一些小事。',
    subtitle: '胡言乱语',
    listItems: [
      '拉屎时灵感涌现，解决过不少 bug。',
      '剩下的都是性癖。',
    ],
    closer: '呃。。。',
    imageDir: '07_signature',
    imageLayout: 'auto',
  },
];

