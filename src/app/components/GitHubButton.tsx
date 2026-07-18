"use client";

import { Button, Link, Tooltip } from "@heroui/react";
import { FaGithub } from "react-icons/fa6";

export function GitHubButton() {
  return (
    <Tooltip content="GitHub link">
      <Button
        size="md"
        radius="full"
        variant="light"
        as={Link}
        href="https://github.com/n-d-r-d-g/devcon-scheduler"
        aria-label="GitHub link"
        className="!text-default-foreground focus-visible:!ring-transparent data-[focus-visible=true]:!-outline-offset-2"
        isIconOnly
        isExternal
      >
        <FaGithub size={16} />
      </Button>
    </Tooltip>
  );
}
