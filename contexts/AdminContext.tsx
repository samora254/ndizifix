import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { videos as initialVideos, series as initialSeries, Video, Series, Episode } from '@/mocks/videos';

const MOVIES_STORAGE_KEY = '@admin_movies';
const SERIES_STORAGE_KEY = '@admin_series';

function parseVideoUrl(url: string): { type: 'youtube' | 'gdrive' | 'aws' | 'direct'; originalUrl: string; playableUrl: string; warning?: string } {
  const trimmedUrl = url.trim();
  
  if (trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be')) {
    let videoId = '';
    
    if (trimmedUrl.includes('youtu.be/')) {
      videoId = trimmedUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (trimmedUrl.includes('youtube.com')) {
      const urlParams = new URLSearchParams(trimmedUrl.split('?')[1] || '');
      videoId = urlParams.get('v') || '';
    }
    
    console.warn('[AdminContext] ⚠️ YouTube videos cannot be played in expo-av Video component due to YouTube TOS restrictions.');
    console.log('[AdminContext] 💡 YouTube URL detected. Consider using a direct video file URL (AWS S3, direct MP4 link) instead.');
    
    return {
      type: 'youtube',
      originalUrl: trimmedUrl,
      playableUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : trimmedUrl,
      warning: 'YouTube videos cannot be played directly. Use AWS S3 or direct video URLs.',
    };
  }
  
  if (trimmedUrl.includes('drive.google.com')) {
    let fileId = '';
    
    if (trimmedUrl.includes('/file/d/')) {
      fileId = trimmedUrl.split('/file/d/')[1]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('id=')) {
      const urlParams = new URLSearchParams(trimmedUrl.split('?')[1] || '');
      fileId = urlParams.get('id') || '';
    } else if (trimmedUrl.includes('/open?id=')) {
      fileId = trimmedUrl.split('/open?id=')[1]?.split('&')[0] || '';
    }
    
    console.warn('[AdminContext] ⚠️ Google Drive direct video streaming is unreliable for large files.');
    console.log('[AdminContext] 💡 For videos: Consider using AWS S3 or direct MP4 URLs for better reliability.');
    console.log('[AdminContext] 💡 For thumbnails: Make sure the file is publicly shared and use the preview format.');
    
    return {
      type: 'gdrive',
      originalUrl: trimmedUrl,
      playableUrl: fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : trimmedUrl,
      warning: 'Google Drive streaming can be slow/unreliable. AWS S3 is recommended for videos.',
    };
  }
  
  if (trimmedUrl.includes('amazonaws.com') || trimmedUrl.includes('.s3.')) {
    console.log('[AdminContext] ✅ AWS S3 URL detected - optimal for video streaming');
    return {
      type: 'aws',
      originalUrl: trimmedUrl,
      playableUrl: trimmedUrl,
    };
  }
  
  console.log('[AdminContext] Direct URL detected:', trimmedUrl.substring(0, 50));
  return {
    type: 'direct',
    originalUrl: trimmedUrl,
    playableUrl: trimmedUrl,
  };
}

function parseThumbnailUrl(url: string): string {
  const trimmedUrl = url.trim();
  
  if (trimmedUrl.includes('drive.google.com')) {
    let fileId = '';
    
    if (trimmedUrl.includes('/file/d/')) {
      fileId = trimmedUrl.split('/file/d/')[1]?.split('/')[0] || '';
    } else if (trimmedUrl.includes('id=')) {
      const urlParams = new URLSearchParams(trimmedUrl.split('?')[1] || '');
      fileId = urlParams.get('id') || '';
    } else if (trimmedUrl.includes('/open?id=')) {
      fileId = trimmedUrl.split('/open?id=')[1]?.split('&')[0] || '';
    }
    
    if (fileId) {
      console.log('[AdminContext] Converting Google Drive thumbnail to thumbnail view format');
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }
  }
  
  return trimmedUrl;
}

export const [AdminProvider, useAdmin] = createContextHook(() => {
  const [movies, setMovies] = useState<Video[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [movies, series, isLoaded]);

  const loadData = async () => {
    try {
      const [storedMovies, storedSeries] = await Promise.all([
        AsyncStorage.getItem(MOVIES_STORAGE_KEY),
        AsyncStorage.getItem(SERIES_STORAGE_KEY),
      ]);

      if (storedMovies) {
        setMovies(JSON.parse(storedMovies));
      } else {
        setMovies(initialVideos);
      }

      if (storedSeries) {
        setSeries(JSON.parse(storedSeries));
      } else {
        setSeries(initialSeries);
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('[AdminContext] Error loading data:', error);
      setMovies(initialVideos);
      setSeries(initialSeries);
      setIsLoaded(true);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(movies)),
        AsyncStorage.setItem(SERIES_STORAGE_KEY, JSON.stringify(series)),
      ]);
      console.log('[AdminContext] Data saved successfully');
    } catch (error) {
      console.error('[AdminContext] Error saving data:', error);
    }
  };

  const addMovie = (movie: Omit<Video, 'id'>) => {
    const parsedVideo = parseVideoUrl(movie.videoUrl);
    const parsedThumbnail = parseThumbnailUrl(movie.thumbnail);
    
    const newMovie: Video = {
      ...movie,
      id: Date.now().toString(),
      videoUrl: parsedVideo.playableUrl,
      thumbnail: parsedThumbnail,
    };
    
    if (parsedVideo.warning) {
      console.warn(`[AdminContext] Movie "${movie.title}" - ${parsedVideo.warning}`);
    }
    
    setMovies((prev) => [newMovie, ...prev]);
  };

  const updateMovie = (id: string, updates: Partial<Video>) => {
    setMovies((prev) =>
      prev.map((movie) => {
        if (movie.id === id) {
          const updatedMovie = { ...movie, ...updates };
          if (updates.videoUrl) {
            const parsedVideo = parseVideoUrl(updates.videoUrl);
            updatedMovie.videoUrl = parsedVideo.playableUrl;
            if (parsedVideo.warning) {
              console.warn(`[AdminContext] Movie update "${movie.title}" - ${parsedVideo.warning}`);
            }
          }
          if (updates.thumbnail) {
            updatedMovie.thumbnail = parseThumbnailUrl(updates.thumbnail);
          }
          return updatedMovie;
        }
        return movie;
      })
    );
  };

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  const addSeries = (seriesData: Omit<Series, 'id'>) => {
    const newSeries: Series = {
      ...seriesData,
      id: `s${Date.now()}`,
      thumbnail: parseThumbnailUrl(seriesData.thumbnail),
      seasons: seriesData.seasons.map((season) => ({
        ...season,
        episodes: season.episodes.map((episode) => ({
          ...episode,
          videoUrl: parseVideoUrl(episode.videoUrl).playableUrl,
          thumbnail: parseThumbnailUrl(episode.thumbnail),
        })),
      })),
    };
    setSeries((prev) => [newSeries, ...prev]);
  };

  const updateSeries = (id: string, updates: Partial<Series>) => {
    setSeries((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updatedSeries = { ...s, ...updates };
          if (updates.thumbnail) {
            updatedSeries.thumbnail = parseThumbnailUrl(updates.thumbnail);
          }
          if (updates.seasons) {
            updatedSeries.seasons = updates.seasons.map((season) => ({
              ...season,
              episodes: season.episodes.map((episode) => ({
                ...episode,
                videoUrl: parseVideoUrl(episode.videoUrl).playableUrl,
                thumbnail: parseThumbnailUrl(episode.thumbnail),
              })),
            }));
          }
          return updatedSeries;
        }
        return s;
      })
    );
  };

  const deleteSeries = (id: string) => {
    setSeries((prev) => prev.filter((s) => s.id !== id));
  };

  const addEpisodeToSeries = (seriesId: string, seasonNumber: number, episode: Omit<Episode, 'id'>) => {
    setSeries((prev) =>
      prev.map((s) => {
        if (s.id === seriesId) {
          const updatedSeasons = s.seasons.map((season) => {
            if (season.seasonNumber === seasonNumber) {
              const newEpisode: Episode = {
                ...episode,
                id: `${seriesId}s${seasonNumber}e${Date.now()}`,
                videoUrl: parseVideoUrl(episode.videoUrl).playableUrl,
                thumbnail: parseThumbnailUrl(episode.thumbnail),
              };
              return {
                ...season,
                episodes: [...season.episodes, newEpisode],
              };
            }
            return season;
          });

          const seasonExists = updatedSeasons.some((s) => s.seasonNumber === seasonNumber);
          if (!seasonExists) {
            const newEpisode: Episode = {
              ...episode,
              id: `${seriesId}s${seasonNumber}e${Date.now()}`,
              videoUrl: parseVideoUrl(episode.videoUrl).playableUrl,
              thumbnail: parseThumbnailUrl(episode.thumbnail),
            };
            updatedSeasons.push({
              seasonNumber,
              episodes: [newEpisode],
            });
            updatedSeasons.sort((a, b) => a.seasonNumber - b.seasonNumber);
          }

          return { ...s, seasons: updatedSeasons };
        }
        return s;
      })
    );
  };

  const updateEpisode = (seriesId: string, seasonNumber: number, episodeId: string, updates: Partial<Episode>) => {
    setSeries((prev) =>
      prev.map((s) => {
        if (s.id === seriesId) {
          return {
            ...s,
            seasons: s.seasons.map((season) => {
              if (season.seasonNumber === seasonNumber) {
                return {
                  ...season,
                  episodes: season.episodes.map((ep) => {
                    if (ep.id === episodeId) {
                      const updatedEpisode = { ...ep, ...updates };
                      if (updates.videoUrl) {
                        updatedEpisode.videoUrl = parseVideoUrl(updates.videoUrl).playableUrl;
                      }
                      if (updates.thumbnail) {
                        updatedEpisode.thumbnail = parseThumbnailUrl(updates.thumbnail);
                      }
                      return updatedEpisode;
                    }
                    return ep;
                  }),
                };
              }
              return season;
            }),
          };
        }
        return s;
      })
    );
  };

  const deleteEpisode = (seriesId: string, seasonNumber: number, episodeId: string) => {
    setSeries((prev) =>
      prev.map((s) => {
        if (s.id === seriesId) {
          return {
            ...s,
            seasons: s.seasons.map((season) => {
              if (season.seasonNumber === seasonNumber) {
                return {
                  ...season,
                  episodes: season.episodes.filter((ep) => ep.id !== episodeId),
                };
              }
              return season;
            }),
          };
        }
        return s;
      })
    );
  };

  return {
    movies,
    series,
    isLoaded,
    addMovie,
    updateMovie,
    deleteMovie,
    addSeries,
    updateSeries,
    deleteSeries,
    addEpisodeToSeries,
    updateEpisode,
    deleteEpisode,
  };
});
