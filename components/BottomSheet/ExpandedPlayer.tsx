import { View, StyleSheet, Image, Pressable, Dimensions, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useEffect, useState, useRef } from 'react';
import { expandedPlayerStyles as styles } from '@/styles/expanded-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import movies from '@/data/movies.json';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

interface MovieData {
    id?: string;
    title: string;
    year: string;
    duration: string;
    rating: string;
    description: string;
    cast: string[];
    director: string;
    videoUrl: string;
}

interface ExpandedPlayerProps {
    scrollComponent?: (props: any) => React.ReactElement;
    movieData: MovieData;
}

interface PlaybackStatus {
    isLoaded: boolean;
    positionMillis: number;
    durationMillis: number;
}

interface VideoRef {
    setOnPlaybackStatusUpdate: (callback: (status: PlaybackStatus) => void) => void;
    setPositionAsync: (position: number) => void;
}

export function ExpandedPlayer({ scrollComponent, movieData }: ExpandedPlayerProps) {
    const ScrollComponentToUse = scrollComponent || ScrollView;
    const insets = useSafeAreaInsets();
    const videoRef = useRef<Video | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(100);
    const [duration, setDuration] = useState(0);

    const onPlaybackStatusUpdate = (status: PlaybackStatus) => {
        if (status.isLoaded) {
            progress.value = status.positionMillis;
            setDuration(status.durationMillis);
            max.value = status.durationMillis;
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }
    }, []);

    return (
        <LinearGradient
            colors={['#1f1f1f', '#121212']}
            style={[styles.rootContainer, { marginTop: insets.top }]}
        >
            <View style={styles.videoContainer}>
                <Video
                    ref={videoRef}
                    style={styles.video}
                    source={{ uri: movieData?.videoUrl ?? 'https://videos.pexels.com/video-files/4865386/4865386-uhd_2732_1440_25fps.mp4' }}
                    useNativeControls={false}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    isMuted={isMuted}
                    shouldPlay
                />
                <View style={styles.videoOverlay}>
                    <Pressable
                        style={styles.closeButton}
                        onPress={() => {/* handle close */ }}
                    >
                        <Ionicons name="close-outline" size={26} color="white" />
                    </Pressable>
                </View>
                <View style={styles.muteOverlay}>
                    <Pressable
                        style={styles.soundButton}
                        onPress={() => setIsMuted(!isMuted)}
                    >
                        <Ionicons
                            name={isMuted ? "volume-mute" : "volume-medium"}
                            size={18}
                            color="white"
                        />
                    </Pressable>
                </View>
                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        progress={progress}
                        minimumValue={min}
                        maximumValue={max}
                        onValueChange={(value) => {
                            if (videoRef.current) {
                                videoRef.current.setPositionAsync(value);
                            }
                        }}
                        theme={{
                            minimumTrackTintColor: '#db0000',
                            // maximumTrackTintColor: 'rgba(255, 255, 255, 0.795)',
                            bubbleBackgroundColor: '#db0000',
                        }}
                        thumbWidth={5}
                        sliderHeight={5}
                        containerStyle={styles.sliderInner}
                        disableTrackFollow={false}
                        disableTapEvent={false}
                    />
                </View>
            </View>

            <ScrollComponentToUse
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    <ThemedText style={styles.title}>{movieData?.title || "Movie Title"}</ThemedText>

                    <View style={styles.metaInfo}>
                        <ThemedText style={styles.year}>{movieData?.year || "2024"}</ThemedText>
                        <ThemedText style={styles.duration}>{movieData?.duration || "2h 7m"}</ThemedText>
                        <ThemedText style={styles.rating}>{movieData?.rating || "TV-MA"}</ThemedText>
                        <ThemedText style={styles.quality}>HD</ThemedText>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.playButton}>
                            <Ionicons name="play" size={24} color="black" />
                            <ThemedText style={styles.playButtonText}>Play</ThemedText>
                        </Pressable>

                        <Pressable style={styles.downloadButton}>
                            <Ionicons name="download" size={20} color="white" />
                            <ThemedText style={styles.downloadButtonText}>Download</ThemedText>
                        </Pressable>
                    </View>

                    <ThemedText style={styles.description}>
                        {movieData?.description || "In this suspenseful drama, a police officer investigates a challenging case involving twin sisters."}
                    </ThemedText>

                    <View style={styles.castInfo}>
                        <ThemedText style={styles.castLabel}>Cast: </ThemedText>
                        <ThemedText style={styles.castText}>
                            {movieData?.cast?.join(', ') || "Kajol, Kriti Sanon, Shaheer Sheikh"}
                        </ThemedText>
                    </View>

                    <View style={styles.directorInfo}>
                        <ThemedText style={styles.directorLabel}>Director: </ThemedText>
                        <ThemedText style={styles.directorText}>
                            {movieData?.director || "Shashanka Chaturvedi"}
                        </ThemedText>
                    </View>

                    <View style={styles.actionButtons}>
                        <Pressable style={styles.actionButton}>
                            <Ionicons name="add" size={24} color="white" />
                            <ThemedText style={styles.actionButtonText}>My List</ThemedText>
                        </Pressable>
                        <Pressable style={styles.actionButton}>
                            <Ionicons name="thumbs-up" size={24} color="white" />
                            <ThemedText style={styles.actionButtonText}>Rate</ThemedText>
                        </Pressable>
                        <Pressable style={styles.actionButton}>
                            <Ionicons name="share-social" size={24} color="white" />
                            <ThemedText style={styles.actionButtonText}>Share</ThemedText>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.moreLikeThis}>
                    <ThemedText style={styles.moreLikeThisTitle}>More Like This</ThemedText>
                    <View style={styles.movieGrid}>
                        {movies.movies[0].movies.slice(0, 6).map((movie, index) => (
                            <View key={movie.id} style={styles.moviePoster}>
                                <Image
                                    source={{ uri: movie.imageUrl }}
                                    style={{ width: '100%', height: '100%', borderRadius: 4 }}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollComponentToUse>
        </LinearGradient>
    );
}

