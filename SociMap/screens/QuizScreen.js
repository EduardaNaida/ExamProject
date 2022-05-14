import { StatusBar } from 'expo-status-bar';
import { Button, ImageBackground, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
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
                console.log("rätt");
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

        }
    }, [currentQuestion]);



    return loading ? 
    (   <ImageBackground style={styles.headerImg}>   
        <Text style={styles.header}>Quiz</Text>
        <View style={styleQuiz.container}>
        <ActivityIndicator
        size='large'
        color='blue'
    /><Text style={styleQuiz.question}>Preparing Quiz</Text></View></ImageBackground>)
    :
    (
    <ImageBackground style={styles.headerImg}>   
    <Text style={styles.header}>Quiz</Text>
    <View style={styleQuiz.container}>
    
    
    {currentQuestion < amountOfQuestions
        ?   <><View style={styleQuiz.container2}><Text style={styleQuiz.statsText}>{"Score: " + correctGuesses + "/" + amountOfQuestions}</Text>
            <Text style={styleQuiz.statsText}>{"Question: " + (currentQuestion + 1) + "/" + amountOfQuestions}</Text></View>
            <Text style={styleQuiz.question}>{questionText}</Text>
            <View style={styleQuiz.answers}>{buttons}</View>
            
            <TouchableOpacity style={styleQuiz.startOver} onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}><Text style={styleQuiz.btnTxt}>Start over</Text></TouchableOpacity>
            </>
        :  (<View><Text style={styleQuiz.question}>{'You got ' + correctGuesses +'/' + amountOfQuestions + 'points'}</Text>
            <TouchableOpacity style={styleQuiz.startOver} onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}><Text style={styleQuiz.btnTxt}>Start over</Text></TouchableOpacity>
        </View>)

    }
    <StatusBar style="auto" />
  </View>
  </ImageBackground>);
}


const styleQuiz = StyleSheet.create({
    container:{
        flex: 1,
        padding:10, //<TouchableOpacity style={styleQuiz.startOver} onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}><Text style={styleQuiz.btnTxt}>Start over</Text></TouchableOpacity>
        //alignItems:'center',    <Button title={"Start over"} onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}></Button>

        backgroundColor:'#ffffff',//    <View style={styleQuiz.startOverBox}><TouchableOpacity style={styleQuiz.startOver} onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}><Text style={styleQuiz.btnTxt}>Start over</Text></TouchableOpacity></View>      
        
        width:'100%',
        height:'100%',
        borderRadius:60,
       // flexDirection:'column',
        marginBottom:'-100%',
        paddingBottom:60,
        //alignItems:'center',
    },
    container2:{
        flexDirection:'row',
        padding:20,
        fontSize: 20,
        justifyContent: 'space-between',
    },
    statsText:{
        fontSize: 20,
        fontFamily: "Inter"
    },
    welcome: {
        height: 100,
        fontSize: 30,
        margin: 20,
        color: 'white',
        fontFamily: "Inter"
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
      answers:{
        backgroundColor:'red',
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
  