import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
  }
  
  const create = newObject => {
    return axios.post(baseUrl, newObject)
  }
  
  const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
  }

  const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
  }

  const all = (props) => {
    return axios.all(props)
  }

  const spread = (props) => {
    return axios.spread(props)
  }

const exportedObject = {
    getAll,
    create,
    update,
    remove,
    all,
    spread
}

export default exportedObject