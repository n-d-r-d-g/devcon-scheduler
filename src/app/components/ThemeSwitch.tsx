"use client";

import { APP_THEMES } from "@/constants";
import { Select, SelectItem, Tooltip } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectionChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => setTheme(e.target.value),
    [setTheme]
  );

  const Icon = useCallback(() => {
    const currTheme = APP_THEMES.find((appTheme) => appTheme.key === theme);
    const CurrThemeIcon = (currTheme ?? APP_THEMES[0]).icon;

    return <CurrThemeIcon size={18} className="min-w-[18px]" />;
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <Tooltip content="Change theme">
      <div>
        <Select
          aria-label="Change theme"
          selectedKeys={[theme ?? "system"]}
          startContent={<Icon />}
          onChange={handleSelectionChange}
          className="w-[68px]"
        >
          {APP_THEMES.map((appTheme) => (
            <SelectItem key={appTheme.key} aria-label={appTheme.label}>
              <appTheme.icon size={16} />
            </SelectItem>
          ))}
        </Select>
      </div>
    </Tooltip>
  );
}
