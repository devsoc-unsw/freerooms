import { Rating } from "@common/types";
import { API_URL } from "@frontend/config";
import axios from "axios";

const insertRating = (roomID: string, buildingID: string, rating: Rating) => {
  const response = axios
    .post(`${API_URL}/rating/rate/${buildingID}/${roomID}`, rating)
    .then((res) => res.data);

  return { response };
};

export default insertRating;
