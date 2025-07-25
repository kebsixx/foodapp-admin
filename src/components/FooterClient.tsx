import Image from "next/image";
import ThemeToggle from "./theme-toggle"; // Impor komponen ThemeToggle

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900" id="contact">
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8">
        {/* ... Konten utama footer Anda (grid) tetap di sini ... */}
        <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <div className="flex justify-start text-black dark:text-white">
                <Image
                  src="/logo-text.svg"
                  alt="Cerita Senja"
                  width={240}
                  height={24}
                />
              </div>
              <p className="mt-6 max-w-md text-left leading-relaxed text-gray-500 dark:text-gray-400 sm:max-w-xs">
                Nikmati cita rasa autentik dan suasana yang nyaman. Kunjungi
                kami atau pesan sekarang.
              </p>
              <ul className="mt-8 flex justify-start gap-6 md:gap-8">
                <li>
                  <a
                    href="https://www.instagram.com/ceritasenja_cafe"
                    rel="noreferrer"
                    target="_blank"
                    className="text-black dark:text-white transition hover:text-[#7FCD91] dark:hover:text-emerald-500 flex items-center gap-2">
                    <svg
                      className="size-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      @ceritasenja_cafe
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 min-w-full gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
              <div className="text-left">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  About Us
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Company History
                    </span>
                  </li>

                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Meet the Team
                    </span>
                  </li>

                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Employee Handbook
                    </span>
                  </li>

                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Careers
                    </span>
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Our Services
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Suasana
                    </span>
                  </li>

                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Cita Rasa
                    </span>
                  </li>

                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Pesan Antar
                    </span>
                  </li>

                  <li>
                    <span className="text-gray-700 dark:text-gray-300 cursor-default">
                      Nail Art
                    </span>
                  </li>
                </ul>
              </div>
              <div id="contact" className="text-left">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Contact Us
                </p>

                <ul className="mt-8 space-y-4 text-sm">
                  <li>
                    <a
                      className="flex items-center justify-start gap-1.5"
                      href="mailto:cerita@senja.id">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 shrink-0 text-gray-900 dark:text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="flex-1 text-gray-700 dark:text-gray-300">
                        cerita@senja.id
                      </span>
                    </a>
                  </li>

                  <li>
                    <a
                      className="flex items-center justify-start gap-1.5"
                      href="whatsapp://send?phone=6285175003172&text=Halo%20Cerita%20Senja">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5 shrink-0 text-gray-900 dark:text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="flex-1 text-gray-700 dark:text-gray-300">
                        085175003172
                      </span>
                    </a>
                  </li>

                  <li className="flex items-start justify-start gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 shrink-0 text-gray-900 dark:text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <address className="-mt-0.5 flex-1 not-italic text-gray-700 dark:text-gray-300 text-left">
                      Jl. Gubernur Sunandar Prijosoedarmo No.29, Sidowaras,
                      Kraton, Kec. Krian, Kabupaten Sidoarjo, Jawa Timur 61262
                    </address>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Bawah Footer (Copyright & Theme Toggle) */}
        <div className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            {/* Copyright & Links */}
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="block sm:inline">All rights reserved. </span>
                <a href="/user/terms-of-use" className="...">
                  Terms & Conditions
                </a>
                <span> · </span>
                <a href="/user/policy" className="...">
                  Privacy Policy
                </a>
              </p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                © {new Date().getFullYear()} Cerita Senja
              </p>
            </div>

            {/* Theme Toggle di pojok kanan */}
            <div className="mt-4 sm:mt-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
