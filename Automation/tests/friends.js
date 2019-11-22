module.exports = {
    '@tags': ['friends'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(2000)
        .click('#root > div > div > div > div > div > a:nth-child(5)')
        .pause(2000)
        .assert.visible('input[type=email]')
        .setValue('input[type=email]', 'automator@me.com')
        .pause(1000)
        .assert.visible('input[type=password]')
        .setValue('input[type=password]', '123456')
        .pause(1000)
        .click('#root > div > div > div > div > div > form > div:nth-child(3) > button')
        .pause(5000)
        .click('#root > div > div > div.makeStyles-root-5 > header > div > a:nth-child(6) > span.MuiIconButton-label > svg')
        .click('#root > div > div > div.container > div > ul > a:nth-child(3)')
        .end();
    }
  };