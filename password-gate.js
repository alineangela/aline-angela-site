(function () {
  const PASS_HASH = "ee857fc09939b4fa49120244d0a8138d93ce9468b721428b6ec98680a999e97f";
  const STORAGE_KEY = "aa_site_unlocked";

  document.documentElement.classList.add("aa-locked");

  const style = document.createElement("style");
  style.textContent = `
    html.aa-locked body > :not(#aa-password-gate) {
      display: none !important;
    }
    #aa-password-gate {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      min-height: 100vh;
      padding: 24px;
      box-sizing: border-box;
      background:
        linear-gradient(180deg, rgba(20, 18, 16, 0.82), rgba(20, 18, 16, 0.94)),
        url("assets/hero-bg.webp") center / cover no-repeat;
      color: #f8f5ec;
      font-family: Inter, Arial, sans-serif;
    }
    #aa-password-gate form {
      width: min(100%, 380px);
      display: grid;
      gap: 16px;
      padding: 28px;
      border: 1px solid rgba(248, 245, 236, 0.28);
      background: rgba(20, 18, 16, 0.72);
      backdrop-filter: blur(14px);
      box-sizing: border-box;
    }
    #aa-password-gate h1 {
      margin: 0;
      color: #f8f5ec;
      font-family: "Cormorant Garamond", Georgia, serif;
      font-size: 32px;
      font-weight: 400;
      line-height: 1.05;
      letter-spacing: 0;
    }
    #aa-password-gate p {
      margin: 0;
      color: rgba(248, 245, 236, 0.74);
      font-size: 13px;
      line-height: 1.5;
    }
    #aa-password-gate label {
      display: grid;
      gap: 8px;
      color: rgba(248, 245, 236, 0.8);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    #aa-password-gate input {
      width: 100%;
      min-height: 46px;
      border: 1px solid rgba(248, 245, 236, 0.28);
      border-radius: 0;
      padding: 0 12px;
      box-sizing: border-box;
      background: rgba(248, 245, 236, 0.96);
      color: #1e1b18;
      font: 16px Inter, Arial, sans-serif;
    }
    #aa-password-gate button {
      min-height: 46px;
      border: 0;
      border-radius: 0;
      background: #f8f5ec;
      color: #1e1b18;
      font: 700 12px Inter, Arial, sans-serif;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
    }
    #aa-password-gate .aa-error {
      min-height: 18px;
      color: #ffd2c7;
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);

  function unlock() {
    document.documentElement.classList.remove("aa-locked");
    const gate = document.getElementById("aa-password-gate");
    if (gate) gate.remove();
  }

  async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("");
  }

  function renderGate() {
    if (localStorage.getItem(STORAGE_KEY) === PASS_HASH) {
      unlock();
      return;
    }

    const gate = document.createElement("div");
    gate.id = "aa-password-gate";
    gate.innerHTML = `
      <form autocomplete="off">
        <h1>Preview protegido</h1>
        <p>Digite a senha para visualizar o site em teste.</p>
        <label>
          Senha
          <input type="password" name="password" autocomplete="current-password" autofocus>
        </label>
        <button type="submit">Entrar</button>
        <div class="aa-error" aria-live="polite"></div>
      </form>
    `;

    gate.querySelector("form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const input = form.elements.password;
      const error = form.querySelector(".aa-error");
      const hash = await sha256(input.value);

      if (hash === PASS_HASH) {
        localStorage.setItem(STORAGE_KEY, PASS_HASH);
        unlock();
      } else {
        error.textContent = "Senha incorreta.";
        input.value = "";
        input.focus();
      }
    });

    document.body.prepend(gate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderGate);
  } else {
    renderGate();
  }
})();
