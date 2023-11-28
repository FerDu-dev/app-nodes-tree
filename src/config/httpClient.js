import axios from "axios"; 

const httpClient = axios.create({
    baseURL: 'https://api-graph.tests.grupoapok.com/api',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
});
  

export default httpClient;