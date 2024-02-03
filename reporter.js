let AUTHORIZATION_HEADER = ''
let TESTRAIL_HOST = ''

var once_per_day = true
var todayDate =  new Date().toDateString()
var case_titles_from_testrail = []
var test_case_titles = []
var case_ids = []
const runName = `Test run:${todayDate}`
const projectId = 1
var runId
var results = []
var case_index = 0
//function which gets all the cases from testrail project
async function getCases(project_id) {
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/get_cases/${project_id}`, {
    method: 'GET',
    headers: {
      'Authorization': AUTHORIZATION_HEADER,
    }
  })
  var result = JSON.parse(await response.text())
  // console.log('Got all cases from project:', result == [] ? 'No test case on project' : result['cases'])
  return result['cases']
}
//function which adds new case in testrail project
async function addCase(section_id, runName) {
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/add_case/${section_id}`, {
    method: 'POST',
    headers: {
      'Authorization': AUTHORIZATION_HEADER,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'title': runName,
    })
  })
  var id = JSON.parse(await response.text()).id
  case_ids.push(id)
  console.log('Succesfully added new test case to your project with id ',id)
}
//function which adds new test run
async function addRun(run_name, project_id) {
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/add_run/${project_id}`, {
    method: 'POST',
    headers: {
      'Authorization': AUTHORIZATION_HEADER,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'name': run_name,
      'include_all': false,
    })
  })
  runId = JSON.parse(await response.text()).id
  console.log('Succesfully added new run:',runId)
}
//function which updates the test run
async function updateRun(run_id, case_ids) {
  await fetch(`${TESTRAIL_HOST}//index.php?/api/v2/update_run/${run_id}`, {
    method: 'POST',
    headers: {
      'Authorization': AUTHORIZATION_HEADER,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'include_all': false,
      'case_ids': case_ids
    })
  })
  console.log('Succesfully updated the run:', run_id)
}

//function which adds all the results for test cases
async function addResultsForCases(run_id, results) {
  const a = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/add_results_for_cases/${run_id}`, {
    method: 'POST',
    headers: {
      'Authorization': AUTHORIZATION_HEADER,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      'results': results
    })
  })
  console.log(JSON.parse(await a.text()))
}
//gets last run from your test runs
async function getLastRun(project_id){
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/get_runs/${project_id}`,{
    method:'GET',
    headers:{
      'Authorization': AUTHORIZATION_HEADER,
      'Content-type': 'application/json'
    }
  })
  var runs = JSON.parse(await response.text())['runs'] 
  return runs.length == 0 ? '' : runs[0]
}


class BaseReporter {
  constructor(options = {}) {
    this.config = void 0;
    this.suite = void 0;
    this.totalTestCount = 0;
    this.result = void 0;
    this.fileDurations = new Map();
    this._omitFailures = void 0;
    this._fatalErrors = [];
    this._failureCount = 0;
    this._omitFailures = options.omitFailures || false;
  }
  version() {
    return 'v2';
  }
  onConfigure(config) {
    this.config = config;
  }
  async onBegin(suite) {
    if (once_per_day == true){
      var last_title = (await getLastRun(projectId)).name
     if(last_title != undefined){
      var _date = last_title.split(':')[1]
      if(todayDate == _date){
        runId = (await getLastRun(projectId)).id
      }else {
        await addRun(runName,projectId)
      }
    }else await addRun(runName,projectId)
     } else await addRun(runName,projectId)
    // reporter takes all the cases from testrail project
    const test_cases_in_testrail = await getCases(projectId)
    this.suite = suite;
    this.totalTestCount = suite.allTests().length;
    const allTests = suite.allTests()
    //gets project's test case titles and then compares with local test titles. If test;s title is the same as in testrail project, it takes testrail project's case id instead of creating new test case, then adds it to the case_ids list, which contains current case ids
    allTests.forEach(_test => {
      test_case_titles.push(_test.title)
      test_cases_in_testrail.forEach(el => {
        if (_test.title == el.title) {
          case_titles_from_testrail.push(el.title)
          case_ids.push(el.id)
          return false
        }
      })
    })
    test_case_titles = test_case_titles.filter(item => !case_titles_from_testrail.includes(item))
    test_case_titles.forEach(async _title => {
      await addCase(1, _title)
    })
    //checks todays date and last run's date, they if once_per_day is true takes last run's ID and makes all the functions there. If once_per_day is false or date aren't the same it creates new run 
//     if(once_per_day == true){
//       var _title = await getLastRun(projectId).name
//      if(_title != undefined){
//       var _date = _title.split(':')[1]
//      }
//     }
//     console.log('DATE', _date)
// if(_title == undefined){
//   await addRun(runName,projectId)
//   console.log(_date,'DATE')
//   console.log(_title,'TITLE')
// } else {
//   if(once_per_day == true){
//     todayDate == _date ? runId = await getLastRun(projectId).id : await addRun(runName, projectId) 
//   }await addRun(runName,projectId)
// }
  }


