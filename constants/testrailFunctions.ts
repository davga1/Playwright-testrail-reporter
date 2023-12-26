let AUTHORIZATION_HEADER = ''
let YOUR_TESTRAIL_HOST = ''

export async function passed(id: number) {
    await fetch(`${YOUR_TESTRAIL_HOST}/index.php?/api/v2/add_result/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            "comment": "Test passed succesfully",
            "status_id": 1
        })
        ,
        headers: { 'Authorization': AUTHORIZATION_HEADER, 'Content-Type': 'application/json' }
    });
    console.log(`Test passed succesfully`)
    console.log(`ID: ${id}`)
}
export async function failed(id: number, text: string) {
    const response = await fetch(`${YOUR_TESTRAIL_HOST}/index.php?/api/v2/add_result/${id}`, {
        method: 'POST',
        body: JSON.stringify({
            "comment": text,
            "status_id": 5,
        }),
        headers: { 'Authorization': AUTHORIZATION_HEADER, 'Content-Type': 'application/json' }
    });
    console.log('problem:', response.body)
    console.log(`ID: ${id}`)
}

export async function _afterEach (id:number,info){
        if (info.status == 'failed') {
            let a = (info.error?.message?.split('Call'))
            await failed(id, a![0].toString())
            console.log(a![0].toString())
        }
        if (info.status == 'passed')
            await passed(id);
}