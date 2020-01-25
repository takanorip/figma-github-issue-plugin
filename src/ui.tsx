import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

import './ui.css'

declare function require(path: string): any

const Octokit = require("@octokit/rest")

const App = () => {

  useEffect(() => {
    window.addEventListener('message', onMessage)
    parent.postMessage({ pluginMessage: { type: 'init' } }, '*')
  })

  const [repositoryUrl, setRepositoryUrl] = useState<string>('')
  const [issueTitle, setIssueTitle] = useState<string>('')
  const [issueBody, setIssueBody] = useState<string>('')
  const [imageArr, setImageArr] = useState<Uint8Array>(null)
  const [token, setToken] = useState<string>('')

  const sendInit = () => {
    parent.postMessage({ pluginMessage: { type: 'init' } }, '*')
  }

  const onCreateissue = async () => {
    const octokit = new Octokit({
      auth: token,
    })

    const urlPathArr = new URL(repositoryUrl).pathname.split('/')
    const owner = urlPathArr[1]
    const repo = urlPathArr[2]

    const branchList = await octokit.repos.listBranches({
      owner,
      repo
    })
    const hasFigmaBranch = branchList.some(branch => branch.name = 'figma-issue')

    if (!hasFigmaBranch) {
      const masteRref = await octokit.git.getRef({
        owner,
        repo,
        ref: 'master'
      })
      await octokit.git.createRef({
        owner,
        repo,
        ref: 'refs/heads/figma-issue',
        sha: masteRref.object.sha,
      })
    }

    // upload image
    const ascii = new Uint8Array(imageArr);
    const b64encoded = btoa(String.fromCharCode.apply(null, ascii));
    const { data: { content } } = await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: `${issueTitle}.png`,
      message: 'add figma issue image',
      content: b64encoded,
    })
    const imageUrl = content.url

    await octokit.issues.create({
      owner,
      repo,
      title: issueTitle,
      body: `${issueBody}
      ${imageUrl}`,
    })
  }

  const onMessage = (event: MessageEvent) => {
    const message = event.data.pluginMessage
    setIssueTitle(message.node.name)
    setImageArr(message.imageArr)
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
        <button onClick={sendInit}>log</button>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react-page'))
