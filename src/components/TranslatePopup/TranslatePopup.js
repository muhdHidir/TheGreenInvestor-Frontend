import { Modal, Text } from "@mantine/core";
import React, { useEffect } from "react";
import GoogleTranslate from "./GoogleTranslate";

const TranslatePopup = ({ opened, handleClose }) => {
  return (
    <Modal
      centered
      size="xs"
      className="font-bold text-xl"
      opened={opened}
      withCloseButton={false}
      onClose={handleClose}
    >
      <Text className="text-center notranslate text-darkGreen-50 text-xl font-bold">
        Translation
      </Text>

      <GoogleTranslate />
    </Modal>
  );
};

export default TranslatePopup;
