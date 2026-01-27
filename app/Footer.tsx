export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 bg-primary-50 border-t border-gray-200 text-center text-xs text-zinc-500 flex flex-col items-center gap-1">
      <span>
        Built with <span className="text-red-500">♥</span> by  <a href="https://github.com/smtanbin/MsgPackClient" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Tanbin Hassan Bappi</a> &mdash; <span className="text-zinc-400">GitHub</span>
      </span>
      <span>
        MIT Licensed &copy; {new Date().getFullYear()}
      </span>
    </footer>
  )
}
