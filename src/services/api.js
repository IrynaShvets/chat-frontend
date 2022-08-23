import Axios from "axios";

export const api = async () => {
  const response = await Axios.get("https://api.chucknorris.io/jokes/random");
  return response.data;
};
