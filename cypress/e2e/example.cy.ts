// https://docs.cypress.io/api/introduction/api.html
describe("My First Test", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.title().should('eq', ("CyberLearning"));

    //course title
    //TODO: test for empty body then body content
    click('#btn');

    //unit title
    //TODO: test for empty body then body content
    click('#btn');

    //lesson title
    //TODO: test for empty body then body content
    click('#btn');

    //module title
    //TODO: test for empty body then body content
    click('#btn');

    //info slides
    //TODO: test for empty body then body content
    click('#btn');
    click('#btn');
    click('#btn');

    click('#btn0');

    //info slides
    //TODO: test for green
    click('#btn');
    click('#btn0');
    //TODO: test for red
    click('#btn');
    click('#btn0');

    //TODO: test for red
    click('#btn');

    //vocab
    //TODO: test for empty body then body content
    click('#btn0');
    //TODO: test for red
    click('#btn');
    click('#btn0');
    //TODO: test for green
    click('#btn');
    click('#btn2');
    click('#btn');
    click('#btn3');
    click('#btn');
    click('#btn0');
    click('#btn');

    //sort
    click('#btn');
    click('#btn');

    //imap
    click('#blue');
    click('#btn');

    //mc 1
    //TODO: test for empty body then body content "lecture is so boring"
    //TODO: test for button visibilty
    click('#btn1');
    //TODO: test for button visibilty
    click('#btn');

    //gap 1
    //TODO: test for empty body
    //TODO: test for visibility of 3 fills and 3 gaps
    //TODO: "remaining" = 3
    // const dataTransfer = new DataTransfer();
    // cy.get('#fill0').trigger('dragstart', {dataTransfer});
    // cy.get('#gap0').trigger('drop',{dataTransfer});
    dragDrop('#fill0','#gap0');
    //TODO: "remaining" = 2
    dragDrop('#fill1','#gap1');
    //TODO: "remaining" = 1
    dragDrop('#fill2','#gap2');
    //TODO: "remaining" = 0
    //TODO: #ans0 green, #ans1 red, #ans2 red
    //TODO: btn visibile
    /*
    .assert.textContains("body", "Number correct: 3")
    .assert.textContains("body", "Number questions: 3")
    .assert.textContains("body", "100%")
    .assert.visible('button[id=btn]')
    */
    click('#btn');

    //gap 2
    //TODO: test for empty body
    //TODO: test for visibility of 3 fills and 3 gaps
    //TODO: "remaining" = 3
    dragDrop('#fill2','#gap1');
    //TODO: "remaining" = 2
    dragDrop('#fill0','#gap0');
    //TODO: "remaining" = 1
    dragDrop('#fill1','#gap2');
    //TODO: "remaining" = 0
    //TODO: #ans0 green, #ans1 red, #ans2 red
    //TODO: btn visibile
    /*
    .assert.textContains("body", "Number correct: 1")
    .assert.textContains("body", "Number questions: 3")
    .assert.textContains("body", "33%")
    .assert.visible('button[id=btn]')
    */
    click('#btn');

    //select
    click('#w4');
    click('#w6');
    //test 4 and 5 red, 6 green
    click('#btn'); //done
        //TODO: btn visibile
    click('#btn'); //continue

    //mc2
    //test body not empty
    //test for  "learn the periodic table"
    //test btn0 visible
    click('#btn0');
    //test btn visible
    click('#btn');

    //results
    // .assert.not.textContains("body", "undefined")
    // .assert.textContains("body", "b,a,c,d")
    // .assert.textContains("body", "blue")
    // .assert.textContains("body", "hadn't")
    // .assert.textContains("body", "NUMBER OF QUESTIONS: 16")
    // .assert.textContains("body", "NUMBER CORRECT: 10")
    // .assert.textContains("body", "PERCENT CORRECT: 63%")
    // .assert.textContains("body", "15.")
    // .assert.textContains("body", "ans")

    click('#startOver');

    //test body contains "course 1"
  });
});
function click(e1:string) {
  cy.get(e1).click();
}
function dragDrop (e1:string, e2:string)  {
  const dataTransfer = new DataTransfer();
  cy.get(e1).trigger('dragstart', {dataTransfer});
  cy.get(e2).trigger('drop',{dataTransfer});
}