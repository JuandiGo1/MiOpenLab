import ContentLoader from "react-content-loader";

const ProjectSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={900}
    height={280}
    viewBox="0 0 476 124"
    backgroundColor="#d3d7d9"
    foregroundColor="#dfdcce"
    {...props}
  >
    <rect x="6" y="2" rx="3" ry="3" width="88" height="9" />
    <rect x="34" y="20" rx="3" ry="3" width="52" height="10" />
    <rect x="0" y="46" rx="3" ry="3" width="410" height="14" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="12" />
    <rect x="0" y="95" rx="3" ry="3" width="178" height="13" />
    <circle cx="13" cy="26" r="12" />
    <rect x="335" y="2" rx="3" ry="3" width="88" height="6" />
    <rect x="335" y="18" rx="3" ry="3" width="88" height="6" />
  </ContentLoader>
);

export default ProjectSkeleton;
