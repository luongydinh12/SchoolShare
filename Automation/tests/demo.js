module.exports = {
    '@tags': ['demo'],
    'Demo test Google' : function (client) {
      client
        .url('http://www.google.com')

        // .waitForElementVisible('body', 1000)
           .assert.title('Google')
           .assert.visible({selector: '#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input'})
           .setValue('input[type=text]', 'rembrandt van rijn')
           .waitForElementVisible('button[name=btnK]', 5000)
           .click('button[name=bntk]')
           .pause(5000)
        // .assert.containsText('ol#rso li:first-child',
        //   'Rembrandt - Wikipedia')
        .end();
    }
  
  };
  