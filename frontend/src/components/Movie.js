import React from "react";
import axios from "axios";
import { useState } from "react";
import CardsCarousel from "./CardsCarousel";
import { useEffect } from "react";
import Loading from "./Loading";
import { BACKEND_URL } from "../constants";

export default function Movie() {
  const [movie, setMovie] = useState({});

  useEffect(() => {
    console.log(movie);
  }, [movie]);

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    const genres = [
      "Action",
      "Sports",
      "Award Winning",
      "Drama",
      "Mystery",
      "Romance",
      "Comedy",
      "Adventure",
      "Fantasy",
      "Sci-Fi",
      "Slice of Life",
    ].sort(() => Math.random() - 0.5);

    const requests = genres.map((genre) =>
      axios.get(`${BACKEND_URL}/movie/${genre}`)
    );

    Promise.all(requests)
      .then((res) => {
        console.log(res.data);
        for (const genreIndex in genres) {
          setMovie((prevAnime) => ({
            ...prevAnime,
            [genres[genreIndex]]: res[genreIndex].data.results.sort(
              () => Math.random() - 0.5
            ),
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const fetchData = async () => {
      try {
        const popular = await axios.get(
          "https://api.jikan.moe/v4/top/anime?type=movie&sfw&filter=bypopularity"
        );
        setMovie((prevAnime) => ({
          "Most Popular": popular.data.data,
          ...prevAnime,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (Object.keys(movie).length < 12) {
    return <Loading />;
  }

  return (
    <div>
      {Object.entries(movie).map(([genre, anime]) => (
        <CardsCarousel key={genre} carouselTitle={genre} animeList={anime} />
      ))}
    </div>
  );
}
