/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
describe('WorkflowDiagram', () => {
  const storyPath = 'Core/WorkflowDiagram';
  const tests = ['Basic', 'With Tooltips'];

  tests.forEach((testName) => {
    it(testName, function () {
      const id = Cypress.storyId(storyPath, testName);
      cy.visit('iframe', { qs: { id } });

      if (testName.includes('Tooltip')) {
        cy.get('#storybook-root').within(() => {
          cy.get('li').first().trigger('mouseenter'); // trigger tooltip
          cy.wait(50);
        });
      }

      cy.compareSnapshot(testName);
    });
  });
});