  onStdOut(chunk, test, result) {
    this._appendOutput({
      chunk,
      type: 'stdout'
    }, result);
  }
  onStdErr(chunk, test, result) {
    this._appendOutput({
      chunk,
      type: 'stderr'
    }, result);
  }
  _appendOutput(output, result) {
    if (!result) return;
    result[kOutputSymbol] = result[kOutputSymbol] || [];
    result[kOutputSymbol].push(output);
  }
  onTestBegin(test, result) { }
  async onTestEnd(test, result) {
    if (result.status == 'passed') {
      results.push({
        "case_id": case_ids[case_index],
        "status_id": 1,
        "comment": "This test passed",
      })
    } else if (result.status == 'failed') {
      results.push({
        "case_id": case_ids[case_index],
        "status_id": 5,
        "comment": "This test failed",
      })
    }

    if (result.status !== 'skipped' && result.status !== test.expectedStatus) ++this._failureCount;
    // Ignore any tests that are run in parallel.
    for (let suite = test.parent; suite; suite = suite.parent) {
      if (suite._parallelMode === 'parallel') return;
    }
    case_index++

  }
  onError(error) {
    this._fatalErrors.push(error);
  }
  async onEnd(result) {
    this.result = result;
    await updateRun(runId, case_ids)
    console.log('CASE IDS', case_ids)
    results[0].case_id = case_ids[0]
    await addResultsForCases(runId, results)
  }
  onStepBegin(test, result, step) { }
  onStepEnd(test, result, step) { }
  async onExit() { }
  printsToStdio() {
    return true;
  }
  fitToScreen(line, prefix) {
    if (!ttyWidth) {
      // Guard against the case where we cannot determine available width.
      return line;
    }
    return fitToWidth(line, ttyWidth, prefix);
  }
  generateStartingMessage() {
    var _this$config$metadata;
    const jobs = (_this$config$metadata = this.config.metadata.actualWorkers) !== null && _this$config$metadata !== void 0 ? _this$config$metadata : this.config.workers;
    const shardDetails = this.config.shard ? `, shard ${this.config.shard.current} of ${this.config.shard.total}` : '';
    if (!this.totalTestCount) return '';
    return '\n' + colors.dim('Running ') + this.totalTestCount + colors.dim(` test${this.totalTestCount !== 1 ? 's' : ''} using `) + jobs + colors.dim(` worker${jobs !== 1 ? 's' : ''}${shardDetails}`);
  }
  getSlowTests() {
    if (!this.config.reportSlowTests) return [];
    const fileDurations = [...this.fileDurations.entries()];
    fileDurations.sort((a, b) => b[1] - a[1]);
    const count = Math.min(fileDurations.length, this.config.reportSlowTests.max || Number.POSITIVE_INFINITY);
    const threshold = this.config.reportSlowTests.threshold;
    return fileDurations.filter(([, duration]) => duration > threshold).slice(0, count);
  }
  generateSummaryMessage({
    didNotRun,
    skipped,
    expected,
    interrupted,
    unexpected,
    flaky,
    fatalErrors
  }) {
    const tokens = [];
    if (unexpected.length) { }
    if (interrupted.length) { }
    if (flaky.length) { }
    if (skipped) { }
    if (didNotRun) { }
    if (expected) { }
    if (this.result.status === 'timedout') { }
    if (fatalErrors.length && expected + unexpected.length + interrupted.length + flaky.length > 0) { }
  }
  generateSummary() {
    let didNotRun = 0;
    let skipped = 0;
    let expected = 0;
    const interrupted = [];
    const interruptedToPrint = [];
    const unexpected = [];
    const flaky = [];
    this.suite.allTests().forEach(test => {
      switch (test.outcome()) {
        case 'skipped':
          {
            if (test.results.some(result => result.status === 'interrupted')) {
              if (test.results.some(result => !!result.error)) interruptedToPrint.push(test);
              interrupted.push(test);
            } else if (!test.results.length) {
              ++didNotRun;
            } else {
              ++skipped;
            }
            break;
          }
        case 'expected':
          ++expected;
          break;
        case 'unexpected':
          unexpected.push(test);
          break;
        case 'flaky':
          flaky.push(test);
          break;
      }
    });
    const failuresToPrint = [...unexpected, ...flaky, ...interruptedToPrint];
    return {
      didNotRun,
      skipped,
      expected,
      interrupted,
      unexpected,
      flaky,
      failuresToPrint,
      fatalErrors: this._fatalErrors
    };
  }
  epilogue(full) {
    const summary = this.generateSummary();
    const summaryMessage = this.generateSummaryMessage(summary);
    if (full && summary.failuresToPrint.length && !this._omitFailures) this._printFailures(summary.failuresToPrint);
    this._printSlowTests();
    this._printMaxFailuresReached();
    this._printSummary(summaryMessage);
  }
  _printFailures(failures) {
    console.log('');
    failures.forEach((test, index) => {
      console.log(formatFailure(this.config, test, {
        index: index + 1
      }).message);
    });
  }
  _printSlowTests() { }
  _printMaxFailuresReached() { }
  _printSummary(summary) { }
  willRetry(test) { }
}
module.exports = BaseReporter