module.exports = {
    '@tags': ['login_facebook'],
    'Test School Share Login' : function (client) {
      client
        .url('https://schoolshare.me/')
        .waitForElementVisible('body', 1000)
        .assert.title('School Share')
        .pause(1000)
        .click('#root > div > div.container.valign-wrapper > div > div > a:nth-child(5)')
        .pause(1000)
        .click('#root > div > div.container > div > div > form > div:nth-child(4) > div > a:nth-child(2)')
        .pause(2000)
        .windowHandles(function(result) {
            // An array of window handles.
            console.log(result.value);
            client.switchWindow(result.value[1])

          })
        .resizeWindow(1000, 800)
        //.assert.visible('input[type=password]')
        //.setValue('input[type=password]', 'automator@me.com')
        .pause(1000)
        .end();
    }
  };