let AUTHORIZATION_HEADER = ''
let TESTRAIL_HOST = ''

let projectId = 1
let runName = 'New Test Run:' + new Date().toDateString()
let results = []
let case_index = 0
let testrail_cases = []
let case_ids = []
let once_per_day = true


async function get_cases_from_testrail(project_id) {
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/get_cases/${project_id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTHORIZATION_HEADER
    }
  })
  const result = JSON.parse(await response.text())['cases']
  return result
}

async function add_run(run_name, project_id, case_ids) {
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/add_run/${project_id}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTHORIZATION_HEADER
    },
    body: JSON.stringify({
      "include_all": false,
      "name": run_name,
      "case_ids": case_ids
    })
  })
  return JSON.parse(await response.text())
}

async function add_results_for_cases(run_id, _results) {
  await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/add_results_for_cases/${run_id}`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTHORIZATION_HEADER
    },
    body: JSON.stringify({
      "results": _results
    })
  })
}

async function get_runs(project_id) {
  const response = await fetch(`${TESTRAIL_HOST}/index.php?/api/v2/get_runs/${project_id}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": AUTHORIZATION_HEADER
    },
  })
  return JSON.parse(await response.text())
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
    const localTests = suite.allTests()
    await get_cases_from_testrail(projectId).then((res) => {
      res.forEach((el) => {
        testrail_cases.push(el)
      })
    })
    localTests.forEach(async (_test) => {
      testrail_cases.forEach((t_test) => {
        if (_test.title == t_test.title) {
          case_ids.push(t_test.id)
        }
      })
    })
    try {
      if (once_per_day == true) {
        await get_runs(projectId).then((res) => {
          const last_run = res['runs'][0]
          const last_run_name = last_run.name
          if (last_run_name.split(':')[1] == new Date().toDateString()) {
            global.runId = last_run.id
            global.url = last_run.url
          }
        })
      } else {
        const res = await add_run(runName, projectId, case_ids);
        if (res && typeof res.id === 'number') {
          global.runId = res.id;
          global.url = res.url
        } else {
          console.error("Invalid response from add_run:", res);
        }
      }

    } catch (error) {
      console.error("Error while calling add_run:", error);
    }
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
    }
    else if (result.status == 'failed') {
      results.push({
        "case_id": case_ids[case_index],
        "status_id": 5,
        "comment": result.error?.message.replace(/(\u001b\[\d+m)/g, '').replace(/(\n)/, '\n').replace(/\/\/ Object\.is equality/g, '')
      })
    }
    case_index++
  }
  onError(error) {
    this._fatalErrors.push(error);
  }
  async onEnd(result) {
    await add_results_for_cases(global.runId, results)
    console.log('See results! :', global.url)

  }
  onStepBegin(test, result, step) { }
  onStepEnd(test, result, step) { }
  async onExit() {
  }
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
export default BaseReporter