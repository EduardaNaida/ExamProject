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
        return questionData['answers'].map((element, _) =>
        {
            console.log(element);
            return <CustomButton title={element['text']} correct={element['correct']}/>
        });
    }

    const CustomButton = ({title, correct}) =>
    {
        function onPressCorrect()
        {
            if (correct)
            {
                setCorrectGuesses(correctGuesses + 1);
                setCurrentQuestion(currentQuestion + 1);
            }
            else
            {
                setCurrentQuestion(currentQuestion + 1);
            }

        }

        return <Button title={title} onPress={onPressCorrect}/>
    }

    const [correctGuesses, setCorrectGuesses] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    //!TODO set lA33tHQiCCb88nQzkIax to a group this id is just for testing
    const allQuestions = createQuiz();
    const amountOfQuestions = allQuestions[1].length;
    const [questionData, setQuestionData] = useState(allQuestions[currentQuestion]);
    let buttons = buttonList(questionData);
    let questionText = questionData['text'];


    useEffect(() =>
    {
        if(currentQuestion < amountOfQuestions)
        {
            setQuestionData(allQuestions[currentQuestion]);
        }
    }, [currentQuestion]);


    console.log(currentQuestion);

    return (
    <View style={styles.container}>
    {currentQuestion < amountOfQuestions
        ?   <><Text>{"antal rätt:" + correctGuesses + "/" + amountOfQuestions}</Text>
            <Text>{"Fråga " + (currentQuestion + 1) + "/" + amountOfQuestions}</Text>
            <Text>{questionText}</Text>
            {buttons}</>
        :   <Text>{'Du fick ' + correctGuesses +'/' + amountOfQuestions + 'rätt'}</Text>

    }        
    <Button title='Försök igen' onPress={() => {setCorrectGuesses(0);setCurrentQuestion(0)}}/>
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
  