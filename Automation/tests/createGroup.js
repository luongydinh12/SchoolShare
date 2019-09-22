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
    '@tags': ['createGroup'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(200)
        .click('#root > div > div.container.valign-wrapper > div > div > a:nth-child(5)')
        .pause(200)
        .assert.visible('input[type=email]')
        .setValue('input[type=email]', 'automator@me.com')
        .pause(100)
        .assert.visible('input[type=password]')
        .setValue('input[type=password]', '123456')
        .pause(1000)
        .click('#root > div > div.container > div > div > form > div:nth-child(3) > button')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div > div > div > div:nth-child(7) > a:nth-child(1)')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > a')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > a')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div > form > div:nth-child(1) > select > option:nth-child(2)')
        .pause(1000)
        .assert.visible('input[id=text]')
        .setValue('input[id=text]', word)
        .pause(1000)
        .setValue('#textarea1', randomDescription)
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div > form > button')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(1) > a:nth-child(1)')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > div > div > div:nth-child(1) > a')
        .pause(3000)
        .end();
    }
  };