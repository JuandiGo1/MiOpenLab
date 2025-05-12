import ContentLoader from "react-content-loader";
import { useEffect, useState } from "react";

let isDarkMode = localStorage.getItem("theme") === "dark";

const ProjectSkeleton = (props) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const theme = localStorage.getItem("theme");
        setIsDarkMode(theme === "dark");
    }, []);
    
    return (
        <div className="bg-white rounded-lg shadow-md mb-4 p-5 dark:bg-[#333333]">
            <ContentLoader
                speed={2}
                width="100%"
                height={300}
                viewBox="0 0 900 300"
                backgroundColor={!isDarkMode ? "#d6d6d6" : "#d6d6d6"}
                foregroundColor={!isDarkMode ? "#bd9260" : "#5858FA"}
                {...props}
            >
                <rect x="48" y="8" rx="3" ry="3" width="88" height="10" />
                <rect x="48" y="26" rx="3" ry="3" width="52" height="10" />
                <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
                <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
                <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
                <circle cx="20" cy="22" r="20" />
                <rect x="-2" y="114" rx="0" ry="0" width="323" height="92" />
                <rect x="474" y="5" rx="3" ry="3" width="88" height="10" />
                <rect x="473" y="21" rx="3" ry="3" width="88" height="10" />
                <circle cx="10" cy="238" r="7" />
                <rect x="443" y="236" rx="3" ry="3" width="134" height="5" />
            </ContentLoader>
        </div>
    );
};

export default ProjectSkeleton;
