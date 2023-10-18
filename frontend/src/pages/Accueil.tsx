import {
  Box,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Button, Flex, Link, Avatar, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Modal, Divider } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';



function HomePage() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date | null) => {
    if (!date) return
    setSelectedDate(date);
  };

  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 6);

  const year = selectedDate.getFullYear();
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0, donc ajoutez 1
  const day = selectedDate.getDate().toString().padStart(2, '0');
  const hours = selectedDate.getHours().toString().padStart(2, '0');

  const date = `${year}-${month}-${day}T${hours}:00`;


  const [widgets, setWidgets] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);


  const [weatherData, setWeatherData] = useState<any>(null);

  const getWigets = async () => {
    const response = await fetch("https://meteoplus.fly.dev/widgets", {
      method: "GET",
      headers: {
        "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJqdWxlc3NvcmVuc0BnbWFpbC5jb20iLCJuYW1lIjoiSnVsZXMiLCJpYXQiOjE2OTc2MjExNTMsImV4cCI6MTcyOTE1NzE1M30.N-PAEuikOLqyhV7JZWsWMzcos4fz3M3Bs-LlO_lgD-fkhcMfPfholzDZX0RPBM8a-sYCI5IjY8mh_KGKulrgxP45lWwYDdVFP8Se_-Mw7M6MEmzbFpndUdl7FEnR4lKDBJE8-Vs09fEeYXWHvdtXx9dQzxWQzDt3VVBhL67DKyARRFFl97WNwS75rL7RceKSacvs3GV-Xzm2oXpurCWqJSgPZ22Lc7v_SRsHXr49CRuB2aD9k7hs4X5IH-ddYFHN96csAiEELKGrFQa06tJD5nR-p_CJizKrrWC32BzI25ptYrskARZlaUiFlt3uFQ5ZfteHUe_S87n-apfASi1cbw",
        "ngrok-skip-browser-warning": "*",
        'Access-Control-Allow-Origin': '*'
      }
    })
    console.log(await response.json())
  }

  const getWeather = async () => {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.6495&longitude=3.113&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m&timezone=Europe%2FLondon", {
      method: "GET",
    })

    setWeatherData(await response.json())
  }


  const getcity = async () => {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=1&language=fr&format=json`, {
      method: "GET",
    })

    setCityData(await response.json())
    console.log(JSON.stringify(cityData.latitude))
  }


  const [taille, setTaille] = useState('petit');
  const [ville, setVille] = useState('');
  const [cityData, setCityData] = useState<any>(null);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validez les données ici, par exemple, vérifiez si la ville existe et si son nom commence par une majuscule.

    if (ville && /^[A-Z][a-z]*$/.test(ville)) {
      // Effectuez ici ce que vous souhaitez avec les données valides, par exemple, envoyez-les au serveur.
      console.log(`Taille : ${taille}, Ville : ${ville}`);
      getcity()
      const response = fetch("https://meteoplus.fly.dev/widgets", {
        method: "POST",
        headers: {
          "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJqdWxlc3NvcmVuc0BnbWFpbC5jb20iLCJuYW1lIjoiSnVsZXMiLCJpYXQiOjE2OTc2MjExNTMsImV4cCI6MTcyOTE1NzE1M30.N-PAEuikOLqyhV7JZWsWMzcos4fz3M3Bs-LlO_lgD-fkhcMfPfholzDZX0RPBM8a-sYCI5IjY8mh_KGKulrgxP45lWwYDdVFP8Se_-Mw7M6MEmzbFpndUdl7FEnR4lKDBJE8-Vs09fEeYXWHvdtXx9dQzxWQzDt3VVBhL67DKyARRFFl97WNwS75rL7RceKSacvs3GV-Xzm2oXpurCWqJSgPZ22Lc7v_SRsHXr49CRuB2aD9k7hs4X5IH-ddYFHN96csAiEELKGrFQa06tJD5nR-p_CJizKrrWC32BzI25ptYrskARZlaUiFlt3uFQ5ZfteHUe_S87n-apfASi1cbw",
          "ngrok-skip-browser-warning": "*",
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude: 50, longitude: 10, size: taille })
      })
    } else {
      console.error('Les données du formulaire sont incorrectes.');
    }
  };


  useEffect(() => {
    getWigets()
    getWeather()
    console.log(selectedDate);
  }, []);


  return (
    <div>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1rem"
        borderBottom="1px solid #e0e0e0"
        backgroundColor="teal.500"
      >
        <Flex justify="space-between" width="15%">
          <Link href="/about" color="white" textDecoration="none" >
            Tableau de bord
          </Link>
          <Link href="/contact" color="white" textDecoration="none">
            Autre
          </Link>
        </Flex>
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
        <Flex justify="space-between" width="4.5%">
          <Link onClick={openModal} color="white" textDecoration="none">
            <EmailIcon boxSize={7} />
          </Link>
          <Link href="/profile" color="white" textDecoration="none">
            <Avatar bg='#CBD5E0' boxSize={7} />
          </Link>
        </Flex>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Messages</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Demande d'invitation : Jules vous à inviter à rejoindre son tableau de bord !</p>
            <Divider my={3} />
            <p>Demande d'invitation : Hugo vous à inviter à rejoindre son tableau de bord !</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex
        display="flex"
        justify="space-evenly"
        flexWrap="wrap"
      >

        <Box
          bg="#e0e0e0"
          boxShadow="-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"
          borderRadius={20}
          p={4}
          width="40%"
          h="200px"
          margin="50px"
          flexDirection="row"
          justifyContent="space-evenly"
          display="flex"
          alignItems="center"
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginLeft: "10px" }}>
              <p style={{ fontSize: "20px" }}>VILLE</p>
              <p style={{ fontSize: "35px", fontWeight: "bold" }}>{weatherData == null ? "chargement" : JSON.stringify(weatherData.hourly.temperature_2m[weatherData.hourly.time.indexOf(date) + 1])}°C</p>
            </div>
          </div>
          <div style={{ fontSize: "20px", textAlign: "left", lineHeight: "40px" }}>
            <p>Humidité : {weatherData == null ? "chargement" : JSON.stringify(weatherData.hourly.relativehumidity_2m[weatherData.hourly.time.indexOf(date) + 1])}%</p>
            <p>Vent : {weatherData == null ? "chargement" : JSON.stringify(weatherData.hourly.windspeed_10m[weatherData.hourly.time.indexOf(date) + 1])}Km/h</p>
          </div>
        </Box>

        <Box
          bg={"#e0e0e0"}
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
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
            <p style={{ fontSize: "20px" }}>VILLE</p>
            <p style={{ fontSize: "35px", fontWeight: "bold" }}>{weatherData == null ? "chargement" : JSON.stringify(weatherData.hourly.temperature_2m[weatherData.hourly.time.indexOf(date) + 1])}°C</p>
          </div>
        </Box>


        <Box
          bg={"#e0e0e0"}
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
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
            <form onSubmit={handleSubmit}>
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
          </div>
        </Box>

      </Flex>

    </div>

  );
}

export default HomePage;