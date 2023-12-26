import {type Page,type Locator} from '@playwright/test'
import { facebookHomePageLocators } from '../constants/facebookLocators';

export class homePage {
    static instance:homePage
    page: Page
    readonly homeIcon:Locator;
    readonly liveVideoIcon: Locator;
    readonly liveVideoText: Locator;
    readonly photoVideoIcon: Locator;
    readonly photoVideoText: Locator;
    readonly feelingActivityIcon: Locator;
    readonly feelingActivityText: Locator;
    readonly userAvatarButton: Locator;
    readonly logoutButton: Locator;
    constructor(page: Page) {
        this.page = page
        this.homeIcon = page.locator(facebookHomePageLocators.homeIcon)
        this.liveVideoIcon = page.locator(facebookHomePageLocators.liveVideoIcon).nth(0);
        this.liveVideoText = page.locator(facebookHomePageLocators.liveVideoText).nth(0);
        this.photoVideoIcon = page.locator(facebookHomePageLocators.photoVideoIcon).nth(1);
        this.photoVideoText = page.locator(facebookHomePageLocators.photoVideoText).nth(1);
        this.feelingActivityIcon = page.locator(facebookHomePageLocators.feelingActivityIcon).nth(2);
        this.feelingActivityText = page.locator(facebookHomePageLocators.feelingActivityText).nth(2);
        this.userAvatarButton = page.locator(facebookHomePageLocators.userAvatarButton).nth(0);
        this.logoutButton = page.locator(facebookHomePageLocators.logoutButton).nth(5);
    }
    static getInstance(page:Page){
        this.instance = new homePage(page)
        return this.instance
    }
    async logout() {
        await this.page.waitForTimeout(2000);
        await this.userAvatarButton.click();
        await this.page.waitForTimeout(2000);
        await this.logoutButton.click();
    }
}