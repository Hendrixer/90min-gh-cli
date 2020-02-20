#!/usr/bin/env node
const prog = require('caporal');
const { Octokit } = require("@octokit/rest");
const chalk = require('chalk')


const octokit = new Octokit({
  auth: process.env.GH_TOKEN
})

prog
  .version('1.0.0')
  // you specify arguments using .argument()
  // 'app' is required, 'env' is optional
  .command('star', 'Star an repo')
  .argument('<repo>', 'Repo to start', prog.STRING)
  .action(async (args, options, logger) => {
    const [owner, repo] = args.repo.split('/')

    try {
      await octokit.activity.starRepo({
        owner,
        repo
      })
  
      console.log(chalk.magenta(`Succces ⭐️`))

    } catch (e) {
      console.error(chalk.red(`${e}`))

    }
  })

  .command('repos', 'get users repos')
  .argument('<repo>', 'Repo to start', prog.STRING)
  .action(async (args, options, logger) => {
    const [owner, repo] = args.repo.split('/')

    try {
      const result = await octokit.pulls.list({
        owner,
        repo
      })
  
      console.log(JSON.stringify(result.data.map(({number, state, title}) => ({
        title,
        state,
        number
      })), null, 2))

    } catch (e) {
      console.error(chalk.red(`${e}`))

    }
  })
 
prog.parse(process.argv);
