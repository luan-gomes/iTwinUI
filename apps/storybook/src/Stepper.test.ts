/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
describe('Stepper', () => {
  const storyPath = 'Core/Stepper';
  const tests = ['Basic', 'Long', 'Localized Long', 'With Tooltips'];

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
