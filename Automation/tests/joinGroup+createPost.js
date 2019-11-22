var faker = require('faker');
var randomName = faker.name.findName();
var randomDescription = faker.lorem.sentence();
var department = faker.commerce.department();
var noun = faker.hacker.noun();
var bsnoun = faker.company.bsNoun();
var bsbuzz = faker.company.bsBuzz();
var catchphrasedesc = faker.company.catchPhraseDescriptor();
var catchphrase = faker.company.catchPhrase();
var catchphrasenoun = faker.company.catchPhraseNoun();
var bs = faker.company.bs();
var jobdescriptor = faker.name.jobDescriptor();
var jobtitle = faker.name.jobTitle();
var word = faker.random.word();
module.exports = {
    '@tags': ['joinGroup+createPost'],
    'Test School Share Login' : function (client) {
      client
      .url('https://schoolshare.me/')
      .waitForElementVisible('body', 1000)
      .assert.title('School Share')
      .pause(1000)
      .click('#root > div > div > div > div > div > a:nth-child(5)')
      .pause(1000)
      .assert.visible('input[type=email]')
      .setValue('input[type=email]', 'automator@me.com')
      .pause(1000)
      .assert.visible('input[type=password]')
      .setValue('input[type=password]', '123456')
      .pause(1000)
      .click('#root > div > div > div > div > div > form > div:nth-child(3) > button')
      .pause(1000)
      .click('#root > div > div > div.makeStyles-root-5 > header > div > a.MuiButtonBase-root.MuiFab-root.makeStyles-margin-1.MuiFab-extended.MuiFab-sizeSmall.MuiFab-primary > span.MuiFab-label > svg')
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(1) > a')
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div.col > div.col.\\31 4 > a:nth-child(2)')
      .pause(1000)
      .assert.visible('input[type=text]')
      .setValue('input[type=text]', word)
      .pause(1000)
      .assert.visible('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div > div > form > div > div:nth-child(2)')
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div > div > form > div > div:nth-child(2)')
      .setValue('textarea[placeholder="Type your post here... "]', randomDescription)
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div > div > form > button:nth-child(2)')
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div > p:nth-child(3) > a:nth-child(1)')
      .pause(1000)
      .setValue('textarea[placeholder="Type your reply here"]', randomDescription)
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div > div > a:nth-child(3)')
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div > p:nth-child(3) > a:nth-child(1)')
      .pause(1000)
      .setValue('textarea[placeholder="Type your reply here"]', randomDescription)
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > div > div > div > a:nth-child(2)')
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3) > div > div > div > div > div > div > a > img')
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3) > div > div > div > div > div > div > p:nth-child(3) > a:nth-child(2)')
      .pause(1000)
      .setValue('textarea[placeholder="Type your revised message here"]', randomDescription)
      .pause(1000)
      .click('#root > div > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(3) > div > div > div > div > div > div > div:nth-child(4) > a:nth-child(2)')
      .pause(1000)
    }
  
  };
  