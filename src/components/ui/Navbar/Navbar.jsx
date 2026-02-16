import { A } from "@solidjs/router";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-[color:var(--color-neutral-100)] bg-[rgba(247,246,249,0.9)] backdrop-blur">
      <div
        className="h-0.5"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-primary-400), var(--color-blue-400))",
        }}
      />
      <div className="max-w-5xl mx-auto px-5">
        <ul className="flex items-center justify-center md:justify-start gap-2 flex-wrap list-none m-0 py-2.5 px-0">
          <li className="relative w-full md:w-auto">
            <A
              href="/"
              className="inline-flex items-center justify-center md:justify-start text-sm font-semibold no-underline transition-all duration-200 px-4 py-2 rounded-full text-[color:var(--color-neutral-600)] hover:bg-[color:var(--color-primary-50)] hover:text-[color:var(--color-primary-700)] w-full md:w-auto"
              activeClass="bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)]"
              end
            >
              Payment Form
            </A>
          </li>
          <li className="relative w-full md:w-auto">
            <A
              href="/payment-methods"
              className="inline-flex items-center justify-center md:justify-start text-sm font-semibold no-underline transition-all duration-200 px-4 py-2 rounded-full text-[color:var(--color-neutral-600)] hover:bg-[color:var(--color-primary-50)] hover:text-[color:var(--color-primary-700)] w-full md:w-auto"
              activeClass="bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)]"
            >
              Embedded Components
            </A>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
