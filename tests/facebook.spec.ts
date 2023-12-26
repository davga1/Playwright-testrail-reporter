import { homePage } from '../pages/homePage';
import { loginPage } from '../pages/loginPage'
import { _afterEach } from '../constants/testrailFunctions';
import { test, expect } from '@playwright/test'
import { facebookusernameAndPassword } from '../constants/facebookConstants';


var id: number
test.beforeEach(async ({page}) =>{
    await page.goto('https://www.facebook.com/')
})

// test.afterEach(async ({}, testInfo) => {
//     await _afterEach(id,testInfo)
// })

test('User can enter to facebook.com', async ({ page }) => {
    id = 86
    await expect(page). toHaveTitle('Facebook - log in or sign up', { timeout: 5000 })
})
 test('Facebook logo has correct CSS', async ({ page }) => {
     id = 87
     const fb = new loginPage(page);
     await expect(fb.facebookLogo).toHaveCSS('height', '106px', { timeout: 10000 })
     await expect(fb.facebookLogo).toHaveCSS('margin', '-28px')
 })
 test('Username and password textboxes have right hint texts', async ({ page }) => {
     id = 88
     const fb = new loginPage(page);
     await expect(fb.usernameTextbox).toHaveAttribute('placeholder', 'Email or phone number', { timeout: 10000 })
     await expect(fb.passwordTextbox).toHaveAttribute('placeholder', 'Password')
 })
 test('Log in button has correct CSS', async ({ page }) => {
     id = 89
     const fb = new loginPage(page);
     await expect(fb.loginButton).toHaveCSS('background-color', 'rgb(24, 119, 242)', { timeout: 10000 })
     await expect(fb.loginButton).toHaveCSS('border-radius', '6px')
     await expect(fb.loginButton).toHaveCSS('line-height', '48px')
     await expect(fb.loginButton).toHaveCSS('font-size', '20px')
     await expect(fb.loginButton).toHaveCSS('padding', '0px 16px')
     await expect(fb.loginButton).toHaveCSS('width', '332px')
     })
 test('Forgot password link has correct CSS', async ({ page }) => {
     id = 90
     const fb = new loginPage(page);
     await expect(fb.forgotPasswordLink).toHaveCSS('color', 'rgb(24, 119, 242)', { timeout: 10000 })
     await expect(fb.forgotPasswordLink).toHaveCSS('font-size', '14px')
     await expect(fb.forgotPasswordLink).toHaveCSS('font-weight', '500')
 })
 test('"Create new account" button has correct CSS', async ({ page }) => {
     id = 91
     const fb = new loginPage(page);
     await expect(fb.createNewAccountButton).toHaveCSS('background-color', 'rgb(66, 183, 42)', { timeout: 10000 });
     await expect(fb.createNewAccountButton).toHaveCSS('border-radius', '6px');
     await expect(fb.createNewAccountButton).toHaveCSS('line-height', '48px');
     await expect(fb.createNewAccountButton).toHaveCSS('font-size', '17px');
     await expect(fb.createNewAccountButton).toHaveCSS('padding', '0px 16px');
 })
 test('User can login to facebook', async ({ page }) => {
    let _homePage:homePage = new  homePage(page) ;
     id = 92
     const fb = new loginPage(page)
      _homePage = await fb.login(facebookusernameAndPassword.username,facebookusernameAndPassword.password,page)
     await expect(_homePage.homeIcon).toBeVisible()
 })
 test('"Live video" icon has correct height, width and "Live video" text exists', async ({ page }) => {
    let _homePage:homePage = new  homePage(page) ;
     id = 93
     const fb = new loginPage(page)
     _homePage = await fb.login(facebookusernameAndPassword.username,facebookusernameAndPassword.password,page)
     await expect(_homePage.liveVideoIcon).toHaveCSS('height', '24px', { timeout: 10000 })
     await expect(_homePage.liveVideoIcon).toHaveCSS('width', '24px');
     await expect(_homePage.liveVideoText).toHaveText('Live video')
 })
 test('"Photo/video" icon has correct height, width and "Photo/video" text exists', async ({ page }) => {
    let _homePage:homePage = new  homePage(page) ;
     id = 94
     const fb = new loginPage(page);
     _homePage = await fb.login(facebookusernameAndPassword.username,facebookusernameAndPassword.password,page)
     await expect(_homePage.photoVideoIcon).toHaveCSS('height', '24px', { timeout: 10000 })
     await expect(_homePage.photoVideoIcon).toHaveCSS('width', '24px');
     await expect(_homePage.photoVideoText).toHaveText('Photo/video')
 })
 test('"Feeling/activity" icon has correct height, width and "Feeling/activity" text exists', async ({ page }) => {
    let _homePage:homePage = new  homePage(page) ;
     id = 95
     const fb = new loginPage(page);
     _homePage = await fb.login(facebookusernameAndPassword.username,facebookusernameAndPassword.password,page)
     await expect(_homePage.feelingActivityIcon).toHaveCSS('height', '24px', { timeout: 10000 })
     await expect(_homePage.feelingActivityIcon).toHaveCSS('width', '24px');
     await expect(_homePage.feelingActivityText).toHaveText('Feeling/activity')
 })
 test('Logging out from Facebook is working correctly', async ({ page }) => {
    let _homePage:homePage = new  homePage(page) ;
     id = 96
     const fb = new loginPage(page);
     _homePage = await fb.login(facebookusernameAndPassword.username,facebookusernameAndPassword.password,page)
     await _homePage.logout();
     await expect(page).toHaveTitle('Facebook - log in or sign up', { timeout: 10000 });
 })