var faker = require('faker');
var randomName = faker.name.findName();
var randomEmail = faker.internet.email();
var randomPassword = faker.internet.password();
var randomUsername = faker.internet.userName();
var randomDescription = faker.lorem.sentence();
var randomPicture = faker.image.imageUrl();
module.exports = {
    '@tags': ['createProfile'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(500)
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
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div > div > div > div:nth-child(6) > a')
        .pause(1000)
        .assert.visible('input[name=name]')
        .setValue('input[name=name]', randomName)
        .assert.visible('input[name=handle]')
        .setValue('input[name=handle]', randomUsername)
        .assert.visible('input[name=description]')
        .setValue('input[name=description]', randomDescription)
        .assert.visible('input[name=avatar]')
        .setValue('input[name=avatar]', randomPicture)
        .pause(3000)
        .click('#root > div > div.create-profile > div > div > div > form > input')
        .pause(3000)
        .click('#root > div > div:nth-child(2) > div > div > div > button:nth-child(8)')
        .pause(3000)
        .end();
    }
  };