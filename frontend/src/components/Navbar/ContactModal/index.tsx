import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  Flex,
  Button,
} from "@chakra-ui/react";
import { User } from "../../../models/user";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

interface ContactModalProps {
  closeModal: () => void;
  isContactModalOpen: boolean;
  users: User[];
  deleteContact: (id: string) => void;
}

export default function ContactModal({ isContactModalOpen, closeModal, users, deleteContact }: ContactModalProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const newIsHovered: {
      [key: string]: boolean;
    } = {};

    users.forEach((user) => {
      newIsHovered[user.id] = false;
    });

    setIsHovered(newIsHovered);
  }, [users]);

  return (
    <Modal isOpen={isContactModalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={25} fontWeight={"bold"}>
          Contact
        </ModalHeader>
        <ModalBody>
          <Flex flexDirection={"column"}>
            <Box w={"80%"} h={1} bg={"#0E487D"} mt={"-10px"} mb={"20px"} borderRadius={"full"} alignSelf={"center"} />
            {users.map((user) => (
              <Flex
                key={user.id}
                mb={5}
                alignItems={"center"}
                justifyContent={"space-between"}
                onMouseEnter={() => setIsHovered({ ...isHovered, [user.id]: true })}
                onMouseLeave={() => setIsHovered({ ...isHovered, [user.id]: false })}
              >
                <Text fontSize={20} fontWeight={"bold"} mr={5} ml={10}>
                  {user.name}
                </Text>
                <Flex alignItems={"center"}>
                  <Button
                    mr={5}
                    onClick={() => {
                      navigate(`${user.id}`), closeModal();
                    }}
                  >
                    Accéder
                  </Button>

                  <Box
                    visibility={isHovered[user.id] ? "visible" : "hidden"}
                    _hover={{ color: "red.400", transform: "scale(1.1)" }}
                    _active={{ transform: "scale(0.9)" }}
                    transition={"transform,color 0.2s"}
                    cursor={"pointer"}
                    onClick={() => {
                      if (user.contactId) deleteContact(user.contactId);
                    }}
                  >
                    <DeleteIcon />
                  </Box>
                </Flex>
              </Flex>
            ))}
            {window.location.pathname !== "/" && (
              <Button
                mt={1}
                w={100}
                bgGradient={"linear(to-r, #2583DA, #0E487D)"}
                color={"#FFFFFF"}
                _hover={{
                  bgGradient: "linear(to-r, #2583DA, #0E487D)",
                  transform: "scale(1.05)",
                }}
                _active={{ transform: "scale(0.9)" }}
                alignSelf={"end"}
                onClick={() => {
                  navigate("/"), closeModal();
                }}
              >
                Retour
              </Button>
            )}
          </Flex>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
}
