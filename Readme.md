# Playwright Test Suite for Facebook Login


<b>This repository contains a Playwright test suite for automated testing with example test which contains eleven tests with facebook functionality. The tests cover various aspects of the login process, UI elements, and user interactions.</b>

## Prerequests

``` bash
1.install Node.js on your machine
2.install Playwright package (npm install -D @playwright/test)
3.Be registered on TestRail cloud 
4.install Python 3.10.4 on your machine
5.install Playwright CLI on your machine(pip install trcli)
```

## Installation
1. Install dependencies:
```bash
npm install 
```
## Project structure

1. **homePage.ts** : Contains the class definition for the home page.

2. **loginPage.ts**: Contains the class definition for the login page and the login functionality.

3. **testrailFunctions.ts**: Contains functions for interacting with TestRail and reporting test results.
4. **facebookLocators.ts**: Contains all locators for tests with facebook
5. **facebookConstants.ts**: Contains username and password which are used for tests 
_Before testing please fill them with real username and password_ 
6. **facebook.spec.ts**: Main file with all the tests and functionalities

7. **package.json**: Most important part of the program. Because there are all the scripts, dependencies etc.

## How to use

I want to say that there are 3 different methods to create and submit/change your test cases and runs on TestRail.

* Let's start from package.json
```
You can see that there is "pwSubmit" on "scripts" part.

playwright test & trcli -y -h {YOUR_TESTRAIL_HOST} --project \"{YOUR_PROJECT_NAME}\" --username {YOUR_USERNAME} --password {YOUR_PASSWORD} parse_junit --title \"{TEST_RUN_NAME}\" -f ./test-results/junit-report.xml

here is the code which you should past there
just add all missing info and it will work.
```
It means that after `npm run pwSubmit` command you will see that all your test cases were created with test results (e.g passed or failed)

* Now let's check second reporter

```
Click on "node_modules", then "playwright-testrali-reporter" , then "README.md"
This is reporter from github, so here is its instruction. Just fill missing parts and all will work
```

* And third

```
Look at testrailFunctions.ts 
Just fill authorization header and your testrail host for submitting data. It's important, that you should have created test run which have runs and paste test run "id"-s on end(look at facebook.spec.ts, which is an example)
Also don't forget about test.afterEach() function, which does all the work( facebook.spec.ts lines 13-15) and add your test case run id in the tests(f.e. line 18)
```

# So, choose which variant you want to use and enjoy creating and submitting test cases and runs on Testrail!
