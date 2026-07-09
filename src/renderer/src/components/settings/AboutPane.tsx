import {
  Bug,
  Calendar,
  Cpu,
  FolderOpen,
  Loader,
  Monitor,
  Stethoscope,
} from "lucide-react";
import { useI18n } from "../useI18n";
import BrandLogo from "../common/BrandLogo";
import hermesIcon from "../../assets/hermes-icon.svg";
import pythonLogo from "../../assets/logos/python.svg";
import openaiLogo from "../../assets/logos/openai.svg";
import { ConfigHealth } from "../../screens/Settings/ConfigHealth";
import { useSettings } from "./SettingsDataContext";

export default function AboutPane(): React.JSX.Element {
  const { t } = useI18n();
  const {
    hermesHome,
    hermesVersion,
    appVersion,
    parsedVersion,
    doctorOutput,
    doctorRunning,
    dumpOutput,
    dumpRunning,
    setDumpOutput,
    setDumpRunning,
    handleDoctor,
  } = useSettings();

  const loading = hermesVersion === null;

  return (
    <div className="settings-modal-pane">
      <ConfigHealth />

      {/* Hermes Agent (engine) — version info only */}
      <section className="settings-card">
        <header className="settings-card-head">
          <span className="settings-card-icon">
            <BrandLogo provider="nous" size={20} />
          </span>
          <div className="settings-card-headtext">
            <div className="settings-card-title">
              {t("settings.sections.hermesAgent")}
            </div>
            <div className="settings-card-sub">
              {t("settings.agentSubtitle")}
            </div>
          </div>
        </header>

        <div className="settings-card-body">
          <div className="settings-meta-grid">
            <Meta
              label={t("common.engine")}
              loading={loading}
              icon={<Cpu size={13} />}
            >
              {parsedVersion
                ? `v${parsedVersion.version}`
                : t("settings.notDetected")}
            </Meta>
            <Meta
              label={t("common.released")}
              loading={loading}
              icon={<Calendar size={13} />}
            >
              {parsedVersion?.date || "—"}
            </Meta>
            <Meta
              label="Python"
              loading={loading}
              icon={<MetaLogo src={pythonLogo} alt="Python" />}
            >
              {parsedVersion?.python || "—"}
            </Meta>
            <Meta
              label="OpenAI SDK"
              loading={loading}
              icon={<MetaLogo src={openaiLogo} alt="OpenAI" />}
            >
              {parsedVersion?.sdk || "—"}
            </Meta>
          </div>

          <div className="settings-meta-path">
            <span className="settings-meta-label">
              <FolderOpen size={13} />
              {t("common.home")}
            </span>
            {!hermesHome ? (
              <span className="skeleton skeleton-md" />
            ) : (
              <code className="settings-meta-pathvalue">{hermesHome}</code>
            )}
          </div>

          <div className="settings-card-actions">
            <button
              className="btn btn-secondary"
              onClick={handleDoctor}
              disabled={doctorRunning}
            >
              <Stethoscope size={14} />
              {doctorRunning
                ? t("settings.runningDiagnosis")
                : t("settings.runDiagnosis")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={async () => {
                setDumpRunning(true);
                setDumpOutput(null);
                const output = await window.hermesAPI.runHermesDump();
                setDumpOutput(output);
                setDumpRunning(false);
              }}
              disabled={dumpRunning}
            >
              <Bug size={14} />
              {dumpRunning ? t("settings.running") : t("settings.debugDump")}
            </button>
          </div>

          {doctorOutput && (
            <pre className="settings-hermes-doctor">{doctorOutput}</pre>
          )}
          {dumpOutput && (
            <pre className="settings-hermes-doctor">{dumpOutput}</pre>
          )}
        </div>
      </section>

      {/* Hermes Lychee (this app) */}
      <section className="settings-card">
        <header className="settings-card-head">
          <span className="settings-card-icon">
            <img
              src={hermesIcon}
              width={20}
              height={20}
              className="brand-logo brand-logo--match-theme"
              alt="Hermes Lychee"
            />
          </span>
          <div className="settings-card-headtext">
            <div className="settings-card-title">Hermes Lychee</div>
            <div className="settings-card-sub">基于 hermes-desktop 改进</div>
          </div>
        </header>

        <div className="settings-card-body">
          <div className="settings-meta-grid">
            <Meta
              label="桌面端"
              loading={!appVersion}
              icon={<Monitor size={13} />}
            >
              v{appVersion}
            </Meta>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 12 }}>
            <a
              href="https://github.com/NousResearch/hermes-agent"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-text)", textDecoration: "none" }}
            >
              hermes-agent ↗
            </a>
            <a
              href="https://github.com/NousResearch/hermes-desktop"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-text)", textDecoration: "none" }}
            >
              hermes-desktop ↗
            </a>
          </div>

          <div className="settings-meta-grid" style={{ marginTop: 14 }}>
            <div className="settings-meta-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span className="settings-meta-label" style={{ fontSize: 10 }}>原作者</span>
              <a href="https://github.com/NousResearch/hermes-desktop" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-text)", textDecoration: "none" }}>NousResearch ↗</a>
            </div>
            <div className="settings-meta-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span className="settings-meta-label" style={{ fontSize: 10 }}>汉化改编</span>
              <a href="https://space.bilibili.com/3493128967293256" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-text)", textDecoration: "none" }}>whcl412（B站）↗</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Meta({
  label,
  loading,
  icon,
  children,
}: {
  label: string;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="settings-meta">
      <span className="settings-meta-label">
        {icon}
        {label}
      </span>
      {loading ? (
        <span className="skeleton skeleton-sm" />
      ) : (
        <span className="settings-meta-value">{children}</span>
      )}
    </div>
  );
}

function MetaLogo({
  src,
  alt,
}: {
  src: string;
  alt: string;
}): React.JSX.Element {
  return (
    <img
      src={src}
      width={13}
      height={13}
      alt={alt}
      className="brand-logo brand-logo--match-theme"
    />
  );
}
