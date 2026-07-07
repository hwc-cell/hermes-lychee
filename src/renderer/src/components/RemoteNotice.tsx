import { Signal } from "../assets/icons";

function RemoteNotice({ feature }: { feature: string }): React.JSX.Element {
  return (
    <div className="remote-notice">
      <Signal size={28} className="remote-notice-icon" />
      <p className="remote-notice-title">已连接到远程 Hermes</p>
      <p className="remote-notice-desc">
        {feature}在远程模式下暂不可用。相关数据位于服务器端，
        目前尚无法通过 API 访问。
      </p>
    </div>
  );
}

export default RemoteNotice;
