import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { AttemptSignIn } from './FirebaseInterface';

export const QuizView = () =>
{
    function getGroupInfo()
    {
        //!TODO 
        return [["1", 0, ["12", "14"]],["2", 0, ["1", "2", "3", "4" ]],["3", 2, ["4", "4", "1"]]];
    }

    function buttonList(question)
    {
        return question[ANSWERS].map((item,index) =>
        {
            if (index == question[CORRECTANSWER])
            {
                return <CustomButton title={item} correct={true}/>
            }
            return <CustomButton title={item} correct={false}/>
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

    const QUESTIONTEXT = 0;
    const CORRECTANSWER = 1;
    const ANSWERS = 2;

    const allQuestions = getGroupInfo();
    const amountOfQuestions = allQuestions[1].length;
    const [questionData, setQuestionData] = useState(allQuestions[currentQuestion]);
    let buttons = buttonList(questionData);
    let questionText = questionData[QUESTIONTEXT];


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
  