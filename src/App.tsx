import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

type Attendance = 'Present & Voting' | 'Present' | 'Absent'

type Member = {
  name: string
  attendance: Attendance
}

const motionList = [
  'Motion to Adjourn Debate',
  'Motion to Suspend Debate',
  'Motion to Expel Member(s) from the Party',
  'Motion for Confidence',
  'Motion for Vote of No Confidence',
  'Motion to Table Draft Bill',
  'Motion to Table Unfriendly Amendment',
  'Motion to Introduce Draft Bill',
  'Motion to Introduce Unfriendly Amendment',
  'Motion to Move into Direct Voting Procedures',
  'Motion for an Unmoderated Caucus',
  'Motion for a Party Caucus',
  'Motion for a Moderated Caucus',
  'Motion to Extend / Elapse Caucus',
  'Motion to Amend Speaking Time',
  'Motion to Divide the Question',
  'Motion to Divide the House',
  'Motion for a Roll Call Vote',
]

function initials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function AppShell() {
  const [members, setMembers] = useState<Member[]>([
    {name: 'Abdul Hamid Jumat', attendance:'Present & Voting'},
    {name: 'Ahmad bin Ibrahim', attendance:'Present & Voting'},
    {name:'Chor Yeok Eng', attendance:'Present & Voting'},
    {name: 'Fong Swee Suan' , attendance: 'Present' },
    {name:'Goh Keng Swee', attendance:'Present & Voting'},
    {name: 'James Joseph Puthucheary', attendance:'Present'},
    {name: 'K. M. Byrne', attendance:'Present & Voting'},
    {name: 'Lee Khoon Choy', attendance:'Present & Voting'},
    {name: 'Lee Kuan Yew', attendance: 'Present & Voting' },
    {name:'Lee Siew Chow', attendance:'Present & Voting'},
    {name: 'Lim Chin Siong', attendance:'Present'},
    {name: 'Lim Yew Hock', attendance:'Present & Voting'},
    {name: 'Ong Eng Guan', attendance:'Present & Voting'},
    {name: 'Ong Pang Boon', attendance:'Present & Voting'},
    {name: 'S. Rajaratnam', attendance:'Present & Voting'},
    {name: 'S. Ramasamy', attendance:'Present & Voting'},
    {name:'S.T Bani', attendance:'Present & Voting'},
    {name:'S.V. Lingam', attendance:'Present & Voting'},
    {name: 'Sheng Nam Chin', attendance:'Present & Voting'},
    {name: 'Toh Chin Chye', attendance:'Present & Voting'},
    {name: 'Yong Nyuk Lin', attendance:'Present & Voting'},
  ])
  const [customName, setCustomName] = useState('')
  const navigate = useNavigate()

  const addMember = () => {
    const name = customName.trim()
    if (!name || members.some((member) => member.name.toLowerCase() === name.toLowerCase())) return
    setMembers((current) => [...current, { name, attendance: 'Present & Voting' }])
    setCustomName('')
  }

  const removeMember = (name: string) => setMembers((current) => current.filter((member) => member.name !== name))

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/setup" replace />} />
      <Route
        path="/setup"
        element={<SetupPage members={members} setMembers={setMembers} customName={customName} setCustomName={setCustomName} addMember={addMember} removeMember={removeMember} start={() => navigate('/session')} />}
      />
      <Route path="/session" element={<SessionPage members={members} />} />
    </Routes>
  )
}

function Header({ members = [] }: { members?: Member[] }) {
  const councilCount = members.filter((member) => member.attendance !== 'Absent').length
  const votingCount = members.filter((member) => member.attendance === 'Present & Voting').length
  const substantive = Math.ceil(votingCount * 2 / 3)
  const simple = Math.ceil(councilCount / 2)

  const Pie = ({ value, total, label, detail }: { value: number; total: number; label: string; detail: string }) => (
    <div className="header-stat">
      <div className="mini-pie" style={{ '--pie': `${total ? (value / total) * 360 : 0}deg` } as React.CSSProperties}>
        <span>{value}</span>
      </div>
      <div><strong>{detail}</strong><small>{label}</small></div>
    </div>
  )

  return (
    <header className="topbar">
      <div className="brand">
        <div ><img src="/yusof.avif" style={{width:'50px', padding:'0px'}}></img></div>
        <div>
          <div className="brand-title">Second Legislative Assembly</div>
          <div className="brand-subtitle">OPMUN 2026</div>
        </div>
      </div>
      {councilCount > 0 && (
        <div className="header-stats">
          <Pie value={councilCount} total={councilCount} label="Total in council" detail={`${councilCount} members`} />
          <Pie value={substantive} total={votingCount} label="Substantive threshold" detail={`${substantive} to pass`} />
          <Pie value={simple} total={votingCount} label="Simple majority" detail={`${simple} to pass`} />
        </div>
      )}
      <button className="icon-button" aria-label="Fullscreen">⛶</button>
    </header>
  )
}

