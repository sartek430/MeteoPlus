import { Box, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Link,
  Avatar,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Modal,
  Input,
  Image,
  useToast,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import image from "../assets/image/Beautiful Weather.jpg";

function HomePage() {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  const [loadingCreateWidgets, setLoadingCreateWidgets] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [taille, setTaille] = useState('SMALL');
  const [ville, setVille] = useState('');

  const toast = useToast()

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 6);
  const [email, setEmail] = useState("");
  const toast = useToast();

  const sendInvit = async () => {
    if(email === ""){
      toast({
        title: "Erreur lors de l'envoi de l'invitation",
        description: "L'adresse mail est vide",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios.post("https://meteoplus.fly.dev/invits", {
      email: email,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response);
      closeModal();
      toast({
        title: "Invitation envoyée avec succès",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    })
    .catch((error) => {
      console.error(error);
      toast({
        title: "Erreur lors de l'envoi de l'invitation",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    });
};

  const getWigets = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch("https://meteoplus.fly.dev/widgets", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        'Access-Control-Allow-Origin': '*'
      }
    })

    const widgets: any[] = await response.json()

    setWidgets(widgets)

    setLoadingWidgets(false)

    setWidgets(await Promise.all(widgets.map(async (widget: { id: number, displayName: string, latitude: string, longitude: string }) => {
      const weather = await getWeather(widget.latitude, widget.longitude)

      const year = selectedDate.getFullYear()
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
      const day = selectedDate.getDate().toString().padStart(2, '0')
      const hours = selectedDate.getHours().toString().padStart(2, '0')

      const date = `${year}-${month}-${day}T${hours}:00`

      return {
        ...widget,
        temperature: weather.hourly.temperature_2m[weather.hourly.time.indexOf(date) + 1],
        humidity: weather.hourly.relativehumidity_2m[weather.hourly.time.indexOf(date) + 1],
        wind: weather.hourly.windspeed_10m[weather.hourly.time.indexOf(date) + 1]
      }
    })));
  }

  const getWeather = async (lat: string, long: string) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m&timezone=Europe%2FLondon`, {
      method: "GET",
    })

    return await response.json()
  }

    setWeatherData(await response.json());
  };

  const getCity = async () => {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=1&language=fr&format=json`)
      const data = await response.json()

      return data.results?.[0]
    } catch (e) {
      console.error(e);
      return null
    }
  }

  const createWidget = async (e: any) => {
    e.preventDefault();
    setLoadingCreateWidgets(true);

    const city = await getCity()

    if (!city) {
      setLoadingCreateWidgets(false);

      return toast({
        title: 'La ville n\'a pas été trouvé',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    const token = localStorage.getItem('token')

    await fetch("https://meteoplus.fly.dev/widgets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: city.latitude,
        longitude: city.longitude,
        size: taille,
        displayName: `${city.name}${!!city.country ? ` (${city.country})` : ''}`,
      })
    })

    await getWigets()

    setLoadingCreateWidgets(false);
  };

  useEffect(() => {
    getWigets()
  }, [selectedDate]);


  return (
    <div>
      <Image src={image} position={"absolute"} zIndex={-10} h={"100vh"} w={"100%"}></Image>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1rem"
        backgroundColor="#e0e0e050"
        backdropBlur={"blur(30px)"}
      >
        <Flex justify="space-between" width="15%">
          <Link href="/about" color="white" textDecoration="none">
            Tableau de bord
          </Link>
          <Link href="/contact" color="white" textDecoration="none">
            Autre
          </Link>
        </Flex>
        <Flex>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => handleDateChange(date)}
          isClearable
          minDate={currentDate}
          maxDate={maxDate}
          showYearDropdown
          showMonthDropdown
          showTimeSelect
          dateFormat="dd/MM/yyyy-HH'h'"
        />
        </Flex>
        <Flex justify="space-between">
          <Link onClick={openModal} color="white" textDecoration="none">
            <Text mr={10} fontSize={20}>
              Inviter
            </Text>
          </Link>
          <Link href="/profile" color="white" textDecoration="none">
            <Avatar bg="#CBD5E0" boxSize={7} />
          </Link>
        </Flex>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={25} fontWeight={"bold"}>
            Créer une Invitation
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} alignItems={"center"}>
              <Box
                w={"80%"}
                h={1}
                bg={"#0E487D"}
                mt={"-10px"}
                mb={"20px"}
                borderRadius={"full"}
              />
              <Text alignSelf={"baseline"} fontSize={20} fontWeight={"bold"}>
                Insérer addresse mail{" "}
              </Text>
              <Input
                mt={5}
                mb={5}
                placeholder="Addresse mail"
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Button alignSelf={"end"} mt={"20px"} onClick={sendInvit}>
                Inviter
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex
        display="flex"
        justify="space-evenly"
        flexWrap="wrap"
      >

        {loadingWidgets ? (
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        ) : widgets.length > 0 ? widgets.map((widget: any) => (
          <Box
            bg="#e0e0e010"
            backdropFilter={"blur(30px)"}
            boxShadow="-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"
            borderRadius={20}
            p={4}
            width={widget.size === "SMALL" ? "15%" : "40%"}
            h="200px"
            margin="50px"
            flexDirection="row"
            justifyContent="space-evenly"
            display="flex"
            alignItems="center"
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ marginLeft: "10px" }}>
                <p style={{ fontSize: "20px" }}>{widget.displayName}</p>
                <p style={{ fontSize: "35px", fontWeight: "bold" }}>{!widget.temperature ? <Spinner /> : widget.temperature}°C</p>
              </div>
            </div>
            {widget.size !== "SMALL" && (
              <div style={{ fontSize: "20px", textAlign: "left", lineHeight: "40px" }}>
                <p>Humidité : {!widget.humidity ? <Spinner /> : widget.humidity}%</p>
                <p>Vent : {!widget.wind ? <Spinner /> : widget.wind}km/h</p>
              </div>
            )}
          </Box>
        )) : <p>Vous n'avez pas encore de widgets.</p>}

        <Box
          bg={"#e0e0e010"}
          backdropFilter={"blur(30px)"}
          borderRadius={20}
          p={4}
          width="15%"
          h="200px"
          textAlign="center"
          display="flex"
          margin="50px"
          flexDirection="column"
          justifyContent="space-evenly"
        >
          <div style={{ marginLeft: "10px" }}>
            <h1>Créer un Widget</h1>
            {loadingCreateWidgets ? (
              <Spinner />
            ) : (
              <form onSubmit={createWidget}>
                <div>
                  <label htmlFor="taille">Taille :</label>
                  <select
                    name="taille"
                    id="taille"
                    value={taille}
                    onChange={(e) => setTaille(e.target.value)}
                  >
                    <option value="SMALL">Petit</option>
                    <option value="MEDIUM">Grand</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ville">Ville :</label>
                  <input
                    type="text"
                    name="ville"
                    id="ville"
                    placeholder="Nom de la ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                  />
                </div>

                <div>
                  <button type="submit">Créer Widget</button>
                </div>
              </form>
            )}
          </div>
        </Box>
      </Flex>
    </div>
  );
}

export default HomePage;
