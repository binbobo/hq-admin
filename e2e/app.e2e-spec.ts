import { HqAdminPage } from './app.po';

describe('hq-admin App', () => {
  let page: HqAdminPage;

  beforeEach(() => {
    page = new HqAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
