/**
 * POST hook to insert a new rating
 */

import { Rating } from "@common//types";
import axios from "axios";

import { API_URL } from "../config";

const fetcher = (url: string, body: Rating) =>
  axios.post(url, body).then((res) => res.data);

const setInsertRating = (roomID: string, rating: Rating) => {
  const response = fetcher(API_URL + "/rating/rate/" + roomID, rating);
  return {
    response,
  };
};

export default setInsertRating;
