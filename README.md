# Pack Tester

A modern, modular Pack Tester testing client inspired by Postman, built with Next.js and React. Designed for easy encoding/decoding, API testing, and developer productivity.

## Features
- Encode and decode Pack Tester to/from JSON and Hex
- Multi-endpoint tabbed interface (up to 9 tabs)
- Custom request headers and body
- MacOS-style UI with responsive design
- Copy buttons for JSON and Hex outputs
- Accessible (ARIA labels, keyboard navigation)
- Environment management
- convector tool with live size and reduction stats

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:3000/home](http://localhost:3000/home)

## Usage
- **Tabs:** Add, rename, or delete endpoints. Each tab is a separate API request context.
- **Headers:** Add default or custom headers per endpoint.
- **Request Body:** Write JSON, see live Pack Tester hex and size reduction.
- **Encoder/Decoder:** Convert between JSON and Pack Tester Hex, see size stats, copy results.
- **Environment:** Manage base URLs and environment variables.
- **Mobile:** Fully responsive, tabs become dropdowns.

## Documentation & References
- [Pack Tester Official Site](https://msgpack.org/)
- [Pack Tester Specification](https://github.com/msgpack/msgpack/blob/master/spec.md)
- [Project GitHub](https://github.com/smtanbin/pack-tester)

## Accessibility
- All interactive elements have ARIA labels and keyboard support.
- Logo is clickable to return home.

## License
MIT

---

*Built with Next.js, TailwindCSS, and Lucide icons.*
