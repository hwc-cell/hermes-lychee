import type { ModelCommandFormatter, SlashCommandDefinition } from "./types";

const formatExplainSelection: ModelCommandFormatter = async (input) => ({
  content: [
    "请清晰解释以下内容。",
    input.args && `额外说明：\n${input.args}`,
    input.selectedText && `内容：\n${input.selectedText}`,
  ]
    .filter(Boolean)
    .join("\n\n"),
  attachments: input.attachments,
});

// @lat: [[chat-commands#Slash command execution#Central command router#Desktop commands]]
export const DESKTOP_SLASH_COMMANDS: SlashCommandDefinition[] = [
  {
    name: "settings",
    description: "打开桌面端设置",
    category: "桌面端",
    source: "desktop",
    target: "desktop",
    allowWhileBusy: true,
    uiAction: true,
    execute: async ({ args }, context) => {
      context.openSettings(args || undefined);
      return { type: "handled" };
    },
  },
  {
    name: "explain-selection",
    description: "解释选中的内容",
    category: "桌面端",
    source: "desktop",
    target: "model",
    allowWhileBusy: false,
    supportsAttachments: true,
    format: formatExplainSelection,
  },
  {
    name: "help",
    aliases: ["commands"],
    description: "查看可用指令",
    category: "桌面端",
    source: "desktop",
    target: "desktop",
    allowWhileBusy: true,
    execute: async (_input, context) => ({
      type: "handled",
      output: context.renderSlashHelp(),
    }),
  },
  {
    name: "model",
    description: "打开模型选择器",
    category: "桌面端",
    source: "desktop",
    target: "desktop",
    allowWhileBusy: true,
    uiAction: true,
    execute: async () => {
      window.dispatchEvent(new CustomEvent("model-picker:open"));
      return { type: "handled" };
    },
  },
  ...(
    [
      ["agents", "打开 Agent 配置页面"],
      ["office", "打开 3D 工作区页面"],
      ["discover", "打开发现页面"],
      ["providers", "打开服务商页面"],
      ["schedules", "打开定时任务页面"],
      ["kanban", "打开看板"],
      ["gateway", "打开网关状态页面"],
    ] as const
  ).map(
    ([name, description]): SlashCommandDefinition => ({
      name,
      description,
      category: "导航",
      source: "desktop",
      target: "desktop",
      allowWhileBusy: true,
      uiAction: true,
      execute: async () => {
        window.dispatchEvent(
          new CustomEvent("navigation:goto", { detail: name }),
        );
        return { type: "handled" };
      },
    }),
  ),
];

// `uiAction: true` marks commands whose effect is a UI change with no
// transcript output (start a new chat, clear it, toggle fast mode) — the
// router suppresses their echoed `/command` user bubble.
const LOCAL_COMMANDS: ReadonlyArray<
  readonly [name: string, description: string, uiAction?: boolean]
> = [
  ["new", "开始新对话", true],
  ["clear", "清空对话历史", true],
  ["persona", "查看当前人格"],
  ["memory", "查看 Agent 记忆"],
  ["tools", "查看可用工具集"],
  ["skills", "查看已安装技能"],
  ["version", "查看 Hermes 版本"],
  ["fast", "切换快速模式", true],
  ["usage", "查看 Token 用量"],
];

export const LOCAL_DESKTOP_SLASH_COMMANDS: SlashCommandDefinition[] =
  LOCAL_COMMANDS.map(([name, description, uiAction]) => ({
    name,
    description,
    category: "桌面端",
    source: "desktop",
    target: "desktop",
    allowWhileBusy: true,
    ...(uiAction ? { uiAction: true } : {}),
    execute: async (input, context) => {
      const handled = await context.executeDesktopSlash(input.rawInput);
      return handled
        ? { type: "handled" as const }
        : {
            type: "error" as const,
            message: `桌面端指令 /${input.name} 暂不可用`,
          };
    },
  }));
