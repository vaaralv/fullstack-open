
describe('Login',function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Johannes Rantala',
      username: 'jrantala',
      password: 'jrantala'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })
  
  it('succeeds with correct credentials', function() {
    cy.login({username: 'jrantala', password: 'jrantala'})
    cy.contains('Johannes Rantala logged in')
  })

  it('fails with wrong credentials', function() {
    cy.logout()
    cy.get('#username').type('jrantala')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('wrong credentials')
  })
})

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Johannes Rantala',
      username: 'jrantala',
      password: 'jrantala'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#username').should('be.visible')
    cy.get('#password').should('be.visible')
    cy.contains('login')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({username: 'jrantala', password: 'jrantala'})
    })

    it('A blog can be created', function() {
      cy.createBlog({title: 'lol', author: 'meikä', url:'lol.fi'})
      cy.contains('add new blog').click()
      cy.contains('title').find('input').type('Testibloogi')
      cy.contains('author').find('input').type('Testi author')
      cy.contains('url').find('input').type('www.testiurl.fi')
      cy.get('#create-button').click()
      cy.contains('lol meikä')
      cy.contains('Testibloogi Testi author')   
    })

    it('A blog can be liked', function() {
      cy.createBlog({title: 'Testitykkäysblogi', author: 'meikä', url:'lol.fi'})
      cy.get('#blog').get('#view-button').click()
      cy.get('#blog')
        .contains('Testitykkäysblogi meikä')
        .and('contain', 'likes: 0')
        .parent().get('#like-button').click()
        .parent().contains('likes: 1')
    })

    it('A blog can be deleted by user who created it', function() {
      cy.createBlog({title: 'Testipoistoblogi', author: 'meikä', url:'lollero.fi'})
      cy.contains('Testipoistoblogi meikä').get('#delete-button').click()
      cy.contains('Testipoistoblogi meikä').should('not.exist')
    })

    it('Blogs are ordered in by likes', function() {
      cy.createBlog({title: 'Pitäis olla toka blogi', author: 'meikä', url:'lollero.fi'})
      cy.createBlog({title: 'Pitäis olla kolmas blogi', author: 'meikä', url:'lollero.fi'})
      cy.createBlog({title: 'Pitäis olla eka blogi', author: 'meikä', url:'lollero.fi'})

      cy.get('[id^=view-button]').click({ multiple: true })

      cy.contains('Pitäis olla toka blogi meikä').contains('like').click()
      cy.contains('Pitäis olla eka blogi meikä').contains('like').click()
      cy.contains('Pitäis olla toka blogi meikä').contains('like').click()
      cy.contains('Pitäis olla eka blogi meikä').contains('like').click()
      cy.contains('Pitäis olla kolmas blogi meikä').contains('like').click()
      cy.contains('Pitäis olla eka blogi meikä').contains('like').click()

      cy.get('[id^=blog]')
        .should('have.length', 3)
        .eq(0).contains('Pitäis olla eka blogi meikä')
      cy.get('[id^=blog]').eq(1).contains('Pitäis olla toka blogi meikä')
      cy.get('[id^=blog]').eq(2).contains('Pitäis olla kolmas blogi meikä')
        
  
    })
  })

})



