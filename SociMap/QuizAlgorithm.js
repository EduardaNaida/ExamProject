import { GetPersonData } from "./FirebaseInterface";

export function createQuiz(personId)
{
    //!TODO change to multiple people
    const people = fbInterface.GetPersonData(personId);
    var peopleDictionary = createPeopleDictionary(people);
    var topics = ['email', 'relatives', 'interests', 'job'];
    const numberOfQuestions = 10;

    console.log(people);
    
    var quiz = [];
    for (var i in numberOfQuestions)
    {
        var question = createQuestion(dict, topics);
        if (question != null)
        {
            quiz.push(question);
        }
        
    }

    return quiz;
}

function createQuestion(dict, topics)
{
    if (topics.length == 0)
    {
        return null;
    }
    var topic = topics[Math.floor(Math.random() * topics.length)];
    const rand = Math.random() < 0.5;
    //const rand = 0;
    if(dict[topic].length > 2)
    {
        if (rand)
        {
            return yesOrNoQuestion(dict[topic], topic);
        }
        return multipleChoiceQuestion(dict[topic], topic);
    }

    topics.splice(indexOf(topic), 1);
    createQuestion(dict, topics);
}

function yesOrNoQuestion(choices, topic)
{
    //!TODO lookup the person connected to personid perhaps, dont know the structure
    var choice = choices[Math.floor(Math.random() * choices.length)];
    var person = choice[id];
    var correctAnswer = choice[value];
    var questionAnswer = choices[Math.floor(Math.random() * choices.length)][value];

    var text;
    //!TODO add more topics and cases
    switch (topic) {
        case 'email':
            text = 'Is ' + person + "'s email " + questionAnswer + '?';
            break;
    
        default:
            text = 'Is ' + person + 'related to ' + questionAnswer + '?';
            break;
    }

    if (questionAnswer == correctAnswer)
    {
        answers = [{text:'Yes', correct:true}, {text:'No', correct:false}];
    }
    else
    {
        answers = [{text:'Yes', correct:no}, {text:'No', correct:true}];
    }
    


    return {type:'yesorno', text:text, answers:answers};
}

function multipleChoiceQuestion(choices, topic)
{
    var choice = choices[Math.floor(Math.random() * choices.length)];
    var person = choice[id];
    var correctAnswer = choice[value];

    switch (topic) {
        case 'email':
            text = 'Which email address belongs to ' + person + '?';
            break;
    
        default:
            text = 'What does ' + person + 'work with?';
            break;
    }

    answers = [];

    for (var i = 0; i < choices.length && i < 4; i++)
    {

    }

    return {};
}

function createPeopleDictionary(people)
{
    var dict = {}
    for (const person in people)
    {
        for (const header in person)
        {
            if (person[header] != null && header != person[id])
            {
                if (dict[header] != null)
                {
                    dict[header].push({id:person[id], value:person[header]})
                }
                else
                {
                    dict[header] = [{id:person[id], value:person[header]}]
                }
            }
        }
    }
}

createQuiz("lA33tHQiCCb88nQzkIax");