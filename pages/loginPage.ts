import { Locator, Page } from '@playwright/test'
import { facebookLoginPageLocators } from '../constants/facebookLocators';
import { homePage } from './homePage';
export class loginPage {
    readonly page: Page;
    readonly facebookLogo: Locator;
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;
    readonly forgotPasswordLink: Locator;
    readonly createNewAccountButton: Locator;
    constructor(page: Page) {
        this.page = page;
        this.facebookLogo = page.locator(facebookLoginPageLocators.facebookLogo);
        this.usernameTextbox = page.locator(facebookLoginPageLocators.usernameTextbox);
        this.passwordTextbox = page.locator(facebookLoginPageLocators.passwordTextbox);
        this.loginButton = page.locator(facebookLoginPageLocators.loginButton);
        this.forgotPasswordLink = page.locator(facebookLoginPageLocators.forgotPasswordLink);
        this.createNewAccountButton = page.locator(facebookLoginPageLocators.createNewAccountButton);
    }

    async login(username: string, password: string,page:Page) {
        await this.usernameTextbox.fill(username);
        await this.passwordTextbox.fill(password);
        await this.loginButton.click();
        return homePage.getInstance(page);
    }
}


