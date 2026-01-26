export default function Footer() {
  return (
    <footer className="w-full py-4 px-4 bg-primary-50 border-t border-gray-200 text-center text-xs text-zinc-500 flex flex-col items-center gap-1">
      <span>
        &copy; {new Date().getFullYear()} <a href="https://github.com/smtanbin/MsgPackClient" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Tanbin Hassan Bappi</a> &mdash; <span className="text-zinc-400">GitHub</span>
      </span>
      <span>
        MIT Licensed &mdash; Built with <span className="text-red-500">♥</span> using <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Next.js</a> and <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Tailwind CSS</a>
      </span>
    </footer>
  )
}
