import { NavItem } from "@/types";
import { findActiveLinkIndex } from "@/util/general";
import { useCallback, useEffect, useState } from "react";

const useActiveTab = (links: NavItem[], pathname: string) => {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<number | null>(null);

  const updateActiveTab = useCallback(
    (currentLinks: NavItem[]) => {
      const { activeIndex, parentId } = findActiveLinkIndex(
        currentLinks,
        pathname,
        isCollapsed,
      );
      !isCollapsed && setIsCollapsed(parentId);
      setActiveTab(activeIndex);
    },
    [pathname, isCollapsed],
  );

  useEffect(() => {
    if (links.length > 0) {
      updateActiveTab(links);
    }
  }, [links, pathname, updateActiveTab]);

  return { activeTab, setActiveTab, isCollapsed, setIsCollapsed };
};

export default useActiveTab;
