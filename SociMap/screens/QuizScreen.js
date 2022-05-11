import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { AttemptSignIn } from '../FirebaseInterface';
import { createQuiz } from '../QuizAlgorithm';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default QuizScreen = () =>
{
    return(
        <Stack.Navigator>
            <Stack.Screen name='QuizView' component={QuizView}/>
        </Stack.Navigator>
    );
}

export const QuizView = () =>
{
    function buttonList()
    {
        if (questionData != null)
        {
            return questionData['answers'].map((element, _) =>
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

        return <Button title={title} onPress={onPressCorrect}/>
    }



    const [allQuestions, setAllQuestions] = useState([]);
    const [amountOfQuestions, setAmountOfQuestions] = useState(0);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [buttons, setButtons] = useState(<></>);
    const [questionText, setQuestionText] = useState('');
    const [questionData, setQuestionData] = useState(null);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(async () => {
        const q = await createQuiz('');
        setAllQuestions(q);
        setAmountOfQuestions(allQuestions.length);
        setQuestionData(allQuestions[0]);
        setButtons(buttonList);
        setQuestionText(questionData.text);
        setFirstRender(false);
    }, []);


    useEffect(() =>
    {
        if(firstRender == false && currentQuestion < amountOfQuestions)
        {
            setQuestionData(allQuestions[currentQuestion]);
            setButtons(buttonList);
            setQuestionText(questionData.text);
        }
    }, [currentQuestion]);



    return (
    <View style={styles.container}>
    {currentQuestion < amountOfQuestions
        ?   <><Text>{"Amount of right Answers:" + correctGuesses + "/" + amountOfQuestions}</Text>
            <Text>{"Question #" + (currentQuestion + 1) + "/" + amountOfQuestions}</Text>
            <Text>{questionText}</Text>
            {buttons}</>
        :   <Text>{'You got ' + correctGuesses +'/' + amountOfQuestions + 'points'}</Text>

    }        
    <Button title='Try Again' onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}/>
    <StatusBar style="auto" />
  </View>);
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  