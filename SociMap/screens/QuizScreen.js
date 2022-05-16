import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Pressable, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { AttemptSignIn } from '../FirebaseInterface';
import { createQuiz } from '../QuizAlgorithm';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from '../assets/Stylesheet';
//import { white } from 'react-native-paper/lib/typescript/styles/colors';

const Stack = createNativeStackNavigator();

export default QuizScreen = () =>
{
    return(
        <Stack.Navigator>
            <Stack.Screen name='QuizView' component={QuizView} options={{headerShown:false}}/>
        </Stack.Navigator>
    );
}

export const QuizView = () =>
{
    function buttonList(data)
    {
        if (data != null)
        {
            return data.map((element, _) =>
            {
                return <CustomButton title={element.text} correct={element.correct}/>
            });
        }
        return <></>;
        
    }

    const CustomButton = ({title, correct}) =>
    {
        function onPressCorrect()
        {
            if (correct)
            {
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
    const [firstRender, setFirstRender] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        const q = await createQuiz('');
        setAllQuestions(q);
        setAmountOfQuestions(q.length);
        if (q.length)
        {
            const firstElement = q[0];
            setQuestionData(firstElement);
            setButtons(buttonList(firstElement.answers));
            setQuestionText(firstElement.text);
        }
        setFirstRender(false);
        setLoading(false);
        
    }, []);


    useEffect(() =>
    {
        if(firstRender == false && currentQuestion < amountOfQuestions)
        {
            setQuestionData(allQuestions[currentQuestion]);
            setButtons(buttonList(questionData.answers));
            setQuestionText(questionData.text);
            console.log("bild=", questionData);
        }
    }, [currentQuestion]);



    return loading ?  
    (<View style={{flex:1}}>
        <View style={{marginTop:100}}></View>
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
        <View style={{flex:1}}>

            <Text style={styles.header}>Quiz</Text>
            <View style={styleQuiz.container}>
            
            
            {currentQuestion < amountOfQuestions
                ?   
                <>
                    <View style={styleQuiz.container2}>
                        <Text style={styleQuiz.statsText}>{"Score: " + correctGuesses + "/" + amountOfQuestions}</Text>
                        <Text style={styleQuiz.statsText}>{"Question: " + (currentQuestion + 1) + "/" + amountOfQuestions}</Text>
                    </View>
                    {questionData.img && questionData.img != ''
                        ?
                        <Image style={styleQuiz.thumbnail} source={{uri:questionData.img}}/>
                        :
                        <></>
                        }


                    <Text style={styleQuiz.question}>{questionText}</Text>
                    <View style={styleQuiz.answers}>{buttons}</View>
                    
                </>
                :  
                (<View>
                    <Text style={styleQuiz.question}>{'You got ' + correctGuesses +'/' + amountOfQuestions + 'points'}</Text>
                    <TouchableOpacity style={styleQuiz.startOver} onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}><Text style={styleQuiz.btnTxt}>Start over</Text></TouchableOpacity>
                </View>)

            }
        </View>
    </View>);
}


const styleQuiz = StyleSheet.create({
    container:{
        alignItems:'center',
        backgroundColor:'white',
        marginLeft:0,
        borderRadius:60,
        borderBottomEndRadius:0,
        borderBottomStartRadius:0,
        flex:1,
        alignSelf:'stretch'
    },
    container2:{
        flexDirection:'row',
        padding:20,
        fontSize: 20,
        justifyContent: 'space-between',
    },
    statsText:{
        fontSize: 20,
    },
    welcome: {
        height: 100,
        fontSize: 30,
        margin: 20,
        color: 'white',
      },
      widgetContainer:{
        alignItems: 'center',
        flexDirection: 'row',
        flex:1,
        marginBottom:5,
        backgroundColor:'#b5b5b5',
        padding:10,
        borderRadius:10,
    },
      questionBox:{
          margin: 20,
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignSelf: 'center',
      },
      question:{
        margin: 20,
        fontSize: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    thumbnail:{
        alignSelf:'center',
        width:70,
        height:70,
        borderRadius:35,
        backgroundColor:'red'
    },
      answers:{
        justifyContent: 'space-evenly',
          alignSelf: 'center',
        },
        answerButton:{
            alignSelf: 'center',
          borderRadius: 10,
          backgroundColor: "#4169E1",
          width: 200,
          margin: 10,
        },
        startOver:{
            alignSelf: 'center',
          borderRadius: 10,
          backgroundColor: "#FF6B00",
          width: 200,
          margin: 20,
          zIndex: 1
        },
        btnTxt:{
          fontSize: 16,
          textAlign: "center",
          margin: 5,
          color: 'white',  
        },
  });
  