export interface SlashCommand {
  name: string;
  description: string;
  category: "chat" | "agent" | "tools" | "info";
  /** If true, the command is handled locally instead of sent to the backend */
  local?: boolean;
  takesArgs?: boolean;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  // Chat control
  {
    name: "/new",
    description: "开始新对话",
    category: "chat",
    local: true,
  },
  {
    name: "/clear",
    description: "清空对话历史",
    category: "chat",
    local: true,
  },
  // Agent commands (sent to backend)
  {
    name: "/btw",
    description: "插入旁支问题，不影响当前上下文",
    category: "agent",
  },
  {
    name: "/approve",
    description: "批准待执行的操作",
    category: "agent",
  },
  { name: "/deny", description: "拒绝待执行的操作", category: "agent" },
  {
    name: "/status",
    description: "查看当前 Agent 状态",
    category: "agent",
  },
  {
    name: "/reset",
    description: "重置对话上下文",
    category: "agent",
  },
  {
    name: "/compact",
    description: "压缩并总结当前对话",
    category: "agent",
  },
  { name: "/undo", description: "撤销上一步操作", category: "agent" },
  {
    name: "/retry",
    description: "重试上一条失败的操作",
    category: "agent",
  },
  {
    name: "/fast",
    description: "切换低延迟优先模式",
    category: "agent",
    local: true,
  },
  {
    name: "/compress",
    description: "压缩对话，可选指定关注主题",
    category: "agent",
  },
  {
    name: "/usage",
    description: "查看 Token 用量、费用和速率限制",
    category: "agent",
    local: true,
  },
  {
    name: "/debug",
    description: "显示诊断和调试信息",
    category: "agent",
  },
  {
    name: "/goal",
    description: "锁定 Agent 到持久的跨轮目标任务（Ralph 循环）",
    category: "agent",
  },
  {
    name: "/learn",
    description: "从文件、网页、笔记或当前对话中学习可复用技能",
    category: "agent",
    takesArgs: true,
  },
  {
    name: "/steer",
    description: "不中断当前运行的前提下微调 Agent 行为",
    category: "agent",
  },
  {
    name: "/queue",
    description: "安排后续任务在当前轮次结束后执行",
    category: "agent",
  },
  {
    name: "/update",
    description: "将 Hermes 更新到最新版本",
    category: "agent",
  },
  // Tools & capabilities
  { name: "/web", description: "搜索网页", category: "tools" },
  { name: "/image", description: "生成图片", category: "tools" },
  { name: "/browse", description: "浏览指定网址", category: "tools" },
  { name: "/code", description: "编写或执行代码", category: "tools" },
  { name: "/file", description: "读写文件", category: "tools" },
  { name: "/shell", description: "执行 Shell 命令", category: "tools" },
  // Info
  {
    name: "/help",
    description: "查看帮助和可用指令",
    category: "info",
  },
  { name: "/tools", description: "列出可用工具", category: "info" },
  { name: "/skills", description: "列出已安装技能", category: "info" },
  {
    name: "/reload-skills",
    description: "无需重启，重新加载技能目录",
    category: "info",
  },
  {
    name: "/kanban",
    description: "查看或操作看板任务",
    category: "info",
  },
  {
    name: "/curator",
    description: "查看技能调度器状态（按使用频次排序）",
    category: "info",
  },
  {
    name: "/model",
    description: "打开模型选择器",
    category: "info",
  },
  {
    name: "/agents",
    description: "打开 Agent 配置页面",
    category: "info",
  },
  {
    name: "/office",
    description: "打开 3D 工作区页面",
    category: "info",
  },
  {
    name: "/discover",
    description: "打开发现页面",
    category: "info",
  },
  {
    name: "/providers",
    description: "打开服务商页面",
    category: "info",
  },
  {
    name: "/schedules",
    description: "打开定时任务页面",
    category: "info",
  },
  {
    name: "/gateway",
    description: "打开网关状态页面",
    category: "info",
  },
  { name: "/memory", description: "查看 Agent 记忆", category: "info" },
  { name: "/persona", description: "查看当前人格", category: "info" },
  { name: "/version", description: "查看 Hermes 版本", category: "info" },
];
