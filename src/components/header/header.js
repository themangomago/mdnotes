const { ejs } = window.electron;

// Function to render the hello component
const render = async (target, payload) => {
  const template = await fetch(`components/header/header.ejs`).then(
    (response) => response.text()
  );

  // const compiledTemplate = ejs.compile(template);
  // const renderedHtml = compiledTemplate({ text: customText });
  // Assume you have a "ejs" function that compiles and renders the template
  const renderedHtml = ejs.render(template, { text: payload });
  target.outerHTML = renderedHtml;

  themeSwitcher();
};

function themeSwitcher() {
  /*!
   * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
   * Copyright 2011-2023 The Bootstrap Authors
   * Licensed under the Creative Commons Attribution 3.0 Unported License.
   */

  "use strict";
  console.log("color-modes.js");
  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (
      theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#bd-theme");

    if (!themeSwitcher) {
      return;
    }

    const themeSwitcherText = document.querySelector("#bd-theme-text");
    const activeThemeIcon = document.querySelector(".theme-icon-active use");
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );

    const svgOfActiveBtn = btnToActive
      .querySelector("svg use")
      .getAttribute("href");
    console.log("btnToActive");
    console.log(svgOfActiveBtn);

    document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
      element.classList.remove("active");
      element.setAttribute("aria-pressed", "false");
    });

    btnToActive.classList.add("active");
    btnToActive.setAttribute("aria-pressed", "true");
    activeThemeIcon.setAttribute("href", svgOfActiveBtn);
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
    themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

    if (focus) {
      themeSwitcher.focus();
    }
  };

  //TODO: This is not working rn
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      console.log("matchMedia");
      const storedTheme = getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        setTheme(getPreferredTheme());
      }
    });

  // window.addEventListener("DOMContentLoaded", () => {
  //   showActiveTheme(getPreferredTheme());
  //   document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
  //     toggle.addEventListener("click", () => {
  //       const theme = toggle.getAttribute("data-bs-theme-value");
  //       setStoredTheme(theme);
  //       setTheme(theme);
  //       showActiveTheme(theme, true);
  //     });
  //   });
  // });
  showActiveTheme(getPreferredTheme());
  document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      setStoredTheme(theme);
      setTheme(theme);
      showActiveTheme(theme, true);
    });
  });
}

// Export the render function

export { render };
