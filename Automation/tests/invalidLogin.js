module.exports = {
    '@tags': ['invalidLogin'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(2000)
        .click('#root > div > div.container.valign-wrapper > div > div > a:nth-child(5)')
        .pause(2000)
        .assert.visible('input[type=email]')
        .setValue('input[type=email]', '')
        .pause(1000)
        .assert.visible('input[type=password]')
        .setValue('input[type=password]', '123456')
        .pause(1000)
        .click('#root > div > div.container > div > div > form > div:nth-child(3) > button')
        .pause(2000)
        .assert.visible('#root > div > div:nth-child(2) > div > div > div > button:nth-child(8)')
        .end();
    }
  };

  