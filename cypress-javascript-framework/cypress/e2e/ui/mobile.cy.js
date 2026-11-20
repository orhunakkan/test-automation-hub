import { LibraryPage } from '../../pages/library-page.js';
import { ReaderPage } from '../../pages/reader-page.js';

describe('Galaxy Tab S9 landscape', { browser: { family: 'chromium' } }, () => {
  beforeEach(() => {
    cy.viewport(1024, 640);
  });

  it('shows the sidebar', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.navLink('library').should('be.visible');
    libraryPage.menuButton().should('not.be.visible');
  });
});

describe('Pixel 10 Pro', { browser: { family: 'chromium' } }, () => {
  beforeEach(() => {
    cy.viewport(427, 876);
  });

  it('shows the top bar', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.menuButton().should('be.visible');
    libraryPage.navLink('library').should('not.exist');
  });

  it('menu opens the drawer', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.openMenu();
    libraryPage.menuClose().should('be.visible');
    libraryPage.navLink('library').should('be.visible');
  });

  it('reader uses a contents drawer', () => {
    const readerPage = new ReaderPage();
    readerPage.open('/read/pride-and-prejudice/chapter-1');
    readerPage.openContents();
    readerPage.contentsDrawer().should('be.visible');
    readerPage.contentsClose().should('be.visible');
  });
});

describe('Galaxy Tab S9', { browser: { family: 'chromium' } }, () => {
  beforeEach(() => {
    cy.viewport(640, 1024);
  });

  it('shows the top bar', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.menuButton().should('be.visible');
    libraryPage.navLink('library').should('not.exist');
  });

  it('menu opens the drawer', () => {
    const libraryPage = new LibraryPage();
    libraryPage.open();
    libraryPage.openMenu();
    libraryPage.menuClose().should('be.visible');
    libraryPage.navLink('library').should('be.visible');
  });

  it('reader uses a contents drawer', () => {
    const readerPage = new ReaderPage();
    readerPage.open('/read/pride-and-prejudice/chapter-1');
    readerPage.openContents();
    readerPage.contentsDrawer().should('be.visible');
    readerPage.contentsClose().should('be.visible');
  });
});
