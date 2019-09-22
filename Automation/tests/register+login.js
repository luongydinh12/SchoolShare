var faker = require('faker');
var randomName = faker.name.findName();
var randomEmail = faker.internet.email();
var randomPassword = faker.internet.password();
module.exports = {
    '@tags': ['register+login'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(2000)
        .click('#root > div > div.container.valign-wrapper > div > div > a:nth-child(4)')
        .pause(1000)
        .assert.visible('input[type=text]')
        .setValue('input[type=text]', randomName )
        .pause(1000)
        .assert.visible('input[type=email]')
        .setValue('input[type=email]', randomEmail )
        .pause(1000)
        .assert.visible('input[id=password]')
        .setValue('input[id=password]', randomPassword)
        .pause(1000)
        .assert.visible('input[id=password2]')
        .setValue('input[id=password2]', randomPassword)
        .pause(1000)
        .click('#root > div > div.container > div > div > form > div:nth-child(5) > button')
        .pause(1000)
        .assert.visible('input[type=email]')
        .setValue('input[type=email]', randomEmail)
        .pause(1000)
        .assert.visible('input[type=password]')
        .setValue('input[type=password]', randomPassword)
        .pause(1000)
        .click('#root > div > div.container > div > div > form > div:nth-child(3) > button')
        .pause(5000)
        .end();
    }
  };