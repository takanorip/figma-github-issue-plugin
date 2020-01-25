import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

import './ui.css'

declare function require(path: string): any

const Octokit = require("@octokit/rest")

const App = () => {

  useEffect(() => {
    window.addEventListener('message', onMessage)
  })

  const [repositoryUrl, setRepositoryUrl] = useState<string>('')
  const [issueTitle, setIssueTitle] = useState<string>('')
  const [issueBody, setIssueBody] = useState<string>('')
  const [token, setToken] = useState<string>('')

  const onCreateissue = async () => {
    const octokit = new Octokit({
      auth: token,
    })
    const urlPathArr = new URL(repositoryUrl).pathname.split('/')
    await octokit.issues.make({
      owner: urlPathArr[1],
      repo: urlPathArr[2],
      title: issueTitle,
      body: issueBody,
    })
  }

  const onMessage = (event: MessageEvent) => {
    const message = event.data.pluginMessage
    setIssueTitle(message.node.name)
  }

  const onQuit = () => {
    parent.postMessage({ pluginMessage: { type: 'quit' } }, '*')
  }

  return (
    <div>
      <img src={require('./logo.svg')} />
      <h2 className="title">GitHub Isssue Maker</h2>
      <div>
        <label htmlFor="">Your Access Token</label>
        <input value={token} onChange={e => setToken(e.target.value)} />
      </div>
      <div>
        <label htmlFor="">Repository URL</label>
        <input value={repositoryUrl} onChange={e => setRepositoryUrl(e.target.value)} />
      </div>
      <div>
        <label htmlFor="">Issue Title</label>
        <input value={issueTitle} onChange={e => setIssueTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="">Issue body</label>
        <input value={issueBody} onChange={e => setIssueBody(e.target.value)} />
      </div>
      <div>
        <button onClick={onCreateissue}>Create</button>
        <button onClick={onQuit}>Quit</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
