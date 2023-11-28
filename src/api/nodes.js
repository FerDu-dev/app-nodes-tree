import httpClient from "../config/httpClient"

export const createNode = async (data) => {
    try {
      const response = await  httpClient.post('/node', data)
      alert("node created");
      return response.data
    } catch (e) {
        alert("Can't create a child node");
      console.log("Error during the fetching", e)
    }
}


export const getNodes = async () => {
    try {
      const response = await  httpClient.get('/nodes')
      return response.data
    } catch (e) {
        alert("Can't create a child node");
      console.log("Error during the fetching", e)
    }
}

export const getNode = async (id) => {
    try {
      const response = await  httpClient.get(`/node/${id}`)
      return response.data
    } catch (e) {
      
      console.log("Error during the fetching", e)
    }
}

export const getChildNodes = async (id) => {
    try {
      const response = await  httpClient.get(`/nodes?parent=${id}`)
      return response.data
    } catch (e) {
      alert("Can't load a child node");
      console.log("Error during the fetching", e)
    }
}

export const getLocales = async () => {
    try {
      const response = await  httpClient.get('/locales')
      return response.data
    } catch (e) {
      console.log("Error during the fetching", e)
    }
}

export const translateChildNode = async (childId, locale) => {
    try {
      const response = await  httpClient.get(`/node/${childId}?locale=${locale}`)
      return response.data
    } catch (e) {
     
      console.log("Error during the fetching", e)
    }
}


export const deleteNode = async (id) => {
    try {
      const response = await  httpClient.delete(`/node/${id}`)
      return response.data
    } catch (e) {
        alert("Can't delete a parent node");
        console.log("Error during the fetching", e)
    }
}


