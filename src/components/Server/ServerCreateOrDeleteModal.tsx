import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Text,
  Button,
} from '@chakra-ui/react';
import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';

type props = {
  mutationIsLoading: boolean;
  isValid: boolean;
  touched: FormikTouched<{
    name: string;
  }>;
  errors: FormikErrors<{
    name: string;
  }>;
  isOpen: boolean;
  name: string;
  onClose: () => void;
  handleReset: (e?: React.SyntheticEvent<any, Event> | undefined) => void;
  handleChange: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  headerText: string;
  bodyText: string;
};

export default function ServerCreateOrDeleteModal({
  touched,
  errors,
  isOpen,
  onClose,
  name,
  handleReset,
  handleChange,
  isValid,
  handleBlur,
  handleSubmit,
  mutationIsLoading,
  bodyText,
  headerText,
}: props) {
  return (
    <Modal
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleReset();
      }}
    >
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent>
        <ModalHeader className="text-purple-900 font-bold text-center">
          {headerText}
        </ModalHeader>
        <ModalBody className="pb-6">
          <Text className="text-purple-900 font-semibold">{bodyText}</Text>
          <Input
            autoCapitalize="none"
            autoFocus={false}
            type="text"
            placeholder="Server Name"
            value={name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
          />
          {touched.name && errors.name && (
            <Text className="text-s text-red-400">{errors.name}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            className="mr-3"
            colorScheme="purple"
            disabled={!isValid || mutationIsLoading}
            isLoading={mutationIsLoading}
            onClick={() => handleSubmit()}
          >
            Confirm
          </Button>
          <Button
            color="purple.900"
            variant="unstyled"
            onClick={() => {
              handleReset();
              onClose();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
