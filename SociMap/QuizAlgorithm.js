import { GetPersonData, GetPersonsFromPath } from "./FirebaseInterface";
//!THE TOPICS THAT ARE USED IN createQuestion NEEDS TO HAVE CASES IN createTopicDictionary, yesOrNoQuestion and multipleChoiceQuestion
export function createQuiz()
{
    //!TODO change to multiple people this is just testing
    const people = GetPersonData(id);
    console.log(people);
    var topicDictionary = createTopicDictionary(people);
    const numberOfQuestions = 10;

    console.log(topicDictionary);
    
    var quiz = [];
    for (var i in numberOfQuestions)
    {
        var question = createQuestion(topicDictionary);
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
    //! needs to be the same topics that are used in createTopicDictionary for getting specified questions
    var topics = ['work', 'unspecified']
    var topic = topics[Math.floor(Math.random() * topics.length)];
    const rand = Math.random() < 0.5;
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
        case 'work':
            text = 'Does ' + person + " work at/with " + questionAnswer + '?';
            break;
    
        default:
            text = 'Does the note ' + questionAnswer + 'belong to ' + person + '?';
            break;
    }

    if (questionAnswer == correctAnswer)
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
    var person = choice[id];
    var correctAnswer = choice[value];

    switch (topic) {
        case 'work':
            text = 'Where does ' + person + 'work/what does ' + person + 'work with?';
            break;
    
        default:
            text = 'Which note is under ' + person + '?';
            break;
    }

    answers = [{text:correctAnswer, correct:true}];

    for (var i = 0; i < choices.length && i < 4; i++)
    {
        answer = choices[Math.floor(Math.random() * choices.length)][value];
        if(answer == correctAnswer)
        {
            answers.push({text:answer, correct:true});
        }
        else
        {
            answers.push({text:answer, correct:false});
        }
    }
    return {type:'multiplechoice', text:text, answers:shuffleArray(answers)}
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
    for (const person in people)
    {
        for (const header in person)
        {
            //TODO fix person[id] to correct name/id and add a metric shitton of keywords to sort by
            if (header != person[id])
            {
                switch (header) {
                    case ['work', 'job'].some(s => header.toLowerCase.indexOf(s) !== -1):
                        createListOrPush(dict, "work");
                        break;
                                        
                    default:
                        createListOrPush(dict, "unspecified")
                        break;
                }
            }
        }
    }
}

function createListOrPush(dict, tag)
{
    if (dict[tag] != null)
    {
        dict[tag].push({id:person[id], value:person[header]})
    }
    else
    {
        dict[tag] = [{id:person[id], value:person[header]}]
    }
}