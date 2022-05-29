import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Pressable, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { AttemptSignIn } from '../FirebaseInterface';
import { createQuiz } from '../QuizAlgorithm';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from '../assets/Stylesheet';
import { async } from '@firebase/util';
//import { white } from 'react-native-paper/lib/typescript/styles/colors';

const Stack = createNativeStackNavigator();

export default QuizScreen = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: true,
            //headerTransparent: true,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            headerShadowVisible: false,
            title: '',
            headerTintColor: '#fff',
        }}>
            <Stack.Screen name='QuizView' component={QuizView} />
        </Stack.Navigator>
    );
}

export const QuizView = () => {
    function buttonList(data) {
        if (data != null) {
            return data.map((element, _) => {
                return <CustomButton title={element.text} correct={element.correct} />
            });
        }
        return <></>;

    }

    const CustomButton = ({ title, correct }) => {
        function onPressCorrect() {
            if (correct) {
                setCorrectGuesses(correctGuesses + 1);
            }
            setCurrentQuestion(currentQuestion + 1);
        }

        return <TouchableOpacity onPress={onPressCorrect} style={styleQuiz.answerButton}><Text style={styleQuiz.btnTxt}>{title}</Text></TouchableOpacity>
    }



    const [allQuestions, setAllQuestions] = useState([]);
    const [amountOfQuestions, setAmountOfQuestions] = useState(0);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [buttons, setButtons] = useState(<></>);
    const [questionText, setQuestionText] = useState('');
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [thumbnail, setQuestionThumbnail] = useState(<></>);

    async function setQuiz() {
        const q = await createQuiz('');
        setAllQuestions(q);
        setAmountOfQuestions(q.length);
        if (q.length) {
            const firstElement = q[0];
            setQuestionData(firstElement);
            setButtons(buttonList(firstElement.answers));
            setQuestionText(firstElement.text);
            setCurrentQuestion(0);
        }
        setLoading(false);
    }

    useEffect(async () => {
        setQuiz();
    }, []);


    useEffect(() => {
        if (currentQuestion < amountOfQuestions) {
            setQuestionData(allQuestions[currentQuestion]);
            setButtons(buttonList(questionData.answers));
            setQuestionText(questionData.text);
            var img = questionData.img;
            if (img && img != '') {
                setQuestionThumbnail(<Image style={styleQuiz.thumbnail} source={{ uri: questionData.img }} />);
            }
            else {
                setQuestionThumbnail(<></>);
            }

        }
    }, [currentQuestion]);



    return loading ?
        (<View style={{ flex: 1 }}>
            <View style={{ marginTop: 100 }}></View>
            <View style={styleQuiz.container}>
                <Text style={styles.header}>Quiz</Text>
                <View style={styleQuiz.container}>
                    <ActivityIndicator
                        size='large'
                        color='blue'
                    />
                    <Text style={styleQuiz.question}>Preparing Quiz</Text>
                </View>
            </View>
        </View>
        )
        :
        (
            <View style={{ flex: 1 }}>

                <Text style={styles.header}>Quiz</Text>
                <View style={styleQuiz.container}>


                    {currentQuestion < amountOfQuestions
                        ?
                        <>
                            <View style={styleQuiz.container2}>
                                <Text style={styleQuiz.statsText}>{"Score: " + correctGuesses + "/" + amountOfQuestions + " \n"}
                                    {"Question: " + (currentQuestion + 1) + "/" + amountOfQuestions}</Text>
                            </View>
                            {thumbnail}


                            <Text style={styleQuiz.question}>{questionText}</Text>
                            <View style={styleQuiz.answers}>{buttons}</View>

                        </>
                        :
                        amountOfQuestions != 0
                            ?
                            <View>
                                <Text style={styleQuiz.question}>{'You got ' + correctGuesses + '/' + amountOfQuestions + ' points '}</Text>
                                <TouchableOpacity style={styleQuiz.startOver} onPress={async () => { setLoading(true); setCorrectGuesses(0); setQuiz() }}><Text style={styleQuiz.btnTxt}>Start over</Text></TouchableOpacity>
                            </View>
                            :
                            <View>
                                <Text style={styleQuiz.question}>{'You do not have enough contacts and/or notes to create a quiz at the moment'}</Text>
                                <TouchableOpacity style={styleQuiz.startOver} onPress={() => { setLoading(true); setQuiz() }}><Text style={styleQuiz.btnTxt}>Retry</Text></TouchableOpacity>
                            </View>


                    }
                </View>
            </View>);
}


const styleQuiz = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginLeft: 0,
        borderRadius: 60,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        flex: 1,
        alignSelf: 'stretch'
    },
    container2: {
        flexDirection: 'row',
        padding: 20,
        fontSize: 20,
        justifyContent: 'space-between',
    },
    statsText: {
        fontSize: 20,
    },
    welcome: {
        height: 100,
        fontSize: 30,
        margin: 20,
        color: 'white',
    },
    widgetContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        marginBottom: 5,
        backgroundColor: '#b5b5b5',
        padding: 10,
        borderRadius: 10,
    },
    questionBox: {
        margin: 20,
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignSelf: 'center',
    },
    question: {
        margin: 20,
        fontSize: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    thumbnail: {
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white'
    },
    answers: {
        justifyContent: 'space-evenly',
        alignSelf: 'center',
    },
    answerButton: {
        alignSelf: 'center',
        borderRadius: 20,
        backgroundColor: '#ADD8E6',
        width: 300,
        margin: 10,
    },
    startOver: {
        alignSelf: 'center',
        borderRadius: 20,
        backgroundColor: "#F8CA9C",
        width: 300,
        paddingLeft: 30,
        paddingRight: 30,
        margin: 20,
        zIndex: 1,

    },
    btnTxt: {
        fontSize: 18,
        textAlign: 'center',
        margin: 5,
        padding: 1,
        color: 'black',
    },
});
