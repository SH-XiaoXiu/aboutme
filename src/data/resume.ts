export const basic = {
    name: 'XiaoXiu',
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
    douyin: 'douyin.com/user/A_XiaoXiu',
};

export const skills: { category: string; items: string[] }[] = [
    {category: '编程语言', items: ['Java', 'C', 'TypeScript', 'Python', 'Assembly']},
    {category: '后端框架', items: ['Spring Boot', 'Spring Cloud', 'Nest.js', 'FastAPI']},
    {
        category: '数据 / 中间件',
        items: ['PostgreSQL', 'MySQL', 'Redis', 'RabbitMQ', 'Elasticsearch', 'MongoDB', 'MQTT']
    },
    {category: '前端 / 客户端', items: ['Vue 3', 'React', '微信小程序', 'Vite', 'Pinia', 'Electron']},
    {category: '嵌入式 / 硬件', items: ['ARM Cortex-M', 'STM32', 'ESP32', 'FreeRTOS']},
    {category: '工具链', items: ['Git', 'Maven', 'Gradle', 'CMake', 'Docker', 'QEMU']},
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
    | 'habits'
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
    habitItems?: string[];
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
        subtitle: '高中没读完就跑路了，后面很多东西靠自己慢慢摸索。',
        paragraphs: [
            '路线不太标准。',
            '但也没长歪。',
            '一整个莫名其妙'
        ],
        meta: ['深圳', '写代码', '还在学'],
        imageDir: '01_manifesto',
        imageLayout: 'auto',
    },
    {
        kind: 'origin',
        index: '02',
        label: 'ORIGIN',
        title: 'Minecraft。',
        subtitle: '事情差不多就是这么开始的。',
        paragraphs: [
            '我学编程不是因为什么远大理想，主要是玩方块人玩的 :)。',
            '后来不满足于只当玩家，就开始自己开服、写插件、折腾 Java 和服务端，最后连服务器都往家里搬。魔怔了 (bushi',
        ],
        closer: '很多事都是这样，先是玩，玩着玩着就把自己玩进去了。',
        imageDir: '02_origin',
        imageLayout: 'auto',
    },
    {
    kind: 'habits',
    index: '03',
    label: 'HABITS',
    title: '平时差不多就这样',
    subtitle: '没有什么精致生活，能运转就行。',
    habitItems: [
      '居家写代码。健身。咖啡。海边。',
      '状态好才见人，所以一般已经收拾过自己了。',
      '感兴趣的事能一口气做很久。',
      '作息偏晚，但不是少睡。',
      '桌上设备不少，一起开着的时候，房间有点像小型机房。',
    ],
    closer: '能运转就先这么运转着。',
    imageDir: '03_habits',
    imageLayout: 'auto',
  },
  {
      kind: 'relationship',
      index: '04',
      label: 'RELATIONSHIP',
      title: '恋爱中，感情状况稳定。',
      subtitle: '已美美幸福好几年了喵',
      paragraphs: [
          '冷知识:',
          '煮波是1',
      ],
    imageDir: '05_relationship',
    imageLayout: 'auto',
  },
    {
        kind: 'now',
        index: '05',
        label: 'NOW',
        title: '现在大概在干嘛',
        subtitle: '都算正经事。',
        listItems: [
            '平时写代码、健身、喝咖啡、去海边。',
            '继续补以前没来得及补的东西，也继续学新的东西。',
            '最近在看操作系统，也想把神经网络和深度学习再认真捡起来。',
            '也在找一份真正适合自己的工作，最好能安心做几年。',
        ],
        closer: '先把眼前的事做好。',
        imageDir: '06_now',
        imageLayout: 'auto',
    },
    {
        kind: 'signature',
        index: '06',
        label: 'SIGNATURE',
        title: '一些小事',
        subtitle: '没什么用，但很像我。',
        listItems: [
            '咖啡基本是刚需，不然人会一直卡在开机界面。',
            '鼠标换来换去，最后还是会买回 G502。',
            '我很多 bug，不是在工位上解决的，是在厕所里想到办法的。',
        ],
        closer: '差不多就这些。',
        imageDir: '07_signature',
        imageLayout: 'auto',
    },
];
