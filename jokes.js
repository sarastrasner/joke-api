'use strict';
const program = require('commander');
const superagent = require('superagent');
let token;


program.version('0.0.1');

program
    .command('signup')
    .arguments('<user> <pass>')
    .alias('su')
    .description('signup for the jokes app')
    .action(function(user, pass) {
        superagent.post(`https://sarastrasner-auth-api.herokuapp.com/signup`)
        .send({username: `${user}`, password: `${pass}`})
        .then(results => {console.log(`Welcome ${user}`)})
        .catch(e => console.error('this is an error!', e))
    })


program 
    .command('signin')
    .arguments('<user> <pass>')
    .alias('si')
    .description('sign in for the jokes app')
    .action(async function(user, pass) {
        const results = await superagent.post(`https://sarastrasner-auth-api.herokuapp.com/signin`)
        .auth(`${user}`, `${pass}`)
        token = results.body.token;
        console.log(`${user}, you have successfully logged in!`)
    })


program
    .command('get-all-jokes')
    .alias('all')
    .description('retrieves all jokes in the database. get ready to laugh!')
    .action(function() {
        superagent.get('https://sarastrasner-auth-api.herokuapp.com/api/v1/jokes')
        .then(results => results.body.forEach(item => {
            console.log('------');
            console.log('Title:', item.name);
            console.log(item.description);
            console.log(item.punchline);
            console.log('------');
        }))
    })
    

program
    .command('get-one-joke')
    .alias('one')
    .description('retrieves one random joke from the database >:)')
    .action(function() {
        superagent.get('https://sarastrasner-auth-api.herokuapp.com/api/v1/jokes')
        .then(results => {
            let randomJoke = Math.floor(Math.random() * results.body.length);
            console.log('------');
            console.log(results.body[randomJoke].description)
            console.log(results.body[randomJoke].punchline)
            console.log('------');
        } )
    })
    
program
    .command('add-joke')
    .arguments('<title> <desc> <punchline>')
    .alias('add')
    .description(`think you're funny? add your joke to our database!`)
    .action(function (title, desc, punchline) {
        superagent.post('https://sarastrasner-auth-api.herokuapp.com/api/v1/jokes')
        .send({name: `${title}`, description: `${desc}`, punchline: `${punchline}`})
        .then(results => { console.log('Joke Added!') })
    })

program
    .command('delete-joke')
    .arguments('<name>')
    .alias('delete')
    .description('hate a joke? delete it.')
    .action(function(name){
        superagent.get('https://sarastrasner-auth-api.herokuapp.com/api/v1/jokes')
        .then(results => {
            let del = results.body.find(item => item.name == name)
            console.log(del._id);
            superagent.del(`https://sarastrasner-auth-api.herokuapp.com/api/v1/jokes/${del._id}`)
            .then(results => console.log('Joke successfully deleted!'))
        })

    })

program.parse(process.argv);





// TODO
// [x] Signup 
// ---> [] Console.log(return list of options to the user)
// [] SignIn
// [] /GetAllJokes
// [] /GetOneJoke
// ----> get one randomx id for a jokee
// [] /CreateJoke
// [] /EditJoke
// [] /DeleteJoke



module.exports = program;