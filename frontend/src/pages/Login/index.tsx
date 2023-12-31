import { Box, Button, Flex, Image, Input, InputGroup, InputRightElement, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      connection();
    }
  };

  const connection = async (): Promise<void> => {
    setLoginLoading(true);

    if (email === "" || password === "") {
      toast({
        title: "Erreur lors de la connection de l'utilisateur",
        description: "Un des champs est vide",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoginLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://mplusback.fly.dev/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "*",
          },
        },
      );

      toast({
        title: "Utilisateur connecté avec succès",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem("token", response.data.access_token);

      setLoginLoading(false);
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur lors de la connection de l'utilisateur",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      setLoginLoading(false);
    }
  };

  return (
    <Flex justifyContent={"space-between"}>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        borderRadius={20}
        w={"45%"}
        h={"700px"}
        m={"auto"}
        bg={"#e0e0e0"}
        boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
      >
        <Text
          bgClip="text"
          bgGradient={"linear(to-r, #2583DA, #0E487D)"}
          mt={"40px"}
          textAlign={"center"}
          fontSize={"35px"}
          fontWeight={700}
        >
          Connecte toi !
        </Text>
        <Box w="45%" h={"3px"} bg={"#0E487D"} borderRadius={"full"} mt={"10px"}></Box>
        <Input
          w={"50%"}
          mt={"60px"}
          variant="outline"
          placeholder="Email"
          h={"50px"}
          bg={"#FFFFFF"}
          borderColor={"#2583DA"}
          border={"2px"}
          color={"#2583DA"}
          _hover={{ borderColor: "#0E487D" }}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <InputGroup alignItems="center" justifyContent={"center"}>
          <Input
            mt={"60px"}
            h="50px"
            variant="outline"
            w={"50%"}
            bg={"#FFFFFF"}
            borderColor={"#2583DA"}
            _hover={{ borderColor: "#0E487D" }}
            border={"2px"}
            color={"#2583DA"}
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {/* affiche un bouton qui affiche ou non le mot de passe */}
          <InputRightElement width="auto" m="5px">
            <Button
              onClick={() => setShowPassword(!showPassword)}
              backdropFilter={"blur(10px)"}
              mr={"170px"}
              mt={"120px"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Text textAlign="center" mt={"30px"}>
          <Text as="span">Tu n'as pas de compte ?</Text>{" "}
          <Link to="/signup">
            <Text as="span" color="brand.500" textDecoration={"none"} fontWeight={"bold"}>
              Inscris toi !
            </Text>
          </Link>
        </Text>

        <Button
          mt={"40px"}
          w={"50%"}
          h={"50px"}
          bgGradient={"linear(to-r, #2583DA, #0E487D)"}
          color={"#FFFFFF"}
          _hover={{
            bgGradient: "linear(to-r, #2583DA, #0E487D)",
            transform: "scale(1.05)",
          }}
          _active={{ transform: "scale(0.9)" }}
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
          isLoading={loginLoading}
          onClick={connection}
        >
          Connexion !
        </Button>

        <Box w="45%" h={"3px"} bg={"#0E487D"} borderRadius={"full"} mt={"40px"}></Box>
      </Flex>
      <Image src={"/assets/image/Orage.jpg"} h={"100vh"} w={"43%"}></Image>
    </Flex>
  );
};

export default Login;
