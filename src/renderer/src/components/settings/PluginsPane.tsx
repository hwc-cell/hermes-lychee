import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PluginsPane(): React.JSX.Element {
  const [claw3dInstalled, setClaw3dInstalled] = useState<boolean | null>(null);
  const [claw3dInstalling, setClaw3dInstalling] = useState(false);

  useEffect(() => {
    window.hermesAPI.checkOpenClaw().then((r) => setClaw3dInstalled(r.found)).catch(() => setClaw3dInstalled(false));
  }, []);

  async function installClaw3D(): Promise<void> {
    setClaw3dInstalling(true);
    try {
      await window.hermesAPI.claw3dSetup();
      const r = await window.hermesAPI.checkOpenClaw();
      setClaw3dInstalled(r.found);
    } catch {
      // Keep existing state
    } finally {
      setClaw3dInstalling(false);
    }
  }

  return (
    <div className="settings-modal-pane">
      <h3 style={{ margin: "0 0 4px", fontSize: 15 }}>可选组件</h3>
      <div className="settings-field-hint" style={{ marginBottom: 16 }}>
        按需安装，不影响基础对话。已安装组件无需重复安装。
      </div>

      {/* Claw3D */}
      <div className="settings-field" style={{ marginBottom: 16 }}>
        <label className="settings-field-label" style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {claw3dInstalled === null ? (
              <Loader2 size={14} style={{ color: "var(--text-muted)" }} />
            ) : claw3dInstalled ? (
              <CheckCircle2 size={14} style={{ color: "var(--color-ok)" }} />
            ) : (
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⬇</span>
            )}
            Claw3D 可视化工作区
          </span>
          {claw3dInstalled ? (
            <span style={{ fontSize: 12, color: "var(--color-ok)", fontWeight: 600 }}>已安装</span>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              disabled={claw3dInstalling || claw3dInstalled === null}
              onClick={installClaw3D}
              style={{ fontSize: 12, padding: "4px 14px" }}
            >
              {claw3dInstalling ? "安装中…" : "一键安装"}
            </button>
          )}
        </label>
        <div className="settings-field-hint">3D Agent 办公空间，直观查看 Agent 工作状态</div>
      </div>

      {/* Browser */}
      <div className="settings-field" style={{ marginBottom: 16 }}>
        <label className="settings-field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={14} style={{ color: "var(--color-ok)" }} />
          浏览器自动化
        </label>
        <div className="settings-field-hint">Playwright 浏览器，让 Agent 浏览网页、截图、点击</div>
        <div style={{ fontSize: 12, color: "var(--accent-text)", marginTop: 4 }}>
          前往「工具」→ 启用「浏览器」工具集
        </div>
      </div>

      {/* Desktop */}
      <div className="settings-field" style={{ marginBottom: 16 }}>
        <label className="settings-field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={14} style={{ color: "var(--color-ok)" }} />
          桌面控制
        </label>
        <div className="settings-field-hint">允许 Agent 控制鼠标键盘（macOS 需系统设置 → 隐私 → 辅助功能授权）</div>
        <div style={{ fontSize: 12, color: "var(--accent-text)", marginTop: 4 }}>
          前往「工具」→ 启用「桌面控制」工具集
        </div>
      </div>

      {/* FFmpeg */}
      <div className="settings-field" style={{ marginBottom: 16 }}>
        <label className="settings-field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⬇</span>
          FFmpeg 媒体处理
        </label>
        <div className="settings-field-hint">音视频转码、语音合成依赖</div>
        <div style={{ fontSize: 12, color: "var(--accent-text)", marginTop: 4 }}>
          brew install ffmpeg
        </div>
      </div>

      {/* ripgrep */}
      <div className="settings-field" style={{ marginBottom: 16 }}>
        <label className="settings-field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>⬇</span>
          ripgrep 代码搜索
        </label>
        <div className="settings-field-hint">高速代码搜索，Agent 搜索文件必备</div>
        <div style={{ fontSize: 12, color: "var(--accent-text)", marginTop: 4 }}>
          brew install ripgrep
        </div>
      </div>
    </div>
  );
}
