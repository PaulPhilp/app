require('@babel/polyfill');

import * as moment from 'moment';

const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery({
    "projectId":"amityamitydatasandbox",
    credentials: {
        "client_email": "amityamity-bq-standard@amityamitydatasandbox.iam.gserviceaccount.com",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDU25gMrHyFtSmd\nGrqwU3h52MB98J1cFAcUzzQtTecTpYLYmAuH8MZJkbTZysTdnHdKulDhTrpnebDf\nXI3H6ON/Sf8mBTrC53L1FdGgXaMV6tcdyBfZJQ8lZLXZOxVPcXB+YcaX6g9uWYCT\nQ4rv6zISzIBsRmn6rwePeQ7MqytGM1t5ld8UOBnuYL6sSFS9OfXwyFep+46dXkSd\nHKcJYiqGGFtDbl+ctnJUdn6SN27orMHEA4owW8ups2gjyS3Z13VVIj+OEZOypkws\nKrbjIZpO/Sa4rTQkLynfnJAkWQWPKniP/iltydPKTZNv+FlBNYMkVQNNz+wThcNw\nzE01rAYVAgMBAAECggEAAtkxbrH8NJnZBbYu218ylIbXBJhssqe99IRVUWnidrvX\nRWi7dsU9Egz2G5gADGskmYZmwK0aB3p0aHjHmO4/5RsrY+ncAHGycx8on/nAzfFH\nkal00D4Tts9jM5X70gVVmQtb6fqC3FosQ0w7FrzR/bho24oRrv4ansvi69A6kwTk\nrAAUUziq5KQh3lynJ840xs85ninfaxmc1ZB6O0VWbjQpWavPphEENwyv88SaL3gU\nUgeNo1bs87TVr46d9jQ6HWvys0aU0N+MMdEgSoUIJRVgyg814bxFMlJtCyJNGiDX\nwN+f5+Wb1Zm6yYYs2CYPioVf/N+i08mDc//yOjRs4QKBgQDr6wGfPaEnp/8mzapb\nn6EizLRwBBbTRlSTRr8XqERXOnSTDpHWOu0dTayWYnMEjo5cmmmhKsBpeetPjb81\niC5ujnx+dEdLQS5riRdHuC655EmmGaGvHTorZHOMMdvNIJibkJP23zKpsO0KY0/S\nsnwjPwAi3zVIYMclBjLU+UAJ7QKBgQDm+hKMhXFB3+pY90bVqVBDOkMRkZvgtjCJ\nAL8dnDT5FcGvvEIGpQWslBlN7aKRckT868EfWO1S0rn4XLzBfkQ59jWgolGzJcJL\nE12L4LX3cY3iSA6/bH7K7t1OOCdU6cT7JYs/P6BKuzgjr0KLIinZKH54cQyRxL5B\nu6HeW8HHyQKBgQCcenLH+WvDzuUpCq8dOKL7XwWrarrtBbAhQ4KKIXy60rXxuG84\nxjrx/cwkr0YU1q1MdMrtMFsRWuGeEamqyxnpEK84fM2w95nfj72WP28Ws3m6JzQb\n32nu0CDn80YUJ7OxM1NBIsgKz6RaCIcwfFxkUGw5tQ01ZaORRiw/INe9/QKBgQDB\nPrIsLSz/r0ZTHrd95UVIqcMZPNjMncFnrl83d8x+JWzCCeC3zHM92z58i3f69j6v\n2NLf1jfglnuPRo+J14lfcRWXCpcOKmYvB8m5UM0NdEz/58em8i/2uvgfDC4kBd2P\nPe8NgL8sJw0mFei3nWKj1BRT0klw38lKF6Cq99vduQKBgQDOdUNUzDdTDhWzqmTO\n0MtTmOLHKy0LWuogGskEzde8B0D+30Kr5cYCOya8qhmMxywODkq8FcJ3YrnpxUuU\nFHk6hG90k5VKjo55oli6ez0X8/K91bQVfKh/djG9jBuCA1kfWyFI5G9qvQzamoLh\nH2OFRt37ONmkhpxiMrt3HEZckg==\n-----END PRIVATE KEY-----\n",
        }
    });

const dataset = bigquery.dataset('amity_activities');
const table = dataset.table('activities');
const query =
`SELECT count(act_id) as count, yr, mo, act_account_id, act_account_name 
   FROM (
      SELECT act_id, act_name, created_at, EXTRACT(YEAR FROM created_at) as yr, EXTRACT(MONTH FROM created_at) as mo, act_account_id, act_account_name
          FROM \`amityamitydatasandbox.amity_activities.Activity\` 
         WHERE (EXTRACT(YEAR FROM created_at) >= 2020)
        AND (act_customer_status = "active"))
GROUP BY 
    yr,
    mo,
    act_account_id, 
    act_account_name
  `

const dataForge = require('data-forge')

export class Query {

    constructor() {
        console.log(`Query()`)
        this.query = query
        this.dataframe = null
        this.location = 'US'
        }

    static async sleep(ms) {
        // console.log(`sleep(${ms})`)
        return new Promise(resolve => setTimeout(resolve, ms));
        }
    
    static async jobIsRunning(job) {
        // console.log(`jobIsRunning()`)
        let metadata = await job.getMetadata()
        return metadata[0].status.state === 'RUNNING'
        }