function SetupPage({ members, setMembers, customName, setCustomName, addMember, removeMember, start }: {
  members: Member[]
  setMembers: (members: Member[]) => void
  customName: string
  setCustomName: (value: string) => void
  addMember: () => void
  removeMember: (name: string) => void
  start: () => void
}) {
  const [rollCallOpen, setRollCallOpen] = useState(false)
  const [search, setSearch] = useState('')

  const setAttendance = (name: string, attendance: Attendance) => {
    setMembers(members.map((member) => member.name === name ? { ...member, attendance } : member))
  }

  const filtered = members.filter((member) => member.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="app-shell">
      <Header />
      <div className="setup-layout">
        <section className="directory-panel">
          <h1>Second Legislative Assembly</h1>
          <div className="section-heading">Members</div>
          <div className="add-member">
            <div className="avatar small">GSL</div>
            <input value={customName} onChange={(event) => setCustomName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addMember()} placeholder="Enter assembly member name" />
            <button className="add-button" onClick={addMember} aria-label="Add member">+</button>
          </div>

          <div className="section-heading directory-title">Member List</div>
          <label className="search-box">
            <span>⌕</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
          </label>

          <ul className="member-directory">
            {filtered.map((member) => (
              <li key={member.name}>
                <div className="avatar">{initials(member.name)}</div>
                <span>{member.name}</span>
                <button className="remove-member" onClick={() => removeMember(member.name)} aria-label={`Remove ${member.name}`}>×</button>
              </li>
            ))}
            {filtered.length === 0 && <li className="empty-state">No Members found</li>}
          </ul>
        </section>

        <aside className="selection-panel">
          <div className="selection-card">
            <div className="selection-scroll">
              <div className="selected-count"><strong>{members.length}</strong> selected</div>
              {members.map((member) => (
                <div className="selected-member" key={member.name}>
                  <div className="avatar small">{initials(member.name)}</div>
                  <div>
                    <strong>{member.name}</strong>
                    <span className={member.attendance === 'Present & Voting' ? 'status voting' : 'status'}>{member.attendance}</span>
                  </div>
                  <button onClick={() => removeMember(member.name)} aria-label={`Remove ${member.name}`}>×</button>
                </div>
              ))}
            </div>
            <button className="clear-button" onClick={() => setMembers([])} disabled={!members.length}>Clear Selection</button>
            <button className="roll-call-button" onClick={() => setRollCallOpen(true)} disabled={!members.length}>Conduct Roll Call</button>
            <button className="start-button" onClick={start}>Start Session</button>
          </div>
        </aside>
      </div>

      {rollCallOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setRollCallOpen(false)}>
          <div className="roll-call-modal">
            <div className="modal-header">
              <div><span className="eyebrow">ROLL CALL</span><h2>Attendance</h2></div>
              <button onClick={() => setRollCallOpen(false)}>×</button>
            </div>
            <div className="roll-call-list">
              {members.map((member) => (
                <div className="roll-call-row" key={member.name}>
                  <div className="avatar">{initials(member.name)}</div>
                  <strong>{member.name}</strong>
                  <div className="attendance-options">
                    {(['Present & Voting', 'Present', 'Absent'] as Attendance[]).map((attendance) => (
                      <button key={attendance} className={member.attendance === attendance ? 'active' : ''} onClick={() => setAttendance(member.name, attendance)}>{attendance}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="start-button modal-save" onClick={() => setRollCallOpen(false)}>Save Attendance</button>
          </div>
        </div>
      )}
    </main>
  )
}

function SessionPage({ members }: { members: Member[] }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('GSL')
  const [embed, setEmbed] = useState<{ name: string; url: string; type: string } | null>(null)
  const [voteMode, setVoteMode] = useState<'Individual' | 'Party Caucus'>('Individual')
  const [selectedParty, setSelectedParty] = useState('Party A')
  const [vote, setVote] = useState<'For' | 'Against' | 'Abstain' | null>(null)
  const [speakingDuration, setSpeakingDuration] = useState(90)
  const [timeLeft, setTimeLeft] = useState(90)
  const [timerRunning, setTimerRunning] = useState(false)
  const [amendingTime, setAmendingTime] = useState(false)
  const [draftTime, setDraftTime] = useState('1:30')
  const [gslQueue, setGslQueue] = useState<string[]>([])
  const [gslSearch, setGslSearch] = useState('')
  const [modSearch, setModSearch] = useState('')
  const [draftSearch, setDraftSearch] = useState('')
  const [votingSearch, setVotingSearch] = useState('')
  const [individualSearch, setIndividualSearch] = useState('')
  const [updatesUrl, setUpdatesUrl] = useState('')
  const [draftUpdatesUrl, setDraftUpdatesUrl] = useState('')
  const [draftFor, setDraftFor] = useState<string[]>([])
  const [draftAgainst, setDraftAgainst] = useState<string[]>([])
  const [unmodDuration, setUnmodDuration] = useState(600)
  const [unmodTimeLeft, setUnmodTimeLeft] = useState(600)
  const [unmodRunning, setUnmodRunning] = useState(false)
  const [modTopic, setModTopic] = useState('')
  const [modTotal, setModTotal] = useState(600)
  const [modIndividual, setModIndividual] = useState(60)
  const [modSpeakers, setModSpeakers] = useState<string[]>([])
  const [modPriority, setModPriority] = useState<Record<string, 'First' | 'Last'>>({})
  const [motionPool, setMotionPool] = useState<string[]>([
    'Motion to Adjourn Debate',
    'Motion to Suspend Debate',
    'Motion to Expel Member(s) from the Party',
    'Motion for Confidence',
    'Motion for Vote of No Confidence',
    'Motion to Table Draft Bill',
    'Motion to Table Unfriendly Amendment',
    'Motion to Introduce Draft Bill',
    'Motion to Introduce Unfriendly Amendment',
    'Motion to Move into Direct Voting Procedures',
    'Motion for an Unmoderated Caucus',
    'Motion for a Party Caucus',
    'Motion for a Moderated Caucus',
    'Motion to Extend / Elapse Caucus',
    'Motion to Amend Speaking Time',
    'Motion to Divide the Question',
    'Motion to Divide the House',
    'Motion for a Roll Call Vote',
  ])
  const [customMotion, setCustomMotion] = useState('')
  const [activeVotes, setActiveVotes] = useState<{ name: string; proposer: string; duration: number }[]>([])
  const [selectedVote, setSelectedVote] = useState<number | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const gslCurrentName = gslQueue[0]
  const gslCurrent = members.find((member) => member.name === gslCurrentName)

  const addToGsl = (name: string) => {
    setGslQueue((queue) => queue.includes(name) ? queue : [...queue, name])
  }

  const removeFromGsl = (name: string) => {
    setGslQueue((queue) => queue.filter((queuedName) => queuedName !== name))
  }

  const motionPrecedence = [
    'Motion to Adjourn Debate', 'Motion to Suspend Debate', 'Motion to Expel Member(s) from the Party',
    'Motion for Confidence', 'Motion for Vote of No Confidence', 'Motion to Table Draft Bill',
    'Motion to Table Unfriendly Amendment', 'Motion to Introduce Draft Bill', 'Motion to Introduce Unfriendly Amendment',
    'Motion to Move into Direct Voting Procedures', 'Motion for an Unmoderated Caucus', 'Motion for a Party Caucus',
    'Motion for a Moderated Caucus', 'Motion to Extend / Elapse Caucus', 'Motion to Amend Speaking Time',
    'Motion to Divide the Question', 'Motion to Divide the House', 'Motion for a Roll Call Vote',
  ]

  const sortedActiveVotes = [...activeVotes].sort((a, b) => {
    const rankA = motionPrecedence.indexOf(a.name)
    const rankB = motionPrecedence.indexOf(b.name)
    const safeRankA = rankA === -1 ? motionPrecedence.length : rankA
    const safeRankB = rankB === -1 ? motionPrecedence.length : rankB
    if (safeRankA !== safeRankB) return safeRankA - safeRankB
    if (a.duration !== b.duration) return b.duration - a.duration
    return a.name.localeCompare(b.name)
  })

  const orderedModSpeakers = [...modSpeakers].sort((a, b) => {
    const priorityA = modPriority[a]
    const priorityB = modPriority[b]
    if (priorityA === 'First' && priorityB !== 'First') return -1
    if (priorityB === 'First' && priorityA !== 'First') return 1
    if (priorityA === 'Last' && priorityB !== 'Last') return 1
    if (priorityB === 'Last' && priorityA !== 'Last') return -1
    return modSpeakers.indexOf(a) - modSpeakers.indexOf(b)
  })

  const nextSpeaker = () => {
    setGslQueue((queue) => queue.length > 1 ? queue.slice(1) : [])
    setTimerRunning(false)
    setTimeLeft(speakingDuration)
  }

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) return
    const interval = window.setInterval(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [timerRunning, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) setTimerRunning(false)
  }, [timeLeft])

  useEffect(() => {
    if (!unmodRunning || unmodTimeLeft <= 0) return
    const interval = window.setInterval(() => setUnmodTimeLeft((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(interval)
  }, [unmodRunning, unmodTimeLeft])

  useEffect(() => {
    if (unmodTimeLeft === 0) setUnmodRunning(false)
  }, [unmodTimeLeft])

  const handleFile = (file?: File) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setEmbed({ name: file.name, url, type: file.type })
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    handleFile(event.dataTransfer.files[0])
  }

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

  const applySpeakingTime = () => {
    const parts = draftTime.split(':').map((part) => Number.parseInt(part, 10))
    const seconds = parts.length === 2 ? (parts[0] || 0) * 60 + (parts[1] || 0) : parts[0] || 0
    if (!Number.isFinite(seconds) || seconds <= 0) return
    setSpeakingDuration(seconds)
    setTimeLeft(seconds)
    setTimerRunning(false)
    setAmendingTime(false)
  }

  const tabs = ['GSL', 'Draft Bill', 'Moderated', 'Unmoderated', 'Individual Speaking', 'Voting']
  return (
    <main className="app-shell session-shell">
      <Header members={members} />
      <div className="session-layout">
        <aside className="agenda-panel">
          <button className="back-button" onClick={() => navigate('/setup')}>← Setup</button>
          <br/>
          <span className="eyebrow">ORDER OF THE DAY</span>
          <h2>Current Draft Bill</h2>
          <div className="agenda-card">
            <span>Draft Bill</span>
            <small>Second Legislative Assembly</small>
          </div>
          <div className="timer-card">
            <span>Speaking timer</span>
            <strong>{formatTime(timeLeft)}</strong>
            <div className="timer-controls">
              <button onClick={() => setTimerRunning((running) => !running)} aria-label={timerRunning ? 'Pause timer' : 'Start timer'}>{timerRunning ? 'Ⅱ' : '▶'}</button>
              <button onClick={() => { setTimerRunning(false); setTimeLeft(speakingDuration) }} aria-label="Reset timer">↻</button>
              <button onClick={() => setAmendingTime((value) => !value)} aria-label="Amend speaking time">±</button>
            </div>
            <div className="timer-bar"><span style={{ width: `${speakingDuration ? (timeLeft / speakingDuration) * 100 : 0}%` }} /></div>
            {amendingTime && (
              <div className="amend-time">
                <input value={draftTime} onChange={(event) => setDraftTime(event.target.value)} aria-label="Speaking time as minutes and seconds" />
                <button onClick={applySpeakingTime}>Set</button>
              </div>
            )}
          </div>
          <div className="motion-heading"><span>Motions</span><small>{motionList.length}</small></div>
          <div className="motion-list">
            {motionList.map((motion, index) => <button key={motion}><span>{index + 1}</span>{motion}</button>)}
          </div>
        </aside>

        <section className="workspace">
          <div className="workspace-header">
            <div><span className="eyebrow">LEGISLATIVE PROCEDURE</span><h1>{activeTab}</h1></div>
            <button className="secondary-button">Session controls</button>
          </div>

          {activeTab === 'GSL' ? (
            <div className="gsl-workspace">
              <div className="gsl-speaker-panel">
                <div className="gsl-current">
                  <span className="eyebrow">CURRENT SPEAKER</span>
                  {gslCurrent ? (
                    <div><div className="avatar large">{initials(gslCurrent.name)}</div><strong>{gslCurrent.name}</strong><small>{gslCurrent.attendance}</small></div>
                  ) : <strong>No speaker in queue</strong>}
                  <div className="gsl-time"><strong>{formatTime(timeLeft)}</strong><div className="gsl-progress"><span style={{ width: `${speakingDuration ? (timeLeft / speakingDuration) * 100 : 0}%` }} /></div></div>
                  <div className="gsl-controls">
                    <button className="gsl-primary" disabled={!gslCurrent} onClick={() => setTimerRunning((running) => !running)}>{timerRunning ? 'Pause' : 'Start'}</button>
                    <button className="gsl-next" disabled={!gslCurrent} onClick={nextSpeaker}>Next →</button>
                  </div>
                </div>
              </div>
              <div className="gsl-queue">
                <div className="gsl-queue-heading"><strong>Speaker Queue</strong><span>{gslQueue.length} queued</span></div>
                <div className="gsl-queued-list">
                  {gslQueue.map((name, index) => {
                    const member = members.find((item) => item.name === name)
                    if (!member) return null
                    return (
                      <div className={`gsl-queue-member ${index === 0 ? 'current' : ''}`} key={name}>
                        <div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{index === 0 ? 'Speaking now' : member.attendance}</small></div>
                        <button onClick={() => removeFromGsl(name)} aria-label={`Remove ${name} from queue`}>×</button>
                      </div>
                    )
                  })}
                  {gslQueue.length === 0 && <div className="empty-gsl">Add members from the directory below.</div>}
                </div>

                <div className="gsl-directory-heading"><strong>Assembly Members</strong><span>{members.length}</span></div>
                <input className="gsl-search" value={gslSearch} onChange={(event) => setGslSearch(event.target.value)} placeholder="Search member name" />
                <div className="gsl-member-directory">
                  {members.filter((member) => member.name.toLowerCase().includes(gslSearch.trim().toLowerCase())).map((member) => {
                    const queued = gslQueue.includes(member.name)
                    return (
                      <button className="gsl-directory-member" disabled={queued} key={member.name} onClick={() => addToGsl(member.name)}>
                        <div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div><span>{queued ? 'Queued' : '+'}</span>
                      </button>
                    )
                  })}
                  {members.filter((member) => member.name.toLowerCase().includes(gslSearch.trim().toLowerCase())).length === 0 && <div className="empty-gsl">No matching members.</div>}
                </div>
              </div>
            </div>
          ) : activeTab === 'Draft Bill' ? (
            <div className="draft-speaker-layout">
              <div className="draft-speakers">
                <div className="draft-search-wrap">
                  <input value={draftSearch} onChange={(event) => setDraftSearch(event.target.value)} placeholder="Search member name" />
                </div>
                {(['For', 'Against'] as const).map((side) => {
                  const selected = side === 'For' ? draftFor : draftAgainst
                  const setSelected = side === 'For' ? setDraftFor : setDraftAgainst
                  return (
                    <section className={`draft-side ${side.toLowerCase()}`} key={side}>
                      <div className="column-title"><span>{side.toUpperCase()}</span><strong>{selected.length} selected</strong></div>
                      <div className="draft-member-list">
                        {members.filter((member) => member.name.toLowerCase().includes(draftSearch.trim().toLowerCase())).map((member) => {
                          const active = selected.includes(member.name)
                          const conflict = (side === 'For' ? draftAgainst : draftFor).includes(member.name)
                          return (
                            <button disabled={conflict} className={active ? 'selected' : ''} key={member.name} onClick={() => setSelected(active ? selected.filter((name) => name !== member.name) : [...selected, member.name])}>
                              <div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div><span>{active ? 'Selected' : '+'}</span>
                            </button>
                          )
                        })}
                      </div>
                    </section>
                  )
                })}
              </div>
              <div className="draft-embed" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
                {embed ? (
                  <div className="embed-preview">
                    {embed.type.startsWith('image/') ? <img src={embed.url} alt="Draft Bill preview" /> : <iframe src={embed.url} title={embed.name} />}
                    <div className="embed-footer"><strong>{embed.name}</strong><button onClick={() => setEmbed(null)}>Remove</button></div>
                  </div>
                ) : (
                  <button className="dropzone" onClick={() => fileInput.current?.click()}><span>＋</span><strong>Add Draft Bill preview</strong><small>Drag a file here or browse</small></button>
                )}
                <input ref={fileInput} type="file" accept=".pdf,image/*,.txt" hidden onChange={(event) => handleFile(event.target.files?.[0])} />
              </div>
            </div>
          ) : activeTab === 'Unmoderated' ? (
            <div className="unmod-workspace">
              <div className="custom-timer">
                <span className="eyebrow">UNMODERATED CAUCUS</span>
                <strong>{formatTime(unmodTimeLeft)}</strong>
                <div className="gsl-progress"><span style={{ width: `${unmodDuration ? (unmodTimeLeft / unmodDuration) * 100 : 0}%` }} /></div>
                <div className="unmod-controls">
                  <button onClick={() => setUnmodRunning((running) => !running)}>{unmodRunning ? 'Pause timer' : 'Start timer'}</button>
                  <button onClick={() => { setUnmodRunning(false); setUnmodTimeLeft(unmodDuration) }}>Reset</button>
                  <label>Set time <input type="text" value={formatTime(unmodDuration)} onChange={(event) => {
                    const parts = event.target.value.split(':').map(Number)
                    const seconds = parts.length === 2 ? (parts[0] || 0) * 60 + (parts[1] || 0) : (parts[0] || 0)
                    if (seconds > 0) { setUnmodDuration(seconds); setUnmodTimeLeft(seconds) }
                  }} /></label>
                </div>
              </div>
            </div>
          ) : activeTab === 'Moderated' ? (
            <div className="mod-workspace">
              <div className="mod-controls-card">
                <label>Moderated caucus topic<input value={modTopic} onChange={(event) => setModTopic(event.target.value)} placeholder="Enter caucus topic" /></label>
                <div className="mod-time-grid">
                  <label>Total speaking time <input type="number" min="30" step="30" value={modTotal} onChange={(event) => setModTotal(Math.max(30, Number(event.target.value) || 30))} /><small>{formatTime(modTotal)}</small></label>
                  <label>Individual speaking time <input type="number" min="15" step="15" value={modIndividual} onChange={(event) => setModIndividual(Math.max(15, Number(event.target.value) || 15))} /><small>{formatTime(modIndividual)}</small></label>
                </div>
                <button className="round-time" onClick={() => {
                  const count = Math.max(modSpeakers.length, 1)
                  const rounded = Math.max(15, Math.round((modTotal / count) / 15) * 15)
                  setModIndividual(rounded)
                }}>Auto-calculate rounded individual time</button>
                <div className="mod-summary"><span>{modSpeakers.length} speakers</span><span>{Math.floor(modTotal / modIndividual)} speaking slots</span><span>{formatTime(modSpeakers.length ? modTotal / modSpeakers.length : 0)} average</span></div>
                <div className="mod-speaker-order">
                  <strong>Speaking order</strong>
                  {orderedModSpeakers.length === 0 ? <small>No speakers selected</small> : orderedModSpeakers.map((name, index) => (
                    <div key={name}><span>{index + 1}</span><strong>{name}</strong><small>{modPriority[name] || 'Regular'}</small></div>
                  ))}
                </div>
              </div>
              <div className="mod-speaker-card">
                <input className="mod-search" value={modSearch} onChange={(event) => setModSearch(event.target.value)} placeholder="Search member name" />
                <div className="gsl-directory-heading"><strong>Select speakers</strong>
                <span>{modSpeakers.length}</span></div>
                <div className="mod-member-list">
                  {members.filter((member) => member.name.toLowerCase().includes(modSearch.trim().toLowerCase())).map((member) => {
                    const selected = modSpeakers.includes(member.name)
                    return (
                      <div className={selected ? 'selected' : ''} key={member.name}>
                        <button onClick={() => setModSpeakers(selected ? modSpeakers.filter((name) => name !== member.name) : [...modSpeakers, member.name])}><div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div></button>
                        {selected && <div className="priority-options"><button className={modPriority[member.name] === 'First' ? 'active' : ''} onClick={() => setModPriority({ ...modPriority, [member.name]: 'First' })}>Go first</button><button className={modPriority[member.name] === 'Last' ? 'active' : ''} onClick={() => setModPriority({ ...modPriority, [member.name]: 'Last' })}>Go last</button></div>}
                      </div>
                    )
                  })}

                  {/* {members.map((member) => {
                    const selected = modSpeakers.includes(member.name)
                    return (
                      <div className={selected ? 'selected' : ''} key={member.name}>
                        <button onClick={() => setModSpeakers(selected ? modSpeakers.filter((name) => name !== member.name) : [...modSpeakers, member.name])}><div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div></button>
                        {selected && <div className="priority-options"><button className={modPriority[member.name] === 'First' ? 'active' : ''} onClick={() => setModPriority({ ...modPriority, [member.name]: 'First' })}>Go first</button><button className={modPriority[member.name] === 'Last' ? 'active' : ''} onClick={() => setModPriority({ ...modPriority, [member.name]: 'Last' })}>Go last</button></div>}
                      </div>
                    )
                  })} */}
                </div>
              </div>
            </div>
          ) : activeTab === 'Individual Speaking' ? (
            <div className="draft-speaker-layout individual-speaking">
              <div className="mod-controls-card">
                <strong>Individual Speaking</strong>
                <p>Select a member to begin an individual speaking period.</p>
                <input className="member-search" value={individualSearch} onChange={(event) => setIndividualSearch(event.target.value)} placeholder="Search member name" />
                <div className="mod-member-list individual-member-list">
                  {members.filter((member) => member.name.toLowerCase().includes(individualSearch.trim().toLowerCase())).map((member) => (
                    <button className={`gsl-directory-member ${member.attendance === 'Absent' ? 'inactive-member' : ''}`} disabled={member.attendance === 'Absent'} key={member.name}>
                      <div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div><span>{member.attendance === 'Absent' ? 'Absent' : 'Speak'}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'Updates' ? (
            <div className="updates-workspace">
              <div className="updates-controls">
                <span className="eyebrow">TUMBLR OR WEBSITE UPDATES</span>
                <label>Updates website URL<input value={draftUpdatesUrl} onChange={(event) => setDraftUpdatesUrl(event.target.value)} placeholder="https://example.tumblr.com" /></label>
                <button onClick={() => setUpdatesUrl(draftUpdatesUrl.trim())}>Embed updates</button>
              </div>
              <div className="updates-preview">
                {updatesUrl ? (
                  <iframe src={updatesUrl} title="Assembly updates" />
                ) : (
                  <div className="empty-updates"><strong>No updates website embedded</strong><small>Add and embed a Tumblr or website URL above.</small></div>
                )}
              </div>
            </div>
          ) : (
            <div className="voting-workspace">
              <aside className="voting-motion-list">
                <span className="eyebrow">MOTION POOL</span>
                <div className="motion-pool-list">
                  {motionPool.map((motion) => (
                    <button key={motion} onClick={() => {
                      const duration = /Unmoderated|Moderated|Party Caucus|Extend|Speaking Time/.test(motion) ? 10 : 0
                      setActiveVotes((votes) => [...votes, { name: motion, proposer: '', duration }])
                    }}><span>{motion}</span><b>+</b></button>
                  ))}
                </div>
                <div className="custom-motion">
                  <input value={customMotion} onChange={(event) => setCustomMotion(event.target.value)} placeholder="Custom motion name" />
                  <button onClick={() => {
                    const name = customMotion.trim()
                    if (!name) return
                    setMotionPool((pool) => pool.includes(name) ? pool : [...pool, name])
                    setCustomMotion('')
                  }}>Add</button>
                </div>
              </aside>

              <div className="voting-content">
                <div className="voting-title"><span className="eyebrow">MOTIONS TO VOTE</span><strong>{activeVotes.length} on the ballot</strong></div>
                {activeVotes.length === 0 ? (
                  <div className="empty-vote-list">Select motions from the motion pool to begin voting.</div>
                ) : (
                  <div className="active-vote-list">
                    {sortedActiveVotes.map((item) => {
                      const index = activeVotes.findIndex((voteItem) => voteItem === item)
                      return (
                        <div className={selectedVote === index ? 'active' : ''} key={`${item.name}-${index}`}>
                          <button className="vote-item-main" onClick={() => setSelectedVote(index)}><strong>{item.name}</strong><small>Proposed by {item.proposer || 'Not indicated'}</small></button>
                          <input value={item.proposer} onChange={(event) => setActiveVotes((votes) => votes.map((voteItem, voteIndex) => voteIndex === index ? { ...voteItem, proposer: event.target.value } : voteItem))} placeholder="Proposer" list="assembly-member-names" />
                          {/Unmoderated|Moderated|Party Caucus|Caucus|Extend|Speaking Time/.test(item.name) && (
                            <input className="motion-duration" type="number" min="1" value={item.duration} onChange={(event) => setActiveVotes((votes) => votes.map((voteItem, voteIndex) => voteIndex === index ? { ...voteItem, duration: Math.max(1, Number(event.target.value) || 1) } : voteItem))} title="Duration in minutes" />
                          )}
                          <button className="remove-vote" onClick={() => { setActiveVotes((votes) => votes.filter((_, voteIndex) => voteIndex !== index)); setSelectedVote(null) }}>×</button>
                        </div>
                      )
                    })}
                  </div>
                )}
                <datalist id="assembly-member-names">{members.map((member) => <option key={member.name} value={member.name} />)}</datalist>
                {selectedVote !== null && <input className="voting-member-search" value={votingSearch} onChange={(event) => setVotingSearch(event.target.value)} placeholder="Search voting members" />}

                {selectedVote !== null && activeVotes[selectedVote] && (
                  <div className="selected-vote-panel">
                    {activeVotes[selectedVote].name === 'Motion for Confidence' || activeVotes[selectedVote].name === 'Motion for Vote of No Confidence' ? (
                      <>
                        <div className="party-selector">
                          <label>Party conducting vote</label>
                          <select value={selectedParty} onChange={(event) => setSelectedParty(event.target.value)}>
                            {['Party A', 'Party B', 'Party C'].map((party) => <option key={party}>{party}</option>)}
                          </select>
                          <span>Procedural vote · {selectedParty}</span>
                        </div>
                        <div className="vote-grid procedural-grid">
                          {members.filter((member) => member.name.toLowerCase().includes(votingSearch.trim().toLowerCase())).map((member) => (
                            <button disabled={member.attendance === 'Absent'} className="vote-member" key={member.name}><div className="avatar">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div><span className={member.attendance === 'Present' ? 'observer-badge' : member.attendance === 'Absent' ? 'absent-badge' : 'member-badge'}>{member.attendance === 'Absent' ? 'Absent' : member.attendance === 'Present' ? 'Observer' : 'Assembly Member'}</span></button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="vote-mode-switch">
                          <button className={voteMode === 'Individual' ? 'active' : ''} onClick={() => setVoteMode('Individual')}>Individual Voting</button>
                          <button className={voteMode === 'Party Caucus' ? 'active' : ''} onClick={() => setVoteMode('Party Caucus')}>Party Caucus</button>
                        </div>
                        {voteMode === 'Individual' ? (
                          <div className="vote-grid">
                            {members.filter((member) => member.name.toLowerCase().includes(votingSearch.trim().toLowerCase())).map((member) => (
                              <button disabled={member.attendance === 'Absent'} className="vote-member" key={member.name}><div className="avatar">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div><span className={member.attendance === 'Present' ? 'observer-badge' : member.attendance === 'Absent' ? 'absent-badge' : 'member-badge'}>{member.attendance === 'Absent' ? 'Absent' : member.attendance === 'Present' ? 'Observer' : 'Assembly Member'}</span></button>
                            ))}
                          </div>
                        ) : (
                          <div className="party-grid">
                            {['Party A', 'Party B', 'Party C'].map((party) => <button key={party} className="party-card"><strong>{party}</strong><span>Party Caucus</span></button>)}
                          </div>
                        )}
                      </>
                    )}
                    <div className="vote-buttons">
                      {(['For', 'Against', 'Abstain'] as const).map((option) => <button key={option} className={vote === option ? `active ${option.toLowerCase()}` : option.toLowerCase()} onClick={() => setVote(option)}>{option}</button>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <nav className="bottom-tabs">
            {tabs.map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}><span>{tab === 'GSL' ? 'G' : tab === 'Draft Bill' ? 'D' : tab === 'Moderated' ? 'M' : tab === 'Unmoderated' ? 'U' : tab === 'Individual Speaking' ? 'I' : tab === 'Voting' ? 'V' : 'U'}</span>{tab}</button>)}
          </nav>
        </section>

        <aside className="attendance-panel">
          <div className="attendance-header"><span className="eyebrow">CHAMBER</span><button>•••</button></div>
          <h3>Members & observers</h3>
          <div className="attendance-legend"><span><i className="green" />Present & Voting</span><span><i className="gold" />Present (Observer)</span></div>
          <div className="attendance-list">
            {members.map((member) => <div key={member.name}><div className="avatar small">{initials(member.name)}</div><div><strong>{member.name}</strong><small>{member.attendance}</small></div><span className={member.attendance === 'Present' ? 'dot observer' : 'dot'} /></div>)}
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function App() {
  return <HashRouter><AppShell /></HashRouter>
}
