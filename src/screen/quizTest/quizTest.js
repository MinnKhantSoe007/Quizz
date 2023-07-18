import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Modal, Image, Dimensions } from "react-native";
import { styles } from "./quizTest.style";
import { Ionicons } from '@expo/vector-icons';
import { DATA } from '../../data/quizData';
import { useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { ImageResource } from "../../resource/imageResource";
import Carousel from "react-native-snap-carousel";
import { TouchableRipple } from "react-native-paper";
import { useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function QuizTest({ navigation }) {

    const allQuestions = DATA;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
    const [correctOption, setCorrectOption] = useState(null);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [score, setScore] = useState(0);
    const [continueButton, setContinueButton] = useState(false);
    const [scoreModal, setScoreModal] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0)
    const carouselRef = useRef(null)

    const renderItem = ({ item, index }) => {
        console.log("Item ::", item);
        return (
            <View style={{ height: Dimensions.get('window').height * 0.7, borderRadius: 10, backgroundColor: '#fff' }}>
                <View style={{ minHeight: 100 }}>
                    <Text style={styles.number}>
                        {item.question}
                    </Text>
                </View>
                <View>
                    {item.options.map((item, index) => (
                        <TouchableRipple onPress={() => { carouselRef.current.snapToNext()}} key={index} borderless={true} style={{ margin: 15, borderRadius: 10 }}>
                            <View style={styles.answer_container}>
                                <Text style={styles.answer}>{index +1}. {item}</Text>
                            </View>
                        </TouchableRipple>
                    ))}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.quiz_container}>
                <LinearGradient colors={["#fff", "#5E60CE"]} style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                        {[...Array(allQuestions.length ?? 0)].map((_, i) => {
                            return (
                                <View key={i} style={styles.indicatorStyle(i == activeIndex)}>
                                    <Text style={styles.indicatorText(i == activeIndex)}>{i + 1}</Text>
                                </View>
                            )
                        })}
                    </View>
                    <View>
                        <Carousel
                            ref={carouselRef}
                            layout={"default"}
                            data={allQuestions}
                            renderItem={renderItem}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={Math.round(Dimensions.get('window').width * 0.8)}
                            containerCustomStyle={{ borderRadius: 10 }}
                            onSnapToItem={(idx) => {
                                setActiveIndex(idx)
                            }}
                        scrollEnabled={false}
                        />
                    </View>
                </LinearGradient>
            </View>
        </SafeAreaView>

    )
}