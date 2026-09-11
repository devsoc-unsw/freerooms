/**
 * POST hook to insert a new rating
 */

import { Rating } from "@common//types";
import { API_URL } from "@frontend/config";
import axios from "axios";

const fetcher = (url: string, body: Rating) =>
  axios.post(url, body).then((res) => res.data);

const setInsertRating = (
  roomID: string,
  buildingID: string,
  rating: Rating
) => {
  const response = fetcher(
    API_URL + "/rating/rate/" + buildingID + "/" + roomID,
    rating
  );
  return {
    response,
  };
};

export default setInsertRating;
