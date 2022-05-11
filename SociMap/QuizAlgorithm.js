import { GetPersonData, GetPersonsData, GetPersonsFromPath } from "./FirebaseInterface";
//!THE TOPICS THAT ARE USED IN createQuestion NEEDS TO HAVE CASES IN createTopicDictionary, yesOrNoQuestion and multipleChoiceQuestion oterwise they will be unspecified questions
export async function createQuiz(id)
{
    //!TODO change to multiple people this is just testing
    const people = await GetPersonsData(id);
    var topicDictionary = createTopicDictionary(people);
    const numberOfQuestions = 10;

    var quiz = [];
    var topics = ['work', 'unspecified'];
    for (var i = 0; i <= numberOfQuestions; i++)
    {
        var question = createQuestion(topicDictionary, topics);
        if (question != null)
        {
            quiz.push(question);
        }
  
        
    }

    return quiz;
}

function createQuestion(dict, topics)
{
    if(topics.length == 0) return null;
    var topic = topics[Math.floor(Math.random() * topics.length)];
    const rand = Math.random() < 0.5;
    if(dict[topic] && dict[topic].length > 2)
    {
        if (rand)
        {
            return yesOrNoQuestion(dict[topic], topic);
        }
        return multipleChoiceQuestion(dict[topic], topic);
    }
    topics.splice(topics.indexOf(topic), 1);
    createQuestion(dict, topics);
}

function yesOrNoQuestion(choices, topic)
{
    var choice = choices[Math.floor(Math.random() * choices.length)];
    var person = choice.name;
    var correctAnswers = choice.value;
    var questionAnswer = choices[Math.floor(Math.random() * choices.length)].value[Math.floor(Math.random() * choice.value.length)];

    var text;
    //!TODO add more topics and cases
    switch (topic) {
        case 'work':
            text = 'Does ' + person + " work at/with " + questionAnswer + '?';
            break;
    
        default:
            text = 'Does the note ' + questionAnswer + ' belong to ' + person + '?';
            break;
    }

    if (correctAnswers.includes(questionAnswer))
    {
        answers = [{text:'Yes', correct:true}, {text:'No', correct:false}];
    }
    else
    {
        answers = [{text:'Yes', correct:false}, {text:'No', correct:true}];
    }

    return {type:'yesorno', text:text, answers:answers};
}

function multipleChoiceQuestion(choices, topic)
{
    var choice = choices[Math.floor(Math.random() * choices.length)];
    var person = choice.name;
    var correctAnswer = choice.value[Math.floor(Math.random() * choice.value.length)];
    choices.splice(choices.indexOf(choice), 1);
    var text;
    switch (topic) {
        case 'work':
            text = 'Where does ' + person + 'work/what does ' + person + 'work with?';
            break;
    
        default:
            text = 'Which note is for ' + person + '?';
            break;
    }

    var answers = [{text:correctAnswer, correct:true}];

    for (var i = 0; i < choices.length && i < 3; i++)
    {
        var wrongAnswer = choices[Math.floor(Math.random() * choices.length)];
        var answer = wrongAnswer.value[Math.floor(Math.random() * wrongAnswer.value.length)];
        answers.push({text:answer, correct:false});
        
    }
    shuffleArray(answers);
    return {type:'multiplechoice', text:text, answers:answers}
}

function shuffleArray(array)
{
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

function createTopicDictionary(people)
{
    var dict = {}
    for (const index in people)
    {
        const person = people[index];
        for (const h in person.notes)
        {
            const note = person.notes[h];
            const headline = note.headline;
            switch (headline) {
                case ['work', 'job'].some(s => headline.toLowerCase().includes(s)):
                    createListOrPush(dict, "work", person, note);
                    break;
                                    
                default:
                    createListOrPush(dict, "unspecified", person, note);
                    break;
            }
        }
    }
    return dict;
}

function createListOrPush(dict, tag, person, note)
{
    if (note.values.length)
    {
        const questionObject = {name:person.name, value:note.values.map(element => element.value)};
        if (dict[tag] != null)
        {
            dict[tag].push(questionObject);
        }
        else
        {
            dict[tag] = [questionObject];
        }
    }
}