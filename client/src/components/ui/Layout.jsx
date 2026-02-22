import React from 'react'

export const PageLayout = ({ children, sidebar = null }) => {
  return (
    <div className="page">
      {sidebar && (
        <aside className="sidebar">
          {sidebar}
        </aside>
      )}
      <main className="main">
        {children}
      </main>
    </div>
  )
}

export const Sidebar = ({ children }) => {
  return (
    <div className="sidebar">
      {children}
    </div>
  )
}

export const MainContent = ({ children }) => {
  return (
    <main className="main">
      {children}
    </main>
  )
}

export const WelcomeSection = ({ title, subtitle }) => {
  return (
    <div className="welcome">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}

export const Section = ({ title, children, className = '' }) => {
  return (
    <div className={`section ${className}`}>
      <div className="section-title">{title}</div>
      {children}
    </div>
  )
}

export const ProgressBar = ({ progress }) => {
  return (
    <div className="h-1 bg-[var(--border)] rounded overflow-hidden mb-10">
      <div
        className="h-full bg-[var(--green)] rounded transition-all duration-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default PageLayout
