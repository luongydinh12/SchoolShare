module.exports = {
    '@tags': ['createCategory+Group+Message'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(2000)
        .click('#root > div > div.container.valign-wrapper > div > div > a:nth-child(5)')
        .pause(2000)
        .assert.visible('input[type=email]')
        .setValue('input[type=email]', 'automator@me.com')
        .pause(1000)
        .assert.visible('input[type=password]')
        .setValue('input[type=password]', '123456')
        .pause(1000)
        .click('#root > div > div.container > div > div > form > div:nth-child(3) > button')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div > div > div > div:nth-child(7) > a:nth-child(1)')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(1) > a:nth-child(2)')
        .pause(1000)
        .end();
    }
  };