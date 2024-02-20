exports.init = function () {
    meteoConf = {
        cleApi: Config.modules.Meteo.cleApi,
    };
};

exports.action = function (data, callback) {
    let client = setClient(data);
    info("Meteo from:", data.client, "To:", client);
    meteo(data, client, callback);
};

function meteo(data, client) {

    if (!meteoConf.cleApi) {
      Avatar.speak(`La configuration de météo est manquante`, data.client, () => {
          Avatar.Speech.end(data.client);
        });
      return;
    }
  
    async function climat() {
      let city;
      try {
        const locationResponse = await fetch('http://ip-api.com/json/');
        if (!locationResponse.ok) {
          throw new Error(`Code erreur: ${locationResponse.status}`);
        }
        const locationData = await locationResponse.json();
        city = locationData.city;
      } catch (error) {
        Avatar.speak(`Je n'arrive pas à obtenir la localisation de la ville: ${error.message}`, data.client, () => {
          Avatar.Speech.end(data.client);
        });
        return;
      }
  
      let location = data.action.rawSentence.replace("quelle est la météo à", "").replace("donne-moi la météo à", "").replace("quelle est la météo", "").replace("donne-moi la météo", "").replace("la météo", "").replace("météo", "").replace("à", "").trim();
      let query = (location !== "") ? location : city;
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query.toLowerCase().replace("é", "e")}&lang=fr&appid=${meteoConf.cleApi}&units=metric`;
  
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Code erreur: ${response.status}`);
        }
  
        const meteoData = await response.json();

       if (location) {
          Avatar.speak(`Météo pour ${location}, Temps: ${meteoData.weather[0].description}, la température est de ${Math.round(meteoData.main.temp)} degrés, la vitesse du vent est de ${Math.round(meteoData.wind.speed)} km/h, les températures prévues entre ${Math.round(meteoData.main.temp_min)} et ${Math.round(meteoData.main.temp_max)} degrés`, data.client, () => {
            Avatar.Speech.end(data.client);
          });
        } else {
          Avatar.speak(`Météo pour ${city}. Temps: ${meteoData.weather[0].description}, la température est de ${Math.round(meteoData.main.temp)} degrés, la vitesse du vent est de ${Math.round(meteoData.wind.speed)} km/h, les températures prévues entre ${Math.round(meteoData.main.temp_min)} et ${Math.round(meteoData.main.temp_max)} degrés`, data.client, () => {
            Avatar.Speech.end(data.client);
          });
        }
      } catch (error) {
        Avatar.speak(`Je n'arrive pas à accéder au site météo: ${error.message}`, data.client, () => {
          Avatar.Speech.end(data.client);
        });
        return;
      }
    }
    climat();
  }
  

function setClient(data) {
    let client = data.client;
    if (data.action.room)
        client = (data.action.room !== 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
    if (data.action.setRoom)
        client = data.action.setRoom;
    return client;
}