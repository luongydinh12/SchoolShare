module.exports = {
  '@tags': ['login+logout'],
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
      .pause(1000)
      .click('#root > div > div > div.makeStyles-root-1 > header > div > button > span.MuiIconButton-label > svg')
      .pause(1000)
      .click('#root > div > div > div.makeStyles-root-1 > div > div > ul > div:nth-child(3) > div.MuiListItemText-root > span')
      .pause(3000)
      .end();
  }
};