    async runQuery() {
        console.log(`Query.runQuery()`)
        const options = {
            query: this.query,
            // Location must match that of the dataset(s) referenced in the query.
            location: this.location,
            };
  
        // console.log(options)
        // Run the query as a job
        const [job] = await bigquery.createQueryJob(options);
        console.log(job)
        do {
            await Query.sleep(1000)
        }   
        while(await Query.jobIsRunning(job)) 

        const [rows] = await job.getQueryResults();
        console.log(`Number of Rows :: ${rows.length}`)
        this.dataframe = new dataForge.DataFrame(rows)
        console.log(`Number of Rows :: ${this.dataframe.count()}`)
        return this
        }

    groupByYears(accounts) {

        let accountYears = {}

        for (const acct of accounts) { 
            let accountName = acct.getSeries('act_account_name').distinct().first()
            let accountYear = acct.getSeries('yr').distinct().first()
            if (!accountYears[accountName]) accountYears[accountName] = {}
            let yearsGroup = acct.groupBy(row => row.yr)
            yearsGroup.forEach((group, g) => {
                let accountYear = group.getSeries('yr').distinct().first()
                accountYears[accountName][accountYear] = group.count()
                })
            
            }

        let rows = []
        Object.keys(accountYears).forEach((accountName,a) => {
            let years = accountYears[accountName]
            Object.keys(years).forEach((year, y) => {
                let row = {id: `${accountName}-${year}`, accountName: accountName, count: accountYears[accountName][year], year: year}
                rows.push(row)
                })
            })

        return rows.sort((val, prev) => { 
            return val.accountName < prev.accountName;
            })
        }

    groupByMonths(accounts) {
        console.log(`groupByMonths(${accounts.count()})`)
        console.log(accounts.first())

        let data = accounts
                    .groupBy(row => row.AccountYearMonth)

        console.log(`Number of Groups = ${data.count()}`)

        data = data.select(group => {
                        let first = group.first()
                        console.log(`first ${JSON.stringify(first)}`)
                        return {
                            accountMoYr: `${first.act_account_name}-${first.yr}-${first.mo}`,
                            accountName: first.act_account_name,
                            month: first.mo,
                            year: first.yr,
                            Month: first.Month,
                            Year: first.Year,
                            Quarter: first.Quarter,
                            count: first.count
                            }
                        })
                    .groupBy(row => row.accountName)
                    .select(group => {
                        let data = {}
                        data.accountName = group.first().accountName
                        group.forEach((grp, g) => {
                            
                            data[`count${g}`] = grp.count
                            })
                        return data
                        })

        console.log(data.count())
        
        data = data.
                where(row => {
                    let total = 0
                    // console.log(row)
                    console.log(total)
                    for (let m = 0;  m < 6; m++) {
                        console.log(m)
                        console.log(row[`count${m}`])
                        total += row[`count${m}`]
                        }
                    console.log(total)
                    console.log(`\n`)
                    return total > 500
                })

    console.log(data.count())
    return data.toArray()

        data = data.select((group, g) => { 
                        return {
                            accountName: group.first().act_account_name,
                            month: group.first().mo,
                            count: group.count()
                            }
                    })

        data.groupBy(row => row.mo)
                .forEach((accountGroup, ag) => { 
                    console.log(`AccountGroup ${ag} :: ${accountGroup.first().act_accountName}`)
                    return accountGroup.forEach((monthGroup, mg) => { 
                        console.log(`MonthGroup ${mg} :: ${monthGroup.first().mo}`)
                        return {
                            accountName: monthGroup.first().act_accountName,
                            month: monthGroup.first().mo,
                            count: monthGroup.count()
                            }
                        })
                    })
                


                

        
        let accountMonths = {}
        for (const acct of accounts) { 
            let accountName = acct.getSeries('act_account_name').distinct().first()
            let accountMonth = acct.getSeries('mo').distinct().first()
            if (!accountMonths[accountName]) accountMonths[accountName] = {}
            let monthsGroup = acct.groupBy(row => row.mo)
            monthsGroup.forEach((group, g) => {
                let accountMonth = group.getSeries('mo').distinct().first()
                accountMonths[accountName][accountMonth] = group.count()
                })
            
            }

        let rows = []
        Object.keys(accountMonths).forEach((accountName,a) => {
            let months = accountMonths[accountName]
            rows[a] = {'accountName': accountName}
            Object.keys(months).forEach((month, m) => {
                let monthName = `count${m}`
                rows[a][monthName] = accountMonths[accountName][month]
                })
            })

        return rows

        /***/
        }

    getData() {
        console.log(`Query.getData()`)

        function cleanRow(row) {
            return (typeof row.act_account_name === 'string')
                && (typeof row.mo === 'number')
                && (typeof row.yr === 'number')
            }

        function transformRow(inputRow) {
            
            return { 
                AccountYearMonth: `${inputRow.act_account_name}-${inputRow.yr}-${inputRow.mo}`,
                }
            }

        console.log(`Original Data = ${this.dataframe.count()}`)
        console.log(this.dataframe.first())

        let accounts =  this.dataframe
                            .where(cleanRow)
                            .generateSeries(row => transformRow(row))
                            
        return this.groupByMonths(accounts)
        }
    }
 