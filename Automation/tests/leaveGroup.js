module.exports = {
    '@tags': ['leaveGroup'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(1000)
        .click('#root > div > div.container.valign-wrapper > div > div > a:nth-child(5)')
        .pause(1000)
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
        .click('#root > div > div:nth-child(2) > div:nth-child(1) > a:nth-child(3)')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > div > div > a:nth-child(1)')
        .pause(1000)
        .click('#root > div > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(2) > button')
        .pause(1000)
        .click('#modal_0 > div.modal-footer > button:nth-child(1)')
        .pause(3000)
        .end();
    }
  };