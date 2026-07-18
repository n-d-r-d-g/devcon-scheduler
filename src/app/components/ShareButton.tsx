"use client";

import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tooltip, useDisclosure, Snippet } from "@heroui/react";
import { FaShare } from "react-icons/fa6";
import QRCode from 'react-qr-code';

const retrieveShareLink = () => {
  const url = new URL(window.location.href);
  const activeSessions = localStorage.getItem("activeSessions");

  if (activeSessions) {
    url.searchParams.set("share", btoa(activeSessions));
  } else {
    url.searchParams.delete("share");
  }

  return url.toString();
}

export function ShareButton() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Tooltip content="Share link">
        <Button
          onPress={onOpen}
          size="md"
          radius="full"
          variant="light"
          aria-label="Share link"
          className="!text-default-foreground focus-visible:!ring-transparent data-[focus-visible=true]:!-outline-offset-2"
          isIconOnly
        >
          <FaShare size={16} />
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Share link</ModalHeader>
              <ModalBody>
                <div className="max-w-full mx-auto bg-white p-3 rounded-lg">
                  <QRCode value={retrieveShareLink()} bgColor="white" fgColor="black" className="max-w-full" />
                </div>
                <Snippet className="overflow-auto pe-[0.375rem] scrollbar-hide [&>button]:sticky [&>button]:right-0 [&>button]:shadow-[0.75rem_0_#eeeeef] [&>button]:bg-zinc-200 [&>button]:hover:bg-zinc-300 dark:[&>button]:shadow-[0.75rem_0_#27272c] dark:[&>button]:bg-zinc-800 dark:[&>button]:hover:bg-zinc-700" hideSymbol>{retrieveShareLink()}</Snippet>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
