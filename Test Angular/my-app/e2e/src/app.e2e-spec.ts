import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';

const expectedH1 = 'World Map';
const expectedTitle = `${expectedH1}`;
const targetCity = { id: 15, name: 'Magneta' };
const targetCityDashboardIndex = 2;
const nameSuffix = 'X';
const newCityName = targetCity.name + nameSuffix;

class City {
  constructor(public id: number, public name: string) {}

  // Factory methods

  // City from string formatted as '<id> <name>'.
  static fromString(s: string): City {
    return new City(
      +s.substring(0, s.indexOf(' ')),
      s.slice(s.indexOf(' ') + 1),
    );
  }

  // City from city list <li> element.
  static async fromLi(li: ElementFinder): Promise<City> {
    const stringsFromA = await li.all(by.css('a')).getText();
    const strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // City id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<City> {
    // Get city id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
      id: +id.slice(id.indexOf(' ') + 1),
      name: name.substring(0, name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topCities: element.all(by.css('app-root app-dashboard > div a')),

      appCitiesHref: navElts.get(1),
      appCities: element(by.css('app-root app-cities')),
      allCities: element.all(by.css('app-root app-cities li')),
      selectedCitySubview: element(by.css('app-root app-cities > div:last-child')),

      cityDetail: element(by.css('app-root app-city-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, async () => {
      expect(await browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, async () => {
      await expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Cities'];
    it(`has views ${expectedViewNames}`, async () => {
      const viewNames = await getPageElts().navElts.map(el => el!.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', async () => {
      const page = getPageElts();
      expect(await page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top cities', async () => {
      const page = getPageElts();
      expect(await page.topCities.count()).toEqual(4);
    });

    it(`selects and routes to ${targetCity.name} details`, dashboardSelectTargetCity);

    it(`updates city name (${newCityName}) in details view`, updateCityNameInDetailView);

    it(`cancels and shows ${targetCity.name} in Dashboard`, async () => {
      await element(by.buttonText('go back')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetCityElt = getPageElts().topCities.get(targetCityDashboardIndex);
      expect(await targetCityElt.getText()).toEqual(targetCity.name);
    });

    it(`selects and routes to ${targetCity.name} details`, dashboardSelectTargetCity);

    it(`updates city name (${newCityName}) in details view`, updateCityNameInDetailView);

    it(`saves and shows ${newCityName} in Dashboard`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetCityElt = getPageElts().topCities.get(targetCityDashboardIndex);
      expect(await targetCityElt.getText()).toEqual(newCityName);
    });

  });

  describe('Cities tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Cities view', async () => {
      await getPageElts().appCitiesHref.click();
      const page = getPageElts();
      expect(await page.appCities.isPresent()).toBeTruthy();
      expect(await page.allCities.count()).toEqual(9, 'number of cities');
    });

    it('can route to city details', async () => {
      await getCityLiEltById(targetCity.id).click();

      const page = getPageElts();
      expect(await page.cityDetail.isPresent()).toBeTruthy('shows city detail');
      const city = await City.fromDetail(page.cityDetail);
      expect(city.id).toEqual(targetCity.id);
      expect(city.name).toEqual(targetCity.name.toUpperCase());
    });

    it(`updates city name (${newCityName}) in details view`, updateCityNameInDetailView);

    it(`shows ${newCityName} in Cities list`, async () => {
      await element(by.buttonText('save')).click();
      await browser.waitForAngular();
      const expectedText = `${targetCity.id} ${newCityName}`;
      expect(await getCityAEltById(targetCity.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newCityName} from Cities list`, async () => {
      const citiesBefore = await toCityArray(getPageElts().allCities);
      const li = getCityLiEltById(targetCity.id);
      await li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(await page.appCities.isPresent()).toBeTruthy();
      expect(await page.allCities.count()).toEqual(8, 'number of cities');
      const citiesAfter = await toCityArray(page.allCities);
      // console.log(await City.fromLi(page.allCities[0]));
      const expectedCities =  citiesBefore.filter(h => h.name !== newCityName);
      expect(citiesAfter).toEqual(expectedCities);
      // expect(page.selectedCitySubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetCity.name}`, async () => {
      const addedCityName = 'Alice';
      const citiesBefore = await toCityArray(getPageElts().allCities);
      const numCities = citiesBefore.length;

      await element(by.css('input')).sendKeys(addedCityName);
      await element(by.buttonText('Add city')).click();

      const page = getPageElts();
      const citiesAfter = await toCityArray(page.allCities);
      expect(citiesAfter.length).toEqual(numCities + 1, 'number of cities');

      expect(citiesAfter.slice(0, numCities)).toEqual(citiesBefore, 'Old cities are still there');

      const maxId = citiesBefore[citiesBefore.length - 1].id;
      expect(citiesAfter[numCities]).toEqual({id: maxId + 1, name: addedCityName});
    });

    it('displays correctly styled buttons', async () => {
      const buttons = await element.all(by.buttonText('x'));

      for (const button of buttons) {
        // Inherited styles from styles.css
        expect(await button.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
        expect(await button.getCssValue('border')).toContain('none');
        expect(await button.getCssValue('padding')).toBe('1px 10px 3px');
        expect(await button.getCssValue('border-radius')).toBe('4px');
        // Styles defined in cities.component.css
        expect(await button.getCssValue('left')).toBe('210px');
        expect(await button.getCssValue('top')).toBe('5px');
      }

      const addButton = element(by.buttonText('Add city'));
      // Inherited styles from styles.css
      expect(await addButton.getCssValue('font-family')).toBe('Arial, Helvetica, sans-serif');
      expect(await addButton.getCssValue('border')).toContain('none');
      expect(await addButton.getCssValue('padding')).toBe('8px 24px');
      expect(await addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive city search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      await getPageElts().searchBox.sendKeys('Ma');
      await browser.sleep(1000);

      expect(await getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      await getPageElts().searchBox.sendKeys('g');
      await browser.sleep(1000);
      expect(await getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'n' and gets ${targetCity.name}`, async () => {
      await getPageElts().searchBox.sendKeys('n');
      await browser.sleep(1000);
      const page = getPageElts();
      expect(await page.searchResults.count()).toBe(1);
      const city = page.searchResults.get(0);
      expect(await city.getText()).toEqual(targetCity.name);
    });

    it(`navigates to ${targetCity.name} details view`, async () => {
      const city = getPageElts().searchResults.get(0);
      expect(await city.getText()).toEqual(targetCity.name);
      await city.click();

      const page = getPageElts();
      expect(await page.cityDetail.isPresent()).toBeTruthy('shows city detail');
      const city2 = await City.fromDetail(page.cityDetail);
      expect(city2.id).toEqual(targetCity.id);
      expect(city2.name).toEqual(targetCity.name.toUpperCase());
    });
  });

  async function dashboardSelectTargetCity() {
    const targetCityElt = getPageElts().topCities.get(targetCityDashboardIndex);
    expect(await targetCityElt.getText()).toEqual(targetCity.name);
    await targetCityElt.click();
    await browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(await page.cityDetail.isPresent()).toBeTruthy('shows city detail');
    const city = await City.fromDetail(page.cityDetail);
    expect(city.id).toEqual(targetCity.id);
    expect(city.name).toEqual(targetCity.name.toUpperCase());
  }

  async function updateCityNameInDetailView() {
    // Assumes that the current view is the city details view.
    await addToCityName(nameSuffix);

    const page = getPageElts();
    const city = await City.fromDetail(page.cityDetail);
    expect(city.id).toEqual(targetCity.id);
    expect(city.name).toEqual(newCityName.toUpperCase());
  }

});

async function addToCityName(text: string): Promise<void> {
  const input = element(by.css('input'));
  await input.sendKeys(text);
}

async function expectHeading(hLevel: number, expectedText: string): Promise<void> {
  const hTag = `h${hLevel}`;
  const hText = await element(by.css(hTag)).getText();
  expect(hText).toEqual(expectedText, hTag);
}

function getCityAEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getCityLiEltById(id: number): ElementFinder {
  const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toCityArray(allCities: ElementArrayFinder): Promise<City[]> {
  return allCities.map(city => City.fromLi(city!));
}
