import "./Loading.css";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const Loading = () => {
  return (
    <div className="loading-screen">
      <Icon icon="svg-spinners:90-ring" className="loading-icon" />
    </div>
  );
};

export default Loading;
